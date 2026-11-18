import { JobApplicationForm } from "@/components/forms/JobApplicationForm";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { siteConfig } from "@/config/site.config";

export const metadata = {
  title: "Nosotros",
};

export default function NosotrosPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Nuestra historia"
        title={`Conoce ${siteConfig.name}`}
        description="Operamos con transparencia, acompañamiento profesional y un inventario curado de vehículos y parcelas."
      />

      <div className="grid gap-8 lg:grid-cols-2">
        <article className="space-y-4 text-sm leading-relaxed text-muted sm:text-base">
          <p>
            En {siteConfig.shortName} creemos que comprar o vender un activo
            importante debe sentirse claro, seguro y humano. Por eso
            construimos una experiencia comercial ejecutiva, con información
            verificable y atención cercana.
          </p>
          <p>
            Nuestro equipo combina peritaje, asesoría comercial y procesos
            documentales para que cada cliente avance con respaldo: desde la
            primera consulta hasta la entrega.
          </p>
        </article>

        <div className="grid gap-4 sm:grid-cols-2">
          {[
            {
              title: "Transparencia",
              text: "Publicamos estado, precio y detalle técnico sin letra pequeña.",
            },
            {
              title: "Respaldo",
              text: "Acompañamos financiación, consignación y evaluación de usados.",
            },
            {
              title: "Curaduría",
              text: "Seleccionamos unidades y lotes con criterio comercial real.",
            },
            {
              title: "Cercanía",
              text: "WhatsApp y asesoría directa para resolver dudas al instante.",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-bold text-foreground">{item.title}</h3>
              <p className="mt-2 text-sm text-muted">{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      <section className="mt-16">
        <JobApplicationForm />
      </section>
    </div>
  );
}
