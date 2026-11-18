"use client";

import { useMemo, useState } from "react";
import { VehicleCard } from "@/components/vehicles/VehicleCard";
import type { InventoryStatus, Transmission, Vehicle } from "@/types/inventory";

type VehicleFiltersProps = {
  vehicles: Vehicle[];
  initialQuery?: string;
  initialMinPrice?: string;
  initialMaxPrice?: string;
};

export function VehicleFilters({
  vehicles,
  initialQuery = "",
  initialMinPrice = "",
  initialMaxPrice = "",
}: VehicleFiltersProps) {
  const [q, setQ] = useState(initialQuery);
  const [marca, setMarca] = useState("");
  const [anioMin, setAnioMin] = useState("");
  const [anioMax, setAnioMax] = useState("");
  const [transmision, setTransmision] = useState<"" | Transmission>("");
  const [minPrice, setMinPrice] = useState(initialMinPrice);
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice);
  const [estado, setEstado] = useState<"" | InventoryStatus>("");

  const marcas = useMemo(
    () => Array.from(new Set(vehicles.map((v) => v.marca))).sort(),
    [vehicles],
  );

  const filtered = useMemo(() => {
    return vehicles.filter((vehicle) => {
      const haystack = `${vehicle.marca} ${vehicle.modelo} ${vehicle.descripcion}`.toLowerCase();
      if (q && !haystack.includes(q.toLowerCase())) return false;
      if (marca && vehicle.marca !== marca) return false;
      if (anioMin && vehicle.anio < Number(anioMin)) return false;
      if (anioMax && vehicle.anio > Number(anioMax)) return false;
      if (transmision && vehicle.transmision !== transmision) return false;
      if (minPrice && vehicle.precio < Number(minPrice)) return false;
      if (maxPrice && vehicle.precio > Number(maxPrice)) return false;
      if (estado && vehicle.estado !== estado) return false;
      return true;
    });
  }, [vehicles, q, marca, anioMin, anioMax, transmision, minPrice, maxPrice, estado]);

  return (
    <div className="space-y-8">
      <div className="grid gap-3 rounded-xl border border-border bg-card p-4 sm:grid-cols-2 lg:grid-cols-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por texto"
          className="input-field"
        />
        <select
          value={marca}
          onChange={(e) => setMarca(e.target.value)}
          className="input-field"
        >
          <option value="">Todas las marcas</option>
          {marcas.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <input
          type="number"
          value={anioMin}
          onChange={(e) => setAnioMin(e.target.value)}
          placeholder="Año mínimo"
          className="input-field"
        />
        <input
          type="number"
          value={anioMax}
          onChange={(e) => setAnioMax(e.target.value)}
          placeholder="Año máximo"
          className="input-field"
        />
        <select
          value={transmision}
          onChange={(e) => setTransmision(e.target.value as "" | Transmission)}
          className="input-field"
        >
          <option value="">Cualquier transmisión</option>
          <option value="Automática">Automática</option>
          <option value="Mecánica">Mecánica</option>
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
      </div>

      <p className="text-sm text-muted">
        {filtered.length} vehículo{filtered.length === 1 ? "" : "s"} encontrado
        {filtered.length === 1 ? "" : "s"}
      </p>

      {filtered.length ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border p-10 text-center text-muted">
          No hay vehículos con esos filtros. Ajusta la búsqueda.
        </div>
      )}
    </div>
  );
}
