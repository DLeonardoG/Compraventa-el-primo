import { Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { ContactForm } from "@/components/forms/ContactForm";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { siteConfig } from "@/config/site.config";
import { buildWhatsAppUrl } from "@/lib/formatters";

export const metadata = {
  title: "Contacto",
};

const desks = [
  {
    title: "Ventas Vehículos",
    href: "/vehiculos",
    text: "Inventario general, financiación y retoma.",
  },
  {
    title: "Línea Prestige",
    href: "/prestige",
    text: "Atención VIP para unidades exclusivas.",
  },
  {
    title: "Parcelas",
    href: "/parcelas",
    text: "Lotes, visitas a terreno y documentación.",
  },
  {
    title: "Trámites",
    href: `https://wa.me/${siteConfig.whatsappNumber}`,
    text: "Traspaso, SOAT y acompañamiento documental.",
  },
];

export default function ContactoPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Hablemos"
        title="Contacto"
        description="Canales directos de atención comercial y formulario de mensaje."
      />

      <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {desks.map((desk) => (
          <Link
            key={desk.title}
            href={desk.href}
            className="border border-border bg-card p-5 transition-colors hover:bg-elevated"
          >
            <div className="mb-3 h-px w-8 bg-accent" />
            <h3 className="heading-display font-bold">{desk.title}</h3>
            <p className="mt-2 text-sm text-muted">{desk.text}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <ContactForm />

        <div className="space-y-5">
          <div className="space-y-4 border border-border bg-card p-5 text-sm">
            <p className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-accent" strokeWidth={1.5} />
              <span>
                <span className="block font-semibold text-foreground">Dirección</span>
                {siteConfig.address}
              </span>
            </p>
            <p className="flex items-start gap-3">
              <Phone className="mt-0.5 h-5 w-5 shrink-0 text-accent" strokeWidth={1.5} />
              <span>
                <span className="block font-semibold text-foreground">Teléfono</span>
                {siteConfig.phone}
              </span>
            </p>
            <p className="flex items-start gap-3">
              <Mail className="mt-0.5 h-5 w-5 shrink-0 text-accent" strokeWidth={1.5} />
              <span>
                <span className="block font-semibold text-foreground">Correo</span>
                {siteConfig.email}
              </span>
            </p>
            <p className="border-t border-border pt-4 text-muted">
              Horario: {siteConfig.schedule}
            </p>
            <a
              href={buildWhatsAppUrl(
                `Hola ${siteConfig.companyName}, deseo ${siteConfig.whatsappSalesLabel.toLowerCase()}.`,
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp w-full"
            >
              WhatsApp {siteConfig.whatsappSalesLabel}
            </a>
          </div>

          <div className="overflow-hidden border border-border">
            <iframe
              title={`Mapa ${siteConfig.shortName}`}
              src={siteConfig.mapEmbedUrl}
              className="h-72 w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
