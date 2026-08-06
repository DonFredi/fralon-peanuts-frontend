// modules/cart/pages/cart-page.tsx
"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useCart } from "../context/cart-context";
import CartItem from "../components/CartItem";
import CartItemSkeleton from "../components/CartItemSkeleton";
import CartEmpty from "../components/CartEmpty";
import CartSummary from "../components/CartSummary";
import SectionWrapper from "@/shared/components/shared/SectionWrapper";
import PageWrapper from "@/shared/components/shared/PageWrapper";
import PageHero from "@/shared/components/layout/PageHero";

export default function CartPage() {
  const { items, isLoading, isMutating, itemCount, subtotal, updateQuantity, removeFromCart } = useCart();

  return (
    <PageWrapper>
      <PageHero title="Shopping Cart" />
      <SectionWrapper className="">
        {/* ── Back button ── */}
        {/* <Button variant="ghost" size="sm" className="gap-1.5 -ml-2 mb-6 text-muted-foreground" asChild>
          <Link href="/products">
            <ArrowLeft className="h-4 w-4" />
            Continue shopping
          </Link>
        </Button> */}

        {/* ── Title ── */}
        <h2 className="text-xl font-semibold mb-6">
          {isLoading
            ? "Your cart"
            : itemCount > 0
              ? `Your cart (${itemCount} item${itemCount !== 1 ? "s" : ""})`
              : "Your cart"}
        </h2>

        {/* ── Loading ── */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-8">
            <div>
              {[...Array(3)].map((_, i) => (
                <CartItemSkeleton key={i} />
              ))}
            </div>
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-11 w-full rounded-md mt-2" />
            </div>
          </div>
        )}

        {/* ── Empty ── */}
        {!isLoading && items.length === 0 && <CartEmpty />}

        {/* ── Items + summary ── */}
        {!isLoading && items.length > 0 && (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_320px] md:items-start">
            {/* ── Item list ── */}
            <div>
              {items.map((item) => (
                <CartItem key={item.cartItemId} item={item} variant="full" onRemove={removeFromCart} />
              ))}
            </div>

            {/* ── Order summary — sticky on desktop ── */}
            <div className="rounded-xl border p-4 md:sticky md:top-6">
              <p className="text-sm font-semibold mb-4">Order summary</p>
              <CartSummary subtotal={subtotal} itemCount={itemCount} isMutating={isMutating} />
            </div>
          </div>
        )}

        {/* ── Sticky summary bar — mobile only ── */}
        {!isLoading && items.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur-sm px-4 py-3 md:hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">Subtotal</span>
              <span className="text-sm font-bold">KSH {subtotal.toLocaleString()}</span>
            </div>
            <Button className="w-full" disabled={isMutating} asChild>
              <Link href="/checkout">Proceed to checkout</Link>
            </Button>
          </div>
        )}
      </SectionWrapper>
    </PageWrapper>
  );
}
