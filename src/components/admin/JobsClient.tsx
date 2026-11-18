"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { markJobRead } from "@/app/admin/actions";

export type JobRow = {
  id: string;
  nombre: string;
  telefono: string;
  email: string;
  cargo: string;
  cvUrl: string;
  leido: boolean;
  createdAt: string;
};

export function JobsClient({ jobs }: { jobs: JobRow[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);

  async function toggleRead(id: string, leido: boolean) {
    setBusyId(id);
    await markJobRead(id, leido);
    setBusyId(null);
    router.refresh();
  }

  return (
    <div className="space-y-3">
      {jobs.map((job) => (
        <article
          key={job.id}
          className={`border border-border bg-card p-4 ${
            job.leido ? "opacity-70" : ""
          }`}
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.14em] text-accent">
                {job.cargo}
                {!job.leido ? " · Sin revisar" : ""}
              </p>
              <h3 className="mt-1 font-medium text-foreground">{job.nombre}</h3>
              <p className="text-sm text-muted">
                {job.telefono} · {job.email}
              </p>
              <p className="mt-1 text-xs text-muted">
                {new Date(job.createdAt).toLocaleString("es-CO")}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <a
                href={job.cvUrl}
                target="_blank"
                rel="noreferrer"
                className="border border-border px-3 py-1.5 text-[10px] uppercase tracking-[0.14em] text-muted hover:text-accent"
              >
                Ver CV PDF
              </a>
              <button
                type="button"
                disabled={busyId === job.id}
                onClick={() => void toggleRead(job.id, !job.leido)}
                className="border border-border px-3 py-1.5 text-[10px] uppercase tracking-[0.14em] text-muted hover:text-foreground"
              >
                {job.leido ? "Marcar pendiente" : "Marcar revisado"}
              </button>
            </div>
          </div>
        </article>
      ))}
      {!jobs.length ? (
        <p className="text-sm text-muted">Aún no hay postulaciones.</p>
      ) : null}
    </div>
  );
}
