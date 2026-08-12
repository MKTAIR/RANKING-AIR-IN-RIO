import { NextResponse } from "next/server";
import { getRankingData } from "@/lib/store";

export async function GET() {
  const data = await getRankingData();

  if (!data) {
    return NextResponse.json({ loaded: false, updatedAt: null, brands: [] });
  }

  return NextResponse.json({
    loaded: true,
    updatedAt: data.updatedAt,
    fileName: data.fileName ?? null,
    brands: data.brands.map((b) => ({ name: b.name, count: b.top20.length })),
  });
}
