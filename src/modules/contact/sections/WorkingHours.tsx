import SectionHeading from "@/shared/components/shared/SectionHeading";
import SectionWrapper from "@/shared/components/shared/SectionWrapper";
import { P } from "@/shared/components/ui/Typography";
import Info from "../components/Info";

export default function WorkingHours() {
  return (
    <SectionWrapper className="flex flex-wrap items-center justify-center gap-6">
      <div className="section-content">
        <SectionHeading>
          See where the magic
          <br />
          happens
        </SectionHeading>
        <P>
          We invite you to visit our production facility to experience firsthand how our delicious peanut butter is
          made. Witness our passion for quality and learn more about what makes us stand out. Watch as we process your
          order an be the boss, we take pride in gaining customer confidence with this.
        </P>
      </div>
      <div className="radius-card w-80 md:w-72 bg-primary p-6 pt-4 flex flex-col items-center gap-4">
        <span className="radius-btn font-semibold text-foreground bg-secondary px-4 py-1">
          <P>Opening Hours</P>
        </span>
        <Info day="Monday - Friday">8.00am - 7.30pm</Info>
        <Info day="Saturday">9.00am - 7.00pm</Info>
        <Info day="Sunday">Closed</Info>
      </div>
    </SectionWrapper>
  );
}
