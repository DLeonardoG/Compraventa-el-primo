import { Building2, Handshake } from "lucide-react";
import { ConsignmentForm } from "@/components/forms/ConsignmentForm";
import { siteConfig } from "@/config/site.config";

export const metadata = {
  title: "Vende tu vehículo",
};

const modes = [
  {
    title: "Consignación en vitrina",
    text: "Dejas el vehículo en el showroom. Lo publicamos, lo mostramos y cerramos la venta. El pago se liquida cuando el comprador recibe la unidad.",
    icon: Building2,
  },
  {
    title: "Retoma / compra directa",
    text: "Peritamos la unidad y te presentamos una oferta de compra o de retoma si vas a llevarte otro vehículo del inventario.",
    icon: Handshake,
  },
];

export default function SellVehiclePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <section className="mb-12 border border-border bg-[#0c0c0f] p-8 sm:p-12">
        <div className="h-px w-16 bg-accent" />
        <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">
          Consignación y retoma
        </p>
        <h1 className="heading-display mt-3 max-w-3xl text-3xl font-bold sm:text-4xl">
          Vende tu vehículo con {siteConfig.shortName}
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-300 sm:text-base">
          Eliges si lo exhibimos en vitrina o si lo tomamos en compra directa.
          El equipo comercial te responde por WhatsApp con el siguiente paso.
        </p>
      </section>

      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-4">
          {modes.map((mode) => (
            <article key={mode.title} className="border border-border bg-card p-5">
              <mode.icon className="h-5 w-5 text-accent" strokeWidth={1.5} />
              <h2 className="heading-display mt-3 text-lg font-bold">{mode.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">{mode.text}</p>
            </article>
          ))}
        </div>
        <div className="border border-border bg-card p-5 sm:p-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">
            Datos del vehículo
          </p>
          <h2 className="heading-display mt-2 mb-5 text-xl font-bold">
            Cuéntanos qué quieres vender
          </h2>
          <ConsignmentForm />
        </div>
      </div>
    </div>
  );
}
