import { FeaturedParcels } from "@/components/home/FeaturedParcels";
import { FeaturedVehicles } from "@/components/home/FeaturedVehicles";
import { HeroSearch } from "@/components/home/HeroSearch";
import { PrestigeBanner } from "@/components/home/PrestigeBanner";
import { TrustSection } from "@/components/home/TrustSection";
import { getFeaturedParcels, getFeaturedVehicles } from "@/lib/sheets";

export default async function HomePage() {
  const [vehicles, parcels] = await Promise.all([
    getFeaturedVehicles(),
    getFeaturedParcels(),
  ]);

  return (
    <>
      <HeroSearch />
      <FeaturedVehicles vehicles={vehicles} />
      <PrestigeBanner />
      <FeaturedParcels parcels={parcels} />
      <TrustSection />
    </>
  );
}
