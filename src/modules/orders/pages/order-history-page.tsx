import PageWrapper from "@/shared/components/shared/PageWrapper";
import PageHero from "@/shared/components/layout/PageHero";
import OrderHistorySection from "../sections/OrderHistorySection";

export default function OrderHistoryPage() {
  return (
    <PageWrapper>
      <PageHero title="My Orders" />
      <OrderHistorySection />
    </PageWrapper>
  );
}
