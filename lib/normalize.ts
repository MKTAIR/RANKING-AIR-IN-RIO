/**
 * Normaliza un número de cliente para poder compararlos de forma confiable
 * aunque vengan con espacios, ceros a la izquierda, o como número/texto
 * distinto entre el Excel y lo que tipea el cliente.
 */
export function normalizeClientNumber(raw: unknown): string {
  const s = String(raw ?? "").trim();
  const digitsOnly = s.replace(/\D/g, "");
  if (!digitsOnly) return s.toUpperCase().replace(/\s+/g, "");
  // saca ceros a la izquierda pero conserva al menos un dígito
  return digitsOnly.replace(/^0+(?=\d)/, "");
}
