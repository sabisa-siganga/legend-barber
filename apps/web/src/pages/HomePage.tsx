import { useEffect } from "react";
import { BrandStatement } from "../components/home/BrandStatement";
import { CraftSection } from "../components/home/CraftSection";
import { FeaturedServices } from "../components/home/FeaturedServices";
import { HeroSection } from "../components/home/HeroSection";
import { VisitSection } from "../components/home/VisitSection";
import { shopDetails } from "../lib/shopDetails";

export function HomePage() {
  useEffect(() => {
    document.title = shopDetails.documentTitle;
  }, []);

  return (
    <>
      <HeroSection />
      <BrandStatement />
      <FeaturedServices />
      <CraftSection />
      <VisitSection />
    </>
  );
}
