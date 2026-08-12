"use client";
import SectionHeading from "@/shared/components/shared/SectionHeading";
import SectionWrapper from "@/shared/components/shared/SectionWrapper";
import { Button } from "@/shared/components/ui/button";
import { P } from "@/shared/components/ui/Typography";
import Image from "next/image";
import spreadImage from "../../../../public/images/spread_img.png";
import { useRouter } from "next/navigation";
import { MoveRightIcon } from "lucide-react";

export default function KnowUs() {
  const router = useRouter();
  return (
    <SectionWrapper className="flex flex-col items-center gap-6 md:flex-row md:justify-around">
      <article className="section-content md:max-w-90 lg:max-w-125">
        <SectionHeading caption="Rooted in real goodness">Get to know us</SectionHeading>
        <P>
          It all started with a simple love for peanuts – roasted to perfection, ground with care, and shared around the
          table. What began as a small family recipe has grown into a community of peanut butter lovers who believe that
          the best things in life are natural, simple, and shared. Every jar we craft carries that same spirit of home
          and togetherness, a taste of tradition made for today. With each spoonful, you’re not just enjoying peanut
          butter—you’re joining a family that celebrates real, wholesome goodness.
        </P>
        <Button onClick={() => router.push("/about")} variant="outline">
          Learn more
          <MoveRightIcon />
        </Button>
      </article>
      <Image
        src={spreadImage}
        placeholder="blur"
        alt="peanut butter"
        className="md:w-80 md:h-120 w-full h-75 max-w-125 object-cover radius-card bg-secondary"
      />
    </SectionWrapper>
  );
}
