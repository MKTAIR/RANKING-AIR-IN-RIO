import ExcelJS from "exceljs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.join(__dirname, "..", "public", "templates", "plantilla-top20.xlsx");

const workbook = new ExcelJS.Workbook();

const instructions = workbook.addWorksheet("Instrucciones");
instructions.columns = [{ width: 90 }];
[
  "CÓMO COMPLETAR ESTA PLANILLA",
  "",
  "1. Cada hoja (pestaña, abajo) representa UNA marca participante.",
  "2. El nombre de la hoja es el nombre de la marca tal cual se va a mostrar en el sitio.",
  "3. En la columna A de cada hoja, cargá los números de cliente del Top 20 de esa marca,",
  "   uno por fila, en orden de posición (el de la fila 2 es el N° 1 del ranking).",
  "   La fila 1 puede tener el título 'Cliente' (opcional, se ignora al cargar).",
  "4. Para agregar una marca nueva: click derecho sobre una pestaña > Insertar > Hoja,",
  "   y ponerle de nombre la marca. Para sacar una marca, borrá su hoja.",
  "5. Guardá el archivo como .xlsx y subilo desde /admin en el sitio.",
  "",
  "Se toman como máximo los primeros 20 valores de cada hoja.",
].forEach((line, i) => {
  const row = instructions.getRow(i + 1);
  row.getCell(1).value = line;
  if (i === 0) row.getCell(1).font = { bold: true, size: 13 };
});

function addBrandSheet(name, sampleClients) {
  const sheet = workbook.addWorksheet(name);
  sheet.columns = [{ header: "Cliente", key: "cliente", width: 18 }];
  sheet.getRow(1).font = { bold: true };
  sampleClients.forEach((c) => sheet.addRow([c]));
}

addBrandSheet("ASUS", ["100234", "100987", "101122"]);
addBrandSheet("HP", ["100234", "100450"]);

await workbook.xlsx.writeFile(outPath);
console.log("Plantilla generada en", outPath);
