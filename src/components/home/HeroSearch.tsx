"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { siteConfig } from "@/config/site.config";
import { cn } from "@/lib/utils";

type SearchTab = "vehiculo" | "parcela";

export function HeroSearch() {
  const router = useRouter();
  const [tab, setTab] = useState<SearchTab>("vehiculo");
  const [query, setQuery] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);

    const path = tab === "vehiculo" ? "/vehiculos" : "/parcelas";
    const qs = params.toString();
    router.push(qs ? `${path}?${qs}` : path);
  }

  return (
    <section className="relative isolate overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=2000&q=80)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/70 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(217,119,6,0.18),_transparent_55%)]" />

      <div className="relative mx-auto flex min-h-[78vh] max-w-7xl flex-col justify-center px-4 py-20 sm:px-6 lg:px-8">
        <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.25em] text-accent">
          {siteConfig.city}
        </p>
        <h1 className="animate-fade-up delay-100 mt-3 max-w-3xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
          {siteConfig.name}
        </h1>
        <p className="animate-fade-up delay-200 mt-4 max-w-xl text-base text-zinc-300 sm:text-lg">
          {siteConfig.tagline}. Encuentra tu próximo vehículo o parcela con
          transparencia y acompañamiento profesional.
        </p>

        <form
          onSubmit={onSubmit}
          className="animate-fade-up delay-300 mt-10 w-full max-w-3xl rounded-2xl border border-white/10 bg-black/45 p-4 backdrop-blur-md sm:p-5"
        >
          <div className="mb-4 flex gap-2">
            <button
              type="button"
              onClick={() => setTab("vehiculo")}
              className={cn(
                "rounded-md px-4 py-2 text-sm font-semibold transition-colors",
                tab === "vehiculo"
                  ? "bg-accent text-black"
                  : "bg-white/5 text-zinc-300 hover:bg-white/10",
              )}
            >
              Buscar Vehículo
            </button>
            <button
              type="button"
              onClick={() => setTab("parcela")}
              className={cn(
                "rounded-md px-4 py-2 text-sm font-semibold transition-colors",
                tab === "parcela"
                  ? "bg-accent text-black"
                  : "bg-white/5 text-zinc-300 hover:bg-white/10",
              )}
            >
              Buscar Parcela
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-4">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                tab === "vehiculo"
                  ? "Marca, modelo..."
                  : "Ubicación o título..."
              }
              className="input-field sm:col-span-2"
            />
            <input
              type="number"
              min={0}
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="Precio mín."
              className="input-field"
            />
            <input
              type="number"
              min={0}
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="Precio máx."
              className="input-field"
            />
          </div>

          <button type="submit" className="btn-primary mt-4 w-full sm:w-auto">
            <Search className="h-4 w-4" />
            Buscar ahora
          </button>
        </form>
      </div>
    </section>
  );
}
