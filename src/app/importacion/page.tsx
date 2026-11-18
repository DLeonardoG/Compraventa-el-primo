import { ImportRequestForm } from "@/components/forms/ImportRequestForm";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { VehicleCard } from "@/components/vehicles/VehicleCard";
import { siteConfig } from "@/config/site.config";
import { getImportVehicles } from "@/lib/inventory";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Importación Directa",
};

const steps = [
  {
    title: "Cotización",
    text: "Defines marca, modelo, año, color y presupuesto. Te devolvemos opciones reales.",
  },
  {
    title: "Inspección en origen",
    text: "Revisamos historial, estado mecánico y documentación antes de comprometer el embarque.",
  },
  {
    title: "Nacionalización",
    text: "Acompañamos impuestos, trámites y la llegada del vehículo a Colombia.",
  },
  {
    title: "Entrega",
    text: "Recibes la unidad con traspaso ordenado y soporte comercial del mismo equipo.",
  },
];

export default async function ImportacionPage() {
  const vehicles = await getImportVehicles();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <section className="mb-12 border border-border bg-[#0c0c0f] p-8 sm:p-12">
        <div className="h-px w-16 bg-accent" />
        <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">
          Importación directa
        </p>
        <h1 className="heading-display mt-3 max-w-2xl text-3xl font-bold sm:text-4xl">
          Traemos el vehículo que necesitas
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-300 sm:text-base">
          Con {siteConfig.companyName} gestionas importación bajo pedido con
          acompañamiento de punta a punta.
        </p>
      </section>

      <SectionHeading
        eyebrow="En tránsito / Importación"
        title="Unidades de importación"
        description="Inventario filtrado por línea Importación."
      />

      {vehicles.length ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      ) : (
        <div className="border border-dashed border-border p-10 text-center text-muted">
          No hay unidades de importación publicadas en este momento.
        </div>
      )}

      <section className="mt-16 grid gap-8 lg:grid-cols-2">
        <div>
          <SectionHeading
            eyebrow="Proceso"
            title="Cómo importar con El Primo"
            description="Cuatro pasos claros para traer tu vehículo a pedido."
            className="mb-6"
          />
          <ol className="space-y-4">
            {steps.map((step, index) => (
              <li key={step.title} className="border border-border bg-card p-4">
                <p className="font-tech text-[10px] uppercase tracking-[0.18em] text-accent">
                  Paso {index + 1}
                </p>
                <h3 className="heading-display mt-2 font-bold">{step.title}</h3>
                <p className="mt-1 text-sm text-muted">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
        <ImportRequestForm />
      </section>
    </div>
  );
}
