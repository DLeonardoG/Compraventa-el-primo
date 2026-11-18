import { ParcelFilters } from "@/components/parcels/ParcelFilters";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getParcels } from "@/lib/inventory";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Parcelas",
};

export default async function ParcelasPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const parcels = await getParcels();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Inmobiliaria"
        title="Parcelas y lotes"
        description="Filtra por ubicación, área mínima, rango de precio y estado."
      />
      <ParcelFilters
        parcels={parcels}
        initialQuery={typeof params.q === "string" ? params.q : ""}
        initialMinPrice={typeof params.minPrice === "string" ? params.minPrice : ""}
        initialMaxPrice={typeof params.maxPrice === "string" ? params.maxPrice : ""}
        initialAreaMin={typeof params.areaMin === "string" ? params.areaMin : ""}
      />
    </div>
  );
}
