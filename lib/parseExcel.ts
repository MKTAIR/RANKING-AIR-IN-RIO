import ExcelJS from "exceljs";
import type { BrandRanking } from "./types";

const SHEETS_TO_SKIP = ["instrucciones", "leeme", "léeme", "readme", "info"];
const HEADER_WORDS = ["cliente", "nro cliente", "n° cliente", "numero de cliente", "número de cliente"];

export class ExcelFormatError extends Error {}

function cellToText(value: ExcelJS.CellValue): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "object") {
    // fórmulas / rich text
    if ("result" in value && value.result !== undefined) return String(value.result);
    if ("text" in value) return String((value as { text: unknown }).text);
    if ("richText" in value) {
      return (value as { richText: { text: string }[] }).richText.map((r) => r.text).join("");
    }
  }
  return String(value);
}

/**
 * Formato esperado: un archivo .xlsx con una hoja por marca.
 * Nombre de la hoja = nombre de la marca.
 * Columna A = números de cliente del Top 20, en orden de posición
 * (fila 1 puede ser un encabezado como "Cliente", opcional).
 * Se toman como máximo los primeros 20 valores numéricos de cada hoja.
 */
export async function parseTop20Workbook(buffer: Buffer): Promise<BrandRanking[]> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer as unknown as ArrayBuffer);

  const brands: BrandRanking[] = [];

  workbook.eachSheet((worksheet) => {
    const sheetName = worksheet.name.trim();
    if (!sheetName || SHEETS_TO_SKIP.includes(sheetName.toLowerCase())) return;

    const values: string[] = [];
    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      const raw = cellToText(row.getCell(1).value).trim();
      if (!raw) return;
      if (rowNumber === 1 && HEADER_WORDS.some((w) => raw.toLowerCase().includes(w))) {
        return; // fila de encabezado, se descarta
      }
      values.push(raw);
    });

    if (values.length > 0) {
      brands.push({ name: sheetName, top20: values.slice(0, 20) });
    }
  });

  if (brands.length === 0) {
    throw new ExcelFormatError(
      "No se encontraron datos. Revisá que el Excel tenga una hoja por marca, con los números de cliente en la columna A."
    );
  }

  return brands;
}
