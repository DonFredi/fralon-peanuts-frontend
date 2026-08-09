// modules/cart/components/CartDrawer.tsx
"use client";

import { ShoppingBag } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/shared/components/ui/sheet";
import { Button } from "@/shared/components/ui/button";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { useCart } from "../context/cart-context";
import CartItem from "./CartItem";
import CartItemSkeleton from "./CartItemSkeleton";
import CartEmpty from "./CartEmpty";
import CartSummary from "./CartSummary";
import { H3 } from "@/shared/components/ui/Typography";

export default function CartDrawer() {
  const {
    items,
    isLoading,
    isMutating,
    itemCount,
    subtotal,
    isDrawerOpen,
    closeDrawer,
    updateQuantity,
    removeFromCart,
  } = useCart();

  return (
    <Sheet
      open={isDrawerOpen}
      onOpenChange={(open) => {
        if (!open) closeDrawer();
      }}
    >
      <SheetContent className="flex flex-col w-full sm:max-w-md p-0" onOpenAutoFocus={(e) => e.preventDefault()}>
        {/* ── Header ── */}
        <SheetHeader className="px-4 pt-5 pb-3 border-b">
          <SheetTitle className="flex items-center gap-2 text-base">
            <ShoppingBag className="size-4.5" />
            <span className="text-xl font-semibold">Your cart</span>
            {itemCount > 0 && (
              <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-medium text-background">
                {itemCount}
              </span>
            )}
          </SheetTitle>
          <SheetDescription className="sr-only">Review and manage items in your cart</SheetDescription>
        </SheetHeader>

        {/* ── Body ── */}
        {isLoading ? (
          <div className="flex-1 px-4 overflow-auto">
            {[...Array(3)].map((_, i) => (
              <CartItemSkeleton key={i} />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <CartEmpty onClose={closeDrawer} />
          </div>
        ) : (
          <ScrollArea className="flex-1 px-4">
            {items.map((item) => (
              <CartItem key={item.cartItemId} item={item} variant="compact" onRemove={removeFromCart} />
            ))}
          </ScrollArea>
        )}

        {/* ── Footer ── */}
        {!isLoading && items.length > 0 && (
          <div className="px-4 pb-6 pt-3 bg-background">
            <CartSummary subtotal={subtotal} itemCount={itemCount} isMutating={isMutating} onCheckout={closeDrawer} />
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
