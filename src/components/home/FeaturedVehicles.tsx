import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { VehicleCard } from "@/components/vehicles/VehicleCard";
import type { Vehicle } from "@/types/inventory";

export function FeaturedVehicles({ vehicles }: { vehicles: Vehicle[] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-end justify-between gap-4">
        <SectionHeading
          eyebrow="Vitrina"
          title="Vehículos Destacados"
          description="Unidades con peritaje certificado, SOAT y Tecnomecánica vigentes."
          className="mb-0"
        />
        <Link
          href="/vehiculos"
          className="hidden items-center gap-1 text-sm font-semibold text-accent hover:underline sm:inline-flex"
        >
          Ver catálogo
          <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
        </Link>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {vehicles.map((vehicle) => (
          <VehicleCard key={vehicle.id} vehicle={vehicle} />
        ))}
      </div>
    </section>
  );
}
