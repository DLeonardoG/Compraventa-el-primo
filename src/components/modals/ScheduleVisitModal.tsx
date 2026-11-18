"use client";

import { X } from "lucide-react";
import { useState, type FormEvent } from "react";
import { createLead } from "@/app/actions/leads";
import { useToast } from "@/components/providers/ToastProvider";
import { siteConfig } from "@/config/site.config";
import { buildWhatsAppUrl } from "@/lib/formatters";

type ScheduleVisitModalProps = {
  open: boolean;
  onClose: () => void;
  subject: string;
  kind?: "test-drive" | "parcel-visit";
};

export function ScheduleVisitModal({
  open,
  onClose,
  subject,
  kind = "test-drive",
}: ScheduleVisitModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      subject,
      kind,
      name: String(data.get("name") || ""),
      phone: String(data.get("phone") || ""),
      date: String(data.get("date") || ""),
      time: String(data.get("time") || ""),
      notes: String(data.get("notes") || ""),
    };

    setLoading(true);
    try {
      const result = await createLead({
        tipo: "CITA",
        nombre: payload.name,
        telefono: payload.phone,
        detalle: payload,
      });
      if (!result.ok) throw new Error(result.error);

      const label =
        kind === "test-drive" ? "Agendar Cita / Test Drive" : "Agendar Visita al Terreno";
      const message = `Hola ${siteConfig.companyName}, quiero ${label} para ${subject}. Fecha ${payload.date} ${payload.time}. Contacto: ${payload.name} / ${payload.phone}. ${payload.notes}`;
      window.open(buildWhatsAppUrl(message), "_blank", "noopener,noreferrer");
      toast("Cita preparada. Continuamos por WhatsApp.");
      form.reset();
      onClose();
    } catch {
      toast("No se pudo enviar. Intenta por WhatsApp.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4">
      <div className="absolute inset-0" onClick={onClose} aria-hidden />
      <div className="relative z-10 w-full max-w-md border border-border bg-card p-5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
              Agenda
            </p>
            <h2 className="heading-display mt-1 text-lg font-bold">
              {kind === "test-drive" ? "Agendar Cita / Test Drive" : "Agendar Visita al Terreno"}
            </h2>
            <p className="mt-1 text-xs text-muted">{subject}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="border border-border p-2 text-muted hover:text-foreground"
            aria-label="Cerrar"
          >
            <X className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-3">
          <input name="name" required placeholder="Nombre completo" className="input-field" />
          <input name="phone" required placeholder="WhatsApp" className="input-field" />
          <div className="grid grid-cols-2 gap-3">
            <input name="date" type="date" required className="input-field" />
            <input name="time" type="time" required className="input-field" />
          </div>
          <textarea
            name="notes"
            rows={3}
            placeholder="Notas adicionales"
            className="input-field"
          />
          <button type="submit" className="btn-champagne w-full" disabled={loading}>
            {loading ? "Enviando..." : "Confirmar por WhatsApp"}
          </button>
        </form>
      </div>
    </div>
  );
}
