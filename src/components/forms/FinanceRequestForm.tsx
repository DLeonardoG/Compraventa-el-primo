"use client";

import { useState, type FormEvent } from "react";
import { createLead } from "@/app/actions/leads";
import { siteConfig } from "@/config/site.config";
import { buildWhatsAppUrl, formatCOP } from "@/lib/formatters";

export function FinanceRequestForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const nombre = String(data.get("nombre") || "");
    const telefono = String(data.get("telefono") || "");
    const email = String(data.get("email") || "");
    const perfil = String(data.get("perfil") || "");
    const monto = Number(data.get("monto") || 0);
    const inicial = Number(data.get("inicial") || 0);
    const plazo = String(data.get("plazo") || "");

    setStatus("loading");
    const result = await createLead({
      tipo: "FINANCIACION",
      nombre,
      telefono,
      email,
      detalle: { perfil, monto, inicial, plazo },
    });

    if (!result.ok) {
      setStatus("error");
      setMessage(result.error);
      return;
    }

    const text = `Hola ${siteConfig.companyName}, solicito pre-aprobación de crédito. Perfil: ${perfil}. Monto ${formatCOP(monto)}, cuota inicial ${formatCOP(inicial)}, plazo ${plazo} meses. Contacto: ${nombre} / ${telefono}.`;
    window.open(buildWhatsAppUrl(text), "_blank", "noopener,noreferrer");
    setStatus("success");
    setMessage("Solicitud registrada. Continuamos por WhatsApp.");
    form.reset();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 border border-border bg-card p-5">
      <h2 className="heading-display text-lg font-bold">Solicitud de pre-aprobación</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        <input name="nombre" required placeholder="Nombre completo" className="input-field" />
        <input name="telefono" required placeholder="WhatsApp" className="input-field" />
        <input name="email" type="email" placeholder="Correo" className="input-field" />
        <select name="perfil" required className="input-field" defaultValue="">
          <option value="" disabled>
            Perfil
          </option>
          <option value="Empleado">Empleado</option>
          <option value="Independiente">Independiente</option>
          <option value="Pensionado">Pensionado</option>
          <option value="Empresa">Empresa</option>
        </select>
        <input
          name="monto"
          type="number"
          min={1}
          required
          placeholder="Monto a financiar"
          className="input-field price-num"
        />
        <input
          name="inicial"
          type="number"
          min={0}
          required
          placeholder="Cuota inicial"
          className="input-field price-num"
        />
        <select name="plazo" required className="input-field sm:col-span-2" defaultValue="48">
          {siteConfig.financing.terms.map((term) => (
            <option key={term} value={term}>
              {term} meses
            </option>
          ))}
        </select>
      </div>
      <button type="submit" className="btn-whatsapp" disabled={status === "loading"}>
        {status === "loading" ? "Enviando..." : "Enviar pre-aprobación"}
      </button>
      {message ? (
        <p className={`text-sm ${status === "success" ? "text-emerald-400" : "text-red-400"}`}>
          {message}
        </p>
      ) : null}
    </form>
  );
}
