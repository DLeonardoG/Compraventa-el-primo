"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { saveParcel } from "@/app/admin/actions";
import {
  MediaUploader,
  type DraftMedia,
} from "@/components/admin/MediaUploader";
import type { InventoryStatus, Parcel } from "@/types/inventory";

const statuses: InventoryStatus[] = ["DISPONIBLE", "RESERVADO", "VENDIDO"];

type ParcelFormProps = {
  parcel?: Parcel;
};

export function ParcelForm({ parcel }: ParcelFormProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [media, setMedia] = useState<DraftMedia[]>(parcel?.media ?? []);
  const [destacado, setDestacado] = useState(parcel?.destacado ?? false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const result = await saveParcel({
      id: parcel?.id,
      titulo: String(form.get("titulo") || ""),
      ubicacion: String(form.get("ubicacion") || ""),
      areaM2: Number(form.get("areaM2") || 0),
      precio: Number(form.get("precio") || 0),
      servicios: String(form.get("servicios") || ""),
      topografia: String(form.get("topografia") || ""),
      documentacion: String(form.get("documentacion") || ""),
      estado: String(form.get("estado") || "DISPONIBLE") as InventoryStatus,
      destacado,
      descripcion: String(form.get("descripcion") || ""),
      media: media.map(({ id, url, key, tipo, orden, esPortada }) => ({
        id,
        url,
        key,
        tipo,
        orden,
        esPortada,
      })),
    });
    setSaving(false);
    if (!result.ok) {
      setError(result.error || "Error al guardar");
      return;
    }
    router.push("/admin/parcelas");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <Field name="titulo" label="Título" defaultValue={parcel?.titulo} required />
        <Field name="ubicacion" label="Ubicación" defaultValue={parcel?.ubicacion} required />
        <Field name="areaM2" label="Área m²" type="number" defaultValue={parcel?.area_m2 ?? 0} required />
        <Field name="precio" label="Precio" type="number" defaultValue={parcel?.precio ?? 0} required />
        <Field name="servicios" label="Servicios" defaultValue={parcel?.servicios} />
        <Field name="topografia" label="Topografía" defaultValue={parcel?.topografia} />
        <Field name="documentacion" label="Documentación" defaultValue={parcel?.documentacion} />
        <label className="block space-y-1.5">
          <span className="text-xs uppercase tracking-[0.14em] text-muted">
            Estado
          </span>
          <select
            name="estado"
            defaultValue={parcel?.estado ?? "DISPONIBLE"}
            className="w-full border border-border bg-elevated px-3 py-2 text-sm outline-none focus:border-accent"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="flex items-center gap-2 text-sm text-muted">
        <input
          type="checkbox"
          checked={destacado}
          onChange={(event) => setDestacado(event.target.checked)}
        />
        Destacada en home
      </label>

      <label className="block space-y-1.5">
        <span className="text-xs uppercase tracking-[0.14em] text-muted">
          Descripción
        </span>
        <textarea
          name="descripcion"
          rows={5}
          defaultValue={parcel?.descripcion}
          className="w-full border border-border bg-elevated px-3 py-2 text-sm outline-none focus:border-accent"
          required
        />
      </label>

      <div>
        <p className="mb-2 text-xs uppercase tracking-[0.14em] text-muted">
          Medios
        </p>
        <MediaUploader folder="parcelas" value={media} onChange={setMedia} />
      </div>

      {error ? <p className="text-sm text-red-400">{error}</p> : null}

      <button
        type="submit"
        disabled={saving}
        className="bg-accent px-4 py-2.5 text-sm font-semibold uppercase tracking-[0.14em] text-background disabled:opacity-60"
      >
        {saving ? "Guardando..." : "Guardar parcela"}
      </button>
    </form>
  );
}

function Field({
  name,
  label,
  defaultValue,
  type = "text",
  required,
}: {
  name: string;
  label: string;
  defaultValue?: string | number;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs uppercase tracking-[0.14em] text-muted">
        {label}
      </span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        className="w-full border border-border bg-elevated px-3 py-2 text-sm outline-none focus:border-accent"
      />
    </label>
  );
}
