import { NextRequest, NextResponse } from "next/server";
import { saveRankingData } from "@/lib/store";
import { parseTop20Workbook, ExcelFormatError } from "@/lib/parseExcel";
import type { RankingData } from "@/lib/types";

export async function POST(req: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return NextResponse.json(
      {
        error:
          "Falta configurar la variable de entorno ADMIN_PASSWORD en Vercel. Sin eso, la carga queda bloqueada por seguridad.",
      },
      { status: 500 }
    );
  }

  const form = await req.formData();
  const password = String(form.get("password") ?? "");
  if (password !== adminPassword) {
    return NextResponse.json({ error: "Contraseña incorrecta." }, { status: 401 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No se recibió ningún archivo." }, { status: 400 });
  }
  if (!file.name.toLowerCase().endsWith(".xlsx")) {
    return NextResponse.json({ error: "El archivo tiene que ser un .xlsx" }, { status: 400 });
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const brands = await parseTop20Workbook(buffer);

    const data: RankingData = {
      updatedAt: new Date().toISOString(),
      fileName: file.name,
      brands,
    };

    await saveRankingData(data);

    return NextResponse.json({
      ok: true,
      updatedAt: data.updatedAt,
      brands: brands.map((b) => ({ name: b.name, count: b.top20.length })),
    });
  } catch (err) {
    if (err instanceof ExcelFormatError) {
      return NextResponse.json({ error: err.message }, { status: 422 });
    }
    console.error(err);
    return NextResponse.json(
      { error: "No se pudo leer el archivo. Verificá que sea un .xlsx válido." },
      { status: 500 }
    );
  }
}
