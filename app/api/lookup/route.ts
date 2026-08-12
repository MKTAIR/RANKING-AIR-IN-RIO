import { NextRequest, NextResponse } from "next/server";
import { getRankingData } from "@/lib/store";
import { normalizeClientNumber } from "@/lib/normalize";

export async function GET(req: NextRequest) {
  const cliente = req.nextUrl.searchParams.get("cliente") ?? "";
  const target = normalizeClientNumber(cliente);

  if (!target) {
    return NextResponse.json({ error: "Ingresá un número de cliente." }, { status: 400 });
  }

  const data = await getRankingData();
  if (!data) {
    return NextResponse.json(
      { error: "Todavía no se cargó el ranking. Volvé a intentar más tarde." },
      { status: 404 }
    );
  }

  const matches = data.brands
    .filter((brand) => brand.top20.some((c) => normalizeClientNumber(c) === target))
    .map((brand) => brand.name);

  return NextResponse.json({ clientNumber: cliente, brands: matches });
}
