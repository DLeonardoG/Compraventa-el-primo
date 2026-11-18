"use client";

import { MessageCircle, Share2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ScheduleVisitModal } from "@/components/modals/ScheduleVisitModal";
import { useToast } from "@/components/providers/ToastProvider";
import { LineBadge, StatusBadge } from "@/components/ui/StatusBadge";
import { LightboxGallery } from "@/components/ui/LightboxGallery";
import { FinanceCalculator } from "@/components/vehicles/FinanceCalculator";
import { VehicleCard } from "@/components/vehicles/VehicleCard";
import {
  buildWhatsAppUrl,
  formatCOP,
  formatKm,
  vehicleInterestMessage,
} from "@/lib/formatters";
import type { Vehicle } from "@/types/inventory";

type VehicleDetailClientProps = {
  vehicle: Vehicle;
  similar: Vehicle[];
};

export function VehicleDetailClient({ vehicle, similar }: VehicleDetailClientProps) {
  const { toast } = useToast();
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const title = `${vehicle.marca} ${vehicle.modelo}`;
  const whatsappUrl = buildWhatsAppUrl(
    vehicleInterestMessage(vehicle.marca, vehicle.modelo, vehicle.anio, vehicle.precio),
  );

  const specs = [
    { label: "Marca", value: vehicle.marca },
    { label: "Modelo", value: vehicle.modelo },
    { label: "Año", value: String(vehicle.anio) },
    { label: "Kilometraje", value: formatKm(vehicle.kilometraje) },
    { label: "Motor", value: vehicle.motor },
    { label: "Transmisión", value: vehicle.transmision },
    { label: "Tracción", value: vehicle.traccion },
    { label: "Combustible", value: vehicle.combustible },
    { label: "Color", value: vehicle.color || "N/D" },
    { label: "Placa", value: vehicle.placa || "N/D" },
    { label: "Blindaje", value: vehicle.blindaje || "No" },
  ];

  async function share() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast("Enlace de la ficha copiado");
    } catch {
      toast("No se pudo copiar el enlace");
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <nav className="text-muted">
          <Link href="/" className="hover:text-accent">
            Inicio
          </Link>
          <span className="mx-2">/</span>
          <Link href="/vehiculos" className="hover:text-accent">
            Vehículos
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{title}</span>
        </nav>
        <div className="flex flex-wrap gap-2">
          <Link href="/vehiculos" className="btn-outline px-3 py-2 text-xs">
            Volver al catálogo
          </Link>
          <button type="button" onClick={share} className="btn-outline px-3 py-2 text-xs">
            <Share2 className="h-3.5 w-3.5" strokeWidth={1.5} />
            Compartir ficha
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-8">
          <LightboxGallery media={vehicle.media} alt={title} />

          <div>
            <h2 className="heading-display text-xl font-bold">Descripción</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
              {vehicle.descripcion}
            </p>
          </div>

          <div>
            <h2 className="heading-display mb-4 text-xl font-bold">Ficha técnica</h2>
            <div className="overflow-hidden border border-border">
              <table className="w-full text-sm">
                <tbody>
                  {specs.map((spec, index) => (
                    <tr
                      key={spec.label}
                      className={index % 2 === 0 ? "bg-card" : "bg-background"}
                    >
                      <th className="w-1/3 px-4 py-3 text-left font-medium text-muted">
                        {spec.label}
                      </th>
                      <td className="px-4 py-3 font-tech font-semibold">{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <FinanceCalculator price={vehicle.precio} title={title} />
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="border border-border bg-card p-5">
            <div className="flex flex-wrap gap-2">
              <StatusBadge status={vehicle.estado} />
              <LineBadge linea={vehicle.linea} />
            </div>
            <h1 className="heading-display mt-3 text-2xl font-bold sm:text-3xl">
              {title}
            </h1>
            <p className="mt-2 font-tech text-sm text-muted">
              {vehicle.anio} • {formatKm(vehicle.kilometraje)} • {vehicle.transmision}
            </p>
            <p className="price-num mt-4 text-3xl font-bold text-foreground">
              {formatCOP(vehicle.precio)}
            </p>

            <div className="mt-6 space-y-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp w-full"
              >
                <MessageCircle className="h-4 w-4" strokeWidth={1.5} />
                Contactar Asesor por WhatsApp
              </a>
              <button
                type="button"
                onClick={() => setScheduleOpen(true)}
                className="btn-champagne w-full"
              >
                Agendar Cita / Test Drive
              </button>
              <a href="#simulador" className="btn-outline w-full">
                Simular Crédito
              </a>
            </div>
          </div>
        </aside>
      </div>

      {similar.length ? (
        <section className="mt-16">
          <h2 className="heading-display mb-6 text-2xl font-bold">Vehículos similares</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((item) => (
              <VehicleCard key={item.id} vehicle={item} />
            ))}
          </div>
        </section>
      ) : null}

      <ScheduleVisitModal
        open={scheduleOpen}
        onClose={() => setScheduleOpen(false)}
        subject={title}
        kind="test-drive"
      />
    </div>
  );
}
