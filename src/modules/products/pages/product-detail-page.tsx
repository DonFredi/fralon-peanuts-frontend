// modules/products/pages/product-detail-page.tsx
"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useProductDetail } from "../hooks/use-product-detail";
import { useCartStub } from "@/modules/cart/hooks/use-cart-stub";
import ProductDetailGallery from "../components/product-details/ProductDetailGallery";
import ProductDetailInfo from "../components/product-details/ProductDetailInfo";
import StickyAddToCart from "../components/product-details/StickyAddToCart";
import ProductDetailDescription from "../components/product-details/ProductDetailDescription";
import ProductDetailSkeleton from "../components/product-details/ProductDetailSkeleton";
import { Button } from "@/shared/components/ui/button";
import SectionWrapper from "@/shared/components/shared/SectionWrapper";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const productId = params.slug as string;
  const variantParam = searchParams.get("variant");

  const { data: product, isLoading, isError } = useProductDetail(productId);
  const cart = useCartStub();

  // active variants first, then inactive — for selector ordering
  const sortedVariants = useMemo(() => {
    if (!product) return [];
    return [...product.product_variants].sort((a, b) => {
      if (a.is_active && !b.is_active) return -1;
      if (!a.is_active && b.is_active) return 1;
      return 0;
    });
  }, [product]);

  // resolve selected variant from URL param, fallback to first active
  const selectedVariant = useMemo(() => {
    if (!product) return null;
    if (variantParam) {
      const found = product.product_variants.find((v) => v.id === variantParam);
      if (found) return found;
    }
    return sortedVariants.find((v) => v.is_active) ?? sortedVariants[0] ?? null;
  }, [product, variantParam, sortedVariants]);

  const handleVariantChange = (id: string) => {
    const next = new URLSearchParams(searchParams);
    next.set("variant", id);
    router.push(`?${next.toString()}`, { scroll: false });
  };

  // derive which images to show — variant-specific first, then product-level
  const displayImages = useMemo(() => {
    if (!product) return [];

    const sorted = [...product.product_images].sort((a, b) => {
      if (a.sort_order === null && b.sort_order === null) return 0;
      if (a.sort_order === null) return 1;
      if (b.sort_order === null) return -1;
      return a.sort_order - b.sort_order;
    });

    if (selectedVariant) {
      const variantSpecific = sorted.filter((img) => img.variant_id === selectedVariant.id);
      if (variantSpecific.length > 0) return variantSpecific;
    }

    return sorted.filter((img) => img.variant_id === null);
  }, [product, selectedVariant]);

  if (isLoading) return <ProductDetailSkeleton />;

  if (isError || !product) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center px-4">
        <p className="text-sm font-medium">Product not found</p>
        <p className="text-xs text-muted-foreground mt-1">This product may no longer be available.</p>
        <Button variant="outline" size="sm" className="mt-4" asChild>
          <Link href="/products">Back to products</Link>
        </Button>
      </div>
    );
  }

  return (
    // pb-24 reserves space so sticky CTA never covers content on mobile
    <SectionWrapper className="relative pb-24 md:pb-0">
      <div className="max-w-5xl mx-auto px-4 py-6 md:py-10">
        {/* ── Breadcrumb ── */}
        <Button variant="ghost" size="sm" className="gap-1.5 -ml-2 mb-6 text-muted-foreground" asChild>
          <Link href="/products">
            <ArrowLeft className="h-4 w-4" />
            Back to products
          </Link>
        </Button>

        {/* ── Main layout — stacks on mobile, side-by-side on md+ ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <ProductDetailGallery images={displayImages} productName={product.name} />
          <ProductDetailInfo
            product={product}
            selectedVariant={selectedVariant}
            onVariantChange={handleVariantChange}
          />
        </div>

        {/* ── Below the fold ── */}
        <ProductDetailDescription description={product.description} metadata={product.metadata} />
      </div>

      {/* ── Sticky CTA — mobile only (md:hidden is inside the component) ── */}
      {selectedVariant && <StickyAddToCart variant={selectedVariant} />}
    </SectionWrapper>
  );
}
