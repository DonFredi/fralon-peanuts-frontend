import SectionHeading from "@/shared/components/shared/SectionHeading";
import SectionWrapper from "@/shared/components/shared/SectionWrapper";
import { P } from "@/shared/components/ui/Typography";

export default function Help() {
  return (
    <SectionWrapper>
      <div className="section-head-start">
        <SectionHeading>Help</SectionHeading>
        <P>
          For any technical inquiries about our platform, you can get in touch with our Technical team of Engineers
          through the Email <span className="text-primary font-semibold underline">scripttag@gmail.com</span>
        </P>
      </div>
    </SectionWrapper>
  );
}
