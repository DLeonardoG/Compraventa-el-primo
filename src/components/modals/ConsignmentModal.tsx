"use client";

import { X } from "lucide-react";
import { ConsignmentForm } from "@/components/forms/ConsignmentForm";
import { useConsignment } from "@/components/providers/ConsignmentProvider";

export function ConsignmentModal() {
  const { open, closeConsignment } = useConsignment();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4">
      <div className="absolute inset-0" onClick={closeConsignment} aria-hidden />
      <div className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-sm border border-border bg-card p-5 sm:p-6">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
              Retoma y consignación
            </p>
            <h2 className="heading-display mt-1 text-xl font-bold">
              Vende o consigna tu vehículo
            </h2>
          </div>
          <button
            type="button"
            onClick={closeConsignment}
            className="border border-border p-2 text-muted hover:text-foreground"
            aria-label="Cerrar"
          >
            <X className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>
        <ConsignmentForm onDone={closeConsignment} />
      </div>
    </div>
  );
}
