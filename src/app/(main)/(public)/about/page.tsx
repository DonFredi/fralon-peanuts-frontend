import PageWrapper from "@/shared/components/shared/PageWrapper";
import PageHeading from "@/shared/components/shared/PageHeading";
import TeamSection from "./sections/TeamSection";
import SectionWrapper from "@/shared/components/shared/SectionWrapper";
import AboutIntro from "@/modules/about/sections/AboutIntro";
import ProductsSection from "@/modules/products/sections/ProductsSection";
import Identity from "@/modules/about/sections/Identity";

export default function About() {
  return (
    <PageWrapper>
      <SectionWrapper>
        <PageHeading>About Page</PageHeading>
      </SectionWrapper>
      <AboutIntro />
      <Identity />
      <TeamSection />
      <ProductsSection />
    </PageWrapper>
  );
}
