// modules/cart/lib/local-cart.ts
import type { LocalCartEntry } from "../types/cart.types";

const KEY = "guest_cart";

/** Read the guest cart from localStorage. Returns [] if empty or invalid. */
export function readLocalCart(): LocalCartEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/** Persist the full cart array to localStorage. */
export function writeLocalCart(items: LocalCartEntry[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(items));
}

/** Remove the guest cart from localStorage entirely. */
export function clearLocalCart(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}
