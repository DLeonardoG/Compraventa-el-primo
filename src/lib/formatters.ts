import { siteConfig } from "@/config/site.config";

export function formatCOP(value: number): string {
  const formatted = Math.round(value).toLocaleString("es-CO");
  return `$ ${formatted}`;
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
    .split(/,\s*(?=https?:\/\/)/)
    .map((url) => url.trim())
    .filter(isHttpUrl);
}

export function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function joinFotoUrls(urls: string[]): string {
  return urls.map((url) => url.trim()).filter(isHttpUrl).join(", ");
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
    return (
      normalized === "SI" ||
      normalized === "SÍ" ||
      normalized === "TRUE" ||
      normalized === "1"
    );
  }
  return false;
}

export function buildWhatsAppUrl(
  message: string,
  phone: string = siteConfig.whatsappNumber,
): string {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function vehicleInterestMessage(
  marca: string,
  modelo: string,
  anio: number,
  precio: number,
): string {
  return `Hola ${siteConfig.companyName}, me interesa el ${marca} ${modelo} ${anio} publicado por ${formatCOP(precio)}.`;
}

export function parcelInterestMessage(
  titulo: string,
  ubicacion: string,
  precio: number,
): string {
  return `Hola ${siteConfig.companyName}, me interesa la parcela "${titulo}" en ${ubicacion} publicada por ${formatCOP(precio)}.`;
}

export function generalWhatsAppMessage(): string {
  return `Hola ${siteConfig.companyName}, deseo ${siteConfig.whatsappSalesLabel.toLowerCase()}.`;
}

export function financeSimulationMessage(params: {
  title: string;
  price: number;
  downPayment: number;
  months: number;
  installment: number;
}): string {
  return `Hola ${siteConfig.companyName}, simulé financiación para ${params.title} (${formatCOP(params.price)}). Cuota inicial ${formatCOP(params.downPayment)}, plazo ${params.months} meses, cuota estimada ${formatCOP(params.installment)}.`;
}
