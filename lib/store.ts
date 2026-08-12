import { put, list } from "@vercel/blob";
import { promises as fs } from "fs";
import path from "path";
import type { RankingData } from "./types";

const BLOB_PATHNAME = "air-in-rio/ranking-data.json";
const LOCAL_FALLBACK_PATH = path.join(process.cwd(), ".data", "ranking-data.local.json");

function hasBlobToken(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

export async function getRankingData(): Promise<RankingData | null> {
  if (hasBlobToken()) {
    const { blobs } = await list({ prefix: BLOB_PATHNAME, limit: 1 });
    const blob = blobs.find((b) => b.pathname === BLOB_PATHNAME) ?? blobs[0];
    if (!blob) return null;
    const res = await fetch(blob.url, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as RankingData;
  }

  // Fallback local (solo para desarrollo en tu máquina, sin Vercel Blob conectado)
  try {
    const raw = await fs.readFile(LOCAL_FALLBACK_PATH, "utf-8");
    return JSON.parse(raw) as RankingData;
  } catch {
    return null;
  }
}

export async function saveRankingData(data: RankingData): Promise<void> {
  if (hasBlobToken()) {
    await put(BLOB_PATHNAME, JSON.stringify(data), {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
    });
    return;
  }

  await fs.mkdir(path.dirname(LOCAL_FALLBACK_PATH), { recursive: true });
  await fs.writeFile(LOCAL_FALLBACK_PATH, JSON.stringify(data, null, 2), "utf-8");
}

export function isStorageConfigured(): boolean {
  // En producción (Vercel) necesitás el Blob Store conectado.
  // En desarrollo local, el fallback a archivo siempre funciona.
  return hasBlobToken() || process.env.NODE_ENV !== "production";
}
