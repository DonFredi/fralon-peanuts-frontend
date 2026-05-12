import PageHeading from "@/shared/components/shared/PageHeading";
import PageWrapper from "@/shared/components/shared/PageWrapper";
import SectionWrapper from "@/shared/components/shared/SectionWrapper";
import FavoriteProducts from "./sections/FavoriteProducts";

export default function FavoritesPage() {
  return (
    <PageWrapper>
      <SectionWrapper>
        <PageHeading>Favorites</PageHeading>
      </SectionWrapper>
      <FavoriteProducts />
    </PageWrapper>
  );
}
