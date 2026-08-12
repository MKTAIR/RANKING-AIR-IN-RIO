// Mapea nombres de marca (normalizados) al archivo de logo en /public/assets/logos.
// Si una marca del Excel no matchea acá, se muestra una placa con sus iniciales.
const LOGO_MAP: Record<string, string> = {
  "adata": "adata-xpg.svg",
  "adata/xpg": "adata-xpg.svg",
  "adata xpg": "adata-xpg.svg",
  "xpg": "adata-xpg.svg",
  "apc": "apc.svg",
  "asus business": "asus-business.svg",
  "asus": "asus.svg",
  "brother": "brother.svg",
  "cx": "cx.svg",
  "dell": "dell.svg",
  "epson": "epson.svg",
  "genius": "genius.svg",
  "gigabyte": "gigabyte.svg",
  "hp": "hp.svg",
  "hp impresion": "hp.svg",
  "hp impresión": "hp.svg",
  "hp computo comercial": "hp.svg",
  "hp cómputo comercial": "hp.svg",
  "intel": "intel.svg",
  "lenovo": "lenovo.svg",
  "logitech": "logitech.svg",
  "msi": "msi.svg",
  "pantum": "pantum.svg",
  "tp-link": "tp-link.svg",
  "tp link": "tp-link.svg",
  "arkham": "arkham.svg",
};

function normalizeBrandKey(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // saca acentos
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function getLogoForBrand(brandName: string): string | null {
  const key = normalizeBrandKey(brandName);
  const file = LOGO_MAP[key];
  return file ? `/assets/logos/${file}` : null;
}

export function getBrandInitials(brandName: string): string {
  const words = brandName.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}
