import { BrandQuickFilters } from "@/components/home/BrandQuickFilters";
import { FeaturedParcels } from "@/components/home/FeaturedParcels";
import { FeaturedVehicles } from "@/components/home/FeaturedVehicles";
import { HeroSearch } from "@/components/home/HeroSearch";
import { PrestigeBanner } from "@/components/home/PrestigeBanner";
import { TrustSection } from "@/components/home/TrustSection";
import {
  getFeaturedParcels,
  getFeaturedVehicles,
  getVehicles,
} from "@/lib/inventory";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [vehicles, featuredVehicles, parcels] = await Promise.all([
    getVehicles(),
    getFeaturedVehicles(),
    getFeaturedParcels(),
  ]);

  return (
    <>
      <HeroSearch vehicles={vehicles} />
      <BrandQuickFilters vehicles={vehicles} />
      <FeaturedVehicles vehicles={featuredVehicles} />
      <PrestigeBanner />
      <FeaturedParcels parcels={parcels} />
      <TrustSection />
    </>
  );
}
