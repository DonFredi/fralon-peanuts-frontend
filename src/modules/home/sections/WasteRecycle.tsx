import SectionWrapper from "@/shared/components/shared/SectionWrapper";
import { H3, P } from "@/shared/components/ui/Typography";
import RecycleIcon from "../icons/RecycleIcon";

export default function WasteRecycle() {
  return (
    <SectionWrapper className="">
      <div className="flex flex-col md:flex-row md:items-center md:justify-around gap-4 md:gap-6 bg-secondary radius-card p-4 sm:p-6 lg:py-8">
        <RecycleIcon />
        <div className="max-w-150">
          <H3>Our Zero-Waste Promise, We Give Nuts a Second Life</H3>
          <P>
            Our peanut skins, shells, and processing leftovers are collected, sorted, and repurposed for animal feed,
            organic additives and other eco-friendly uses. Sustainable for us. Valuable for you.
          </P>
        </div>
      </div>
    </SectionWrapper>
  );
}
