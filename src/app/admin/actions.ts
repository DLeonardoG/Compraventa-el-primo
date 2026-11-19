"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  clearAdminSession,
  getAdminCredentials,
  requireAdmin,
  setAdminSession,
  timingSafeEqualString,
} from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uniqueSlug } from "@/lib/slug";
import { deleteObjects } from "@/lib/storage";
import type {
  InventoryStatus,
  MediaItem,
  VehicleCategory,
  VehicleLine,
} from "@/types/inventory";

export type ActionState = {
  ok: boolean;
  error?: string;
  id?: string;
};

export type LoginState = {
  error?: string;
};

type MediaInput = {
  id?: string;
  url: string;
  key: string;
  tipo: string;
  orden: number;
  esPortada: boolean;
};

function refreshPublic() {
  revalidatePath("/", "layout");
  revalidatePath("/vehiculos");
  revalidatePath("/parcelas");
  revalidatePath("/prestige");
  revalidatePath("/importacion");
  revalidatePath("/admin");
}

export async function login(
  _previous: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const creds = getAdminCredentials();

  const emailOk = timingSafeEqualString(email, creds.email.toLowerCase());
  const passOk = timingSafeEqualString(password, creds.password);
  if (!emailOk || !passOk) {
    return { error: "Credenciales incorrectas" };
  }

  await setAdminSession(creds.email);
  redirect("/admin");
}

export async function logout() {
  await clearAdminSession();
  redirect("/admin/login");
}

async function syncMedia(
  entity: { vehicleId?: string; parcelId?: string },
  media: MediaInput[],
) {
  const where = entity.vehicleId
    ? { vehicleId: entity.vehicleId }
    : { parcelId: entity.parcelId! };

  const existing = await prisma.media.findMany({ where });
  const incomingKeys = new Set(media.map((item) => item.key));
  const toDelete = existing.filter((item) => !incomingKeys.has(item.key));

  if (toDelete.length) {
    await deleteObjects(toDelete.map((item) => item.key));
    await prisma.media.deleteMany({
      where: { id: { in: toDelete.map((item) => item.id) } },
    });
  }

  for (const item of media) {
    const found = existing.find((row) => row.key === item.key);
    if (found) {
      await prisma.media.update({
        where: { id: found.id },
        data: {
          url: item.url,
          tipo: item.tipo,
          orden: item.orden,
          esPortada: item.esPortada,
        },
      });
    } else {
      await prisma.media.create({
        data: {
          url: item.url,
          key: item.key,
          tipo: item.tipo,
          orden: item.orden,
          esPortada: item.esPortada,
          vehicleId: entity.vehicleId,
          parcelId: entity.parcelId,
        },
      });
    }
  }
}

export async function saveVehicle(input: {
  id?: string;
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
  categoria: VehicleCategory;
  linea: VehicleLine;
  estado: InventoryStatus;
  destacado: boolean;
  descripcion: string;
  media: MediaInput[];
}): Promise<ActionState> {
  try {
    await requireAdmin();
    const baseSlug = uniqueSlug(`${input.marca}-${input.modelo}-${input.anio}`);
    let slug = baseSlug;
    let attempt = 0;
    while (true) {
      const clash = await prisma.vehicle.findUnique({ where: { slug } });
      if (!clash || clash.id === input.id) break;
      attempt += 1;
      slug = uniqueSlug(baseSlug, attempt);
    }

    const data = {
      slug,
      marca: input.marca.trim(),
      modelo: input.modelo.trim(),
      anio: input.anio,
      kilometraje: input.kilometraje,
      transmision: input.transmision,
      combustible: input.combustible,
      motor: input.motor.trim(),
      traccion: input.traccion.trim(),
      color: input.color.trim(),
      placa: input.placa.trim(),
      blindaje: input.blindaje.trim() || "Sin blindaje",
      precio: input.precio,
      categoria: input.categoria,
      linea: input.linea,
      estado: input.estado,
      destacado: input.destacado,
      descripcion: input.descripcion.trim(),
    };

    const vehicle = input.id
      ? await prisma.vehicle.update({ where: { id: input.id }, data })
      : await prisma.vehicle.create({ data });

    await syncMedia({ vehicleId: vehicle.id }, input.media);
    refreshPublic();
    revalidatePath(`/vehiculos/${vehicle.slug}`);
    return { ok: true, id: vehicle.id };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "No se pudo guardar",
    };
  }
}

