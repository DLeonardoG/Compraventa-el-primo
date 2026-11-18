import { SectionHeading } from "@/components/ui/SectionHeading";
import { VehicleFilters } from "@/components/vehicles/VehicleFilters";
import { getVehicles } from "@/lib/inventory";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Vehículos",
};

export default async function VehiculosPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const vehicles = await getVehicles();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Inventario"
        title="Catálogo de vehículos"
        description="Filtra por marca, línea, año, transmisión, combustible y presupuesto. Oculta vendidos y ordena resultados."
      />
      <VehicleFilters
        vehicles={vehicles}
        initialQuery={typeof params.q === "string" ? params.q : ""}
        initialMarca={typeof params.marca === "string" ? params.marca : ""}
        initialMinPrice={typeof params.minPrice === "string" ? params.minPrice : ""}
        initialMaxPrice={typeof params.maxPrice === "string" ? params.maxPrice : ""}
        initialAnioMin={typeof params.anioMin === "string" ? params.anioMin : ""}
      />
    </div>
  );
}
