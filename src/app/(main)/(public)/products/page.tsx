import PageWrapper from "@/shared/components/shared/PageWrapper";
import SectionWrapper from "@/shared/components/shared/SectionWrapper";
import PageHeading from "@/shared/components/shared/PageHeading";
import ProductsPage from "@/modules/products/ProductsPage";

export default function Products() {
  return (
    <PageWrapper>
      <SectionWrapper>
        <PageHeading>Products</PageHeading>
      </SectionWrapper>
      <ProductsPage />
    </PageWrapper>
  );
}
