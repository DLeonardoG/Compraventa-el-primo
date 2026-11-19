"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { markLeadRead } from "@/app/admin/actions";
import { buildWhatsAppUrl } from "@/lib/formatters";
import type { LeadTipo } from "@/types/inventory";

export type LeadRow = {
  id: string;
  tipo: string;
  nombre: string;
  telefono: string;
  email: string | null;
  detalleJson: string;
  leido: boolean;
  createdAt: string;
};

const tabs: Array<LeadTipo | "ALL"> = [
  "ALL",
  "CONSIGNACION",
  "IMPORTACION",
  "FINANCIACION",
  "CITA",
  "CONTACTO",
];

export function LeadsClient({ leads }: { leads: LeadRow[] }) {
  const router = useRouter();
  const [tab, setTab] = useState<(typeof tabs)[number]>("ALL");
  const [busyId, setBusyId] = useState<string | null>(null);

  const filtered = useMemo(
    () => (tab === "ALL" ? leads : leads.filter((lead) => lead.tipo === tab)),
    [leads, tab],
  );

  async function toggleRead(id: string, leido: boolean) {
    setBusyId(id);
    await markLeadRead(id, leido);
    setBusyId(null);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {tabs.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setTab(item)}
            className={`border px-3 py-1.5 text-[10px] uppercase tracking-[0.14em] ${
              tab === item
                ? "border-accent text-accent"
                : "border-border text-muted hover:text-foreground"
            }`}
          >
            {item === "ALL" ? "Todas" : item}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((lead) => {
          let detalle: Record<string, unknown> = {};
          try {
            detalle = JSON.parse(lead.detalleJson) as Record<string, unknown>;
          } catch {
            detalle = { raw: lead.detalleJson };
          }
          const wa = buildWhatsAppUrl(
            `Hola ${lead.nombre}, te contactamos de Compraventa El Primo respecto a tu solicitud de ${lead.tipo}.`,
            lead.telefono,
          );
          return (
            <article
              key={lead.id}
              className={`border border-border bg-card p-4 ${
                lead.leido ? "opacity-70" : ""
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.14em] text-accent">
                    {lead.tipo}
                    {!lead.leido ? " · Sin leer" : ""}
                  </p>
                  <h3 className="mt-1 font-medium text-foreground">
                    {lead.nombre}
                  </h3>
                  <p className="text-sm text-muted">
                    {lead.telefono}
                    {lead.email ? ` · ${lead.email}` : ""}
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    {new Date(lead.createdAt).toLocaleString("es-CO")}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={wa}
                    target="_blank"
                    rel="noreferrer"
                    className="border border-border px-3 py-1.5 text-[10px] uppercase tracking-[0.14em] text-muted hover:text-accent"
                  >
                    WhatsApp
                  </a>
                  <button
                    type="button"
                    disabled={busyId === lead.id}
                    onClick={() => void toggleRead(lead.id, !lead.leido)}
                    className="border border-border px-3 py-1.5 text-[10px] uppercase tracking-[0.14em] text-muted hover:text-foreground"
                  >
                    {lead.leido ? "Marcar no leído" : "Marcar leído"}
                  </button>
                </div>
              </div>
              <pre className="mt-3 overflow-x-auto border border-border bg-elevated p-3 text-xs text-muted">
                {JSON.stringify(detalle, null, 2)}
              </pre>
            </article>
          );
        })}
        {!filtered.length ? (
          <p className="text-sm text-muted">No hay solicitudes en esta pestaña.</p>
        ) : null}
      </div>
    </div>
  );
}
