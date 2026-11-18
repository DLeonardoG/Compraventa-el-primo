export const siteConfig = {
  companyName: "Compraventa El Primo S.A.S.",
  shortName: "EL PRIMO",
  tagline: "Vehículos Seleccionados • Importación • Parcelas",
  whatsappNumber: "573000000000",
  whatsappSalesLabel: "Asesoría Comercial",
  email: "contacto@compraventaelprimo.com",
  phone: "+57 300 000 0000",
  address: "Sede Principal • Colombia",
  schedule:
    "Lunes a Viernes: 8:00 a.m. – 6:00 p.m. | Sábados: 8:30 a.m. – 2:00 p.m.",
  mapEmbedUrl:
    "https://maps.google.com/maps?q=Colombia&t=&z=13&ie=UTF8&iwloc=&output=embed",
  social: {
    instagram: "#",
    facebook: "#",
    tiktok: "#",
  },
  theme: {
    background: "#09090B",
    card: "#111114",
    border: "#222226",
    elevated: "#18181C",
    accent: "#C5A059",
    whatsapp: "#15803D",
    whatsappHover: "#166534",
    foreground: "#F4F4F5",
    muted: "#A1A1AA",
  },
  financing: {
    defaultMonthlyRate: 1.6,
    legalNote:
      "Simulación referencial. La cuota final depende del estudio de crédito y de la entidad financiera.",
  },
  nav: [
    { label: "Inicio", href: "/" },
    { label: "Vehículos", href: "/vehiculos" },
    { label: "Línea Prestige", href: "/prestige" },
    { label: "Importación", href: "/importacion" },
    { label: "Parcelas", href: "/parcelas" },
    { label: "Nosotros", href: "/nosotros" },
    { label: "Contacto", href: "/contacto" },
  ],
} as const;

/** @deprecated Use siteConfig.companyName */
export const siteNameAlias = siteConfig.companyName;

export type SiteConfig = typeof siteConfig;
