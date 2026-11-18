"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";
import { useConsignment } from "@/components/providers/ConsignmentProvider";
import { siteConfig } from "@/config/site.config";
import { cn } from "@/lib/utils";
import type { Vehicle } from "@/types/inventory";

type SearchTab = "vehiculo" | "parcela";

type HeroSearchProps = {
  vehicles: Vehicle[];
};

export function HeroSearch({ vehicles }: HeroSearchProps) {
  const router = useRouter();
  const { openConsignment } = useConsignment();
  const [tab, setTab] = useState<SearchTab>("vehiculo");
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [anioDesde, setAnioDesde] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [areaMin, setAreaMin] = useState("");

  const marcas = useMemo(
    () => Array.from(new Set(vehicles.map((v) => v.marca))).sort(),
    [vehicles],
  );

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const params = new URLSearchParams();

    if (tab === "vehiculo") {
      if (marca) params.set("marca", marca);
      if (modelo) params.set("q", modelo);
      if (anioDesde) params.set("anioMin", anioDesde);
      if (maxPrice) params.set("maxPrice", maxPrice);
      const qs = params.toString();
      router.push(qs ? `/vehiculos?${qs}` : "/vehiculos");
      return;
    }

    if (ubicacion) params.set("q", ubicacion);
    if (areaMin) params.set("areaMin", areaMin);
    if (maxPrice) params.set("maxPrice", maxPrice);
    const qs = params.toString();
    router.push(qs ? `/parcelas?${qs}` : "/parcelas");
  }

  return (
    <section className="relative isolate min-h-[88vh]">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=2000&q=80)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/65 to-background" />

      <div className="relative mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-end px-4 pb-10 pt-28 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="animate-fade-up text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">
            {siteConfig.shortName}
          </p>
          <h1 className="heading-display animate-fade-up delay-100 mt-3 text-4xl font-extrabold text-white sm:text-5xl lg:text-6xl">
            Showroom de vehículos seleccionados
          </h1>
          <p className="animate-fade-up delay-200 mt-4 max-w-xl text-sm text-zinc-300 sm:text-base">
            Peritaje certificado, traspaso inmediato, financiación hasta el 100%
            y retoma de usados. También parcelas con documentación clara.
          </p>
          <div className="animate-fade-up delay-200 mt-6 flex flex-wrap gap-3">
            <Link href="/vehiculos" className="btn-champagne">
              Explorar Inventario
            </Link>
            <button type="button" onClick={openConsignment} className="btn-outline">
              Consignar Vehículo
            </button>
          </div>
        </div>

        <form
          onSubmit={onSubmit}
          className="animate-fade-up delay-200 mt-10 w-full border border-border bg-card/95 p-4 backdrop-blur-sm sm:p-5"
        >
          <div className="mb-4 flex gap-2">
            <button
              type="button"
              onClick={() => setTab("vehiculo")}
              className={cn(
                "rounded-sm px-4 py-2 text-sm font-semibold transition-colors",
                tab === "vehiculo"
                  ? "bg-accent text-black"
                  : "border border-border text-muted hover:text-foreground",
              )}
            >
              Vehículos
            </button>
            <button
              type="button"
              onClick={() => setTab("parcela")}
              className={cn(
                "rounded-sm px-4 py-2 text-sm font-semibold transition-colors",
                tab === "parcela"
                  ? "bg-accent text-black"
                  : "border border-border text-muted hover:text-foreground",
              )}
            >
              Parcelas
            </button>
          </div>

          {tab === "vehiculo" ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              <select
                value={marca}
                onChange={(e) => setMarca(e.target.value)}
                className="input-field"
              >
                <option value="">Marca</option>
                {marcas.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <input
                value={modelo}
                onChange={(e) => setModelo(e.target.value)}
                placeholder="Modelo / Línea"
                className="input-field"
              />
              <input
                type="number"
                value={anioDesde}
                onChange={(e) => setAnioDesde(e.target.value)}
                placeholder="Año desde"
                className="input-field"
              />
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Presupuesto máximo"
                className="input-field"
              />
              <button type="submit" className="btn-champagne">
                <Search className="h-4 w-4" strokeWidth={1.5} />
                Buscar Vehículos
              </button>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <input
                value={ubicacion}
                onChange={(e) => setUbicacion(e.target.value)}
                placeholder="Ubicación"
                className="input-field"
              />
              <input
                type="number"
                value={areaMin}
                onChange={(e) => setAreaMin(e.target.value)}
                placeholder="Área mínima (m²)"
                className="input-field"
              />
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Presupuesto máximo"
                className="input-field"
              />
              <button type="submit" className="btn-champagne">
                <Search className="h-4 w-4" strokeWidth={1.5} />
                Buscar Parcelas
              </button>
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
