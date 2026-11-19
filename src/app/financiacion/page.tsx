import { CreditRequirements } from "@/components/finance/CreditRequirements";
import { FinanceRequestForm } from "@/components/forms/FinanceRequestForm";
import { FinanceCalculator } from "@/components/vehicles/FinanceCalculator";
import { siteConfig } from "@/config/site.config";

export const metadata = {
  title: "Financiación",
};

export default function FinanciacionPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <section className="mb-12 border border-border bg-[#0c0c0f] p-8 sm:p-12">
        <div className="h-px w-16 bg-accent" />
        <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">
          Crédito automotriz
        </p>
        <h1 className="heading-display mt-3 max-w-3xl text-3xl font-bold sm:text-4xl">
          Financiación a la medida del vehículo
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-300 sm:text-base">
          Simula la cuota con la tasa referencial de {siteConfig.companyName} y
          deja tu solicitud de pre-aprobación. La cuota final la confirma la
          entidad financiera.
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <FinanceCalculator
          price={180000000}
          title="tu vehículo"
          editablePrice
          anchorId="simulador-credito"
        />
        <CreditRequirements />
      </div>

      <div className="mt-8">
        <FinanceRequestForm />
      </div>
    </div>
  );
}
