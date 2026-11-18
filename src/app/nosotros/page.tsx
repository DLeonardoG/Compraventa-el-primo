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
        title={siteConfig.companyName}
        description="Transparencia, peritaje certificado y acompañamiento comercial para vehículos y parcelas."
      />

      <div className="grid gap-8 lg:grid-cols-2">
        <article className="space-y-4 text-sm leading-relaxed text-muted sm:text-base">
          <p>
            En {siteConfig.shortName} construimos una experiencia de showroom
            sobria: inventario curado, información verificable y atención
            cercana desde la primera consulta hasta el traspaso.
          </p>
          <p>
            Operamos con filosofía de respaldo real: financiación acompañada,
            retoma de usados, consignación en vitrina e importación bajo pedido.
          </p>
        </article>

        <div className="grid gap-4 sm:grid-cols-2">
          {[
            {
              title: "Transparencia",
              text: "Publicamos estado, precio y ficha técnica sin letra pequeña.",
            },
            {
              title: "Respaldo",
              text: "Peritaje, SOAT, Tecnomecánica y gestión de traspaso.",
            },
            {
              title: "Curaduría",
              text: "Selección comercial real de unidades y lotes.",
            },
            {
              title: "Cercanía",
              text: "Asesoría directa por WhatsApp en cada línea de negocio.",
            },
          ].map((item) => (
            <div key={item.title} className="border border-border bg-card p-5">
              <div className="mb-3 h-px w-8 bg-accent" />
              <h3 className="heading-display font-bold text-foreground">{item.title}</h3>
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
