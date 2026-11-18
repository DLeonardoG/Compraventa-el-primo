"use client";

import { Copy, Lock, Upload } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { siteConfig } from "@/config/site.config";
import { uploadToCloudinary } from "@/lib/cloudinary";

export default function SubirFotosPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);
  const [urls, setUrls] = useState<string[]>([]);
  const [statusMessage, setStatusMessage] = useState("");
  const [copied, setCopied] = useState(false);

  const csv = useMemo(() => urls.join(", "), [urls]);

  function handlePinSubmit(event: FormEvent) {
    event.preventDefault();
    if (pin === siteConfig.integrations.uploaderPin) {
      setAuthenticated(true);
      setPinError("");
    } else {
      setPinError("PIN incorrecto");
    }
  }

  async function handleUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const input = form.elements.namedItem("photos") as HTMLInputElement;
    const files = input.files ? Array.from(input.files) : [];

    if (!files.length) {
      setStatusMessage("Selecciona al menos una foto.");
      return;
    }

    setUploading(true);
    setStatusMessage("");
    setCopied(false);

    const localPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews(localPreviews);

    try {
      const uploaded: string[] = [];
      for (const file of files) {
        const url = await uploadToCloudinary(file);
        uploaded.push(url);
      }
      setUrls(uploaded);
      setStatusMessage(`${uploaded.length} foto(s) subida(s) correctamente.`);
    } catch (error) {
      const detail =
        error instanceof Error ? error.message : "Error al subir las fotos";
      setStatusMessage(detail);
      setUrls([]);
    } finally {
      setUploading(false);
    }
  }

  async function copyLinks() {
    if (!csv) return;
    await navigator.clipboard.writeText(csv);
    setCopied(true);
  }

  if (!authenticated) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
        <form
          onSubmit={handlePinSubmit}
          className="rounded-xl border border-border bg-card p-6 space-y-4"
        >
          <div className="flex items-center gap-2 text-accent">
            <Lock className="h-5 w-5" />
            <h1 className="text-xl font-bold text-foreground">Acceso interno</h1>
          </div>
          <p className="text-sm text-muted">
            Herramienta oculta para cargar fotos a Cloudinary. Ingresa el PIN.
          </p>
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="PIN"
            className="input-field"
            autoComplete="off"
          />
          {pinError ? <p className="text-sm text-red-400">{pinError}</p> : null}
          <button type="submit" className="btn-primary w-full">
            Entrar
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold tracking-tight">Subir fotos</h1>
      <p className="mt-2 text-sm text-muted">
        Sube múltiples imágenes con transformación `f_auto,q_auto` y copia las
        URLs listas para pegar en Google Sheets.
      </p>

      <form onSubmit={handleUpload} className="mt-8 space-y-4 rounded-xl border border-border bg-card p-5">
        <input
          name="photos"
          type="file"
          accept="image/*"
          multiple
          className="input-field file:mr-3 file:rounded-md file:border-0 file:bg-accent file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-black"
        />
        <button type="submit" className="btn-primary" disabled={uploading}>
          <Upload className="h-4 w-4" />
          {uploading ? "Subiendo..." : "Subir a Cloudinary"}
        </button>
      </form>

      {previews.length ? (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {previews.map((preview) => (
            <div key={preview} className="relative aspect-video overflow-hidden rounded-lg border border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="Vista previa" className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      ) : null}

      {csv ? (
        <div className="mt-6 space-y-3 rounded-xl border border-border bg-card p-5">
          <label className="block text-sm font-medium text-muted">
            URLs separadas por comas
          </label>
          <textarea readOnly value={csv} rows={5} className="input-field font-mono text-xs" />
          <button type="button" onClick={copyLinks} className="btn-secondary">
            <Copy className="h-4 w-4" />
            {copied ? "Copiado" : "Copiar enlaces para Google Sheets"}
          </button>
        </div>
      ) : null}

      {statusMessage ? (
        <p className="mt-4 text-sm text-muted">{statusMessage}</p>
      ) : null}
    </div>
  );
}
