import { lineLabel, statusLabel } from "@/lib/labels";
import type { InventoryStatus, VehicleLine } from "@/types/inventory";
import { cn } from "@/lib/utils";

const statusStyles: Record<InventoryStatus, string> = {
  DISPONIBLE: "border-[#15803D]/60 text-[#15803D] bg-[#15803D]/10",
  RESERVADO: "border-[#B45309]/60 text-[#B45309] bg-[#B45309]/10",
  VENDIDO: "border-[#991B1B]/60 text-[#991B1B] bg-[#991B1B]/10",
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
