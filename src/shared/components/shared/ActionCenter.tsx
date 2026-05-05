"use client";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { H3, P } from "../ui/Typography";
import SectionWrapper from "./SectionWrapper";
import Image from "next/image";

export default function ActionCenter() {
  const router = useRouter();
  return (
    <div className="w-full relative sm:h-70 h-65 overflow-hidden">
      <Image
        src="/images/cta-peanuts.png"
        alt="peanuts"
        fill
        className="absolute top-0 left-0 object-cover"
        sizes="(max-width:768px) 100vw, 50vw"
      />
      <SectionWrapper className="flex z-50 relative justify-center h-full flex-col gap-4">
        <div className="flex flex-col gap-2 text-background max-w-85">
          <H3 className="text-background">Pure. Natural. Wholesome</H3>
          <P>Quality peanut products made for everyday healthy living.</P>
        </div>
        <Button onClick={() => router.push("/products")} variant="accent">
          Explore Our products
        </Button>
      </SectionWrapper>
    </div>
  );
}
