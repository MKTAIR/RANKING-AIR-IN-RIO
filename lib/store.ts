import { put, get, BlobNotFoundError } from "@vercel/blob";
import { promises as fs } from "fs";
import path from "path";
import type { RankingData } from "./types";

const BLOB_PATHNAME = "air-in-rio/ranking-data.json";
const LOCAL_FALLBACK_PATH = path.join(process.cwd(), ".data", "ranking-data.local.json");

// process.env.VERCEL está seteado en todo deploy de Vercel (prod y preview).
// Ahí siempre usamos el Blob Store privado. En tu máquina (sin ese env var),
// usamos un archivo local solo para poder probar el flujo.
function onVercel(): boolean {
  return Boolean(process.env.VERCEL);
}

export async function getRankingData(): Promise<RankingData | null> {
  if (onVercel()) {
    try {
      const result = await get(BLOB_PATHNAME, { access: "private" });
      if (!result || result.statusCode !== 200) return null;
      const text = await new Response(result.stream as unknown as ReadableStream).text();
      return JSON.parse(text) as RankingData;
    } catch (err) {
      if (err instanceof BlobNotFoundError) return null; // todavía no se subió ningún Excel
      console.error("Error leyendo el ranking desde Blob:", err);
      return null;
    }
  }

  try {
    const raw = await fs.readFile(LOCAL_FALLBACK_PATH, "utf-8");
    return JSON.parse(raw) as RankingData;
  } catch {
    return null;
  }
}

export async function saveRankingData(data: RankingData): Promise<void> {
  if (onVercel()) {
    await put(BLOB_PATHNAME, JSON.stringify(data), {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
    });
    return;
  }

  await fs.mkdir(path.dirname(LOCAL_FALLBACK_PATH), { recursive: true });
  await fs.writeFile(LOCAL_FALLBACK_PATH, JSON.stringify(data, null, 2), "utf-8");
}
