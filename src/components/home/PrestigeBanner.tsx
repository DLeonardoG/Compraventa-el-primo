import Link from "next/link";

export function PrestigeBanner() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="border border-border bg-[#0c0c0f] p-8 sm:p-10">
        <div className="h-px w-16 bg-accent" />
        <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
          Prestige & Importación
        </p>
        <h2 className="heading-display mt-3 max-w-2xl text-2xl font-bold sm:text-3xl">
          Línea exclusiva e importación directa bajo pedido
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-muted sm:text-base">
          Atención VIP para unidades premium y acompañamiento completo en
          importación: búsqueda, historial, nacionalización y entrega.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/prestige" className="btn-champagne">
            Ver Línea Prestige
          </Link>
          <Link href="/importacion" className="btn-outline">
            Solicitar Importación
          </Link>
        </div>
      </div>
    </section>
  );
}
