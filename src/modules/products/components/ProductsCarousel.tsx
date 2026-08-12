// modules/products/components/storefront/ProductsCarousel.tsx
"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/shared/components/ui/carousel";
import { toast } from "sonner";
import ProductCard from "./ProductCard";
import ProductCarouselSkeleton from "./ProductsCarouselSkeleton";
import { useStorefrontVariants } from "../hooks/use-storefront-variants";

export default function ProductsCarousel() {
  const { data: variants, isLoading } = useStorefrontVariants();

  const handleAddToCart = (variantId: string) => {
    // wire to cart mutation when ready
    toast.success("Added to cart");
    console.log("add to cart:", variantId);
  };

  if (isLoading) return <ProductCarouselSkeleton />;

  if (!variants || variants.length === 0) return null;

  return (
    <Carousel opts={{ align: "start", containScroll: "trimSnaps" }} className="flex flex-col gap-5 sm:gap-6">
      <CarouselContent className="flex items-center pl-2">
        {variants.map((variant) => (
          <CarouselItem
            key={variant.id}
            className="basis-1/2 pl-3 sm:basis-1/3 sm:pl-4 md:basis-1/4 lg:basis-1/5 xl:basis-1/6"
          >
            <ProductCard variant={variant} onAddToCart={handleAddToCart} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="flex w-full items-center justify-end gap-2">
        <CarouselPrevious
          variant="ghost"
          className="size-10 border border-primary/25 bg-background text-primary hover:bg-primary hover:text-primary"
        />
        <CarouselNext
          variant="ghost"
          className="size-10 border border-primary/25 bg-background text-primary hover:bg-primary hover:text-primary"
        />
      </div>
    </Carousel>
  );
}
