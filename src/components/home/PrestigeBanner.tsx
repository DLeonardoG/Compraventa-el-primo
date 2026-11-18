import Link from "next/link";
import { Sparkles } from "lucide-react";

export function PrestigeBanner() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-2xl border border-accent/25 bg-gradient-to-r from-[#16120c] via-[#121216] to-[#0d1524] p-8 sm:p-10">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute -bottom-12 left-1/3 h-40 w-40 rounded-full bg-accent-secondary/20 blur-3xl" />

        <div className="relative max-w-2xl">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            <Sparkles className="h-4 w-4" />
            Línea Prestige & Importación
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
            Vehículos premium e importación directa bajo pedido
          </h2>
          <p className="mt-3 text-sm text-muted sm:text-base">
            Accede a una selección sobria de alta gama y solicita modelos
            exclusivos con acompañamiento de punta a punta.
          </p>
          <Link href="/prestige" className="btn-primary mt-6 inline-flex">
            Explorar Prestige
          </Link>
        </div>
      </div>
    </section>
  );
}
