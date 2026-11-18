import type { InventoryStatus } from "@/types/inventory";
import { cn } from "@/lib/utils";

const styles: Record<InventoryStatus, string> = {
  Disponible: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  Reservado: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  Vendido: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",
};

export function StatusBadge({ status }: { status: InventoryStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold uppercase tracking-wide",
        styles[status],
      )}
    >
      {status}
    </span>
  );
}
