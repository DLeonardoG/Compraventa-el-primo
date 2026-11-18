import { buildWhatsAppUrl, siteConfig } from "@/config/site.config";

export { buildWhatsAppUrl };

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

export function formatPricePerSqm(precio: number, areaM2: number): string {
  if (!areaM2 || areaM2 <= 0) return "N/D";
  return formatCOP(precio / areaM2);
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
  return `Hola ${siteConfig.companyName}, deseo ${siteConfig.whatsappSalesLabel}.`;
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
