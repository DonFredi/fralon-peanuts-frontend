import SectionHeading from "@/shared/components/shared/SectionHeading";
import SectionWrapper from "@/shared/components/shared/SectionWrapper";
import AppImage from "@/shared/components/ui/AppImage";
import { P } from "@/shared/components/ui/Typography";

export default function AboutIntro() {
  return (
    <SectionWrapper className="flex flex-col max-w-125 lg:max-w-full lg:flex-row gap-6 justify-center lg:justify-around items-center">
      <div className="radius-card relative w-full h-60 lg:w-82.5 lg:h-90 bg-secondary">
        <AppImage src="/images/story_img.png" alt="Peanuts" />
      </div>
      <div className="section-content lg:max-w-112.5">
        <SectionHeading>Our story</SectionHeading>
        <P>
          Fralon Peanuts was born from a simple idea: to create peanut products that are as wholesome as they are
          delicious. What started as a small kitchen experiment has grown into a beloved brand known for quality,
          authenticity, and heart.Our journey began with a deep love for peanuts and a desire to bring something
          different to the market—products that reflect both traditional goodness and modern-day quality. We believed
          that everyone deserved snacks that are not only tasty but also nourishing and responsibly made.
        </P>
      </div>
    </SectionWrapper>
  );
}
