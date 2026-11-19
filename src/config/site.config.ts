export const siteConfig = {
  companyName: "Compraventa El Primo S.A.S.",
  shortName: "EL PRIMO",
  tagline: "Showroom de vehículos seleccionados, importación y parcelas",
  whatsappNumber: "573000000000",
  whatsappDisplay: "+57 300 000 0000",
  whatsappSalesLabel: "asesoría comercial",
  email: "contacto@compraventaelprimo.com",
  address: "Sede principal",
  city: "Medellín",
  region: "Antioquia",
  schedule:
    "Lunes a viernes: 8:00 a.m. – 6:00 p.m. | Sábados: 8:30 a.m. – 2:00 p.m.",
  hoursCompact: "Lun - Vie: 8:00 AM - 6:00 PM · Sáb: 8:30 AM - 2:00 PM",
  mapEmbedUrl:
    "https://maps.google.com/maps?q=Medellin%20Colombia&t=&z=13&ie=UTF8&iwloc=&output=embed",
  social: {
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
    tiktok: "https://tiktok.com",
  },
  theme: {
    background: "#09090B",
    card: "#111114",
    border: "#222226",
    borderHover: "#323238",
    elevated: "#18181C",
    accent: "#C5A059",
    accentHover: "#D4B26A",
    whatsapp: "#15803D",
    whatsappHover: "#166534",
    foreground: "#F4F4F5",
    muted: "#A1A1AA",
    subtle: "#71717A",
  },
  financing: {
    defaultMonthlyRate: 1.6,
    minDownPaymentPercent: 10,
    maxDownPaymentPercent: 70,
    terms: [12, 24, 36, 48, 60, 72] as const,
    legalNote:
      "Simulación referencial. La cuota final depende del estudio de crédito y de la entidad financiera.",
  },
  nav: [
    { label: "Inicio", href: "/" },
    {
      label: "Vehículos",
      href: "/vehiculos",
      children: [
        { label: "Todo el inventario", href: "/vehiculos" },
        { label: "Camionetas y SUV", href: "/vehiculos?categoria=SUV" },
        { label: "Automóviles", href: "/vehiculos?categoria=Automovil" },
        { label: "Pick-ups y 4x4", href: "/vehiculos?categoria=Pickup" },
        {
          label: "Disponibles entrega inmediata",
          href: "/vehiculos?estado=DISPONIBLE",
        },
      ],
    },
    { label: "Línea Prestige", href: "/prestige", accent: true },
    { label: "Importación", href: "/importacion" },
    { label: "Parcelas", href: "/parcelas" },
    { label: "Financiación", href: "/financiacion" },
    {
      label: "Nosotros",
      href: "/nosotros",
      children: [
        { label: "Nuestra empresa y respaldo", href: "/nosotros" },
        { label: "Trabaja con nosotros", href: "/nosotros#formteam" },
      ],
    },
    { label: "Contacto", href: "/contacto" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;

export function buildWhatsAppUrl(
  message: string,
  phone: string = siteConfig.whatsappNumber,
): string {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
