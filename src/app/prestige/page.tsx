import { ImportRequestForm } from "@/components/forms/ImportRequestForm";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { VehicleCard } from "@/components/vehicles/VehicleCard";
import { getPrestigeVehicles } from "@/lib/sheets";

export const metadata = {
  title: "Línea Prestige & Importación",
};

export default async function PrestigePage() {
  const vehicles = await getPrestigeVehicles();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <section className="relative mb-12 overflow-hidden rounded-2xl border border-accent/20 bg-gradient-to-br from-[#16120c] to-[#0d1524] p-8 sm:p-12">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
          Prestige Collection
        </p>
        <h1 className="mt-3 max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl">
          Línea Prestige & Importación bajo pedido
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-300 sm:text-base">
          Una curaduría más sobria para vehículos premium y un servicio de
          importación directa con acompañamiento comercial, documental y de
          entrega.
        </p>
      </section>

      <SectionHeading
        eyebrow="Inventario exclusivo"
        title="Unidades Prestige e Importación"
        description="Filtrado automáticamente por línea Prestige o Importacion."
      />

      {vehicles.length ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border p-10 text-center text-muted">
          Pronto publicaremos nuevas unidades Prestige.
        </div>
      )}

      <section className="mt-16 grid gap-8 lg:grid-cols-2">
        <div>
          <SectionHeading
            eyebrow="Servicio"
            title="Importación directa a tu medida"
            description="Cuéntanos la marca, modelo y presupuesto. Nosotros gestionamos la búsqueda y la importación."
            className="mb-4"
          />
          <ul className="space-y-3 text-sm text-muted">
            <li>• Búsqueda internacional según tu brief</li>
            <li>• Validación de historial y estado</li>
            <li>• Acompañamiento en nacionalización y entrega</li>
          </ul>
        </div>
        <ImportRequestForm />
      </section>
    </div>
  );
}
