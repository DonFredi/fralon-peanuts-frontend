import SectionHeading from "@/shared/components/shared/SectionHeading";
import SectionWrapper from "@/shared/components/shared/SectionWrapper";
import CategoryCard from "../components/CategoryCard";
import { P } from "@/shared/components/ui/Typography";
import peanutButterImage from "../../../../public/images/spread_img.png";
import roastedPeanutsImage from "../../../../public/images/cta-peanuts.png";

const categories = [
  {
    title: "Peanut Butter",
    description: "Smooth, nutty spreads made for every kind of craving.",
    href: "/products?category=peanut-butter",
    image: peanutButterImage,
    imagePosition: "center 70%",
  },
  {
    title: "Peanut Flour",
    description: "A naturally protein-rich pantry essential for baking and cooking.",
    href: "/products?category=peanut-flour",
    image: roastedPeanutsImage,
    imagePosition: "right center",
  },
  {
    title: "Roasted Peanuts",
    description: "Golden, satisfying peanuts for simple, everyday snacking.",
    href: "/products?category=roasted-peanuts",
    image: roastedPeanutsImage,
    imagePosition: "right center",
  },
];

export default function Categories() {
  return (
    <SectionWrapper className="flex flex-col gap-6 py-8 sm:gap-8 sm:py-12 lg:py-16">
      <div className="mx-auto flex max-w-145 flex-col items-center gap-2 text-center">
        <SectionHeading caption="Made for every moment" containerClassName="items-center text-center">
          Everything peanuts, your way
        </SectionHeading>
        <P className="max-w-120 text-center text-foreground-caption">
          From the pantry to snack time, explore our favourite ways to enjoy the goodness of peanuts.
        </P>
      </div>

      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
        {categories.map((category) => (
          <CategoryCard key={category.title} {...category} />
        ))}
      </div>
    </SectionWrapper>
  );
}
