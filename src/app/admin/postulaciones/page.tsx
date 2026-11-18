import { JobsClient } from "@/components/admin/JobsClient";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminJobsPage() {
  const jobs = await prisma.jobApplication.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Hojas de Vida</h1>
        <p className="mt-1 text-sm text-muted">
          Postulaciones recibidas desde Trabaja con Nosotros.
        </p>
      </div>
      <JobsClient
        jobs={jobs.map((job) => ({
          id: job.id,
          nombre: job.nombre,
          telefono: job.telefono,
          email: job.email,
          cargo: job.cargo,
          cvUrl: job.cvUrl,
          leido: job.leido,
          createdAt: job.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
