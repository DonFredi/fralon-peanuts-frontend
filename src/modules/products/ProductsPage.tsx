import SectionWrapper from "@/shared/components/shared/SectionWrapper";
import ProductCard from "./components/ProductCard";

export default function ProductsPage() {
  return (
    <SectionWrapper className="flex flex-wrap gap-4 md:gap-6 justify-center items-center">
      {[...Array(12)].map((_, index) => (
        <ProductCard key={index} />
      ))}
    </SectionWrapper>
  );
}
