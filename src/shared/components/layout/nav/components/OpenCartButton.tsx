"use client";

import { ShoppingCart } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useCart } from "@/modules/cart/context/cart-context";
import { cn } from "@/shared/lib/utils";

export default function OpenCartButton() {
  const { itemCount, openDrawer } = useCart();

  return (
    <Button
      variant="ghost"
      className="relative rounded-sm p-2"
      onClick={openDrawer}
      aria-label={itemCount > 0 ? `Open cart — ${itemCount} item${itemCount !== 1 ? "s" : ""}` : "Open cart"}
    >
      <ShoppingCart className="size-6" />

      {/* badge — only renders when cart has items */}
      {itemCount > 0 && (
        <span
          className={cn(
            "absolute -top-0.5 -right-0.5",
            "flex h-4 w-4 items-center justify-center",
            "rounded-full bg-primary text-[10px] font-semibold text-background",
            // shrink the font for 3+ digit counts
            itemCount > 99 && "text-[8px]",
          )}
          aria-hidden="true" // screen readers get the count from aria-label above
        >
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
    </Button>
  );
}
