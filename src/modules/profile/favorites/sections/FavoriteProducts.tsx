import ProductCard from "@/modules/products/components/ProductCard";
import SectionWrapper from "@/shared/components/shared/SectionWrapper";

export default function FavoriteProducts() {
  return (
    <SectionWrapper className="">
      <div className="flex flex-wrap bg-red-400 justify-center gap-4 md:gap-6">
        {[...Array(5)].map((_, index) => (
          <ProductCard key={index} />
        ))}
      </div>
    </SectionWrapper>
  );
}
