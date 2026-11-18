import { ParcelFilters } from "@/components/parcels/ParcelFilters";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getParcels } from "@/lib/sheets";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

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

  const q = typeof params.q === "string" ? params.q : "";
  const minPrice = typeof params.minPrice === "string" ? params.minPrice : "";
  const maxPrice = typeof params.maxPrice === "string" ? params.maxPrice : "";

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Terrenos"
        title="Parcelas y lotes"
        description="Filtra por ubicación, área, precio y disponibilidad."
      />
      <ParcelFilters
        parcels={parcels}
        initialQuery={q}
        initialMinPrice={minPrice}
        initialMaxPrice={maxPrice}
      />
    </div>
  );
}
