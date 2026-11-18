"use client";

import { useState } from "react";
import { SafeImage } from "@/components/ui/SafeImage";
import { cn } from "@/lib/utils";

export function VehicleGallery({
  photos,
  alt,
}: {
  photos: string[];
  alt: string;
}) {
  const gallery = photos.length ? photos : [""];
  const [active, setActive] = useState(0);

  return (
    <div className="space-y-3">
      <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-border bg-card">
        <SafeImage
          src={gallery[active]}
          alt={`${alt} - foto ${active + 1}`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 60vw"
        />
      </div>
      {gallery.length > 1 ? (
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
          {gallery.map((photo, index) => (
            <button
              key={`${photo}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              className={cn(
                "relative aspect-video overflow-hidden rounded-md border transition-colors",
                active === index ? "border-accent" : "border-border opacity-70 hover:opacity-100",
              )}
            >
              <SafeImage src={photo} alt={`${alt} miniatura ${index + 1}`} fill sizes="120px" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
