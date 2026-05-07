import SectionHeading from "@/shared/components/shared/SectionHeading";
import SectionWrapper from "@/shared/components/shared/SectionWrapper";
import { P } from "@/shared/components/ui/Typography";
import ProductCard from "../components/ProductCard";

export default function ProductsSection() {
  return (
    <div className="flex flex-col gap-6">
      <SectionWrapper className="section-content gap-2 items-center">
        <SectionHeading>Our products</SectionHeading>
        <P className="text-center">
          At Fralon Peanuts, we take pride in crafting the finest peanut-based products that are perfect for every
          moment—from quick snacks to hearty meals. Each product is made with premium-grade peanuts, roasted to
          perfection, and packed with love and nutrition.
        </P>
      </SectionWrapper>
      <div className="flex flex-wrap gap-4 px-6 self-center justify-center items-center">
        {[...Array(4)].map((_, index) => (
          <ProductCard key={index} />
        ))}
      </div>
    </div>
  );
}
