// modules/cart/repository/cart.repository.ts
import { supabase } from "@/shared/lib/supabase/client";
import type { QueryData } from "@supabase/supabase-js";
import type { LocalCartEntry } from "../types/cart.types";
import { ApiCustomError } from "@/shared/errors/api-error";

const BUCKET = "products";

// ── Infer return types directly from query shapes ────────────────────

const _cartItemsShape = supabase.from("cart_items").select(`
    id, quantity, variant_id, product_id,
    product_variants(
      id, name, price_ksh, stock_quantity, available,
      products(
        id, name,
        product_images(id, storage_path, is_primary, variant_id)
      )
    )
  `);

export type ServerCartItem = QueryData<typeof _cartItemsShape>[number];

const _variantDisplayShape = supabase.from("product_variants").select(`
    id, name, price_ksh, stock_quantity, available,
    products(
      id, name,
      product_images(id, storage_path, is_primary, variant_id)
    )
  `);

export type VariantDisplay = QueryData<typeof _variantDisplayShape>[number];

export type GuestCartMergeResult = {
  adjustedItems: number;
  removedItems: number;
};

// ── Helper ──────────────────────────────────────────────────────────

function resolveImageUrl(
  images: { storage_path: string; is_primary: boolean | null; variant_id: string | null }[],
  variantId: string,
): string | null {
  const variantImg = images.find((img) => img.variant_id === variantId);
  if (variantImg) {
    return supabase.storage.from(BUCKET).getPublicUrl(variantImg.storage_path).data.publicUrl;
  }
  const primaryImg = images.find((img) => img.is_primary && img.variant_id === null);
  const fallback = images.find((img) => img.variant_id === null);
  const target = primaryImg ?? fallback ?? null;
  if (!target) return null;
  return supabase.storage.from(BUCKET).getPublicUrl(target.storage_path).data.publicUrl;
}

// ── Repository ───────────────────────────────────────────────────────

export const cartRepository = {
  /**
   * Get or create a cart for the authenticated user.
   * Uses upsert as a safety net for users who existed before the trigger.
   */
  async getOrCreateCart(userId: string): Promise<string> {
    const { data, error } = await supabase
      .from("cart")
      .upsert({ user_id: userId }, { onConflict: "user_id" })
      .select("id")
      .single();

    if (error) throw new ApiCustomError("Failed to resolve cart", 500);
    return data.id;
  },

  /**
   * Fetch all cart items for a given cart ID, joined with variant
   * and product display data.
   */
  async getCartItems(cartId: string): Promise<ServerCartItem[]> {
    const { data, error } = await supabase
      .from("cart_items")
      .select(
        `
        id, quantity, variant_id, product_id,
        product_variants(
          id, name, price_ksh, stock_quantity, available,
          products(
            id, name,
            product_images(id, storage_path, is_primary, variant_id)
          )
        )
      `,
      )
      .eq("cart_id", cartId)
      .order("created_at", { ascending: true });

    if (error) throw new ApiCustomError("Failed to fetch cart items", 500);
    return data;
  },

  /**
   * Fetch variant display data for a list of variant IDs.
   * Used by the guest cart to enrich local entries before display.
   */
  async getVariantDisplayData(variantIds: string[]): Promise<VariantDisplay[]> {
    if (variantIds.length === 0) return [];

    const { data, error } = await supabase
      .from("product_variants")
      .select(
        `
        id, name, price_ksh, stock_quantity, available,
        products(
          id, name,
          product_images(id, storage_path, is_primary, variant_id)
        )
      `,
      )
      .in("id", variantIds);

    if (error) throw new ApiCustomError("Failed to fetch variant data", 500);
    return data;
  },

  /** Add an item or increment quantity if it already exists. */
  async addItem(cartId: string, variantId: string, productId: string): Promise<void> {
    // check if variant is already in cart
    const { data: existing } = await supabase
      .from("cart_items")
      .select("id, quantity")
      .eq("cart_id", cartId)
      .eq("variant_id", variantId)
      .single();

    if (existing) {
      const { error } = await supabase
        .from("cart_items")
        .update({ quantity: existing.quantity + 1 })
        .eq("id", existing.id);

      if (error) throw new ApiCustomError("Failed to update cart item", 500);
    } else {
      const { error } = await supabase
        .from("cart_items")
        .insert({ cart_id: cartId, variant_id: variantId, product_id: productId, quantity: 1 });

      if (error) {
        console.log("adding to cart Error:", error);
        throw new ApiCustomError("Failed to add item to cart", 500);
      }
    }
  },

  /** Update the quantity of a specific cart item. */
  async updateQuantity(cartItemId: string, quantity: number): Promise<void> {
    const { error } = await supabase.from("cart_items").update({ quantity }).eq("id", cartItemId);

    if (error) throw new ApiCustomError("Failed to update quantity", 500);
  },

  /** Remove a specific cart item by its ID. */
  async removeItem(cartItemId: string): Promise<void> {
    const { error } = await supabase.from("cart_items").delete().eq("id", cartItemId);

    if (error) throw new ApiCustomError("Failed to remove cart item", 500);
  },

  /** Remove all items from a cart. */
  async clearCart(cartId: string): Promise<void> {
    const { error } = await supabase.from("cart_items").delete().eq("cart_id", cartId);

    if (error) throw new ApiCustomError("Failed to clear cart", 500);
  },

  /**
   * Merge guest cart items into the server cart on login.
   * Takes the higher quantity when a variant exists in both.
   */
  async mergeGuestCart(
    cartId: string,
    guestItems: LocalCartEntry[],
    serverItems: ServerCartItem[],
  ): Promise<GuestCartMergeResult> {
    const variants = await cartRepository.getVariantDisplayData(guestItems.map((item) => item.variantId));
    const variantsById = new Map(variants.map((variant) => [variant.id, variant]));
    let adjustedItems = 0;
    let removedItems = 0;

    for (const guestItem of guestItems) {
      const variant = variantsById.get(guestItem.variantId);

      if (!variant || !variant.products || !variant.available || variant.stock_quantity <= 0) {
        removedItems += 1;
        continue;
      }

      const quantity = Math.min(guestItem.quantity, variant.stock_quantity);
      if (quantity !== guestItem.quantity) adjustedItems += 1;

      const serverMatch = serverItems.find((s) => s.variant_id === guestItem.variantId);

      if (serverMatch) {
        // take the higher quantity
        const merged = Math.min(Math.max(serverMatch.quantity, quantity), variant.stock_quantity);
        if (merged !== serverMatch.quantity) {
          await cartRepository.updateQuantity(serverMatch.id, merged);
        }
      } else {
        const { error } = await supabase.from("cart_items").insert({
          cart_id: cartId,
          variant_id: guestItem.variantId,
          product_id: variant.products.id,
          quantity,
        });

        if (error) throw new ApiCustomError("Failed to merge cart item", 500);
      }
    }

    return { adjustedItems, removedItems };
  },

  // expose helper for use in context
  resolveImageUrl,
};
