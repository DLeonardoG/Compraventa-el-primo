"use client";

import { ArrowDown, ArrowUp, Star, Trash2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import type { MediaItem, MediaTipo } from "@/types/inventory";
import { cn } from "@/lib/utils";

type DraftMedia = Omit<MediaItem, "id"> & { id?: string; progress?: number };

type MediaUploaderProps = {
  folder: "vehiculos" | "parcelas";
  value: DraftMedia[];
  onChange: (items: DraftMedia[]) => void;
};

async function optimizeImage(file: File): Promise<File> {
  if (!file.type.startsWith("image/") || file.type === "image/webp") {
    // Still resize non-webp images via canvas when possible.
  }
  if (!file.type.startsWith("image/")) return file;

  const bitmap = await createImageBitmap(file);
  const maxWidth = 1600;
  const scale = Math.min(1, maxWidth / bitmap.width);
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", 0.84),
  );
  if (!blob) return file;
  const name = file.name.replace(/\.[^.]+$/, "") + ".webp";
  return new File([blob], name, { type: "image/webp" });
}

function uploadWithProgress(
  uploadUrl: string,
  file: File,
  onProgress: (pct: number) => void,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", uploadUrl);
    xhr.setRequestHeader("Content-Type", file.type);
    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable) return;
      onProgress(Math.round((event.loaded / event.total) * 100));
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else reject(new Error(`Upload failed (${xhr.status})`));
    };
    xhr.onerror = () => reject(new Error("Network error during upload"));
    xhr.send(file);
  });
}

export function MediaUploader({ folder, value, onChange }: MediaUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function processFiles(fileList: FileList | File[]) {
    const files = Array.from(fileList);
    if (!files.length) return;
    setBusy(true);
    setError("");

    try {
      const next = [...value];
      for (const original of files) {
        const isVideo =
          original.type === "video/mp4" || original.type === "video/webm";
        const isImage = original.type.startsWith("image/");
        if (!isVideo && !isImage) {
          throw new Error("Solo se permiten imágenes o videos mp4/webm");
        }

        const file = isImage ? await optimizeImage(original) : original;
        const tipo: MediaTipo = isVideo ? "VIDEO" : "IMAGE";

        const presignRes = await fetch("/api/upload/presign", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: file.name,
            fileType: file.type,
            folder,
          }),
        });
        const presign = (await presignRes.json()) as {
          uploadUrl?: string;
          publicUrl?: string;
          key?: string;
          error?: string;
        };
        if (!presignRes.ok || !presign.uploadUrl || !presign.publicUrl || !presign.key) {
          throw new Error(presign.error || "No se pudo firmar la subida");
        }

        const draft: DraftMedia = {
          url: presign.publicUrl,
          key: presign.key,
          tipo,
          orden: next.length,
          esPortada: next.length === 0 && tipo === "IMAGE",
          progress: 0,
        };
        next.push(draft);
        onChange([...next]);

        await uploadWithProgress(presign.uploadUrl, file, (pct) => {
          draft.progress = pct;
          onChange([...next]);
        });
        draft.progress = 100;
        onChange([...next]);
      }

      const cleaned = next.map(({ progress: _p, ...item }, index) => ({
        ...item,
        orden: index,
        progress: undefined,
      }));
      onChange(cleaned);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al subir archivos");
    } finally {
      setBusy(false);
    }
  }

  async function removeAt(index: number) {
    const item = value[index];
    if (!item) return;
    if (item.key.startsWith("vehiculos/") || item.key.startsWith("parcelas/")) {
      await fetch("/api/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: item.key }),
      });
    }
    const next = value
      .filter((_, i) => i !== index)
      .map((entry, orden) => ({ ...entry, orden }));
    if (!next.some((entry) => entry.esPortada) && next[0]) {
      next[0] = { ...next[0], esPortada: next[0].tipo === "IMAGE" };
    }
    onChange(next);
  }

  function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= value.length) return;
    const next = [...value];
    const tmp = next[index];
    next[index] = next[target];
    next[target] = tmp;
    onChange(next.map((item, orden) => ({ ...item, orden })));
  }

  function setCover(index: number) {
    onChange(
      value.map((item, i) => ({
        ...item,
        esPortada: i === index && item.tipo === "IMAGE",
      })),
    );
  }

  return (
    <div className="space-y-3">
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-2 border border-dashed border-border bg-elevated px-4 py-8 text-center transition-colors",
          dragging && "border-accent bg-card",
        )}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          void processFiles(event.dataTransfer.files);
        }}
      >
        <Upload className="h-5 w-5 text-accent" />
        <p className="text-sm text-muted">
          Arrastra fotos/videos o selecciona archivos
        </p>
        <button
          type="button"
          className="border border-border px-3 py-1.5 text-xs uppercase tracking-[0.14em] text-foreground hover:border-accent hover:text-accent"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
        >
          {busy ? "Subiendo..." : "Seleccionar"}
        </button>
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          multiple
          accept="image/*,video/mp4,video/webm"
          onChange={(event) => {
            if (event.target.files) void processFiles(event.target.files);
            event.target.value = "";
          }}
        />
      </div>

      {error ? <p className="text-sm text-red-400">{error}</p> : null}

      <ul className="space-y-2">
        {value.map((item, index) => (
          <li
            key={item.key}
            className="flex items-center gap-3 border border-border bg-card p-2"
          >
            <div className="relative h-16 w-24 shrink-0 overflow-hidden bg-elevated">
              {item.tipo === "VIDEO" ? (
                <video
                  src={item.url}
                  className="h-full w-full object-cover"
                  muted
                  playsInline
                  preload="metadata"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.url}
                  alt=""
                  className="h-full w-full object-cover"
                />
              )}
              {typeof item.progress === "number" && item.progress < 100 ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-xs text-white">
                  {item.progress}%
                </div>
              ) : null}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs text-muted">{item.key}</p>
              <p className="text-[10px] uppercase tracking-[0.14em] text-accent">
                {item.tipo}
                {item.esPortada ? " · Portada" : ""}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="p-1.5 text-muted hover:text-accent"
                onClick={() => move(index, -1)}
                aria-label="Subir"
              >
                <ArrowUp className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="p-1.5 text-muted hover:text-accent"
                onClick={() => move(index, 1)}
                aria-label="Bajar"
              >
                <ArrowDown className="h-4 w-4" />
              </button>
              {item.tipo === "IMAGE" ? (
                <button
                  type="button"
                  className={cn(
                    "p-1.5 hover:text-accent",
                    item.esPortada ? "text-accent" : "text-muted",
                  )}
                  onClick={() => setCover(index)}
                  aria-label="Marcar portada"
                >
                  <Star className="h-4 w-4" />
                </button>
              ) : null}
              <button
                type="button"
                className="p-1.5 text-muted hover:text-red-400"
                onClick={() => void removeAt(index)}
                aria-label="Eliminar"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export type { DraftMedia };
