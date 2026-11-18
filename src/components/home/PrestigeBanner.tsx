import Link from "next/link";

export function PrestigeBanner() {
  return (
    <section className="mx-auto grid max-w-7xl gap-px bg-border px-4 py-8 sm:px-6 lg:grid-cols-12 lg:px-8">
      <article className="bg-[#0c0c0f] p-8 sm:p-12 lg:col-span-7">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">
          Línea Prestige
        </p>
        <h2 className="heading-display mt-4 max-w-lg text-3xl font-bold sm:text-4xl">
          Gama alta con atención discreta
        </h2>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-muted sm:text-base">
          Porsche, BMW y Mercedes-Benz curados para quien busca presencia,
          historial verificable y un cierre sin ruido.
        </p>
        <Link href="/prestige" className="btn-champagne mt-8">
          Entrar a Prestige
        </Link>
      </article>

      <article className="flex flex-col justify-between bg-[#111114] p-8 sm:p-12 lg:col-span-5">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-subtle">
            Importación bajo pedido
          </p>
          <h2 className="heading-display mt-4 text-2xl font-bold">
            El vehículo que no está en vitrina
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Cotización, inspección en origen, nacionalización y entrega en
            Colombia, con un solo interlocutor.
          </p>
        </div>
        <Link href="/importacion" className="btn-outline mt-8 w-fit">
          Iniciar una importación
        </Link>
      </article>
    </section>
  );
}
