"use client";

import { useState, type FormEvent } from "react";
import { createJobApplication } from "@/app/actions/leads";
import type { JobRole } from "@/types/inventory";

const roles: JobRole[] = [
  "Asesor Comercial",
  "Perito Automotriz",
  "Gestor de Trámites",
  "Administrativo",
  "Otro",
];

const MAX_PDF_BYTES = 5 * 1024 * 1024;

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

    setStatus("loading");
    try {
      const presignRes = await fetch("/api/upload/presign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          folder: "cv",
        }),
      });
      const presign = (await presignRes.json()) as {
        uploadUrl?: string;
        publicUrl?: string;
        key?: string;
        error?: string;
      };
      if (!presignRes.ok || !presign.uploadUrl || !presign.publicUrl || !presign.key) {
        throw new Error(presign.error || "No se pudo preparar la subida del CV");
      }

      const uploadRes = await fetch(presign.uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!uploadRes.ok) throw new Error("No se pudo subir el PDF");

      const result = await createJobApplication({
        nombre: String(data.get("name") || ""),
        telefono: String(data.get("phone") || ""),
        email: String(data.get("email") || ""),
        cargo: String(data.get("role") || ""),
        cvUrl: presign.publicUrl,
        cvKey: presign.key,
      });
      if (!result.ok) throw new Error(result.error);

      setStatus("success");
      setMessage("Postulación enviada. Gracias por tu interés.");
      form.reset();
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "No se pudo enviar la postulación. Intenta de nuevo.",
      );
    }
  }

  return (
    <form
      id="formteam"
      onSubmit={onSubmit}
      className="scroll-mt-24 space-y-4 border border-border bg-card p-5 sm:p-6"
    >
      <h2 className="heading-display text-xl font-bold">Trabaja con nosotros</h2>
      <p className="text-sm text-muted">
        Completa el formulario y adjunta tu hoja de vida en PDF (máximo 5 MB).
      </p>

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
          className="input-field sm:col-span-2 file:mr-3 file:border-0 file:bg-accent file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-black"
        />
      </div>

      <button type="submit" className="btn-champagne" disabled={status === "loading"}>
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
