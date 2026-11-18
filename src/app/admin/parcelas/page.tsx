import { ParcelListClient } from "@/components/admin/ParcelListClient";
import { getParcels } from "@/lib/inventory";

export const dynamic = "force-dynamic";

export default async function AdminParcelsPage() {
  const parcels = await getParcels();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Parcelas</h1>
        <p className="mt-1 text-sm text-muted">
          Gestiona terrenos, estado y medios.
        </p>
      </div>
      <ParcelListClient parcels={parcels} />
    </div>
  );
}
