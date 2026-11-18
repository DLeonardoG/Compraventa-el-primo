"use client";

import {
  BadgeCheck,
  FileCheck2,
  HandCoins,
  RefreshCcw,
} from "lucide-react";
import { useConsignment } from "@/components/providers/ConsignmentProvider";
import { SectionHeading } from "@/components/ui/SectionHeading";

const pillars = [
  {
    icon: BadgeCheck,
    title: "Peritaje Certificado",
    text: "Revisión técnica y transparencia del estado real de cada unidad.",
  },
  {
    icon: HandCoins,
    title: "Financiación hasta 100%",
    text: "Simulación orientativa y acompañamiento con aliados financieros.",
  },
  {
    icon: FileCheck2,
    title: "Traspaso Seguro",
    text: "Gestión documental clara para un traspaso inmediato y ordenado.",
  },
  {
    icon: RefreshCcw,
    title: "Retoma de Usados",
    text: "Recibimos tu usado en parte de pago o consignación en vitrina.",
  },
];

export function TrustSection() {
  const { openConsignment } = useConsignment();

  return (
    <>
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="border border-border bg-card p-8 sm:p-10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
            Consignación y retoma
          </p>
          <h2 className="heading-display mt-3 text-2xl font-bold sm:text-3xl">
            Vendemos o recibimos tu vehículo
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-muted sm:text-base">
            Evalúa consignación en vitrina, compra directa o retoma por otro
            vehículo. Cotización ágil y acompañamiento comercial.
          </p>
          <button type="button" onClick={openConsignment} className="btn-champagne mt-6">
            Cotizar mi vehículo
          </button>
        </div>
      </section>

      <section className="border-y border-border bg-[#0b0b0f]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Confianza"
            title="Pilares de operación"
            description="Procesos sobrios del sector automotor colombiano."
            align="center"
          />

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {pillars.map((item) => (
              <div key={item.title} className="border border-border bg-card p-5">
                <div className="mb-4 h-px w-10 bg-accent" />
                <item.icon className="h-6 w-6 text-accent" strokeWidth={1.5} />
                <h3 className="heading-display mt-4 text-base font-bold">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
