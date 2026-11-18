import { siteConfig } from "@/config/site.config";
import { parseFotoString, parseNumber, parseYesNo } from "@/lib/format";
import { mockParcels, mockVehicles } from "@/lib/mock-data";
import type {
  FuelType,
  InventoryStatus,
  Parcel,
  Transmission,
  Vehicle,
  VehicleLine,
} from "@/types/inventory";

type SheetCell = { v?: unknown; f?: string };
type SheetRow = { c: Array<SheetCell | null> };
type GvizPayload = {
  table?: {
    cols?: Array<{ label?: string }>;
    rows?: SheetRow[];
  };
};

function normalizeHeader(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");
}

function cellValue(cell: SheetCell | null | undefined): unknown {
  if (!cell) return "";
  return cell.v ?? cell.f ?? "";
}

function parseGvizText(raw: string): GvizPayload {
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end === -1) {
    throw new Error("Respuesta gviz inválida");
  }
  return JSON.parse(raw.slice(start, end + 1)) as GvizPayload;
}

async function fetchSheet(tabName: string): Promise<Record<string, string>[]> {
  const sheetId = siteConfig.integrations.googleSheetId;
  if (!sheetId) return [];

  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(tabName)}`;
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`No se pudo leer la hoja ${tabName}`);
  }

  const text = await response.text();
  const payload = parseGvizText(text);
  const cols = payload.table?.cols ?? [];
  const rows = payload.table?.rows ?? [];
  const headers = cols.map((col, index) =>
    normalizeHeader(col.label || `col_${index}`),
  );

  return rows.map((row) => {
    const record: Record<string, string> = {};
    headers.forEach((header, index) => {
      const value = cellValue(row.c?.[index]);
      record[header] = value == null ? "" : String(value);
    });
    return record;
  });
}

function asTransmission(value: string): Transmission {
  return value.toLowerCase().includes("auto") ? "Automática" : "Mecánica";
}

function asFuel(value: string): FuelType {
  const normalized = value.toLowerCase();
  if (normalized.includes("diel") || normalized.includes("diesel")) return "Diésel";
  if (normalized.includes("hibr")) return "Híbrido";
  if (normalized.includes("elec")) return "Eléctrico";
  return "Gasolina";
}

function asLine(value: string): VehicleLine {
  const normalized = normalizeHeader(value);
  if (normalized.includes("prestige")) return "Prestige";
  if (normalized.includes("import")) return "Importacion";
  return "Normal";
}

function asStatus(value: string): InventoryStatus {
  const normalized = normalizeHeader(value);
  if (normalized.includes("vend")) return "Vendido";
  if (normalized.includes("reserv")) return "Reservado";
  return "Disponible";
}

function mapVehicle(row: Record<string, string>, index: number): Vehicle {
  return {
    id: row.id || `veh-${index + 1}`,
    marca: row.marca || "Sin marca",
    modelo: row.modelo || "Sin modelo",
    anio: parseNumber(row.anio),
    kilometraje: parseNumber(row.kilometraje),
    transmision: asTransmission(row.transmision || ""),
    combustible: asFuel(row.combustible || ""),
    motor: row.motor || "",
    precio: parseNumber(row.precio),
    linea: asLine(row.linea || "Normal"),
    estado: asStatus(row.estado || "Disponible"),
    destacado: parseYesNo(row.destacado),
    descripcion: row.descripcion || "",
    fotos: parseFotoString(row.fotos),
  };
}

function mapParcel(row: Record<string, string>, index: number): Parcel {
  return {
    id: row.id || `par-${index + 1}`,
    titulo: row.titulo || "Parcela sin título",
    ubicacion: row.ubicacion || "",
    area_m2: parseNumber(row.area_m2),
    precio: parseNumber(row.precio),
    servicios: row.servicios || "",
    estado: asStatus(row.estado || "Disponible"),
    destacado: parseYesNo(row.destacado),
    descripcion: row.descripcion || "",
    fotos: parseFotoString(row.fotos),
  };
}

export async function getVehicles(): Promise<Vehicle[]> {
  try {
    const rows = await fetchSheet("Vehiculos");
    if (!rows.length) return mockVehicles;
    return rows.map(mapVehicle);
  } catch {
    return mockVehicles;
  }
}

export async function getParcels(): Promise<Parcel[]> {
  try {
    const rows = await fetchSheet("Parcelas");
    if (!rows.length) return mockParcels;
    return rows.map(mapParcel);
  } catch {
    return mockParcels;
  }
}

export async function getVehicleById(id: string): Promise<Vehicle | undefined> {
  const vehicles = await getVehicles();
  return vehicles.find((vehicle) => vehicle.id === id);
}

export async function getParcelById(id: string): Promise<Parcel | undefined> {
  const parcels = await getParcels();
  return parcels.find((parcel) => parcel.id === id);
}

export async function getFeaturedVehicles(): Promise<Vehicle[]> {
  const vehicles = await getVehicles();
  return vehicles.filter((v) => v.destacado && v.estado !== "Vendido").slice(0, 6);
}

export async function getPrestigeVehicles(): Promise<Vehicle[]> {
  const vehicles = await getVehicles();
  return vehicles.filter(
    (v) => v.linea === "Prestige" || v.linea === "Importacion",
  );
}

export async function getFeaturedParcels(): Promise<Parcel[]> {
  const parcels = await getParcels();
  return parcels.filter((p) => p.destacado && p.estado !== "Vendido").slice(0, 4);
}
