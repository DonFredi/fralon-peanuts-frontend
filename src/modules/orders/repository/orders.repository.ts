import { supabase } from "@/shared/lib/supabase/client";
import { ApiCustomError } from "@/shared/errors/api-error";
import type { OrderListItem, OrderWithItems } from "../types/orders.types";

export const ordersRepository = {
  // ── single order with all items ────────────────────────────────
  // RLS ensures the authenticated user can only read their own order
  async getOrder(orderId: string): Promise<OrderWithItems> {
    const { data, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        order_items (
          id,
          product_id,
          variant_id,
          product_name,
          variant_name,
          unit_price_ksh,
          quantity,
          total_ksh
        )
      `
      )
      .eq("id", orderId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        throw new ApiCustomError("Order not found.", 404);
      }
      throw new ApiCustomError("Unable to load your order.", 500);
    }

    return data as OrderWithItems;
  },

  // ── all orders for the currently authenticated user ────────────
  // RLS policy on orders filters by the user's customer record automatically
  async getOrders(): Promise<OrderListItem[]> {
    const { data, error } = await supabase
      .from("orders")
      .select(
        "id, status, payment_status, fulfillment_method, total_ksh, created_at"
      )
      .order("created_at", { ascending: false });

    if (error) {
      throw new ApiCustomError("Unable to load your orders.", 500);
    }

    return (data as OrderListItem[]) ?? [];
  },
};
