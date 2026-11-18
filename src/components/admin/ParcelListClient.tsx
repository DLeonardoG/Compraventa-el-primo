"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { deleteParcel, updateParcelStatus } from "@/app/admin/actions";
import { coverUrl } from "@/lib/inventory-client";
import { statusLabel } from "@/lib/labels";
import { formatCOP } from "@/lib/formatters";
import type { InventoryStatus, Parcel } from "@/types/inventory";

type Props = { parcels: Parcel[] };

const statuses: InventoryStatus[] = ["DISPONIBLE", "RESERVADO", "VENDIDO"];

export function ParcelListClient({ parcels }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [estado, setEstado] = useState<InventoryStatus | "ALL">("ALL");
  const [busyId, setBusyId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return parcels.filter((parcel) => {
      if (estado !== "ALL" && parcel.estado !== estado) return false;
      if (!q) return true;
      return `${parcel.titulo} ${parcel.ubicacion}`.toLowerCase().includes(q);
    });
  }, [parcels, query, estado]);

  async function onStatus(id: string, next: InventoryStatus) {
    setBusyId(id);
    await updateParcelStatus(id, next);
    setBusyId(null);
    router.refresh();
  }

  async function onDelete(id: string) {
    if (!window.confirm("¿Eliminar esta parcela y sus archivos?")) return;
    setBusyId(id);
    await deleteParcel(id);
    setBusyId(null);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar título o ubicación..."
          className="min-w-[220px] flex-1 border border-border bg-elevated px-3 py-2 text-sm outline-none focus:border-accent"
        />
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
          href="/admin/parcelas/nuevo"
          className="bg-accent px-4 py-2 text-sm font-semibold uppercase tracking-[0.14em] text-background"
        >
          Nueva
        </Link>
      </div>

      <div className="space-y-2">
        {filtered.map((parcel) => (
          <div
            key={parcel.id}
            className="flex flex-col gap-3 border border-border bg-card p-3 md:flex-row md:items-center"
          >
            <div className="h-16 w-24 shrink-0 overflow-hidden bg-elevated">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={coverUrl(parcel.media)}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-foreground">{parcel.titulo}</p>
              <p className="text-xs text-muted">
                {parcel.ubicacion} · {statusLabel(parcel.estado)} ·{" "}
                {formatCOP(parcel.precio)}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {statuses.map((status) => (
                <button
                  key={status}
                  type="button"
                  disabled={busyId === parcel.id}
                  onClick={() => void onStatus(parcel.id, status)}
                  className={`border px-2 py-1 text-[10px] uppercase tracking-[0.12em] ${
                    parcel.estado === status
                      ? "border-accent text-accent"
                      : "border-border text-muted hover:text-foreground"
                  }`}
                >
                  {status}
                </button>
              ))}
              <Link
                href={`/admin/parcelas/${parcel.id}`}
                className="border border-border px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-muted hover:text-accent"
              >
                Editar
              </Link>
              <button
                type="button"
                disabled={busyId === parcel.id}
                onClick={() => void onDelete(parcel.id)}
                className="border border-border px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-red-400"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
        {!filtered.length ? (
          <p className="text-sm text-muted">No hay parcelas con esos filtros.</p>
        ) : null}
      </div>
    </div>
  );
}
