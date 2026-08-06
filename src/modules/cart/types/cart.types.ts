// modules/cart/types/cart.types.ts

import type { ProductVariant } from "@/modules/products/types/products.types";

/**
 * Minimal entry stored in localStorage for guest cart.
 * Only IDs + quantity — display data is fetched when cart opens.
 */
export interface LocalCartEntry {
  variantId: string;
  productId: string;
  quantity: number;
}

/**
 * Fully enriched item used by the UI — same shape for both
 * guest and authenticated users after display data is resolved.
 */
export interface CartDisplayItem {
  // identity
  cartItemId: string; // cart_items.id for server | variantId for guest
  variantId: string;
  productId: string;
  quantity: number;

  // display — resolved from variant join
  productName: string;
  variantName: string;
  price: number; // always live — price_ksh from variant
  imageUrl: string | null;

  // stock — used to cap quantity stepper
  stockQuantity: number;
  available: boolean;
}

/**
 * Unified context interface — consumers never know
 * whether they're talking to localStorage or Supabase.
 */
export interface CartContextValue {
  // state
  items: CartDisplayItem[];
  isLoading: boolean;
  isMutating: boolean;
  itemCount: number; // total units across all items
  subtotal: number;
  inCart: (searchableVariantId: string) => boolean;
  quantity: (variant: ProductVariant) => number;

  // drawer
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;

  // actions
  /** Returns false when the variant cannot be added, for example when stock is exhausted. */
  addToCart: (variantId: string, productId: string) => Promise<boolean>;
  updateQuantity: (variantId: string, quantity: number) => Promise<void>;
  removeFromCart: (variantId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}
