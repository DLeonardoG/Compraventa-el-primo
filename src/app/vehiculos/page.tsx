import { SectionHeading } from "@/components/ui/SectionHeading";
import { VehicleFilters } from "@/components/vehicles/VehicleFilters";
import { getVehicles } from "@/lib/sheets";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

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

  const q = typeof params.q === "string" ? params.q : "";
  const minPrice = typeof params.minPrice === "string" ? params.minPrice : "";
  const maxPrice = typeof params.maxPrice === "string" ? params.maxPrice : "";

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Catálogo"
        title="Vehículos disponibles"
        description="Filtra por marca, año, transmisión, precio y estado en tiempo real."
      />
      <VehicleFilters
        vehicles={vehicles}
        initialQuery={q}
        initialMinPrice={minPrice}
        initialMaxPrice={maxPrice}
      />
    </div>
  );
}
