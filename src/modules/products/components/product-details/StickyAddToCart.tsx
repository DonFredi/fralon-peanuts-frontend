// modules/products/components/product-detail/StickyAddToCart.tsx
"use client";

import { Minus, Plus, ShoppingCart } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useCart } from "@/modules/cart/context/cart-context";
import type { ProductDetail } from "../../repository/product-detail.repository";
import type { ProductVariant } from "../../types/products.types";

type Variant = ProductVariant;

interface StickyAddToCartProps {
  variant: ProductVariant;
}

export default function StickyAddToCart({ variant }: StickyAddToCartProps) {
  const { items, addToCart, updateQuantity, isMutating, quantity, inCart } = useCart();

  const isOos = !variant.available;
  const handleAddToCart = () => {
    addToCart(variant.id, variant.product_id);
  };

  const handleUpdateQuantity = () => {
    updateQuantity(variant.id, quantity(variant));
  };

  return (
    <div
      className={[
        // mobile only — hidden on md and up
        "md:hidden",
        "fixed bottom-0 left-0 right-0 z-50",
        "border-t bg-background/95 backdrop-blur-sm",
        "px-6 py-3 shadow-lg",
        "flex items-center justify-between gap-4",
      ].join(" ")}
    >
      {/* ── Left — variant name + price ── */}
      <div className="min-w-0">
        <p className="text-sm text-muted-foreground truncate">{variant.name}</p>
        <p className="text-xl font-bold">KSH {variant.price_ksh.toLocaleString()}</p>
      </div>

      {/* ── Right — CTA ── */}
      <div className="shrink-0">
        {isOos ? (
          <Button size="sm" disabled>
            Out of stock
          </Button>
        ) : inCart(variant.id) ? (
          <div className="flex items-center rounded-lg p-1 border">
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-r-none" onClick={handleUpdateQuantity}>
              <Minus className="h-4 w-4" />
              <span className="sr-only">Decrease quantity</span>
            </Button>
            <span className="w-10 text-center text-sm font-semibold">{quantity(variant)}</span>
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-l-none" onClick={handleUpdateQuantity}>
              <Plus className="h-4 w-4" />
              <span className="sr-only">Increase quantity</span>
            </Button>
          </div>
        ) : (
          <Button onClick={handleAddToCart} className="gap-x-3">
            <ShoppingCart className="size-4" />
            Add to cart
          </Button>
        )}
      </div>
    </div>
  );
}
