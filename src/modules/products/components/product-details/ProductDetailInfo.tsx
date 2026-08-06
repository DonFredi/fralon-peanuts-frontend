// modules/products/components/product-detail/ProductDetailInfo.tsx
"use client";

import { Minus, Plus, ShoppingCart } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { useCart } from "@/modules/cart/context/cart-context";
import { Separator } from "@/shared/components/ui/separator";
import ProductVariantSelector from "./ProductVariantSelector";
import type { ProductDetail } from "../../repository/product-detail.repository";
import FavButton from "../FavButton";
import type { ProductVariant } from "../../types/products.types";
import AddToCartBtn from "../AddToCartBtn";

interface ProductDetailInfoProps {
  product: ProductDetail;
  selectedVariant: ProductVariant | null;
  onVariantChange: (id: string) => void;
}

export default function ProductDetailInfo({ product, selectedVariant, onVariantChange }: ProductDetailInfoProps) {
  const { items, addToCart, updateQuantity, isMutating, inCart, quantity } = useCart();

  const isOos = !selectedVariant?.available;

  const stockStatus = selectedVariant
    ? selectedVariant.stock_quantity === 0
      ? "out"
      : selectedVariant.stock_quantity <= 10
        ? "low"
        : "ok"
    : "out";

  return (
    <div className="flex flex-col gap-5">
      {/* ── 1. Name ── */}
      <div className="space-y-4 border-b border-foreground-muted pb-4 ">
        <div className="flex gap-3">
          <div className="flex-1">
            {product.categories && (
              <p className="text-xs uppercase tracking-widest text-accent">{product.categories.name}</p>
            )}
            <h1 className="text-2xl font-semibold leading-tight">{product.name}</h1>
          </div>
          <FavButton />
        </div>

        {/* ── 2. Price — elevated weight ── */}
        {selectedVariant && (
          <p className="text-3xl font-bold tracking-tight">KSH {selectedVariant.price_ksh.toLocaleString()}</p>
        )}
      </div>

      {/* ── 3. Variant selector ── */}
      <ProductVariantSelector
        variants={product.product_variants}
        selectedVariantId={selectedVariant?.id ?? null}
        onChange={onVariantChange}
      />

      {/* ── 4. Stock indicator ── */}
      {selectedVariant && (
        <div>
          {stockStatus === "out" && <Badge className="bg-destructive/10 text-destructive border-0">Out of stock</Badge>}
          {stockStatus === "low" && (
            <Badge className="bg-amber-500/10 text-amber-600 border-0">
              Only {selectedVariant.stock_quantity} left
            </Badge>
          )}
          {stockStatus === "ok" && <Badge className="bg-success/10 text-green-700 text-sm border-0">In stock</Badge>}
        </div>
      )}

      {/* ── 5. CTA — desktop only, sticky bar handles mobile ── */}
      <div className="hidden md:block">
        {isOos ? (
          <Button className="w-full" size="lg" disabled>
            Out of stock
          </Button>
        ) : inCart(selectedVariant.id) ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center rounded-md border">
              <Button variant="ghost" size="icon" className="h-11 w-11 rounded-r-none" onClick={() => updateQuantity}>
                <Minus className="h-4 w-4" />
                <span className="sr-only">Decrease quantity</span>
              </Button>
              <span className="w-12 text-center text-sm font-semibold">{quantity(selectedVariant)}</span>
              <Button variant="ghost" size="icon" className="h-11 w-11 rounded-l-none" onClick={() => updateQuantity}>
                <Plus className="h-4 w-4" />
                <span className="sr-only">Increase quantity</span>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">In your cart</p>
          </div>
        ) : (
          <AddToCartBtn className="w-full" productId={selectedVariant.product_id} variantId={selectedVariant.id} />
        )}
      </div>
    </div>
  );
}
