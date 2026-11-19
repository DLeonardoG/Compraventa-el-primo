import type {
  InventoryStatus,
  VehicleCategory,
  VehicleLine,
} from "@/types/inventory";

export function categoryLabel(categoria: VehicleCategory): string {
  if (categoria === "Automovil") return "Automóvil";
  if (categoria === "Pickup") return "Pick-up";
  return "SUV";
}

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
