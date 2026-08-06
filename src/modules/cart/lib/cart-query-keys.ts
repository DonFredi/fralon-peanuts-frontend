// modules/cart/lib/cart-query-keys.ts

export const cartKeys = {
  /** top-level key — invalidate to refresh everything cart-related */
  all: () => ["cart"] as const,
  /** server cart items for the authenticated user */
  items: () => ["cart", "items"] as const,
  /** display data for a set of variant IDs (guest cart) */
  display: (ids: string[]) => ["cart", "display", ids] as const,
};
