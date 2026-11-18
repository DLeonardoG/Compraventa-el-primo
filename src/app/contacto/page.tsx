import { Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/forms/ContactForm";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { siteConfig } from "@/config/site.config";

export const metadata = {
  title: "Contacto",
};

export default function ContactoPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Hablemos"
        title="Contacto"
        description="Escríbenos para comprar, consignar o resolver dudas sobre vehículos y parcelas."
      />

      <div className="grid gap-8 lg:grid-cols-2">
        <ContactForm />

        <div className="space-y-5">
          <div className="rounded-xl border border-border bg-card p-5 space-y-4 text-sm">
            <p className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
              <span>
                <span className="block font-semibold text-foreground">Dirección</span>
                {siteConfig.address}
              </span>
            </p>
            <p className="flex items-start gap-3">
              <Phone className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
              <span>
                <span className="block font-semibold text-foreground">Teléfono</span>
                {siteConfig.phone}
              </span>
            </p>
            <p className="flex items-start gap-3">
              <Mail className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
              <span>
                <span className="block font-semibold text-foreground">Correo</span>
                {siteConfig.email}
              </span>
            </p>
            <p className="border-t border-border pt-4 text-muted">
              Horario: {siteConfig.schedule}
            </p>
          </div>

          <div className="overflow-hidden rounded-xl border border-border">
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
