import { P } from "@/shared/components/ui/Typography";
import FavButton from "./FavButton";
import AddToCartBtn from "./AddToCartBtn";

export default function ProductCard() {
  return (
    <div className="p-4 border border-primary radius-card gap-2 flex flex-col w-60 h-90">
      <div className="flex-1 relative">
        <FavButton />
      </div>
      <div className="flex w-full flex-col gap-1 items-center">
        <P className="text-body-lg font-bold">Peanut Butter - 800gms</P>
        <small className="text-caption-base text-foreground-muted">Smooth / Crunchy</small>
        <P className="text-body-lg font-semibold">Ksh 550</P>
        <AddToCartBtn />
      </div>
    </div>
  );
}
