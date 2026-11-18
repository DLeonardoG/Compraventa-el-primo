export function formatCOP(value: number): string {
  const formatted = Math.round(value).toLocaleString("es-CO");
  return `$ ${formatted} COP`;
}

export function formatKm(value: number): string {
  return `${Math.round(value).toLocaleString("es-CO")} km`;
}

export function formatArea(value: number): string {
  return `${Math.round(value).toLocaleString("es-CO")} m²`;
}

export function formatPricePerSqm(precio: number, area_m2: number): string {
  if (!area_m2 || area_m2 <= 0) return "N/D";
  return formatCOP(precio / area_m2);
}

export function parseFotoString(raw: string | undefined | null): string[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((url) => url.trim())
    .filter(Boolean);
}

export function parseNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const cleaned = value.replace(/[^\d.-]/g, "");
    const parsed = Number(cleaned);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
}

export function parseYesNo(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const normalized = value.trim().toUpperCase();
    return normalized === "SI" || normalized === "SÍ" || normalized === "TRUE" || normalized === "1";
  }
  return false;
}
