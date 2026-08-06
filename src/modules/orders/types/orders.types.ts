import type { Database } from "@/shared/lib/supabase/database.types";

export type Order = Database["public"]["Tables"]["orders"]["Row"];
export type OrderItem = Database["public"]["Tables"]["order_items"]["Row"];

// single order with items — used on success page and order detail
export interface OrderWithItems extends Order {
  order_items: OrderItem[];
}

// order list item — lighter shape for the orders history list
export type OrderListItem = Pick<
  Order,
  | "id"
  | "status"
  | "payment_status"
  | "fulfillment_method"
  | "total_ksh"
  | "created_at"
>;
