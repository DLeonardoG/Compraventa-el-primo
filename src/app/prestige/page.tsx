import { SectionHeading } from "@/components/ui/SectionHeading";
import { VehicleCard } from "@/components/vehicles/VehicleCard";
import { siteConfig } from "@/config/site.config";
import { getPrestigeVehicles } from "@/lib/inventory";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Línea Prestige",
};

export default async function PrestigePage() {
  const vehicles = await getPrestigeVehicles();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <section className="mb-12 border border-border bg-[#0c0c0f] p-8 sm:p-12">
        <div className="h-px w-16 bg-accent" />
        <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">
          Prestige Collection
        </p>
        <h1 className="heading-display mt-3 max-w-2xl text-3xl font-extrabold sm:text-4xl">
          Línea Prestige
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-300 sm:text-base">
          Vitrina exclusiva de {siteConfig.companyName} con atención personalizada
          VIP, unidades curadas y acompañamiento comercial discreto.
        </p>
      </section>

      <SectionHeading
        eyebrow="Inventario VIP"
        title="Unidades Prestige disponibles"
        description="Filtrado exclusivamente por línea Prestige."
      />

      {vehicles.length ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      ) : (
        <div className="border border-dashed border-border p-10 text-center text-muted">
          Pronto publicaremos nuevas unidades Prestige.
        </div>
      )}
    </div>
  );
}
