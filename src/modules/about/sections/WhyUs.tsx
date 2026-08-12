import SectionHeading from "@/shared/components/shared/SectionHeading";
import SectionWrapper from "@/shared/components/shared/SectionWrapper";
import { P } from "@/shared/components/ui/Typography";
import { whyUs } from "../content/about-content";
import ReasonCard from "../components/ReasonCard";

export default function WhyUs() {
  return (
    <SectionWrapper className="section-wrapper">
      <div className="section-head">
        <SectionHeading caption="Made with purpose" containerClassName="items-center text-center">
          Why choose us
        </SectionHeading>
        <P className="text-center">{whyUs.intro}</P>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {whyUs.reasons.map((reason) => (
          <ReasonCard reason={reason} key={reason.id} />
        ))}
      </div>
    </SectionWrapper>
  );
}
