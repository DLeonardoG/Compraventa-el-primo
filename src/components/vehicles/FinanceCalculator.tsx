"use client";

import { useMemo, useState } from "react";
import { formatCOP } from "@/lib/format";

export function FinanceCalculator({ price }: { price: number }) {
  const [downPaymentPct, setDownPaymentPct] = useState(30);
  const [months, setMonths] = useState(48);
  const [rate, setRate] = useState(1.6);

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

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="text-lg font-bold">Calculadora de financiación</h3>
      <p className="mt-1 text-sm text-muted">
        Estimación orientativa. Las condiciones finales dependen de la entidad financiera.
      </p>

      <div className="mt-5 space-y-4">
        <label className="block text-sm">
          <span className="mb-1 block text-muted">Cuota inicial ({downPaymentPct}%)</span>
          <input
            type="range"
            min={10}
            max={60}
            value={downPaymentPct}
            onChange={(e) => setDownPaymentPct(Number(e.target.value))}
            className="w-full accent-[var(--accent)]"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-muted">Plazo (meses)</span>
          <select
            value={months}
            onChange={(e) => setMonths(Number(e.target.value))}
            className="input-field"
          >
            {[24, 36, 48, 60, 72].map((value) => (
              <option key={value} value={value}>
                {value} meses
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-muted">Tasa mensual estimada (%)</span>
          <input
            type="number"
            step="0.1"
            min={0}
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="input-field"
          />
        </label>
      </div>

      <dl className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
        <div className="flex justify-between gap-3">
          <dt className="text-muted">Cuota inicial</dt>
          <dd className="font-semibold">{formatCOP(result.downPayment)}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-muted">Monto a financiar</dt>
          <dd className="font-semibold">{formatCOP(result.financed)}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-muted">Cuota estimada</dt>
          <dd className="font-bold text-accent">{formatCOP(result.installment)}</dd>
        </div>
      </dl>
    </div>
  );
}
