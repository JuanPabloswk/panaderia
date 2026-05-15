/**
 * Precio en pesos: solo enteros no negativos (cadena solo dígitos o número entero).
 */
function parsePrecioEntero(raw) {
  if (raw == null || raw === '') return NaN;
  if (typeof raw === 'number') {
    if (!Number.isFinite(raw) || raw < 0) return NaN;
    return Math.round(raw);
  }
  const s = String(raw).trim();
  if (!/^\d+$/.test(s)) return NaN;
  const n = parseInt(s, 10);
  return Number.isFinite(n) ? n : NaN;
}

module.exports = { parsePrecioEntero };