export async function deleteVehicle(id: string): Promise<ActionState> {
  try {
    await requireAdmin();
    const media = await prisma.media.findMany({ where: { vehicleId: id } });
    await deleteObjects(media.map((item) => item.key));
    await prisma.vehicle.delete({ where: { id } });
    refreshPublic();
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "No se pudo eliminar",
    };
  }
}

export async function updateVehicleStatus(
  id: string,
  estado: InventoryStatus,
): Promise<ActionState> {
  try {
    await requireAdmin();
    const vehicle = await prisma.vehicle.update({
      where: { id },
      data: { estado },
    });
    refreshPublic();
    revalidatePath(`/vehiculos/${vehicle.slug}`);
    return { ok: true, id };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "No se pudo actualizar",
    };
  }
}

export async function saveParcel(input: {
  id?: string;
  titulo: string;
  ubicacion: string;
  areaM2: number;
  precio: number;
  servicios: string;
  topografia: string;
  documentacion: string;
  estado: InventoryStatus;
  destacado: boolean;
  descripcion: string;
  media: MediaInput[];
}): Promise<ActionState> {
  try {
    await requireAdmin();
    const baseSlug = uniqueSlug(input.titulo);
    let slug = baseSlug;
    let attempt = 0;
    while (true) {
      const clash = await prisma.parcel.findUnique({ where: { slug } });
      if (!clash || clash.id === input.id) break;
      attempt += 1;
      slug = uniqueSlug(baseSlug, attempt);
    }

    const data = {
      slug,
      titulo: input.titulo.trim(),
      ubicacion: input.ubicacion.trim(),
      areaM2: input.areaM2,
      precio: input.precio,
      servicios: input.servicios.trim(),
      topografia: input.topografia.trim(),
      documentacion: input.documentacion.trim(),
      estado: input.estado,
      destacado: input.destacado,
      descripcion: input.descripcion.trim(),
    };

    const parcel = input.id
      ? await prisma.parcel.update({ where: { id: input.id }, data })
      : await prisma.parcel.create({ data });

    await syncMedia({ parcelId: parcel.id }, input.media);
    refreshPublic();
    revalidatePath(`/parcelas/${parcel.slug}`);
    return { ok: true, id: parcel.id };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "No se pudo guardar",
    };
  }
}

export async function deleteParcel(id: string): Promise<ActionState> {
  try {
    await requireAdmin();
    const media = await prisma.media.findMany({ where: { parcelId: id } });
    await deleteObjects(media.map((item) => item.key));
    await prisma.parcel.delete({ where: { id } });
    refreshPublic();
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "No se pudo eliminar",
    };
  }
}

export async function updateParcelStatus(
  id: string,
  estado: InventoryStatus,
): Promise<ActionState> {
  try {
    await requireAdmin();
    const parcel = await prisma.parcel.update({
      where: { id },
      data: { estado },
    });
    refreshPublic();
    revalidatePath(`/parcelas/${parcel.slug}`);
    return { ok: true, id };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "No se pudo actualizar",
    };
  }
}

export async function markLeadRead(id: string, leido = true): Promise<ActionState> {
  try {
    await requireAdmin();
    await prisma.lead.update({ where: { id }, data: { leido } });
    revalidatePath("/admin/solicitudes");
    revalidatePath("/admin");
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "No se pudo actualizar",
    };
  }
}

export async function markJobRead(id: string, leido = true): Promise<ActionState> {
  try {
    await requireAdmin();
    await prisma.jobApplication.update({ where: { id }, data: { leido } });
    revalidatePath("/admin/postulaciones");
    revalidatePath("/admin");
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "No se pudo actualizar",
    };
  }
}

export type { MediaItem };
