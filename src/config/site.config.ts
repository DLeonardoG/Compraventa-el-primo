export const siteConfig = {
  name: "Compraventa El Primo S.A.S.",
  shortName: "El Primo",
  tagline: "Vehículos seleccionados y parcelas con respaldo",
  city: "Colombia",
  whatsappNumber: "573000000000",
  email: "contacto@compraventaelprimo.com",
  phone: "+57 300 000 0000",
  address: "Calle Principal #00-00, Colombia",
  schedule: "Lunes a sábado · 8:00 a.m. – 6:00 p.m.",
  mapEmbedUrl:
    "https://maps.google.com/maps?q=Colombia&t=&z=13&ie=UTF8&iwloc=&output=embed",
  social: {
    facebook: "https://facebook.com/",
    instagram: "https://instagram.com/",
    youtube: "",
  },
  theme: {
    background: "#09090B",
    card: "#121216",
    border: "#27272A",
    accent: "#D97706",
    accentSecondary: "#3B82F6",
    foreground: "#FAFAFA",
    muted: "#A1A1AA",
  },
  integrations: {
    googleSheetId: "",
    appsScriptUrl: "",
    cloudinaryCloudName: "",
    cloudinaryUploadPreset: "",
    uploaderPin: "2026",
  },
  nav: [
    { label: "Inicio", href: "/" },
    { label: "Vehículos", href: "/vehiculos" },
    { label: "Línea Prestige", href: "/prestige" },
    { label: "Parcelas", href: "/parcelas" },
    { label: "Nosotros", href: "/nosotros" },
    { label: "Contacto", href: "/contacto" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
