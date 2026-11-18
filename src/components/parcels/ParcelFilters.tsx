"use client";

import { Filter, X } from "lucide-react";
import { useMemo, useState } from "react";
import { ParcelCard } from "@/components/parcels/ParcelCard";
import type { InventoryStatus, Parcel } from "@/types/inventory";
import { cn } from "@/lib/utils";

type ParcelFiltersProps = {
  parcels: Parcel[];
  initialQuery?: string;
  initialMinPrice?: string;
  initialMaxPrice?: string;
  initialAreaMin?: string;
};

export function ParcelFilters({
  parcels,
  initialQuery = "",
  initialMinPrice = "",
  initialMaxPrice = "",
  initialAreaMin = "",
}: ParcelFiltersProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [ubicacion, setUbicacion] = useState(initialQuery);
  const [areaMin, setAreaMin] = useState(initialAreaMin);
  const [areaMax, setAreaMax] = useState("");
  const [minPrice, setMinPrice] = useState(initialMinPrice);
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice);
  const [estado, setEstado] = useState<"" | InventoryStatus>("");
  const [hideSold, setHideSold] = useState(true);

  const ubicaciones = useMemo(
    () => Array.from(new Set(parcels.map((p) => p.ubicacion))).sort(),
    [parcels],
  );

  function clearFilters() {
    setUbicacion("");
    setAreaMin("");
    setAreaMax("");
    setMinPrice("");
    setMaxPrice("");
    setEstado("");
    setHideSold(true);
  }

  const filtered = useMemo(() => {
    return parcels.filter((parcel) => {
      const haystack =
        `${parcel.titulo} ${parcel.ubicacion} ${parcel.descripcion}`.toLowerCase();
      if (ubicacion) {
        const matchSelect = parcel.ubicacion === ubicacion;
        const matchText = haystack.includes(ubicacion.toLowerCase());
        if (!matchSelect && !matchText) return false;
      }
      if (areaMin && parcel.area_m2 < Number(areaMin)) return false;
      if (areaMax && parcel.area_m2 > Number(areaMax)) return false;
      if (minPrice && parcel.precio < Number(minPrice)) return false;
      if (maxPrice && parcel.precio > Number(maxPrice)) return false;
      if (estado && parcel.estado !== estado) return false;
      if (hideSold && parcel.estado === "VENDIDO") return false;
      return true;
    });
  }, [parcels, ubicacion, areaMin, areaMax, minPrice, maxPrice, estado, hideSold]);

  const filtersForm = (
    <div className="space-y-3">
      <select
        value={ubicaciones.includes(ubicacion) ? ubicacion : ""}
        onChange={(e) => setUbicacion(e.target.value)}
        className="input-field"
      >
        <option value="">Todas las ubicaciones</option>
        {ubicaciones.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
      <input
        value={ubicacion}
        onChange={(e) => setUbicacion(e.target.value)}
        placeholder="Buscar ubicación / título"
        className="input-field"
      />
      <div className="grid grid-cols-2 gap-2">
        <input
          type="number"
          value={areaMin}
          onChange={(e) => setAreaMin(e.target.value)}
          placeholder="Área mín. m²"
          className="input-field"
        />
        <input
          type="number"
          value={areaMax}
          onChange={(e) => setAreaMax(e.target.value)}
          placeholder="Área máx. m²"
          className="input-field"
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <input
          type="number"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          placeholder="Precio mín."
          className="input-field"
        />
        <input
          type="number"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          placeholder="Precio máx."
          className="input-field"
        />
      </div>
      <select
        value={estado}
        onChange={(e) => setEstado(e.target.value as "" | InventoryStatus)}
        className="input-field"
      >
        <option value="">Estado</option>
        <option value="DISPONIBLE">Disponible</option>
        <option value="RESERVADO">Reservado</option>
        <option value="VENDIDO">Vendido</option>
      </select>
      <label className="flex items-center gap-2 text-sm text-muted">
        <input
          type="checkbox"
          checked={hideSold}
          onChange={(e) => setHideSold(e.target.checked)}
          className="accent-[var(--accent)]"
        />
        Ocultar vendidos
      </label>
      <button type="button" onClick={clearFilters} className="btn-outline w-full text-sm">
        Limpiar filtros
      </button>
    </div>
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
      <aside className="hidden lg:block">
        <div className="sticky top-24 border border-border bg-card p-4">
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">
            Filtros
          </p>
          {filtersForm}
        </div>
      </aside>

      <div className="space-y-5">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="btn-outline lg:hidden"
          >
            <Filter className="h-4 w-4" strokeWidth={1.5} />
            Filtros
          </button>
          <p className="text-sm text-muted">
            {filtered.length} parcela{filtered.length === 1 ? "" : "s"}
          </p>
        </div>

        {filtered.length ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((parcel) => (
              <ParcelCard key={parcel.id} parcel={parcel} />
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-border p-10 text-center text-muted">
            No hay parcelas con esos filtros.
          </div>
        )}
      </div>

      <div
        className={cn(
          "fixed inset-0 z-[70] lg:hidden",
          drawerOpen ? "pointer-events-auto" : "pointer-events-none",
        )}
      >
        <div
          className={cn(
            "absolute inset-0 bg-black/60 transition-opacity",
            drawerOpen ? "opacity-100" : "opacity-0",
          )}
          onClick={() => setDrawerOpen(false)}
        />
        <div
          className={cn(
            "absolute left-0 top-0 h-full w-[86%] max-w-sm overflow-y-auto border-r border-border bg-card p-4 transition-transform",
            drawerOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-semibold">Filtros</p>
            <button type="button" onClick={() => setDrawerOpen(false)} aria-label="Cerrar">
              <X className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </div>
          {filtersForm}
        </div>
      </div>
    </div>
  );
}
