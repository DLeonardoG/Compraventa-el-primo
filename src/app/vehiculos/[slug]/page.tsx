import { notFound } from "next/navigation";
import { VehicleDetailClient } from "@/components/vehicles/VehicleDetailClient";
import {
  getSimilarVehicles,
  getVehicleBySlug,
  getVehicles,
} from "@/lib/inventory";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  try {
    const vehicles = await getVehicles();
    return vehicles.map((vehicle) => ({ slug: vehicle.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  try {
    const vehicle = await getVehicleBySlug(slug);
    if (!vehicle) return { title: "Vehículo no encontrado" };
    return {
      title: `${vehicle.marca} ${vehicle.modelo} ${vehicle.anio}`,
    };
  } catch {
    return { title: "Vehículo" };
  }
}

export default async function VehicleDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const vehicle = await getVehicleBySlug(slug);
  if (!vehicle) notFound();

  const similar = await getSimilarVehicles(vehicle);

  return <VehicleDetailClient vehicle={vehicle} similar={similar} />;
}
