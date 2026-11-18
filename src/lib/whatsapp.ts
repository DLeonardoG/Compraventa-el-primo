import { siteConfig } from "@/config/site.config";

export function buildWhatsAppUrl(message: string, phone = siteConfig.whatsappNumber): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${encoded}`;
}

export function vehicleInterestMessage(
  marca: string,
  modelo: string,
  anio: number,
): string {
  return `Hola, me interesa el ${marca} ${modelo} ${anio} publicado en la web de ${siteConfig.name}.`;
}

export function parcelInterestMessage(titulo: string, ubicacion: string): string {
  return `Hola, me interesa la parcela "${titulo}" en ${ubicacion} publicada en la web de ${siteConfig.name}.`;
}

export function generalWhatsAppMessage(): string {
  return `Hola, quiero más información sobre los servicios de ${siteConfig.name}.`;
}
