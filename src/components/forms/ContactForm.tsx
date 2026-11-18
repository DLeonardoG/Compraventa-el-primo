"use client";

import { useState, type FormEvent } from "react";
import { siteConfig } from "@/config/site.config";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const payload = {
      type: "contact",
      name: String(data.get("name") || ""),
      phone: String(data.get("phone") || ""),
      email: String(data.get("email") || ""),
      interest: String(data.get("interest") || ""),
      vehicleInfo: String(data.get("vehicleInfo") || ""),
      message: String(data.get("message") || ""),
    };

    if (!siteConfig.integrations.appsScriptUrl) {
      setStatus("error");
      setMessage("Configura appsScriptUrl en site.config.ts para enviar el formulario.");
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
      setMessage("Mensaje enviado correctamente. Te contactaremos pronto.");
      form.reset();
    } catch {
      setStatus("error");
      setMessage("No se pudo enviar. Intenta nuevamente o usa WhatsApp.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-border bg-card p-5">
      <h2 className="text-lg font-bold">Contacto / consignación</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        <input name="name" required placeholder="Nombre completo" className="input-field" />
        <input name="phone" required placeholder="Teléfono / WhatsApp" className="input-field" />
        <input name="email" type="email" required placeholder="Correo electrónico" className="input-field" />
        <select name="interest" required className="input-field" defaultValue="">
          <option value="" disabled>
            Motivo de contacto
          </option>
          <option value="Compra de vehículo">Compra de vehículo</option>
          <option value="Consignación de vehículo">Consignación de vehículo</option>
          <option value="Parcelas">Parcelas</option>
          <option value="Otro">Otro</option>
        </select>
        <input
          name="vehicleInfo"
          placeholder="Si consignas: marca, modelo y año"
          className="input-field sm:col-span-2"
        />
        <textarea
          name="message"
          required
          rows={5}
          placeholder="Cuéntanos cómo podemos ayudarte"
          className="input-field sm:col-span-2"
        />
      </div>
      <button type="submit" className="btn-primary" disabled={status === "loading"}>
        {status === "loading" ? "Enviando..." : "Enviar mensaje"}
      </button>
      {message ? (
        <p className={`text-sm ${status === "success" ? "text-emerald-400" : "text-red-400"}`}>
          {message}
        </p>
      ) : null}
    </form>
  );
}
