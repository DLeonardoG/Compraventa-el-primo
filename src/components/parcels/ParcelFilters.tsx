"use client";

import { useMemo, useState } from "react";
import { ParcelCard } from "@/components/parcels/ParcelCard";
import type { InventoryStatus, Parcel } from "@/types/inventory";

type ParcelFiltersProps = {
  parcels: Parcel[];
  initialQuery?: string;
  initialMinPrice?: string;
  initialMaxPrice?: string;
};

export function ParcelFilters({
  parcels,
  initialQuery = "",
  initialMinPrice = "",
  initialMaxPrice = "",
}: ParcelFiltersProps) {
  const [ubicacion, setUbicacion] = useState(initialQuery);
  const [areaMin, setAreaMin] = useState("");
  const [minPrice, setMinPrice] = useState(initialMinPrice);
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice);
  const [estado, setEstado] = useState<"" | InventoryStatus>("");

  const ubicaciones = useMemo(
    () => Array.from(new Set(parcels.map((p) => p.ubicacion))).sort(),
    [parcels],
  );

  const filtered = useMemo(() => {
    return parcels.filter((parcel) => {
      const haystack = `${parcel.titulo} ${parcel.ubicacion} ${parcel.descripcion}`.toLowerCase();
      if (ubicacion) {
        const matchSelect = parcel.ubicacion === ubicacion;
        const matchText = haystack.includes(ubicacion.toLowerCase());
        if (!matchSelect && !matchText) return false;
      }
      if (areaMin && parcel.area_m2 < Number(areaMin)) return false;
      if (minPrice && parcel.precio < Number(minPrice)) return false;
      if (maxPrice && parcel.precio > Number(maxPrice)) return false;
      if (estado && parcel.estado !== estado) return false;
      return true;
    });
  }, [parcels, ubicacion, areaMin, minPrice, maxPrice, estado]);

  return (
    <div className="space-y-8">
      <div className="grid gap-3 rounded-xl border border-border bg-card p-4 sm:grid-cols-2 lg:grid-cols-5">
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
          className="input-field lg:col-span-2"
        />
        <input
          type="number"
          value={areaMin}
          onChange={(e) => setAreaMin(e.target.value)}
          placeholder="Área mínima m²"
          className="input-field"
        />
        <select
          value={estado}
          onChange={(e) => setEstado(e.target.value as "" | InventoryStatus)}
          className="input-field"
        >
          <option value="">Todos los estados</option>
          <option value="Disponible">Disponible</option>
          <option value="Reservado">Reservado</option>
          <option value="Vendido">Vendido</option>
        </select>
        <input
          type="number"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          placeholder="Precio mínimo"
          className="input-field"
        />
        <input
          type="number"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          placeholder="Precio máximo"
          className="input-field"
        />
      </div>

      <p className="text-sm text-muted">
        {filtered.length} parcela{filtered.length === 1 ? "" : "s"} encontrada
        {filtered.length === 1 ? "" : "s"}
      </p>

      {filtered.length ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((parcel) => (
            <ParcelCard key={parcel.id} parcel={parcel} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border p-10 text-center text-muted">
          No hay parcelas con esos filtros.
        </div>
      )}
    </div>
  );
}
