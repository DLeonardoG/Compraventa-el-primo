"use client";

import { X } from "lucide-react";
import { useState, type FormEvent } from "react";
import { createLead } from "@/app/actions/leads";
import { useConsignment } from "@/components/providers/ConsignmentProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { siteConfig } from "@/config/site.config";
import { buildWhatsAppUrl } from "@/lib/formatters";
import type { ConsignmentMode } from "@/types/inventory";

const modes: ConsignmentMode[] = [
  "Consignación en vitrina",
  "Compra directa",
  "Retoma por otro vehículo",
];

export function ConsignmentModal() {
  const { open, closeConsignment } = useConsignment();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      mode: String(data.get("mode") || ""),
      brand: String(data.get("brand") || ""),
      model: String(data.get("model") || ""),
      year: String(data.get("year") || ""),
      mileage: String(data.get("mileage") || ""),
      plate: String(data.get("plate") || ""),
      expectedPrice: String(data.get("expectedPrice") || ""),
      ownerName: String(data.get("ownerName") || ""),
      ownerPhone: String(data.get("ownerPhone") || ""),
      ownerEmail: String(data.get("ownerEmail") || ""),
    };

    setLoading(true);
    try {
      const result = await createLead({
        tipo: "CONSIGNACION",
        nombre: payload.ownerName,
        telefono: payload.ownerPhone,
        email: payload.ownerEmail || undefined,
        detalle: payload,
      });
      if (!result.ok) throw new Error(result.error);

      const message = `Hola ${siteConfig.companyName}, quiero ${payload.mode}. Vehículo: ${payload.brand} ${payload.model} ${payload.year}, ${payload.mileage} km, placa ${payload.plate}, precio esperado ${payload.expectedPrice}. Contacto: ${payload.ownerName} / ${payload.ownerPhone}.`;
      window.open(buildWhatsAppUrl(message), "_blank", "noopener,noreferrer");
      toast("Solicitud lista. Te abrimos WhatsApp.");
      form.reset();
      closeConsignment();
    } catch {
      toast("No se pudo registrar. Intenta por WhatsApp.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4">
      <div
        className="absolute inset-0"
        onClick={closeConsignment}
        aria-hidden
      />
      <div className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto border border-border bg-card p-5 sm:p-6">
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

        <form onSubmit={onSubmit} className="space-y-3">
          <select name="mode" required className="input-field" defaultValue="">
            <option value="" disabled>
              Modalidad
            </option>
            {modes.map((mode) => (
              <option key={mode} value={mode}>
                {mode}
              </option>
            ))}
          </select>
          <div className="grid gap-3 sm:grid-cols-2">
            <input name="brand" required placeholder="Marca" className="input-field" />
            <input name="model" required placeholder="Modelo" className="input-field" />
            <input name="year" required placeholder="Año" className="input-field" />
            <input name="mileage" required placeholder="Kilometraje" className="input-field" />
            <input name="plate" placeholder="Placa" className="input-field" />
            <input
              name="expectedPrice"
              required
              placeholder="Precio esperado"
              className="input-field"
            />
            <input
              name="ownerName"
              required
              placeholder="Nombre del propietario"
              className="input-field"
            />
            <input
              name="ownerPhone"
              required
              placeholder="WhatsApp"
              className="input-field"
            />
            <input
              name="ownerEmail"
              type="email"
              placeholder="Correo"
              className="input-field sm:col-span-2"
            />
          </div>
          <button type="submit" className="btn-whatsapp w-full" disabled={loading}>
            {loading ? "Enviando..." : "Enviar por WhatsApp"}
          </button>
        </form>
      </div>
    </div>
  );
}
