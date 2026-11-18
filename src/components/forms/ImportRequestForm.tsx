"use client";

import { MessageCircle } from "lucide-react";
import { useState, type FormEvent } from "react";
import { createLead } from "@/app/actions/leads";
import { siteConfig } from "@/config/site.config";
import { buildWhatsAppUrl } from "@/lib/formatters";

export function ImportRequestForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const payload = {
      brand: String(data.get("brand") || ""),
      model: String(data.get("model") || ""),
      year: String(data.get("year") || ""),
      color: String(data.get("color") || ""),
      budget: String(data.get("budget") || ""),
      name: String(data.get("name") || ""),
      phone: String(data.get("phone") || ""),
    };

    setStatus("loading");
    const result = await createLead({
      tipo: "IMPORTACION",
      nombre: payload.name,
      telefono: payload.phone,
      detalle: payload,
    });

    if (!result.ok) {
      setStatus("error");
      setMessage(result.error);
      return;
    }

    const wa = `Hola ${siteConfig.companyName}, solicito importación: ${payload.brand} ${payload.model} ${payload.year}, color ${payload.color}, presupuesto ${payload.budget}. Contacto: ${payload.name} / ${payload.phone}.`;
    window.open(buildWhatsAppUrl(wa), "_blank", "noopener,noreferrer");
    setStatus("success");
    setMessage("Solicitud preparada. Continuamos por WhatsApp.");
    form.reset();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 border border-border bg-card p-5">
      <h3 className="heading-display text-lg font-bold">
        Solicitar Vehículo por Importación
      </h3>
      <div className="grid gap-3 sm:grid-cols-2">
        <input name="brand" required placeholder="Marca" className="input-field" />
        <input name="model" required placeholder="Modelo" className="input-field" />
        <input name="year" placeholder="Año" className="input-field" />
        <input name="color" placeholder="Color preferido" className="input-field" />
        <input
          name="budget"
          placeholder="Presupuesto estimado"
          className="input-field sm:col-span-2"
        />
        <input name="name" required placeholder="Nombre" className="input-field" />
        <input name="phone" required placeholder="WhatsApp" className="input-field" />
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="submit" className="btn-champagne" disabled={status === "loading"}>
          {status === "loading" ? "Enviando..." : "Enviar solicitud"}
        </button>
        <a
          href={buildWhatsAppUrl(
            `Hola ${siteConfig.companyName}, quiero información sobre importación directa bajo pedido.`,
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-whatsapp"
        >
          <MessageCircle className="h-4 w-4" strokeWidth={1.5} />
          WhatsApp directo
        </a>
      </div>
      {message ? (
        <p className={`text-sm ${status === "success" ? "text-emerald-400" : "text-red-400"}`}>
          {message}
        </p>
      ) : null}
    </form>
  );
}
