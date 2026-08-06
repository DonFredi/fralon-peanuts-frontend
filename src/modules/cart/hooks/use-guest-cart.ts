// modules/cart/hooks/use-guest-cart.ts
import { useReducer, useEffect } from "react";
import { readLocalCart, writeLocalCart, clearLocalCart } from "../lib/local-cart";
import type { LocalCartEntry } from "../types/cart.types";

type GuestCartAction =
  | { type: "HYDRATE"; items: LocalCartEntry[] }
  | { type: "ADD"; variantId: string; productId: string }
  | { type: "UPDATE"; variantId: string; quantity: number }
  | { type: "REMOVE"; variantId: string }
  | { type: "CLEAR" };

function reducer(state: LocalCartEntry[], action: GuestCartAction): LocalCartEntry[] {
  switch (action.type) {
    case "HYDRATE":
      return action.items;

    case "ADD": {
      const existing = state.find((i) => i.variantId === action.variantId);
      if (existing) {
        return state.map((i) => (i.variantId === action.variantId ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...state, { variantId: action.variantId, productId: action.productId, quantity: 1 }];
    }

    case "UPDATE":
      if (action.quantity <= 0) {
        return state.filter((i) => i.variantId !== action.variantId);
      }
      return state.map((i) => (i.variantId === action.variantId ? { ...i, quantity: action.quantity } : i));

    case "REMOVE":
      return state.filter((i) => i.variantId !== action.variantId);

    case "CLEAR":
      return [];
  }
}

export function useGuestCart() {
  const [items, dispatch] = useReducer(reducer, []);

  // hydrate from localStorage on mount (client only)
  useEffect(() => {
    const stored = readLocalCart();
    if (stored.length > 0) {
      dispatch({ type: "HYDRATE", items: stored });
    }
  }, []);

  // persist to localStorage on every change
  useEffect(() => {
    writeLocalCart(items);
  }, [items]);

  const clear = () => {
    clearLocalCart();
    dispatch({ type: "CLEAR" });
  };

  return { items, dispatch, clear };
}
