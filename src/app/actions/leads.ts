"use server";

import { prisma } from "@/lib/prisma";
import type { LeadTipo } from "@/types/inventory";

export type LeadActionResult = { ok: true } | { ok: false; error: string };

export async function createLead(input: {
  tipo: LeadTipo;
  nombre: string;
  telefono: string;
  email?: string;
  detalle: Record<string, unknown>;
}): Promise<LeadActionResult> {
  try {
    const nombre = input.nombre.trim();
    const telefono = input.telefono.trim();
    if (!nombre || !telefono) {
      return { ok: false, error: "Nombre y teléfono son obligatorios" };
    }

    await prisma.lead.create({
      data: {
        tipo: input.tipo,
        nombre,
        telefono,
        email: input.email?.trim() || null,
        detalleJson: JSON.stringify(input.detalle),
      },
    });

    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "No se pudo guardar",
    };
  }
}

export async function createJobApplication(input: {
  nombre: string;
  telefono: string;
  email: string;
  cargo: string;
  cvUrl: string;
  cvKey: string;
}): Promise<LeadActionResult> {
  try {
    const nombre = input.nombre.trim();
    const telefono = input.telefono.trim();
    const email = input.email.trim();
    const cargo = input.cargo.trim();
    if (!nombre || !telefono || !email || !cargo || !input.cvUrl || !input.cvKey) {
      return { ok: false, error: "Completa todos los campos y adjunta el CV" };
    }

    await prisma.jobApplication.create({
      data: {
        nombre,
        telefono,
        email,
        cargo,
        cvUrl: input.cvUrl,
        cvKey: input.cvKey,
      },
    });

    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "No se pudo guardar",
    };
  }
}
