import { Button } from "@/shared/components/ui/button";
import { ShoppingBasket } from "lucide-react";

export default function AddToCartBtn() {
  return (
    <Button className="gap-2" variant="ghost">
      <ShoppingBasket />
      <span className="">Add to cart</span>
    </Button>
  );
}
