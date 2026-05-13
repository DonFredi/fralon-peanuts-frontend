import SectionWrapper from "@/shared/components/shared/SectionWrapper";
import OrderHistoryItem from "../components/OrderHistoryItem";

export default function OrderHistorySection() {
  return (
    <SectionWrapper>
      <div className="max-w-210 mx-auto flex flex-col gap-4">
        {[...Array(16)].map((_, index) => (
          <OrderHistoryItem key={index} />
        ))}
      </div>
    </SectionWrapper>
  );
}
