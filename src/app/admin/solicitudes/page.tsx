import { LeadsClient } from "@/components/admin/LeadsClient";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminLeadsPage() {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Solicitudes y Leads</h1>
        <p className="mt-1 text-sm text-muted">
          Consignación, importación, citas y contacto.
        </p>
      </div>
      <LeadsClient
        leads={leads.map((lead) => ({
          ...lead,
          createdAt: lead.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
