import { NextResponse } from "next/server";
import { getRankingData } from "@/lib/store";
import { getBrandDisplays } from "@/lib/brandDisplay";

export async function GET() {
  const data = await getRankingData();

  if (!data) {
    return NextResponse.json({ loaded: false, updatedAt: null, brands: [] });
  }

  const brands = data.brands.flatMap((b) =>
    getBrandDisplays(b.name).map((d) => ({
      name: d.name,
      url: d.url ?? null,
      count: b.top20.length,
    }))
  );

  return NextResponse.json({
    loaded: true,
    updatedAt: data.updatedAt,
    fileName: data.fileName ?? null,
    brands,
  });
}
