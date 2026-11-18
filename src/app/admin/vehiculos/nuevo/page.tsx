import { VehicleForm } from "@/components/admin/VehicleForm";

export default function NewVehiclePage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Nuevo vehículo</h1>
        <p className="mt-1 text-sm text-muted">
          Completa la ficha y sube fotos o videos.
        </p>
      </div>
      <VehicleForm />
    </div>
  );
}
