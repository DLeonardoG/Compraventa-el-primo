import type { InventoryStatus, VehicleLine } from "@/types/inventory";

export function lineLabel(linea: VehicleLine): string {
  if (linea === "PRESTIGE") return "Prestige";
  if (linea === "IMPORTACION") return "Importación";
  return "Normal";
}

export function statusLabel(estado: InventoryStatus): string {
  if (estado === "RESERVADO") return "Reservado";
  if (estado === "VENDIDO") return "Vendido";
  return "Disponible";
}
