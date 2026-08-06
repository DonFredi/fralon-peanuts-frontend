// modules/cart/hooks/use-cart-display-data.ts
import { useQuery } from "@tanstack/react-query";
import { cartRepository } from "../repository/cart.repository";
import { cartKeys } from "../lib/cart-query-keys";
import type { LocalCartEntry, CartDisplayItem } from "../types/cart.types";

/**
 * Fetches display data (name, price, image) for a list of guest
 * cart entries. Since product routes are public, no auth required.
 */
export function useCartDisplayData(localItems: LocalCartEntry[]) {
  const variantIds = localItems.map((i) => i.variantId);

  return useQuery({
    queryKey: cartKeys.display(variantIds),
    queryFn: () => cartRepository.getVariantDisplayData(variantIds),
    enabled: variantIds.length > 0,
    staleTime: 2 * 60 * 1000, // 2 min — product data changes rarely
    select: (variants): CartDisplayItem[] => {
      // merge fetched display data with local quantities
      return localItems
        .map((localItem) => {
          const variant = variants.find((v) => v.id === localItem.variantId);
          if (!variant || !variant.products) return null;

          const images = variant.products.product_images ?? [];
          const imageUrl = cartRepository.resolveImageUrl(images, variant.id);

          return {
            cartItemId: localItem.variantId, // guest uses variantId as key
            variantId: variant.id,
            productId: localItem.productId,
            quantity: localItem.quantity,
            productName: variant.products.name,
            variantName: variant.name,
            price: variant.price_ksh,
            imageUrl,
            stockQuantity: variant.stock_quantity,
            available: variant.available ?? false,
          } satisfies CartDisplayItem;
        })
        .filter((item): item is CartDisplayItem => item !== null);
    },
  });
}
