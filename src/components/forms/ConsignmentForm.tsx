"use client";

import { useState, type FormEvent } from "react";
import { createLead } from "@/app/actions/leads";
import { useToast } from "@/components/providers/ToastProvider";
import { siteConfig } from "@/config/site.config";
import { buildWhatsAppUrl } from "@/lib/formatters";
import type { ConsignmentMode } from "@/types/inventory";

const modes: ConsignmentMode[] = [
  "Consignación en vitrina",
  "Compra directa",
  "Retoma por otro vehículo",
];

type ConsignmentFormProps = {
  onDone?: () => void;
};

export function ConsignmentForm({ onDone }: ConsignmentFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

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
      onDone?.();
    } catch {
      toast("No se pudo registrar. Intenta por WhatsApp.");
    } finally {
      setLoading(false);
    }
  }

  return (
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
        {loading ? "Enviando..." : "Enviar y abrir WhatsApp"}
      </button>
    </form>
  );
}
