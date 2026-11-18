"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useState } from "react";
import { SafeImage } from "@/components/ui/SafeImage";
import { cn } from "@/lib/utils";
import type { MediaItem } from "@/types/inventory";

type LightboxGalleryProps = {
  media: MediaItem[];
  alt: string;
};

function MediaFrame({
  item,
  alt,
  fill = false,
  className,
  priority,
}: {
  item: MediaItem | undefined;
  alt: string;
  fill?: boolean;
  className?: string;
  priority?: boolean;
}) {
  if (!item) {
    return <div className={cn("bg-card", fill && "absolute inset-0")} />;
  }

  if (item.tipo === "VIDEO") {
    return (
      <video
        src={item.url}
        controls
        playsInline
        preload="metadata"
        className={cn(
          fill ? "absolute inset-0 h-full w-full object-cover" : "h-full w-full object-cover",
          className,
        )}
      />
    );
  }

  return (
    <SafeImage
      src={item.url}
      alt={alt}
      fill={fill}
      priority={priority}
      sizes={fill ? "(max-width: 1024px) 100vw, 60vw" : "120px"}
      className={className}
    />
  );
}

export function LightboxGallery({ media, alt }: LightboxGalleryProps) {
  const gallery = media.length ? media : [];
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const current = gallery[active];

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightbox(false);
      if (event.key === "ArrowLeft") {
        setActive((prev) => (prev - 1 + gallery.length) % gallery.length);
      }
      if (event.key === "ArrowRight") {
        setActive((prev) => (prev + 1) % gallery.length);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, gallery.length]);

  function prev() {
    setActive((prevIndex) => (prevIndex - 1 + gallery.length) % gallery.length);
  }

  function next() {
    setActive((prevIndex) => (prevIndex + 1) % gallery.length);
  }

  return (
    <>
      <div className="space-y-3">
        <div className="relative aspect-[16/10] overflow-hidden border border-border bg-card">
          {current?.tipo !== "VIDEO" ? (
            <button
              type="button"
              className="absolute inset-0 z-10"
              onClick={() => setLightbox(true)}
              aria-label="Abrir galería"
            />
          ) : null}
          <MediaFrame
            item={current}
            alt={`${alt} - media ${active + 1}`}
            fill
            priority
          />
          {gallery.length > 1 ? (
            <>
              <button
                type="button"
                onClick={prev}
                className="absolute left-2 top-1/2 z-20 -translate-y-1/2 border border-border bg-black/60 p-2 text-foreground"
                aria-label="Anterior"
              >
                <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
              </button>
              <button
                type="button"
                onClick={next}
                className="absolute right-2 top-1/2 z-20 -translate-y-1/2 border border-border bg-black/60 p-2 text-foreground"
                aria-label="Siguiente"
              >
                <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </>
          ) : null}
        </div>

        {gallery.length > 1 ? (
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
            {gallery.map((item, index) => (
              <button
                key={`${item.key}-${index}`}
                type="button"
                onClick={() => setActive(index)}
                className={cn(
                  "relative aspect-video overflow-hidden border transition-colors",
                  active === index ? "border-accent" : "border-border opacity-70 hover:opacity-100",
                )}
              >
                <MediaFrame item={item} alt={`${alt} miniatura ${index + 1}`} fill />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {lightbox && current ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/95 p-4">
          <button
            type="button"
            onClick={() => setLightbox(false)}
            className="absolute right-4 top-4 border border-border p-2 text-foreground"
            aria-label="Cerrar lightbox"
          >
            <X className="h-5 w-5" strokeWidth={1.5} />
          </button>
          <button
            type="button"
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 border border-border p-3"
            aria-label="Anterior"
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
          </button>
          <div className="relative h-[75vh] w-full max-w-5xl">
            {current.tipo === "VIDEO" ? (
              <video
                src={current.url}
                controls
                playsInline
                preload="metadata"
                className="h-full w-full object-contain"
              />
            ) : (
              <SafeImage
                src={current.url}
                alt={`${alt} lightbox`}
                fill
                sizes="100vw"
                className="object-contain"
              />
            )}
          </div>
          <button
            type="button"
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 border border-border p-3"
            aria-label="Siguiente"
          >
            <ChevronRight className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>
      ) : null}
    </>
  );
}
