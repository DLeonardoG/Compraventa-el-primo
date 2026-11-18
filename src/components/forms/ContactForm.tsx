"use client";

import { useState, type FormEvent } from "react";
import { createLead } from "@/app/actions/leads";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    setStatus("loading");
    const result = await createLead({
      tipo: "CONTACTO",
      nombre: String(data.get("name") || ""),
      telefono: String(data.get("phone") || ""),
      email: String(data.get("email") || ""),
      detalle: {
        interest: String(data.get("interest") || ""),
        message: String(data.get("message") || ""),
      },
    });

    if (!result.ok) {
      setStatus("error");
      setMessage(result.error);
      return;
    }

    setStatus("success");
    setMessage("Mensaje enviado correctamente. Te contactaremos pronto.");
    form.reset();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 border border-border bg-card p-5">
      <h2 className="heading-display text-lg font-bold">Envíanos un mensaje</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        <input name="name" required placeholder="Nombre completo" className="input-field" />
        <input name="phone" required placeholder="Teléfono / WhatsApp" className="input-field" />
        <input
          name="email"
          type="email"
          required
          placeholder="Correo electrónico"
          className="input-field"
        />
        <select name="interest" required className="input-field" defaultValue="">
          <option value="" disabled>
            Motivo de contacto
          </option>
          <option value="Ventas Vehículos">Ventas Vehículos</option>
          <option value="Línea Prestige">Línea Prestige</option>
          <option value="Parcelas">Parcelas</option>
          <option value="Trámites">Trámites</option>
          <option value="Otro">Otro</option>
        </select>
        <textarea
          name="message"
          required
          rows={5}
          placeholder="Cuéntanos cómo podemos ayudarte"
          className="input-field sm:col-span-2"
        />
      </div>
      <button type="submit" className="btn-champagne" disabled={status === "loading"}>
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
