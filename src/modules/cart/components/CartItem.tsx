// modules/cart/components/CartItem.tsx
"use client";

import Image from "next/image";
import { Minus, Plus, Trash2, ImageIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import type { CartDisplayItem } from "../types/cart.types";
import { useCart } from "../context/cart-context";

interface CartItemProps {
  item: CartDisplayItem;
  onRemove: (variantId: string) => void;
  /** compact = drawer, full = page */
  variant?: "compact" | "full";
}

export default function CartItem({ item, onRemove, variant = "full" }: CartItemProps) {
  const { isMutating, addToCart, removeFromCart } = useCart();
  const isCompact = variant === "compact";
  const isOos = !item.available;
  const atMaxStock = item.quantity >= item.stockQuantity;

  return (
    <div
      className={cn(
        "flex items-start gap-3 py-4 border-b border-foreground-border last:border-0",
        isOos && "opacity-60",
      )}
    >
      {/* ── Image ── */}
      <div
        className={cn(
          "shrink-0 overflow-hidden rounded-lg border border-foreground-border bg-muted",
          isCompact ? "h-16 w-16" : "h-20 w-20",
        )}
      >
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.productName}
            width={isCompact ? 64 : 80}
            height={isCompact ? 64 : 80}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ImageIcon className="h-5 w-5 text-foreground-muted" />
          </div>
        )}
      </div>

      {/* ── Info + controls ── */}
      <div className="flex flex-1 flex-col gap-1 min-w-0">
        {/* product + variant name */}
        <p className="text-sm font-medium leading-tight line-clamp-1">{item.productName}</p>
        <p className="text-xs text-muted-foreground">{item.variantName}</p>

        {/* out of stock notice */}
        {isOos && <p className="text-xs text-destructive font-medium">Out of stock — remove to continue</p>}

        {/* quantity stepper */}
        {!isOos && (
          <div className="flex items-center gap-1 mt-1">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-7 w-7"
              disabled={isMutating || item.quantity <= 1}
              onClick={() => removeFromCart(item.variantId)}
            >
              <Minus className="h-3 w-3" />
              <span className="sr-only">Decrease quantity</span>
            </Button>

            <span className="w-7 text-center text-sm font-medium">{item.quantity}</span>

            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-7 w-7"
              disabled={isMutating || atMaxStock}
              onClick={() => addToCart(item.variantId, item.productId)}
              title={atMaxStock ? "Maximum stock reached" : undefined}
            >
              <Plus className="h-3 w-3" />
              <span className="sr-only">Increase quantity</span>
            </Button>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 justify-between items-end">
        {/* ── Remove button ── */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
          disabled={isMutating}
          onClick={() => onRemove(item.variantId)}
        >
          <Trash2 className="size-5 text-destructive" />
          <span className="sr-only">Remove {item.productName}</span>
        </Button>

        {/* price */}
        <p className="text-base font-semibold">KSH {(item.price * item.quantity).toLocaleString()}</p>
      </div>
    </div>
  );
}
