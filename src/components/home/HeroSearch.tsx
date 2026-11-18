"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";
import { useConsignment } from "@/components/providers/ConsignmentProvider";
import { siteConfig } from "@/config/site.config";
import { cn } from "@/lib/utils";
import type { Vehicle, VehicleLine } from "@/types/inventory";

type SearchTab = "vehiculo" | "parcela";

type HeroSearchProps = {
  vehicles: Vehicle[];
};

const PRICE_RANGES = [
  { id: "", label: "Rango de precio", min: "", max: "" },
  { id: "100", label: "Hasta $ 100.000.000", min: "", max: "100000000" },
  { id: "200", label: "$ 100 a $ 200 millones", min: "100000000", max: "200000000" },
  { id: "350", label: "$ 200 a $ 350 millones", min: "200000000", max: "350000000" },
  { id: "350+", label: "Más de $ 350.000.000", min: "350000000", max: "" },
];

const LINES: { value: "" | VehicleLine; label: string }[] = [
  { value: "", label: "Línea / tipo" },
  { value: "NORMAL", label: "Línea general" },
  { value: "PRESTIGE", label: "Línea Prestige" },
  { value: "IMPORTACION", label: "Importación" },
];

export function HeroSearch({ vehicles }: HeroSearchProps) {
  const router = useRouter();
  const { openConsignment } = useConsignment();
  const [tab, setTab] = useState<SearchTab>("vehiculo");
  const [marca, setMarca] = useState("");
  const [linea, setLinea] = useState<"" | VehicleLine>("");
  const [priceId, setPriceId] = useState("");
  const [ubicacion, setUbicacion] = useState("");

  const marcas = useMemo(
    () => Array.from(new Set(vehicles.map((v) => v.marca))).sort(),
    [vehicles],
  );

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const params = new URLSearchParams();
    const range = PRICE_RANGES.find((item) => item.id === priceId);

    if (tab === "vehiculo") {
      if (marca) params.set("marca", marca);
      if (linea) params.set("linea", linea);
      if (range?.min) params.set("minPrice", range.min);
      if (range?.max) params.set("maxPrice", range.max);
      const qs = params.toString();
      router.push(qs ? `/vehiculos?${qs}` : "/vehiculos");
      return;
    }

    if (ubicacion) params.set("q", ubicacion);
    if (range?.min) params.set("minPrice", range.min);
    if (range?.max) params.set("maxPrice", range.max);
    const qs = params.toString();
    router.push(qs ? `/parcelas?${qs}` : "/parcelas");
  }

  return (
    <section className="relative isolate min-h-[92vh] border-b border-border">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=2400&q=80)",
        }}
      />
      <div className="absolute inset-0 bg-[#09090B]/78" />

      <div className="relative mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-end px-4 pb-12 pt-32 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-accent">
            {siteConfig.companyName}
          </p>
          <div className="mt-5 h-px w-16 bg-accent" />
          <h1 className="heading-display mt-6 text-4xl font-bold text-[#F4F4F5] sm:text-6xl lg:text-7xl">
            Vehículos con criterio.
            <span className="mt-2 block text-[#A1A1AA]">Parcelas con respaldo.</span>
          </h1>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-[#A1A1AA] sm:text-base">
            Showroom en {siteConfig.city} para unidades seleccionadas, línea
            Prestige, importación bajo pedido y lotes campestres con ficha clara.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/vehiculos" className="btn-champagne">
              Ver inventario
            </Link>
            <button type="button" onClick={openConsignment} className="btn-outline">
              Vende tu vehículo
            </button>
          </div>
        </div>

        <form
          onSubmit={onSubmit}
          className="mt-12 w-full border border-border bg-[#111114]/95 p-4 sm:p-5"
        >
          <div className="mb-4 flex gap-2">
            {(
              [
                ["vehiculo", "Vehículos"],
                ["parcela", "Parcelas"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setTab(value)}
                className={cn(
                  "rounded-sm px-4 py-2 text-sm font-semibold transition-colors",
                  tab === value
                    ? "bg-accent text-[#09090B]"
                    : "border border-border text-muted hover:text-foreground",
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {tab === "vehiculo" ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <select
                value={marca}
                onChange={(e) => setMarca(e.target.value)}
                className="input-field"
                aria-label="Marca"
              >
                <option value="">Marca</option>
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
                aria-label="Línea"
              >
                {LINES.map((item) => (
                  <option key={item.label} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
              <select
                value={priceId}
                onChange={(e) => setPriceId(e.target.value)}
                className="input-field"
                aria-label="Rango de precio"
              >
                {PRICE_RANGES.map((item) => (
                  <option key={item.id || "any"} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
              <button type="submit" className="btn-champagne">
                <Search className="h-4 w-4" strokeWidth={1.5} />
                Buscar
              </button>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <input
                value={ubicacion}
                onChange={(e) => setUbicacion(e.target.value)}
                placeholder="Ubicación"
                className="input-field"
                aria-label="Ubicación"
              />
              <select
                value={priceId}
                onChange={(e) => setPriceId(e.target.value)}
                className="input-field"
                aria-label="Rango de precio"
              >
                {PRICE_RANGES.map((item) => (
                  <option key={item.id || "any"} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
              <button type="submit" className="btn-champagne">
                <Search className="h-4 w-4" strokeWidth={1.5} />
                Buscar parcelas
              </button>
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
