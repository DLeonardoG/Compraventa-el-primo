import { notFound } from "next/navigation";
import { VehicleForm } from "@/components/admin/VehicleForm";
import { getVehicleById } from "@/lib/inventory";

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;

export default async function EditVehiclePage({ params }: { params: Params }) {
  const { id } = await params;
  const vehicle = await getVehicleById(id);
  if (!vehicle) notFound();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">
          Editar {vehicle.marca} {vehicle.modelo}
        </h1>
        <p className="mt-1 text-sm text-muted">Slug: {vehicle.slug}</p>
      </div>
      <VehicleForm vehicle={vehicle} />
    </div>
  );
}
