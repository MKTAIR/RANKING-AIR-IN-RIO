import ExcelJS from "exceljs";
import type { BrandRanking } from "./types";

const SHEETS_TO_SKIP = ["instrucciones", "leeme", "léeme", "readme", "info"];
const CLIENT_HEADER_WORDS = [
  "id cliente",
  "cliente",
  "nro cliente",
  "n° cliente",
  "numero de cliente",
  "número de cliente",
  "codigo cliente",
  "código cliente",
];

export class ExcelFormatError extends Error {}

function cellToText(value: ExcelJS.CellValue): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "object") {
    if ("result" in value && value.result !== undefined) return String(value.result);
    if ("text" in value) return String((value as { text: unknown }).text);
    if ("richText" in value) {
      return (value as { richText: { text: string }[] }).richText.map((r) => r.text).join("");
    }
  }
  return String(value);
}

function looksLikeClientHeader(text: string): boolean {
  const t = text.toLowerCase().trim();
  return CLIENT_HEADER_WORDS.some((w) => t.includes(w));
}

/**
 * Formato esperado: un archivo .xlsx con una hoja por marca (el nombre de
 * la hoja = nombre de la marca). Dentro de cada hoja, busca la columna cuyo
 * encabezado (fila 1) diga algo como "Cliente" / "ID Cliente" y toma los
 * valores de esa columna como el Top 20, en orden de fila. Si no encuentra
 * un encabezado así, usa la columna A por defecto (para hojas sin encabezado).
 * Se toman como máximo los primeros 20 valores de cada hoja.
 */
export async function parseTop20Workbook(buffer: Buffer): Promise<BrandRanking[]> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer as unknown as ArrayBuffer);

  const brands: BrandRanking[] = [];

  workbook.eachSheet((worksheet) => {
    const sheetName = worksheet.name.trim();
    if (!sheetName || SHEETS_TO_SKIP.includes(sheetName.toLowerCase())) return;

    let clientCol = 1;
    let foundHeaderCol = false;
    const headerRow = worksheet.getRow(1);
    headerRow.eachCell({ includeEmpty: false }, (cell, colNumber) => {
      if (!foundHeaderCol && looksLikeClientHeader(cellToText(cell.value))) {
        clientCol = colNumber;
        foundHeaderCol = true;
      }
    });

    const values: string[] = [];
    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      if (rowNumber === 1 && foundHeaderCol) return; // fila de encabezados, se descarta
      const raw = cellToText(row.getCell(clientCol).value).trim();
      if (!raw) return;
      // encabezado suelto en col A sin que hayamos detectado una columna con nombre
      if (rowNumber === 1 && !foundHeaderCol && looksLikeClientHeader(raw)) return;
      values.push(raw);
    });

    if (values.length > 0) {
      brands.push({ name: sheetName, top20: values.slice(0, 20) });
    }
  });

  if (brands.length === 0) {
    throw new ExcelFormatError(
      "No se encontraron datos. Revisá que el Excel tenga una hoja por marca, con los números de cliente en una columna con encabezado que incluya la palabra 'Cliente'."
    );
  }

  return brands;
}
