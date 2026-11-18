import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ParcelCard } from "@/components/parcels/ParcelCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Parcel } from "@/types/inventory";

export function FeaturedParcels({ parcels }: { parcels: Parcel[] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-end justify-between gap-4">
        <SectionHeading
          eyebrow="Inmobiliaria"
          title="Parcelas y Lotes Destacados"
          description="Área, servicios, topografía y documentación claros desde la ficha."
          className="mb-0"
        />
        <Link
          href="/parcelas"
          className="hidden items-center gap-1 text-sm font-semibold text-accent hover:underline sm:inline-flex"
        >
          Ver parcelas
          <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
        </Link>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {parcels.map((parcel) => (
          <ParcelCard key={parcel.id} parcel={parcel} />
        ))}
      </div>
    </section>
  );
}
