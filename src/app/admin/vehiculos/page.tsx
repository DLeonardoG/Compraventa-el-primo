import { VehicleListClient } from "@/components/admin/VehicleListClient";
import { getVehicles } from "@/lib/inventory";

export const dynamic = "force-dynamic";

export default async function AdminVehiclesPage() {
  const vehicles = await getVehicles();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Vehículos</h1>
        <p className="mt-1 text-sm text-muted">
          Gestiona inventario, estado y medios.
        </p>
      </div>
      <VehicleListClient vehicles={vehicles} />
    </div>
  );
}
