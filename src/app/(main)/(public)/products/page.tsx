import PageWrapper from "@/shared/components/shared/PageWrapper";
import ProductSection from "./sections/ProductSection";
import SectionWrapper from "@/shared/components/shared/SectionWrapper";
import AppImage from "@/shared/components/ui/AppImage";

export default function Products() {
  return (
    <PageWrapper>
      <ProductSection />
      <SectionWrapper>
        <div className="h-100 w-96 relative">
          <AppImage src="/images/watch.webp" alt="product image" />
        </div>
      </SectionWrapper>
    </PageWrapper>
  );
}
