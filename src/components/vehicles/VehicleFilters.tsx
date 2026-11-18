"use client";

import { Filter, X } from "lucide-react";
import { useMemo, useState } from "react";
import { VehicleCard } from "@/components/vehicles/VehicleCard";
import type {
  FuelType,
  InventoryStatus,
  Transmission,
  Vehicle,
  VehicleLine,
} from "@/types/inventory";
import { cn } from "@/lib/utils";

type SortKey = "recent" | "price-asc" | "price-desc" | "km-asc";

type VehicleFiltersProps = {
  vehicles: Vehicle[];
  initialQuery?: string;
  initialMarca?: string;
  initialMinPrice?: string;
  initialMaxPrice?: string;
  initialAnioMin?: string;
  initialLinea?: string;
};

export function VehicleFilters({
  vehicles,
  initialQuery = "",
  initialMarca = "",
  initialMinPrice = "",
  initialMaxPrice = "",
  initialAnioMin = "",
  initialLinea = "",
}: VehicleFiltersProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [q, setQ] = useState(initialQuery);
  const [marca, setMarca] = useState(initialMarca);
  const [linea, setLinea] = useState<"" | VehicleLine>(
    initialLinea === "PRESTIGE" || initialLinea === "IMPORTACION" || initialLinea === "NORMAL"
      ? initialLinea
      : "",
  );
  const [anioMin, setAnioMin] = useState(initialAnioMin);
  const [anioMax, setAnioMax] = useState("");
  const [transmision, setTransmision] = useState<"" | Transmission>("");
  const [combustible, setCombustible] = useState<"" | FuelType>("");
  const [minPrice, setMinPrice] = useState(initialMinPrice);
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice);
  const [estado, setEstado] = useState<"" | InventoryStatus>("");
  const [hideSold, setHideSold] = useState(true);
  const [sort, setSort] = useState<SortKey>("recent");

  const marcas = useMemo(
    () => Array.from(new Set(vehicles.map((v) => v.marca))).sort(),
    [vehicles],
  );

  function clearFilters() {
    setQ("");
    setMarca("");
    setLinea("");
    setAnioMin("");
    setAnioMax("");
    setTransmision("");
    setCombustible("");
    setMinPrice("");
    setMaxPrice("");
    setEstado("");
    setHideSold(true);
    setSort("recent");
  }

  const filtered = useMemo(() => {
    const list = vehicles.filter((vehicle) => {
      const haystack =
        `${vehicle.marca} ${vehicle.modelo} ${vehicle.descripcion}`.toLowerCase();
      if (q && !haystack.includes(q.toLowerCase())) return false;
      if (marca && vehicle.marca !== marca) return false;
      if (linea && vehicle.linea !== linea) return false;
      if (anioMin && vehicle.anio < Number(anioMin)) return false;
      if (anioMax && vehicle.anio > Number(anioMax)) return false;
      if (transmision && vehicle.transmision !== transmision) return false;
      if (combustible && vehicle.combustible !== combustible) return false;
      if (minPrice && vehicle.precio < Number(minPrice)) return false;
      if (maxPrice && vehicle.precio > Number(maxPrice)) return false;
      if (estado && vehicle.estado !== estado) return false;
      if (hideSold && vehicle.estado === "VENDIDO") return false;
      return true;
    });

    return list.sort((a, b) => {
      if (sort === "price-asc") return a.precio - b.precio;
      if (sort === "price-desc") return b.precio - a.precio;
      if (sort === "km-asc") return a.kilometraje - b.kilometraje;
      return b.anio - a.anio;
    });
  }, [
    vehicles,
    q,
    marca,
    linea,
    anioMin,
    anioMax,
    transmision,
    combustible,
    minPrice,
    maxPrice,
    estado,
    hideSold,
    sort,
  ]);

  const filtersForm = (
    <div className="space-y-3">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Buscar por palabra clave"
        className="input-field"
      />
      <select value={marca} onChange={(e) => setMarca(e.target.value)} className="input-field">
        <option value="">Todas las marcas</option>
        {marcas.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
      <select
        value={linea}
        onChange={(e) => setLinea(e.target.value as "" | VehicleLine)}
        className="input-field"
      >
        <option value="">Todas las líneas</option>
        <option value="NORMAL">Normal</option>
        <option value="PRESTIGE">Prestige</option>
        <option value="IMPORTACION">Importación</option>
      </select>
      <div className="grid grid-cols-2 gap-2">
        <input
          type="number"
          value={anioMin}
          onChange={(e) => setAnioMin(e.target.value)}
          placeholder="Año desde"
          className="input-field"
        />
        <input
          type="number"
          value={anioMax}
          onChange={(e) => setAnioMax(e.target.value)}
          placeholder="Año hasta"
          className="input-field"
        />
      </div>
      <select
        value={transmision}
        onChange={(e) => setTransmision(e.target.value as "" | Transmission)}
        className="input-field"
      >
        <option value="">Transmisión</option>
        <option value="Automática">Automática</option>
        <option value="Mecánica">Mecánica</option>
      </select>
      <select
        value={combustible}
        onChange={(e) => setCombustible(e.target.value as "" | FuelType)}
        className="input-field"
      >
        <option value="">Combustible</option>
        <option value="Gasolina">Gasolina</option>
        <option value="Diésel">Diésel</option>
        <option value="Híbrido">Híbrido</option>
        <option value="Eléctrico">Eléctrico</option>
      </select>
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
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="btn-outline lg:hidden"
          >
            <Filter className="h-4 w-4" strokeWidth={1.5} />
            Filtros
          </button>
          <p className="text-sm text-muted">
            {filtered.length} vehículo{filtered.length === 1 ? "" : "s"}
          </p>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="input-field max-w-xs"
          >
            <option value="recent">Más recientes</option>
            <option value="price-asc">Menor precio</option>
            <option value="price-desc">Mayor precio</option>
            <option value="km-asc">Menor kilometraje</option>
          </select>
        </div>

        {filtered.length ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-border p-10 text-center text-muted">
            No hay vehículos con esos filtros.
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
