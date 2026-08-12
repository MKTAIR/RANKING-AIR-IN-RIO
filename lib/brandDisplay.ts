export interface BrandDisplay {
  name: string;
  url?: string;
}

const BASE = "https://mktair.com.ar/news/20260730-AIR-IN-RIO";

/**
 * Mapea el nombre de hoja del Excel (tal cual lo carga AIR) a cómo se
 * muestra en el sitio y al link "Ver productos" de air-computers.com/air-in-rio.
 * Si una hoja no está acá, se muestra tal cual viene del Excel, sin link.
 */
const OVERRIDES: Record<string, BrandDisplay[]> = {
  apc: [{ name: "APC", url: `${BASE}/APC/apc.html` }],
  epson: [{ name: "EPSON", url: `${BASE}/EPSON/epson.html` }],
  genius: [{ name: "GENIUS", url: `${BASE}/GENIUS/genius.html` }],
  gigabyte: [{ name: "GIGABYTE", url: `${BASE}/GIGABYTE/gigabyte.html` }],
  intel: [{ name: "INTEL", url: `${BASE}/INTEL/intel.html` }],
  msi: [{ name: "MSI", url: `${BASE}/MSI/msi.html` }],
  tplink: [{ name: "TP-LINK", url: `${BASE}/TP-LINK/tp-link.html` }],
  "adata-xpg": [{ name: "ADATA/XPG", url: `${BASE}/ADATA/adata.html` }],
  logitech: [{ name: "LOGITECH", url: `${BASE}/LOGITECH/logitech.html` }],
  lenovo: [{ name: "LENOVO", url: `${BASE}/LENOVO/lenovo.html` }],
  "asus comp": [{ name: "ASUS Business", url: `${BASE}/ASUS%20COMPONENTES/asus-componentes.html` }],
  brother: [{ name: "BROTHER", url: `${BASE}/BROTHER/brother.html` }],
  gamemax: [{ name: "GAMEMAX", url: `${BASE}/GAMEMAX/gamemax.html` }],
  pantum: [{ name: "PANTUM", url: `${BASE}/PANTUM/pantum.html` }],
  "hp computo": [{ name: "HP Cómputo", url: `${BASE}/HP-COMP/hp-comp.html` }],
  "asus nb": [{ name: "ASUS Notebook", url: `${BASE}/ASUS%20NOTEBOOKS/asus-notebooks.html` }],
  "hp impresion": [{ name: "HP Impresión", url: `${BASE}/HP-IMP/hp-imp.html` }],
  dell: [{ name: "DELL", url: `${BASE}/DELL/dell.html` }],
};

function normalizeKey(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function getBrandDisplays(rawName: string): BrandDisplay[] {
  const key = normalizeKey(rawName);
  const tokens = key.split(/[^a-z0-9]+/).filter(Boolean);

  // La hoja combinada "CX - ARKHAM - MEMOX - PERFORMAN..." se muestra como
  // dos tarjetas separadas (CX y Arkham); Performance y Memox no se muestran.
  if (tokens.includes("cx") && tokens.includes("arkham")) {
    return [
      { name: "CX", url: `${BASE}/CX/cx.html` },
      { name: "Arkham", url: `${BASE}/ARKHAM/arkham.html` },
    ];
  }

  return OVERRIDES[key] ?? [{ name: rawName }];
}
