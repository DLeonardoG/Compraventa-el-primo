import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const zero = 0;
  let availableVehicles = zero;
  let soldVehicles = zero;
  let activeParcels = zero;
  let unreadLeads = zero;
  let unreadJobs = zero;

  try {
    [
      availableVehicles,
      soldVehicles,
      activeParcels,
      unreadLeads,
      unreadJobs,
    ] = await Promise.all([
      prisma.vehicle.count({ where: { estado: "DISPONIBLE" } }),
      prisma.vehicle.count({ where: { estado: "VENDIDO" } }),
      prisma.parcel.count({ where: { estado: { not: "VENDIDO" } } }),
      prisma.lead.count({ where: { leido: false } }),
      prisma.jobApplication.count({ where: { leido: false } }),
    ]);
  } catch {
    // Database may be unavailable during local build without DATABASE_URL.
  }

  const cards = [
    { label: "Vehículos Disponibles", value: availableVehicles },
    { label: "Vehículos Vendidos", value: soldVehicles },
    { label: "Parcelas Activas", value: activeParcels },
    { label: "Solicitudes sin leer", value: unreadLeads },
    { label: "Postulaciones sin leer", value: unreadJobs },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Resumen</h1>
        <p className="mt-1 text-sm text-muted">
          Indicadores en tiempo real del inventario y solicitudes.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map((card) => (
          <div
            key={card.label}
            className="border border-border bg-card p-4 rounded-sm"
          >
            <p className="text-[10px] uppercase tracking-[0.14em] text-muted">
              {card.label}
            </p>
            <p className="mt-3 text-3xl font-semibold text-accent">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/admin/vehiculos/nuevo"
          className="bg-accent px-4 py-2.5 text-sm font-semibold uppercase tracking-[0.14em] text-background"
        >
          Crear vehículo
        </Link>
        <Link
          href="/admin/parcelas/nuevo"
          className="border border-border px-4 py-2.5 text-sm font-semibold uppercase tracking-[0.14em] text-foreground hover:border-accent hover:text-accent"
        >
          Crear parcela
        </Link>
      </div>
    </div>
  );
}
