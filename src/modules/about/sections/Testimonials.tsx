import SectionHeading from "@/shared/components/shared/SectionHeading";
import SectionWrapper from "@/shared/components/shared/SectionWrapper";
import TestimonialsCarousel from "../components/TestimonialsCarousel";
import QuotesIcon from "../icons/QuotesIcon";

export default function Testimonials() {
  return (
    <SectionWrapper className="section-wrapper gap-4 overflow-x-hidden">
      <SectionHeading
        caption="Loved by peanut people"
        className="text-center"
        containerClassName="items-center text-center"
      >
        What our customers
        <br /> say about us
      </SectionHeading>
      <QuotesIcon />
      <div className="max-w-full">
        <TestimonialsCarousel />
      </div>
    </SectionWrapper>
  );
}
