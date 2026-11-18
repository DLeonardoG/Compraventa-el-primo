import { ParcelForm } from "@/components/admin/ParcelForm";

export default function NewParcelPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Nueva parcela</h1>
        <p className="mt-1 text-sm text-muted">
          Completa la ficha y sube fotos o videos del terreno.
        </p>
      </div>
      <ParcelForm />
    </div>
  );
}
