"use client";

import { useState, type FormEvent } from "react";
import { siteConfig } from "@/config/site.config";

export function ImportRequestForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const payload = {
      type: "import_request",
      name: String(data.get("name") || ""),
      phone: String(data.get("phone") || ""),
      email: String(data.get("email") || ""),
      brand: String(data.get("brand") || ""),
      model: String(data.get("model") || ""),
      year: String(data.get("year") || ""),
      budget: String(data.get("budget") || ""),
      notes: String(data.get("notes") || ""),
    };

    if (!siteConfig.integrations.appsScriptUrl) {
      setStatus("error");
      setMessage("Configura appsScriptUrl en site.config.ts para enviar solicitudes.");
      return;
    }

    setStatus("loading");
    try {
      const response = await fetch(siteConfig.integrations.appsScriptUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Error al enviar");
      setStatus("success");
      setMessage("Solicitud enviada. Un asesor te contactará pronto.");
      form.reset();
    } catch {
      setStatus("error");
      setMessage("No se pudo enviar la solicitud. Intenta de nuevo o escríbenos por WhatsApp.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-border bg-card p-5">
      <h3 className="text-lg font-bold">Solicitud de vehículo a pedido</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        <input name="name" required placeholder="Nombre completo" className="input-field" />
        <input name="phone" required placeholder="WhatsApp" className="input-field" />
        <input name="email" type="email" required placeholder="Correo" className="input-field" />
        <input name="budget" placeholder="Presupuesto aproximado" className="input-field" />
        <input name="brand" required placeholder="Marca deseada" className="input-field" />
        <input name="model" required placeholder="Modelo deseado" className="input-field" />
        <input name="year" placeholder="Año deseado" className="input-field sm:col-span-2" />
        <textarea
          name="notes"
          rows={4}
          placeholder="Detalles adicionales (color, versión, extras...)"
          className="input-field sm:col-span-2"
        />
      </div>
      <button type="submit" className="btn-primary" disabled={status === "loading"}>
        {status === "loading" ? "Enviando..." : "Enviar solicitud"}
      </button>
      {message ? (
        <p className={`text-sm ${status === "success" ? "text-emerald-400" : "text-red-400"}`}>
          {message}
        </p>
      ) : null}
    </form>
  );
}
