import { notFound } from "next/navigation";
import { ParcelDetailClient } from "@/components/parcels/ParcelDetailClient";
import { getParcelBySlug, getParcels } from "@/lib/inventory";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  try {
    const parcels = await getParcels();
    return parcels.map((parcel) => ({ slug: parcel.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  try {
    const parcel = await getParcelBySlug(slug);
    if (!parcel) return { title: "Parcela no encontrada" };
    return { title: parcel.titulo };
  } catch {
    return { title: "Parcela" };
  }
}

export default async function ParcelDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const parcel = await getParcelBySlug(slug);
  if (!parcel) notFound();

  return <ParcelDetailClient parcel={parcel} />;
}
