"use client";

import { useState, type FormEvent } from "react";
import { siteConfig } from "@/config/site.config";
import type { JobRole } from "@/types/inventory";

const roles: JobRole[] = [
  "Asesor Comercial",
  "Perito",
  "Administrativo",
  "Otro",
];

const MAX_PDF_BYTES = 5 * 1024 * 1024;

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || "");
      const base64 = result.includes(",") ? result.split(",")[1] : result;
      resolve(base64);
    };
    reader.onerror = () => reject(new Error("No se pudo leer el archivo"));
    reader.readAsDataURL(file);
  });
}

export function JobApplicationForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const file = data.get("cv") as File | null;

    if (!file || file.size === 0) {
      setStatus("error");
      setMessage("Adjunta tu hoja de vida en PDF.");
      return;
    }

    if (file.type !== "application/pdf") {
      setStatus("error");
      setMessage("Solo se aceptan archivos PDF.");
      return;
    }

    if (file.size > MAX_PDF_BYTES) {
      setStatus("error");
      setMessage("El PDF no puede superar 5 MB.");
      return;
    }

    if (!siteConfig.integrations.appsScriptUrl) {
      setStatus("error");
      setMessage("Configura appsScriptUrl en site.config.ts para enviar postulaciones.");
      return;
    }

    setStatus("loading");
    try {
      const cvBase64 = await fileToBase64(file);
      const payload = {
        type: "job_application",
        name: String(data.get("name") || ""),
        phone: String(data.get("phone") || ""),
        email: String(data.get("email") || ""),
        role: String(data.get("role") || ""),
        cvFileName: file.name,
        cvMimeType: file.type,
        cvBase64,
      };

      const response = await fetch(siteConfig.integrations.appsScriptUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Error al enviar");

      setStatus("success");
      setMessage("Postulación enviada. Gracias por tu interés.");
      form.reset();
    } catch {
      setStatus("error");
      setMessage("No se pudo enviar la postulación. Intenta de nuevo.");
    }
  }

  return (
    <form
      id="formteam"
      onSubmit={onSubmit}
      className="scroll-mt-24 space-y-4 rounded-xl border border-border bg-card p-5 sm:p-6"
    >
      <h2 className="text-xl font-bold">Trabaja con nosotros</h2>
      <p className="text-sm text-muted">
        Completa el formulario y adjunta tu hoja de vida en PDF (máximo 5 MB).
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <input name="name" required placeholder="Nombre completo" className="input-field" />
        <input name="phone" required placeholder="Teléfono / WhatsApp" className="input-field" />
        <input name="email" type="email" required placeholder="Correo electrónico" className="input-field" />
        <select name="role" required className="input-field" defaultValue="">
          <option value="" disabled>
            Cargo al que aspira
          </option>
          {roles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
        <input
          name="cv"
          type="file"
          accept="application/pdf"
          required
          className="input-field sm:col-span-2 file:mr-3 file:rounded-md file:border-0 file:bg-accent file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-black"
        />
      </div>

      <button type="submit" className="btn-primary" disabled={status === "loading"}>
        {status === "loading" ? "Enviando..." : "Enviar postulación"}
      </button>
      {message ? (
        <p className={`text-sm ${status === "success" ? "text-emerald-400" : "text-red-400"}`}>
          {message}
        </p>
      ) : null}
    </form>
  );
}
