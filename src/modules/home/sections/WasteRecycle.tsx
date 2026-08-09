import SectionWrapper from "@/shared/components/shared/SectionWrapper";
import { H3, P } from "@/shared/components/ui/Typography";
import RecycleIcon from "../icons/RecycleIcon";

export default function WasteRecycle() {
  return (
    <SectionWrapper className="">
      <div className="flex flex-col items-center gap-4 md:gap-6">
        <RecycleIcon />
        <div className="flex flex-col items-center gap-2">
          <H3 className="text-center max-w-100">Our Zero-Waste Promise, We Give Nuts a Second Life</H3>
          <P className="text-center max-w-150">
            Our peanut skins, shells, and processing leftovers are collected, sorted, and repurposed for animal feed,
            organic additives and other eco-friendly uses. Sustainable for us. Valuable for you.
          </P>
        </div>
      </div>
    </SectionWrapper>
  );
}
