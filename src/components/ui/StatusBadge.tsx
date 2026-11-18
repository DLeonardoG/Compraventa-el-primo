import { lineLabel, statusLabel } from "@/lib/labels";
import type { InventoryStatus, VehicleLine } from "@/types/inventory";
import { cn } from "@/lib/utils";

const statusStyles: Record<InventoryStatus, string> = {
  DISPONIBLE: "border-border text-muted bg-black/40",
  RESERVADO: "border-border text-zinc-400 bg-[#18181C]",
  VENDIDO: "border-border text-zinc-500 bg-[#111114]",
};

export function StatusBadge({ status }: { status: InventoryStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em]",
        statusStyles[status],
      )}
    >
      {statusLabel(status)}
    </span>
  );
}

export function LineBadge({ linea }: { linea: VehicleLine }) {
  if (linea === "NORMAL") return null;
  return (
    <span className="inline-flex items-center border border-accent px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-accent">
      {lineLabel(linea)}
    </span>
  );
}
