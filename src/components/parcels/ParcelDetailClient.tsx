"use client";

import { MessageCircle, Share2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ScheduleVisitModal } from "@/components/modals/ScheduleVisitModal";
import { useToast } from "@/components/providers/ToastProvider";
import { LightboxGallery } from "@/components/ui/LightboxGallery";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { FinanceCalculator } from "@/components/vehicles/FinanceCalculator";
import {
  buildWhatsAppUrl,
  formatArea,
  formatCOP,
  formatPricePerSqm,
  parcelInterestMessage,
} from "@/lib/formatters";
import type { Parcel } from "@/types/inventory";

export function ParcelDetailClient({ parcel }: { parcel: Parcel }) {
  const { toast } = useToast();
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const whatsappUrl = buildWhatsAppUrl(
    parcelInterestMessage(parcel.titulo, parcel.ubicacion, parcel.precio),
  );

  const services = parcel.servicios
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

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
          <Link href="/parcelas" className="hover:text-accent">
            Parcelas
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{parcel.titulo}</span>
        </nav>
        <div className="flex flex-wrap gap-2">
          <Link href="/parcelas" className="btn-outline px-3 py-2 text-xs">
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
          <LightboxGallery media={parcel.media} alt={parcel.titulo} />
          <div>
            <h2 className="heading-display text-xl font-bold">Descripción</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
              {parcel.descripcion}
            </p>
          </div>
          <FinanceCalculator price={parcel.precio} title={parcel.titulo} />
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start space-y-4">
          <div className="border border-border bg-card p-5">
            <StatusBadge status={parcel.estado} />
            <h1 className="heading-display mt-3 text-2xl font-bold sm:text-3xl">
              {parcel.titulo}
            </h1>
            <p className="mt-2 font-tech text-sm text-muted">{parcel.ubicacion}</p>
            <p className="price-num mt-4 text-3xl font-bold">
              {formatCOP(parcel.precio)}
            </p>
            <p className="mt-1 font-tech text-sm text-accent">
              {formatPricePerSqm(parcel.precio, parcel.area_m2)} / m²
            </p>

            <dl className="mt-5 space-y-3 border-t border-border pt-4 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Área total</dt>
                <dd className="font-tech font-semibold">{formatArea(parcel.area_m2)}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Topografía</dt>
                <dd className="font-semibold text-right">{parcel.topografia || "N/D"}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Documentación</dt>
                <dd className="font-semibold text-right">
                  {parcel.documentacion || "N/D"}
                </dd>
              </div>
            </dl>

            <div className="mt-4 border-t border-border pt-4">
              <p className="mb-2 text-sm text-muted">Servicios públicos</p>
              <div className="flex flex-wrap gap-2">
                {services.length ? (
                  services.map((service) => (
                    <span
                      key={service}
                      className="border border-border bg-background px-2 py-1 text-xs"
                    >
                      {service}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-muted">Sin información</span>
                )}
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp w-full"
              >
                <MessageCircle className="h-4 w-4" strokeWidth={1.5} />
                Consultar Parcela por WhatsApp
              </a>
              <button
                type="button"
                onClick={() => setScheduleOpen(true)}
                className="btn-champagne w-full"
              >
                Agendar Visita al Terreno
              </button>
              <a href="#simulador" className="btn-outline w-full">
                Simular Financiación
              </a>
            </div>
          </div>
        </aside>
      </div>

      <ScheduleVisitModal
        open={scheduleOpen}
        onClose={() => setScheduleOpen(false)}
        subject={parcel.titulo}
        kind="parcel-visit"
      />
    </div>
  );
}
