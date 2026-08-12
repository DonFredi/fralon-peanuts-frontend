// modules/products/components/storefront/ProductCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { ImageIcon, ShoppingCart } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { getVariantImageUrl } from "../lib/product-list.helpers";
import type { StorefrontVariant } from "../repository/products.repository";
import AddToCartBtn from "./AddToCartBtn";

interface ProductCardProps {
  variant: StorefrontVariant;
  onAddToCart?: (variantId: string) => void;
}

export default function ProductCard({ variant, onAddToCart }: ProductCardProps) {
  const product = variant.products;
  const imageUrl = getVariantImageUrl(variant);
  const isOos = !variant.available;
  const detailHref = `/products/${product.slug}`;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // don't trigger the card's Link
    onAddToCart?.(variant.id);
  };

  return (
    <div className="group flex flex-col rounded-lg border border-foreground-border bg-background overflow-hidden transition-shadow hover:shadow-md">
      {/* ── Image — full card is not a link; only image+text area is ── */}
      <Link href={detailHref} className="block">
        <div className="relative aspect-square w-full overflow-hidden bg-muted">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={`${product?.name ?? ""} ${variant.name}`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <ImageIcon className="h-8 w-8 text-foreground-muted" />
            </div>
          )}

          {/* out of stock badge — on image so it's caught while scanning */}
          {isOos && (
            <div className="absolute top-2 left-2 rounded-full bg-foreground/75 px-2.5 py-0.5 text-[10px] font-medium text-background backdrop-blur-sm">
              Out of stock
            </div>
          )}
        </div>

        {/* ── Text info ── */}
        <div className="p-3 pb-2 space-y-0.5">
          {/* product name — what it is */}
          <p className="text-sm font-medium leading-snug line-clamp-1 text-foreground">{product?.name ?? "—"}</p>

          {/* variant name — which one */}
          <p className="text-xs text-muted-foreground">{variant.name}</p>

          {/* price — slightly elevated: one step up in size + semibold */}
          <p className="text-base font-semibold text-foreground pt-1">KSH {variant.price_ksh.toLocaleString()}</p>
        </div>
      </Link>

      {/* ── CTA — outside Link to avoid nested interactive elements ── */}
      <div className="px-2 pb-3 mt-auto">
        {isOos ? (
          <Button size="sm" className="w-full" disabled aria-label={`${product?.name} ${variant.name} is out of stock`}>
            Out of stock
          </Button>
        ) : (
          <AddToCartBtn
            variantId={variant.id}
            productId={variant.product_id}
            size="sm"
            className="w-full"
            aria-label={`Add ${product?.name} ${variant.name} to cart`}
          />
        )}
      </div>
    </div>
  );
}
