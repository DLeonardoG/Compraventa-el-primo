import Link from "next/link";
import { Calendar, Gauge, Settings2 } from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatCOP, formatKm } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Vehicle } from "@/types/inventory";

type VehicleCardProps = {
  vehicle: Vehicle;
};

export function VehicleCard({ vehicle }: VehicleCardProps) {
  const sold = vehicle.estado === "Vendido";

  return (
    <Link
      href={`/vehiculos/${vehicle.id}`}
      className={cn(
        "group surface-card overflow-hidden rounded-xl transition-all duration-300 hover:-translate-y-1 hover:border-accent/40",
        sold && "opacity-70",
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <SafeImage
          src={vehicle.fotos[0]}
          alt={`${vehicle.marca} ${vehicle.modelo}`}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3">
          <StatusBadge status={vehicle.estado} />
        </div>
        {vehicle.linea !== "Normal" ? (
          <span className="absolute right-3 top-3 rounded-md bg-black/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent">
            {vehicle.linea}
          </span>
        ) : null}
      </div>

      <div className="space-y-3 p-4">
        <div>
          <h3 className="text-lg font-bold tracking-tight text-foreground">
            {vehicle.marca} {vehicle.modelo}
          </h3>
          <p className="mt-1 text-base font-semibold text-accent">
            {formatCOP(vehicle.precio)}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 text-xs text-muted">
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {vehicle.anio}
          </span>
          <span className="inline-flex items-center gap-1">
            <Gauge className="h-3.5 w-3.5" />
            {formatKm(vehicle.kilometraje)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Settings2 className="h-3.5 w-3.5" />
            {vehicle.transmision}
          </span>
        </div>
      </div>
    </Link>
  );
}
