import { MessageCircle } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { FinanceCalculator } from "@/components/vehicles/FinanceCalculator";
import { VehicleGallery } from "@/components/vehicles/VehicleGallery";
import { formatCOP, formatKm } from "@/lib/format";
import { getVehicleById, getVehicles } from "@/lib/sheets";
import { buildWhatsAppUrl, vehicleInterestMessage } from "@/lib/whatsapp";

type Params = Promise<{ id: string }>;

export async function generateStaticParams() {
  const vehicles = await getVehicles();
  return vehicles.map((vehicle) => ({ id: vehicle.id }));
}

export async function generateMetadata({ params }: { params: Params }) {
  const { id } = await params;
  const vehicle = await getVehicleById(id);
  if (!vehicle) return { title: "Vehículo no encontrado" };
  return {
    title: `${vehicle.marca} ${vehicle.modelo} ${vehicle.anio}`,
  };
}

export default async function VehicleDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const vehicle = await getVehicleById(id);
  if (!vehicle) notFound();

  const whatsappUrl = buildWhatsAppUrl(
    vehicleInterestMessage(vehicle.marca, vehicle.modelo, vehicle.anio),
  );

  const specs = [
    { label: "Año", value: String(vehicle.anio) },
    { label: "Kilometraje", value: formatKm(vehicle.kilometraje) },
    { label: "Transmisión", value: vehicle.transmision },
    { label: "Combustible", value: vehicle.combustible },
    { label: "Motor", value: vehicle.motor },
    { label: "Línea", value: vehicle.linea },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Link href="/vehiculos" className="text-sm text-muted hover:text-accent">
        ← Volver al catálogo
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <VehicleGallery
            photos={vehicle.fotos}
            alt={`${vehicle.marca} ${vehicle.modelo}`}
          />
          <div className="mt-6">
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge status={vehicle.estado} />
              {vehicle.linea !== "Normal" ? (
                <span className="rounded-md border border-accent/30 bg-accent/10 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-accent">
                  {vehicle.linea}
                </span>
              ) : null}
            </div>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              {vehicle.marca} {vehicle.modelo}
            </h1>
            <p className="mt-2 text-2xl font-bold text-accent">
              {formatCOP(vehicle.precio)}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
              {vehicle.descripcion}
            </p>
          </div>

          <div className="mt-8 overflow-hidden rounded-xl border border-border">
            <table className="w-full text-sm">
              <tbody>
                {specs.map((spec, index) => (
                  <tr
                    key={spec.label}
                    className={index % 2 === 0 ? "bg-card" : "bg-background/40"}
                  >
                    <th className="w-1/3 px-4 py-3 text-left font-medium text-muted">
                      {spec.label}
                    </th>
                    <td className="px-4 py-3 font-semibold">{spec.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="space-y-5">
          <FinanceCalculator price={vehicle.precio} />
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary w-full"
          >
            <MessageCircle className="h-4 w-4" />
            Consultar este vehículo por WhatsApp
          </a>
        </aside>
      </div>
    </div>
  );
}
