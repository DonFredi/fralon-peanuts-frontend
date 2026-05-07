import SectionHeading from "@/shared/components/shared/SectionHeading";
import SectionWrapper from "@/shared/components/shared/SectionWrapper";
import { P } from "@/shared/components/ui/Typography";
import { about } from "../content/about-content";
import IdentityCard from "../components/IdentityCard";

export default function Identity() {
  return (
    <SectionWrapper className="flex flex-col gap-8 items-center">
      <div className="section-align items-center gap-2">
        <SectionHeading className="text-center">
          Unveiling our identity,
          <br /> vision and values
        </SectionHeading>
        <P className="text-center">{about.intro}</P>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        <IdentityCard title="Our Vision">{about.identity.vision}</IdentityCard>
        <IdentityCard active title="Our Values">
          {about.identity.values}
        </IdentityCard>
        <IdentityCard title="Our Mission">{about.identity.mission}</IdentityCard>
      </div>
    </SectionWrapper>
  );
}
