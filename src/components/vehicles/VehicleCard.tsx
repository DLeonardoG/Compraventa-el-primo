"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";
import { LineBadge, StatusBadge } from "@/components/ui/StatusBadge";
import { coverUrl } from "@/lib/inventory-client";
import { lineLabel } from "@/lib/labels";
import {
  buildWhatsAppUrl,
  formatCOP,
  formatKm,
  vehicleInterestMessage,
} from "@/lib/formatters";
import { cn } from "@/lib/utils";
import type { Vehicle } from "@/types/inventory";

type VehicleCardProps = {
  vehicle: Vehicle;
};

export function VehicleCard({ vehicle }: VehicleCardProps) {
  const sold = vehicle.estado === "VENDIDO";
  const href = `/vehiculos/${vehicle.slug}`;
  const cover = coverUrl(vehicle.media);
  const whatsappUrl = buildWhatsAppUrl(
    vehicleInterestMessage(
      vehicle.marca,
      vehicle.modelo,
      vehicle.anio,
      vehicle.precio,
    ),
  );

  return (
    <article
      className={cn(
        "group surface-card overflow-hidden transition-colors",
        sold && "opacity-70",
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Link href={href} className="absolute inset-0 z-10" aria-label={`Ver ficha ${vehicle.marca} ${vehicle.modelo}`} />
        <SafeImage
          src={cover}
          alt={`${vehicle.marca} ${vehicle.modelo}`}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-2 top-2 z-20 flex flex-wrap gap-1.5">
          <StatusBadge status={vehicle.estado} />
          <LineBadge linea={vehicle.linea} />
        </div>
        <span className="absolute bottom-2 right-2 z-20 border border-border bg-black/70 px-2 py-0.5 font-tech text-[10px] text-zinc-300">
          {vehicle.media.length} medio{vehicle.media.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="space-y-3 p-3.5">
        <div>
          <p className="font-tech text-[10px] uppercase tracking-[0.14em] text-muted">
            {vehicle.anio} / {lineLabel(vehicle.linea)}
          </p>
          <h3 className="heading-display mt-1 text-base font-bold text-foreground">
            {vehicle.marca} {vehicle.modelo}
          </h3>
        </div>

        <div className="meta-split">
          <span>{formatKm(vehicle.kilometraje)}</span>
          <span>{vehicle.transmision}</span>
          <span>{vehicle.motor}</span>
        </div>

        <p className="price-num text-lg font-semibold text-accent">
          {formatCOP(vehicle.precio)}
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
