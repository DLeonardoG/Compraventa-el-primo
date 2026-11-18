"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { saveVehicle } from "@/app/admin/actions";
import {
  MediaUploader,
  type DraftMedia,
} from "@/components/admin/MediaUploader";
import type {
  InventoryStatus,
  Vehicle,
  VehicleLine,
} from "@/types/inventory";

const lines: VehicleLine[] = ["NORMAL", "PRESTIGE", "IMPORTACION"];
const statuses: InventoryStatus[] = ["DISPONIBLE", "RESERVADO", "VENDIDO"];

type VehicleFormProps = {
  vehicle?: Vehicle;
};

export function VehicleForm({ vehicle }: VehicleFormProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [media, setMedia] = useState<DraftMedia[]>(vehicle?.media ?? []);
  const [destacado, setDestacado] = useState(vehicle?.destacado ?? false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const result = await saveVehicle({
      id: vehicle?.id,
      marca: String(form.get("marca") || ""),
      modelo: String(form.get("modelo") || ""),
      anio: Number(form.get("anio") || 0),
      kilometraje: Number(form.get("kilometraje") || 0),
      transmision: String(form.get("transmision") || "Automática"),
      combustible: String(form.get("combustible") || "Gasolina"),
      motor: String(form.get("motor") || ""),
      traccion: String(form.get("traccion") || ""),
      color: String(form.get("color") || ""),
      placa: String(form.get("placa") || ""),
      blindaje: String(form.get("blindaje") || "Sin blindaje"),
      precio: Number(form.get("precio") || 0),
      linea: String(form.get("linea") || "NORMAL") as VehicleLine,
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
    router.push("/admin/vehiculos");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <Field name="marca" label="Marca" defaultValue={vehicle?.marca} required />
        <Field name="modelo" label="Modelo" defaultValue={vehicle?.modelo} required />
        <Field name="anio" label="Año" type="number" defaultValue={vehicle?.anio ?? 2020} required />
        <Field name="kilometraje" label="Kilometraje" type="number" defaultValue={vehicle?.kilometraje ?? 0} required />
        <Field name="precio" label="Precio" type="number" defaultValue={vehicle?.precio ?? 0} required />
        <Field name="placa" label="Placa" defaultValue={vehicle?.placa} />
        <Select
          name="transmision"
          label="Transmisión"
          defaultValue={vehicle?.transmision ?? "Automática"}
          options={["Automática", "Mecánica"]}
        />
        <Select
          name="combustible"
          label="Combustible"
          defaultValue={vehicle?.combustible ?? "Gasolina"}
          options={["Gasolina", "Diésel", "Híbrido", "Eléctrico"]}
        />
        <Select name="linea" label="Línea" defaultValue={vehicle?.linea ?? "NORMAL"} options={lines} />
        <Select name="estado" label="Estado" defaultValue={vehicle?.estado ?? "DISPONIBLE"} options={statuses} />
        <Field name="motor" label="Motor" defaultValue={vehicle?.motor} />
        <Field name="traccion" label="Tracción" defaultValue={vehicle?.traccion} />
        <Field name="color" label="Color" defaultValue={vehicle?.color} />
        <Field name="blindaje" label="Blindaje" defaultValue={vehicle?.blindaje ?? "Sin blindaje"} />
      </div>

      <label className="flex items-center gap-2 text-sm text-muted">
        <input
          type="checkbox"
          checked={destacado}
          onChange={(event) => setDestacado(event.target.checked)}
        />
        Destacado en home
      </label>

      <label className="block space-y-1.5">
        <span className="text-xs uppercase tracking-[0.14em] text-muted">
          Descripción
        </span>
        <textarea
          name="descripcion"
          rows={5}
          defaultValue={vehicle?.descripcion}
          className="w-full border border-border bg-elevated px-3 py-2 text-sm outline-none focus:border-accent"
          required
        />
      </label>

      <div>
        <p className="mb-2 text-xs uppercase tracking-[0.14em] text-muted">
          Medios
        </p>
        <MediaUploader folder="vehiculos" value={media} onChange={setMedia} />
      </div>

      {error ? <p className="text-sm text-red-400">{error}</p> : null}

      <button
        type="submit"
        disabled={saving}
        className="bg-accent px-4 py-2.5 text-sm font-semibold uppercase tracking-[0.14em] text-background disabled:opacity-60"
      >
        {saving ? "Guardando..." : "Guardar vehículo"}
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

function Select({
  name,
  label,
  defaultValue,
  options,
}: {
  name: string;
  label: string;
  defaultValue: string;
  options: string[];
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs uppercase tracking-[0.14em] text-muted">
        {label}
      </span>
      <select
        name={name}
        defaultValue={defaultValue}
        className="w-full border border-border bg-elevated px-3 py-2 text-sm outline-none focus:border-accent"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
