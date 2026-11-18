"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { coverUrl } from "@/lib/inventory-client";
import {
  buildWhatsAppUrl,
  formatArea,
  formatCOP,
  parcelInterestMessage,
} from "@/lib/formatters";
import { cn } from "@/lib/utils";
import type { Parcel } from "@/types/inventory";

type ParcelCardProps = {
  parcel: Parcel;
};

export function ParcelCard({ parcel }: ParcelCardProps) {
  const sold = parcel.estado === "VENDIDO";
  const href = `/parcelas/${parcel.slug}`;
  const cover = coverUrl(parcel.media);
  const servicesShort = parcel.servicios.split(",")[0]?.trim() || "Servicios";
  const whatsappUrl = buildWhatsAppUrl(
    parcelInterestMessage(parcel.titulo, parcel.ubicacion, parcel.precio),
  );

  return (
    <article
      className={cn(
        "group surface-card overflow-hidden transition-colors",
        sold && "opacity-70",
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Link href={href} className="absolute inset-0 z-10" aria-label={`Ver ficha ${parcel.titulo}`} />
        <SafeImage
          src={cover}
          alt={parcel.titulo}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-2 top-2 z-20">
          <StatusBadge status={parcel.estado} />
        </div>
        <span className="absolute bottom-2 right-2 z-20 border border-border bg-black/70 px-2 py-0.5 font-tech text-[10px] text-zinc-300">
          {parcel.media.length} medio{parcel.media.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="space-y-3 p-3.5">
        <div>
          <p className="font-tech text-[10px] uppercase tracking-[0.14em] text-muted">
            {parcel.ubicacion}
          </p>
          <h3 className="heading-display mt-1 text-base font-bold text-foreground">
            {parcel.titulo}
          </h3>
        </div>

        <div className="meta-split">
          <span>{formatArea(parcel.area_m2)}</span>
          <span>{servicesShort}</span>
          <span>{parcel.documentacion || "Escritura"}</span>
        </div>

        <p className="price-num text-lg font-semibold text-foreground">
          {formatCOP(parcel.precio)}
        </p>

        <div className="grid grid-cols-2 gap-2">
          <Link href={href} className="btn-outline w-full px-2 py-2.5 text-xs">
            Ver ficha
          </Link>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp w-full px-2 py-2.5 text-xs"
          >
            <MessageCircle className="h-3.5 w-3.5" strokeWidth={1.5} />
            WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
}
