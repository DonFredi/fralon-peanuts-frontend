import PageHeading from "@/shared/components/shared/PageHeading";
import PageWrapper from "@/shared/components/shared/PageWrapper";
import SectionWrapper from "@/shared/components/shared/SectionWrapper";
import OrderHistorySection from "./sections/OrderHistorySection";

export default function OrderHistoryPage() {
  return (
    <PageWrapper>
      <SectionWrapper>
        <PageHeading>Order History</PageHeading>
      </SectionWrapper>
      <OrderHistorySection />
    </PageWrapper>
  );
}
