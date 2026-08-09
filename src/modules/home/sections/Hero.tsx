import SectionWrapper from "@/shared/components/shared/SectionWrapper";
import { H1, P } from "@/shared/components/ui/Typography";
import Header from "@/shared/components/layout/Header";
import HeroCta from "../components/HeroCta";

export default function Hero() {
  return (
    <div className="relative bg-[url('/images/fralon-hero_img.png')] h-[90vh] bg-cover bg-center overflow-hidden flex flex-col">
      <Header />
      <SectionWrapper className="flex-1 flex items-center">
        <div className="section-content max-w-155">
          <H1>
            Just pure peanut goodness, <span className="text-primary">nothing else</span>
          </H1>
          <P>
            Not Just Any Butter, It's Peanut Perfection. Nutty, But in the Best Way. We offer quality peanut butter
            products. You can get all our products in a store nearby.
          </P>
          <HeroCta />
        </div>
      </SectionWrapper>
    </div>
  );
}
