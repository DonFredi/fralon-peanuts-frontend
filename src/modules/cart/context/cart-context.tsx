// modules/cart/context/cart-context.tsx
"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { cartRepository } from "../repository/cart.repository";
import { cartKeys } from "../lib/cart-query-keys";
import { clearLocalCart } from "../lib/local-cart";
import { useGuestCart } from "../hooks/use-guest-cart";
import { useServerCart } from "../hooks/use-server-cart";
import { useCartDisplayData } from "../hooks/use-cart-display-data";
import type { CartContextValue, CartDisplayItem } from "../types/cart.types";
import { useAuth } from "@/modules/auth/shared/hooks/useAuth";
import type { ProductVariant } from "@/modules/products/types/products.types";

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const isMergingRef = useRef(false);

  // ── Cart ID for authenticated users ──────────────────────────────
  const [cartId, setCartId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setCartId(null);
      return;
    }
    cartRepository
      .getOrCreateCart(user.id)
      .then((data) => setCartId(data))
      .catch(() => toast.error("Failed to load cart"));
  }, [user]);

  // ── Guest cart (useReducer + localStorage) ────────────────────────
  const { items: localItems, dispatch: localDispatch, clear: clearLocal } = useGuestCart();

  // ── Server cart (TanStack Query) ──────────────────────────────────
  const { itemsQuery, isMutating, addMutation, updateMutation, removeMutation, clearMutation } = useServerCart(cartId);

  // ── Guest display data (public fetch, no auth needed) ─────────────
  const { data: guestDisplayItems = [], isLoading: guestLoading } = useCartDisplayData(user ? [] : localItems); // disabled for auth users

  // ── Merge guest cart into server cart when user logs in ───────────
  useEffect(() => {
    if (!user || !cartId || localItems.length === 0 || isMergingRef.current) return;

    isMergingRef.current = true;

    const serverItems = itemsQuery.data ?? [];

    cartRepository
      .mergeGuestCart(cartId, localItems, serverItems)
      .then(({ adjustedItems, removedItems }) => {
        clearLocal();
        clearLocalCart();
        queryClient.invalidateQueries({ queryKey: cartKeys.items() });
        if (adjustedItems > 0 || removedItems > 0) {
          toast.info("Your cart was updated to match current availability");
        }
      })
      .catch(() => toast.error("Failed to sync your cart"))
      .finally(() => {
        isMergingRef.current = false;
      });
  }, [user, cartId]);

  // ── Derive display items for auth users ───────────────────────────
  const serverDisplayItems = useMemo((): CartDisplayItem[] => {
    if (!itemsQuery.data) return [];

    return itemsQuery.data
      .map((item): CartDisplayItem | null => {
        const variant = item.product_variants;
        if (!variant || !variant.products) return null;

        const images = variant.products.product_images ?? [];
        const imageUrl = cartRepository.resolveImageUrl(images, variant.id);

        return {
          cartItemId: item.id,
          variantId: item.variant_id,
          productId: item.product_id,
          quantity: item.quantity,
          productName: variant.products.name,
          variantName: variant.name,
          price: variant.price_ksh,
          imageUrl,
          stockQuantity: variant.stock_quantity,
          available: variant.available ?? false,
        };
      })
      .filter((item): item is CartDisplayItem => item !== null);
  }, [itemsQuery.data]);

  // ── Unified items — routes to correct source ──────────────────────
  const items = user ? serverDisplayItems : guestDisplayItems;
  const isLoading = user ? itemsQuery.isLoading : guestLoading;
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  // Local storage can outlive inventory changes. Clamp guest quantities as soon as live variant data is available.
  useEffect(() => {
    if (user || guestLoading) return;

    const itemsToClamp = guestDisplayItems.filter((item) => {
      const maximumQuantity = item.available ? item.stockQuantity : 0;
      return item.quantity > maximumQuantity;
    });

    if (itemsToClamp.length === 0) return;

    for (const item of itemsToClamp) {
      localDispatch({
        type: "UPDATE",
        variantId: item.variantId,
        quantity: item.available ? item.stockQuantity : 0,
      });
    }
    toast.info("Your cart was updated to match current availability");
  }, [user, guestLoading, guestDisplayItems, localDispatch]);

  // ── Drawer state ──────────────────────────────────────────────────
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // ── Unified actions ───────────────────────────────────────────────
  const addToCart = async (variantId: string, productId: string): Promise<boolean> => {
    const existingItem = items.find((item) => item.variantId === variantId);
    let available = existingItem?.available;
    let stockQuantity = existingItem?.stockQuantity;

    // A product can be added before it appears in cart display data, so fetch its current availability first.
    if (available === undefined || stockQuantity === undefined) {
      try {
        const [variant] = await cartRepository.getVariantDisplayData([variantId]);
        available = variant?.available ?? false;
        stockQuantity = variant?.stock_quantity ?? 0;
      } catch {
        toast.error("Unable to confirm product availability");
        return false;
      }
    }

    const currentQuantity = existingItem?.quantity ?? 0;
    if (!available || stockQuantity <= 0) {
      toast.error("This product is out of stock");
      return false;
    }
    if (currentQuantity >= stockQuantity) {
      toast.error("You have reached the available stock for this product");
      return false;
    }

    if (!user) {
      localDispatch({ type: "ADD", variantId, productId });
      return true;
    }

    try {
      await addMutation.mutateAsync({ variantId, productId });
      return true;
    } catch {
      return false;
    }
  };

  const updateQuantity = async (variantId: string, quantity: number) => {
    const displayItem = items.find((item) => item.variantId === variantId);
    if (!displayItem) return;

    const maximumQuantity = displayItem.available ? displayItem.stockQuantity : 0;
    const nextQuantity = Math.min(quantity, maximumQuantity);
    if (quantity > maximumQuantity) {
      toast.info("Quantity was limited to available stock");
    }

    if (!user) {
      localDispatch({ type: "UPDATE", variantId, quantity: nextQuantity });
    } else {
      const item = serverDisplayItems.find((i) => i.variantId === variantId);
      if (!item) return;
      if (nextQuantity <= 0) {
        await removeMutation.mutateAsync(item.cartItemId);
      } else {
        await updateMutation.mutateAsync({ cartItemId: item.cartItemId, quantity: nextQuantity });
      }
    }
  };

  const removeFromCart = async (variantId: string) => {
    if (!user) {
      localDispatch({ type: "REMOVE", variantId });
    } else {
      const item = serverDisplayItems.find((i) => i.variantId === variantId);
      if (!item) return;
      await removeMutation.mutateAsync(item.cartItemId);
    }
  };

  const clearCart = async () => {
    if (!user) {
      clearLocal();
    } else {
      await clearMutation.mutateAsync();
    }
  };

  const inCart = (searchableVariantId: string) => {
    return items.some((i) => i.variantId === searchableVariantId);
  };

  const quantity = (selectedVariant: ProductVariant) => {
    return items.find((i) => i.variantId === selectedVariant?.id)?.quantity ?? 0;
  };

  const value: CartContextValue = {
    items,
    isLoading,
    isMutating,
    itemCount,
    subtotal,
    isDrawerOpen,
    openDrawer: () => setIsDrawerOpen(true),
    closeDrawer: () => setIsDrawerOpen(false),
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    inCart,
    quantity,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

/** Consume the cart context — throws if used outside CartProvider */
export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
