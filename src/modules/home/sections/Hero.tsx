import SectionWrapper from "@/shared/components/shared/SectionWrapper";
import NavButton from "@/shared/components/ui/NavButton";
import { H1, P } from "@/shared/components/ui/Typography";
import Image from "next/image";
/* import heroImage from "../../../../public/images/hero_img.png"; */

export default function Hero() {
  return (
    <div className="min-h-[60vh] relative">
      {/* <Image src={heroImage} priority alt="peanut butter" className="absolute inset-0" /> */}
      <SectionWrapper className="">
        <div className="section-content max-w-155">
          <H1>
            Just pure peanut goodness,
            <br /> nothing else
          </H1>
          <P>
            Not Just Any Butter, It's Peanut Perfection. Nutty, But in the Best Way. We offer quality peanut butter
            products. You can get all our products in a store nearby.
          </P>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            <NavButton path="/products" className="w-full sm:w-fit">
              View Products
            </NavButton>
            <NavButton path="/auth/login" variant="outline" className="w-full sm:w-fit">
              Log in
            </NavButton>
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
}
