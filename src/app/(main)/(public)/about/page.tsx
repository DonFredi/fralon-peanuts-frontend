import PageWrapper from "@/shared/components/shared/PageWrapper";
import PageHeading from "@/shared/components/shared/PageHeading";
import TeamSection from "./sections/TeamSection";
import SectionWrapper from "@/shared/components/shared/SectionWrapper";
import AboutIntro from "@/modules/about/sections/AboutIntro";
import ProductsSection from "@/modules/products/sections/ProductsSection";

export default function About() {
  return (
    <PageWrapper>
      <SectionWrapper>
        <PageHeading>About Page</PageHeading>
      </SectionWrapper>
      <AboutIntro />
      <TeamSection />
      <ProductsSection />
    </PageWrapper>
  );
}
