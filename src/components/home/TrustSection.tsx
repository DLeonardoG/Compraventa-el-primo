import { BadgeCheck, HandCoins, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { buildWhatsAppUrl, generalWhatsAppMessage } from "@/lib/whatsapp";

const items = [
  {
    icon: BadgeCheck,
    title: "Peritaje profesional",
    text: "Revisión técnica y transparencia en el estado real de cada unidad.",
  },
  {
    icon: HandCoins,
    title: "Financiación acompañada",
    text: "Te orientamos con cuotas estimadas y aliados financieros.",
  },
  {
    icon: RefreshCcw,
    title: "Recibimos tu usado",
    text: "Evalúa tu vehículo actual como parte de pago o consignación.",
  },
];

export function TrustSection() {
  return (
    <section className="border-y border-border bg-[#0b0b0f]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Confianza"
          title="Respaldo en cada etapa"
          description="Procesos claros para comprar, vender o consignar con tranquilidad."
          align="center"
        />

        <div className="grid gap-6 md:grid-cols-3">
          {items.map((item) => (
            <div key={item.title} className="rounded-xl border border-border bg-card p-6">
              <item.icon className="h-8 w-8 text-accent" />
              <h3 className="mt-4 text-lg font-bold">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <a
            href={buildWhatsAppUrl(generalWhatsAppMessage())}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            Hablar con un asesor
          </a>
          <Link href="/contacto" className="btn-secondary">
            Formulario de contacto
          </Link>
        </div>
      </div>
    </section>
  );
}
