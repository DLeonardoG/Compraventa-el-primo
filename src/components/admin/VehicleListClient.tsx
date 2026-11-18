"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  deleteVehicle,
  updateVehicleStatus,
} from "@/app/admin/actions";
import { lineLabel, statusLabel } from "@/lib/labels";
import { coverUrl } from "@/lib/inventory-client";
import { formatCOP } from "@/lib/formatters";
import type { InventoryStatus, Vehicle, VehicleLine } from "@/types/inventory";

type Props = { vehicles: Vehicle[] };

const statuses: InventoryStatus[] = ["DISPONIBLE", "RESERVADO", "VENDIDO"];

export function VehicleListClient({ vehicles }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [linea, setLinea] = useState<VehicleLine | "ALL">("ALL");
  const [estado, setEstado] = useState<InventoryStatus | "ALL">("ALL");
  const [busyId, setBusyId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return vehicles.filter((vehicle) => {
      if (linea !== "ALL" && vehicle.linea !== linea) return false;
      if (estado !== "ALL" && vehicle.estado !== estado) return false;
      if (!q) return true;
      return `${vehicle.marca} ${vehicle.modelo} ${vehicle.placa}`
        .toLowerCase()
        .includes(q);
    });
  }, [vehicles, query, linea, estado]);

  async function onStatus(id: string, next: InventoryStatus) {
    setBusyId(id);
    await updateVehicleStatus(id, next);
    setBusyId(null);
    router.refresh();
  }

  async function onDelete(id: string) {
    if (!window.confirm("¿Eliminar este vehículo y sus archivos?")) return;
    setBusyId(id);
    await deleteVehicle(id);
    setBusyId(null);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar marca, modelo, placa..."
          className="min-w-[220px] flex-1 border border-border bg-elevated px-3 py-2 text-sm outline-none focus:border-accent"
        />
        <select
          value={linea}
          onChange={(event) => setLinea(event.target.value as VehicleLine | "ALL")}
          className="border border-border bg-elevated px-3 py-2 text-sm"
        >
          <option value="ALL">Todas las líneas</option>
          <option value="NORMAL">NORMAL</option>
          <option value="PRESTIGE">PRESTIGE</option>
          <option value="IMPORTACION">IMPORTACION</option>
        </select>
        <select
          value={estado}
          onChange={(event) =>
            setEstado(event.target.value as InventoryStatus | "ALL")
          }
          className="border border-border bg-elevated px-3 py-2 text-sm"
        >
          <option value="ALL">Todos los estados</option>
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <Link
          href="/admin/vehiculos/nuevo"
          className="bg-accent px-4 py-2 text-sm font-semibold uppercase tracking-[0.14em] text-background"
        >
          Nuevo
        </Link>
      </div>

      <div className="space-y-2">
        {filtered.map((vehicle) => (
          <div
            key={vehicle.id}
            className="flex flex-col gap-3 border border-border bg-card p-3 md:flex-row md:items-center"
          >
            <div className="h-16 w-24 shrink-0 overflow-hidden bg-elevated">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={coverUrl(vehicle.media)}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-foreground">
                {vehicle.marca} {vehicle.modelo} · {vehicle.anio}
              </p>
              <p className="text-xs text-muted">
                {lineLabel(vehicle.linea)} · {statusLabel(vehicle.estado)} ·{" "}
                {formatCOP(vehicle.precio)}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {statuses.map((status) => (
                <button
                  key={status}
                  type="button"
                  disabled={busyId === vehicle.id}
                  onClick={() => void onStatus(vehicle.id, status)}
                  className={`border px-2 py-1 text-[10px] uppercase tracking-[0.12em] ${
                    vehicle.estado === status
                      ? "border-accent text-accent"
                      : "border-border text-muted hover:text-foreground"
                  }`}
                >
                  {status}
                </button>
              ))}
              <Link
                href={`/admin/vehiculos/${vehicle.id}`}
                className="border border-border px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-muted hover:text-accent"
              >
                Editar
              </Link>
              <button
                type="button"
                disabled={busyId === vehicle.id}
                onClick={() => void onDelete(vehicle.id)}
                className="border border-border px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-red-400"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
        {!filtered.length ? (
          <p className="text-sm text-muted">No hay vehículos con esos filtros.</p>
        ) : null}
      </div>
    </div>
  );
}
