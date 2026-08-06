/**
 * Formats an integer KSH amount for display.
 * Prices are stored as whole integers — 350 displays as "KSH 350"
 * Supports thousands separators for larger amounts — 12500 → "KSH 12,500"
 */
export function formatPrice(amountKsh: number): string {
  return `KSH ${amountKsh.toLocaleString("en-KE")}`;
}

/**
 * Formats a price range from an array of amounts.
 * Used on product/variant listings — e.g. "KSH 350 – 600"
 * Returns a single price if min and max are the same.
 */
export function formatPriceRange(amounts: number[]): string {
  if (amounts.length === 0) return "—";
  const min = Math.min(...amounts);
  const max = Math.max(...amounts);
  if (min === max) return formatPrice(min);
  return `${formatPrice(min)} – ${formatPrice(max)}`;
}
