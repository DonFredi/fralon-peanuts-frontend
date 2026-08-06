import { useCart } from "@/modules/cart/context/cart-context";
import { Button, type buttonVariants } from "@/shared/components/ui/button";
import type { VariantProps } from "class-variance-authority";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

type ButtonProps = {
  variantId: string;
  productId: string;
  variant?: VariantProps<typeof buttonVariants>["variant"];
  size?: VariantProps<typeof buttonVariants>["size"];
  className?: string;
};

export default function AddToCartBtn({ variantId, productId, variant, size, className }: ButtonProps) {
  const { addToCart, openDrawer } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(variantId, productId ?? "").then((wasAdded) => {
      if (wasAdded) openDrawer();
    });
  };

  return (
    <Button className={twMerge("gap-2 py-2", className)} onClick={handleAddToCart} variant={variant} size={size}>
      <ShoppingCart />
      <span className="">Add to cart</span>
    </Button>
  );
}
