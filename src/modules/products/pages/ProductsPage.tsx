// modules/products/pages/storefront-products-page.tsx
"use client";

import { ProductsGrid, ProductsGridSkeleton } from "../components/ProductGrid";
import { useStorefrontVariants } from "../hooks/use-storefront-variants";
import { toast } from "sonner";
import Link from "next/link";

const toCategorySlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const getCategoryName = (category: unknown) => {
  if (Array.isArray(category)) {
    const firstCategory = category[0];
    return typeof firstCategory === "object" && firstCategory && "name" in firstCategory
      ? String(firstCategory.name ?? "")
      : "";
  }

  return typeof category === "object" && category && "name" in category ? String(category.name ?? "") : "";
};

export default function StorefrontProductsPage({ category }: { category?: string }) {
  const { data: variants, isLoading } = useStorefrontVariants();

  const handleAddToCart = (variantId: string) => {
    // wire to your cart mutation when ready
    toast.success("Added to cart");
    console.log("add to cart:", variantId);
  };

  const filteredVariants = category
    ? variants?.filter((variant) => toCategorySlug(getCategoryName(variant.products?.categories)) === category)
    : variants;
  const hasVariants = (filteredVariants?.length ?? 0) > 0;
  const categoryName = category?.split("-").map((word) => `${word[0]?.toUpperCase() ?? ""}${word.slice(1)}`).join(" ");

  return (
    <div className="space-y-4 p-4 md:p-6">
      {category && (
        <div className="mx-auto flex w-[92%] max-w-300 items-center justify-between gap-4">
          <p className="text-body-lg font-semibold text-foreground">{categoryName}</p>
          <Link href="/products" className="text-body-sm font-semibold text-primary underline-offset-4 hover:underline">
            View all products
          </Link>
        </div>
      )}
      {isLoading && <ProductsGridSkeleton />}

      {!isLoading && !hasVariants && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
          <p className="text-sm font-medium">{category ? `No ${categoryName} products available` : "No products available"}</p>
          <p className="text-xs text-muted-foreground mt-1">Check back soon.</p>
        </div>
      )}

      {!isLoading && hasVariants && <ProductsGrid variants={filteredVariants!} onAddToCart={handleAddToCart} />}
    </div>
  );
}
