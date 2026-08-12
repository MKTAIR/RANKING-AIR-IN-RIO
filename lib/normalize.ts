/**
 * Normaliza un número de cliente para comparar de forma confiable aunque
 * venga con espacios de más o distinta mayúscula/minúscula entre el Excel
 * y lo que tipea el cliente.
 *
 * OJO: no le saca letras ni ceros a la izquierda — los códigos de cliente
 * son alfanuméricos (ej "R8706", "07898") y sacarle esos caracteres podría
 * hacer que dos clientes distintos matcheen entre sí.
 */
export function normalizeClientNumber(raw: unknown): string {
  const s = String(raw ?? "").trim();
  if (!s) return "";
  return s.toUpperCase().replace(/\s+/g, "");
}
