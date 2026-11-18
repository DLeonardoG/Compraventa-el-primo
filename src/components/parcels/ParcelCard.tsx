import Link from "next/link";
import { MapPin, Ruler } from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatArea, formatCOP } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Parcel } from "@/types/inventory";

type ParcelCardProps = {
  parcel: Parcel;
};

export function ParcelCard({ parcel }: ParcelCardProps) {
  const sold = parcel.estado === "Vendido";

  return (
    <Link
      href={`/parcelas/${parcel.id}`}
      className={cn(
        "group surface-card overflow-hidden rounded-xl transition-all duration-300 hover:-translate-y-1 hover:border-accent/40",
        sold && "opacity-70",
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <SafeImage
          src={parcel.fotos[0]}
          alt={parcel.titulo}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3">
          <StatusBadge status={parcel.estado} />
        </div>
      </div>

      <div className="space-y-3 p-4">
        <div>
          <h3 className="text-lg font-bold tracking-tight text-foreground">
            {parcel.titulo}
          </h3>
          <p className="mt-1 text-base font-semibold text-accent">
            {formatCOP(parcel.precio)}
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-xs text-muted">
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {parcel.ubicacion}
          </span>
          <span className="inline-flex items-center gap-1">
            <Ruler className="h-3.5 w-3.5" />
            {formatArea(parcel.area_m2)}
          </span>
        </div>
      </div>
    </Link>
  );
}
