import { MessageCircle } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { VehicleGallery } from "@/components/vehicles/VehicleGallery";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatArea, formatCOP, formatPricePerSqm } from "@/lib/format";
import { getParcelById, getParcels } from "@/lib/sheets";
import { buildWhatsAppUrl, parcelInterestMessage } from "@/lib/whatsapp";

type Params = Promise<{ id: string }>;

export async function generateStaticParams() {
  const parcels = await getParcels();
  return parcels.map((parcel) => ({ id: parcel.id }));
}

export async function generateMetadata({ params }: { params: Params }) {
  const { id } = await params;
  const parcel = await getParcelById(id);
  if (!parcel) return { title: "Parcela no encontrada" };
  return { title: parcel.titulo };
}

export default async function ParcelDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const parcel = await getParcelById(id);
  if (!parcel) notFound();

  const whatsappUrl = buildWhatsAppUrl(
    parcelInterestMessage(parcel.titulo, parcel.ubicacion),
  );

  const services = parcel.servicios
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Link href="/parcelas" className="text-sm text-muted hover:text-accent">
        ← Volver a parcelas
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <VehicleGallery photos={parcel.fotos} alt={parcel.titulo} />
          <div className="mt-6">
            <StatusBadge status={parcel.estado} />
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              {parcel.titulo}
            </h1>
            <p className="mt-2 text-2xl font-bold text-accent">
              {formatCOP(parcel.precio)}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
              {parcel.descripcion}
            </p>
          </div>
        </div>

        <aside className="space-y-5">
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-lg font-bold">Detalles del lote</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Ubicación</dt>
                <dd className="font-semibold text-right">{parcel.ubicacion}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Área</dt>
                <dd className="font-semibold">{formatArea(parcel.area_m2)}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Precio por m²</dt>
                <dd className="font-semibold text-accent">
                  {formatPricePerSqm(parcel.precio, parcel.area_m2)}
                </dd>
              </div>
            </dl>

            <div className="mt-5 border-t border-border pt-4">
              <p className="mb-2 text-sm font-medium text-muted">Servicios públicos</p>
              <div className="flex flex-wrap gap-2">
                {services.length ? (
                  services.map((service) => (
                    <span
                      key={service}
                      className="rounded-md border border-border bg-background px-2 py-1 text-xs"
                    >
                      {service}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-muted">Sin información</span>
                )}
              </div>
            </div>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary w-full"
          >
            <MessageCircle className="h-4 w-4" />
            Consultar esta parcela por WhatsApp
          </a>
        </aside>
      </div>
    </div>
  );
}
