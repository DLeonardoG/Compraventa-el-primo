import { notFound } from "next/navigation";
import { ParcelForm } from "@/components/admin/ParcelForm";
import { getParcelById } from "@/lib/inventory";

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;

export default async function EditParcelPage({ params }: { params: Params }) {
  const { id } = await params;
  const parcel = await getParcelById(id);
  if (!parcel) notFound();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Editar {parcel.titulo}</h1>
        <p className="mt-1 text-sm text-muted">Slug: {parcel.slug}</p>
      </div>
      <ParcelForm parcel={parcel} />
    </div>
  );
}
