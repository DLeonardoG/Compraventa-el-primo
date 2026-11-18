import { prisma } from "@/lib/prisma";
import type {
  FuelType,
  InventoryStatus,
  MediaItem,
  MediaTipo,
  Parcel,
  Transmission,
  Vehicle,
  VehicleLine,
} from "@/types/inventory";

const mediaOrder = [{ esPortada: "desc" as const }, { orden: "asc" as const }];

type DbMedia = {
  id: string;
  url: string;
  key: string;
  tipo: string;
  orden: number;
  esPortada: boolean;
};

function mapMedia(items: DbMedia[]): MediaItem[] {
  return items.map((item) => ({
    id: item.id,
    url: item.url,
    key: item.key,
    tipo: (item.tipo === "VIDEO" ? "VIDEO" : "IMAGE") as MediaTipo,
    orden: item.orden,
    esPortada: item.esPortada,
  }));
}

function asLine(value: string): VehicleLine {
  if (value === "PRESTIGE") return "PRESTIGE";
  if (value === "IMPORTACION") return "IMPORTACION";
  return "NORMAL";
}

function asStatus(value: string): InventoryStatus {
  if (value === "RESERVADO") return "RESERVADO";
  if (value === "VENDIDO") return "VENDIDO";
  return "DISPONIBLE";
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

function mapVehicle(
  row: {
    id: string;
    slug: string;
    marca: string;
    modelo: string;
    anio: number;
    kilometraje: number;
    transmision: string;
    combustible: string;
    motor: string;
    traccion: string;
    color: string;
    placa: string;
    blindaje: string;
    precio: number;
    linea: string;
    estado: string;
    destacado: boolean;
    descripcion: string;
    media: DbMedia[];
  },
): Vehicle {
  return {
    id: row.id,
    slug: row.slug,
    marca: row.marca,
    modelo: row.modelo,
    anio: row.anio,
    kilometraje: row.kilometraje,
    transmision: asTransmission(row.transmision),
    combustible: asFuel(row.combustible),
    motor: row.motor,
    traccion: row.traccion,
    color: row.color,
    placa: row.placa,
    blindaje: row.blindaje,
    precio: row.precio,
    linea: asLine(row.linea),
    estado: asStatus(row.estado),
    destacado: row.destacado,
    descripcion: row.descripcion,
    media: mapMedia(row.media),
  };
}

function mapParcel(
  row: {
    id: string;
    slug: string;
    titulo: string;
    ubicacion: string;
    areaM2: number;
    precio: number;
    servicios: string;
    topografia: string;
    documentacion: string;
    estado: string;
    destacado: boolean;
    descripcion: string;
    media: DbMedia[];
  },
): Parcel {
  return {
    id: row.id,
    slug: row.slug,
    titulo: row.titulo,
    ubicacion: row.ubicacion,
    area_m2: row.areaM2,
    precio: row.precio,
    servicios: row.servicios,
    topografia: row.topografia,
    documentacion: row.documentacion,
    estado: asStatus(row.estado),
    destacado: row.destacado,
    descripcion: row.descripcion,
    media: mapMedia(row.media),
  };
}

export function coverUrl(media: MediaItem[]): string {
  const cover =
    media.find((item) => item.esPortada && item.tipo === "IMAGE") ??
    media.find((item) => item.tipo === "IMAGE") ??
    media[0];
  return cover?.url ?? "";
}

async function safeList<T>(fn: () => Promise<T[]>, fallback: T[] = []): Promise<T[]> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

async function safeOne<T>(fn: () => Promise<T | null>): Promise<T | null> {
  try {
    return await fn();
  } catch {
    return null;
  }
}

export async function getVehicles(): Promise<Vehicle[]> {
  return safeList(async () => {
    const rows = await prisma.vehicle.findMany({
      include: { media: { orderBy: mediaOrder } },
      orderBy: [{ destacado: "desc" }, { updatedAt: "desc" }],
    });
    return rows.map(mapVehicle);
  });
}

export async function getParcels(): Promise<Parcel[]> {
  return safeList(async () => {
    const rows = await prisma.parcel.findMany({
      include: { media: { orderBy: mediaOrder } },
      orderBy: [{ destacado: "desc" }, { updatedAt: "desc" }],
    });
    return rows.map(mapParcel);
  });
}

export async function getVehicleBySlug(slug: string): Promise<Vehicle | null> {
  return safeOne(async () => {
    const row = await prisma.vehicle.findUnique({
      where: { slug },
      include: { media: { orderBy: mediaOrder } },
    });
    return row ? mapVehicle(row) : null;
  });
}

export async function getVehicleById(id: string): Promise<Vehicle | null> {
  return safeOne(async () => {
    const row = await prisma.vehicle.findUnique({
      where: { id },
      include: { media: { orderBy: mediaOrder } },
    });
    return row ? mapVehicle(row) : null;
  });
}

export async function getParcelBySlug(slug: string): Promise<Parcel | null> {
  return safeOne(async () => {
    const row = await prisma.parcel.findUnique({
      where: { slug },
      include: { media: { orderBy: mediaOrder } },
    });
    return row ? mapParcel(row) : null;
  });
}

export async function getParcelById(id: string): Promise<Parcel | null> {
  return safeOne(async () => {
    const row = await prisma.parcel.findUnique({
      where: { id },
      include: { media: { orderBy: mediaOrder } },
    });
    return row ? mapParcel(row) : null;
  });
}

export async function getFeaturedVehicles(): Promise<Vehicle[]> {
  return safeList(async () => {
    const rows = await prisma.vehicle.findMany({
      where: { destacado: true, estado: { not: "VENDIDO" } },
      include: { media: { orderBy: mediaOrder } },
      orderBy: { updatedAt: "desc" },
      take: 6,
    });
    return rows.map(mapVehicle);
  });
}

export async function getPrestigeVehicles(): Promise<Vehicle[]> {
  return safeList(async () => {
    const rows = await prisma.vehicle.findMany({
      where: { linea: "PRESTIGE" },
      include: { media: { orderBy: mediaOrder } },
      orderBy: [{ destacado: "desc" }, { updatedAt: "desc" }],
    });
    return rows.map(mapVehicle);
  });
}

export async function getImportVehicles(): Promise<Vehicle[]> {
  return safeList(async () => {
    const rows = await prisma.vehicle.findMany({
      where: { linea: "IMPORTACION" },
      include: { media: { orderBy: mediaOrder } },
      orderBy: [{ destacado: "desc" }, { updatedAt: "desc" }],
    });
    return rows.map(mapVehicle);
  });
}

export async function getFeaturedParcels(): Promise<Parcel[]> {
  return safeList(async () => {
    const rows = await prisma.parcel.findMany({
      where: { destacado: true, estado: { not: "VENDIDO" } },
      include: { media: { orderBy: mediaOrder } },
      orderBy: { updatedAt: "desc" },
      take: 4,
    });
    return rows.map(mapParcel);
  });
}

export async function getSimilarVehicles(
  vehicle: Vehicle,
  limit = 3,
): Promise<Vehicle[]> {
  return safeList(async () => {
    const rows = await prisma.vehicle.findMany({
      where: {
        id: { not: vehicle.id },
        estado: { not: "VENDIDO" },
        OR: [{ marca: vehicle.marca }, { linea: vehicle.linea }],
      },
      include: { media: { orderBy: mediaOrder } },
      take: limit,
    });
    return rows.map(mapVehicle);
  });
}
