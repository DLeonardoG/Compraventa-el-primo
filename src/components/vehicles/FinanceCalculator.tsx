"use client";

import { MessageCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { siteConfig } from "@/config/site.config";
import {
  buildWhatsAppUrl,
  financeSimulationMessage,
  formatCOP,
} from "@/lib/formatters";
import { cn } from "@/lib/utils";

type FinanceCalculatorProps = {
  price: number;
  title: string;
};

export function FinanceCalculator({ price, title }: FinanceCalculatorProps) {
  const terms = siteConfig.financing.terms;
  const [downPaymentPct, setDownPaymentPct] = useState(30);
  const [months, setMonths] = useState<number>(terms[3] ?? 48);
  const rate = siteConfig.financing.defaultMonthlyRate;

  const result = useMemo(() => {
    const downPayment = price * (downPaymentPct / 100);
    const financed = Math.max(price - downPayment, 0);
    const monthlyRate = rate / 100;
    const installment =
      monthlyRate === 0
        ? financed / months
        : (financed * monthlyRate * Math.pow(1 + monthlyRate, months)) /
          (Math.pow(1 + monthlyRate, months) - 1);

    return {
      downPayment,
      financed,
      installment: Number.isFinite(installment) ? installment : 0,
    };
  }, [price, downPaymentPct, months, rate]);

  const whatsappUrl = buildWhatsAppUrl(
    financeSimulationMessage({
      title,
      price,
      downPayment: result.downPayment,
      months,
      installment: result.installment,
    }),
  );

  return (
    <div id="simulador" className="scroll-mt-28 border border-border bg-card p-5">
      <h3 className="heading-display text-lg font-bold">Simulador de crédito</h3>
      <p className="mt-1 text-sm text-muted">
        Calcula cuota inicial y plazo. {siteConfig.financing.legalNote}
      </p>

      <div className="mt-5 space-y-5">
        <label className="block text-sm">
          <span className="mb-2 flex items-center justify-between text-muted">
            <span>Cuota inicial ({downPaymentPct}%)</span>
            <span className="price-num font-semibold text-foreground">
              {formatCOP(result.downPayment)}
            </span>
          </span>
          <input
            type="range"
            min={siteConfig.financing.minDownPaymentPercent}
            max={siteConfig.financing.maxDownPaymentPercent}
            value={downPaymentPct}
            onChange={(e) => setDownPaymentPct(Number(e.target.value))}
            className="w-full accent-[var(--accent)]"
          />
        </label>

        <div>
          <p className="mb-2 text-sm text-muted">Plazo en meses</p>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {terms.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => setMonths(term)}
                className={cn(
                  "border px-2 py-2 font-tech text-xs transition-colors",
                  months === term
                    ? "border-accent text-accent"
                    : "border-border text-muted hover:border-foreground hover:text-foreground",
                )}
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>

      <dl className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
        <div className="flex justify-between gap-3">
          <dt className="text-muted">Monto a financiar</dt>
          <dd className="price-num font-semibold">{formatCOP(result.financed)}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-muted">Cuota mensual estimada</dt>
          <dd className="price-num font-bold text-accent">
            {formatCOP(result.installment)}
          </dd>
        </div>
        <div className="flex justify-between gap-3 text-xs text-muted">
          <dt>Tasa referencial mensual</dt>
          <dd className="font-tech">{rate}%</dd>
        </div>
      </dl>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-whatsapp mt-5 w-full text-sm"
      >
        <MessageCircle className="h-4 w-4" strokeWidth={1.5} />
        Enviar esta simulación por WhatsApp
      </a>
    </div>
  );
}
