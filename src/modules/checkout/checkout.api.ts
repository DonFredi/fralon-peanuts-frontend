import { supabase } from "@/shared/lib/supabase/client";
import { ApiCustomError } from "@/shared/errors/api-error";
import type { CheckoutInput } from "./checkout.schema";

// flat delivery fee — matches what the server computes in create_order_from_cart
// update both here and in the SQL function when shipping zones are implemented
export const DELIVERY_FEE_KSH = 100;

// ── return types ──────────────────────────────────────────────────────────

export type CreatedOrder = {
  order_id: string;
  order_status: string;
  payment_status: string;
  subtotal_ksh: number;
  shipping_ksh: number;
  total_ksh: number;
};

type OrderItem = {
  id: string;
  product_id: string | null;
  variant_id: string | null;
  product_name: string;
  variant_name: string | null;
  unit_price_ksh: number;
  quantity: number;
  total_ksh: number;
};

export type OrderDetails = {
  id: string;
  status: string;
  fulfillment_method: "pickup" | "delivery";
  payment_method: "cash" | "mpesa";
  payment_status: string;
  payment_reference: string | null;
  subtotal_ksh: number;
  shipping_ksh: number;
  total_ksh: number;
  created_at: string;
  order_items: OrderItem[];
};

// ── createOrder ───────────────────────────────────────────────────────────
// calls the create_order_from_cart Postgres function which handles everything
// atomically — cart reading, price computation, order + items insert, cart clear

export async function createOrder(input: CheckoutInput): Promise<CreatedOrder> {
  const { data, error } = await supabase.rpc("create_order_from_cart", {
    p_fulfillment_method: input.fulfillment_method,
    p_payment_method: input.payment_method,
    p_address_id: undefined,
    p_delivery_address:
      input.fulfillment_method === "delivery"
        ? {
            constituency: input.constituency ?? null,
            ward: input.ward ?? null,
            street: input.street ?? null,
          }
        : null,
    p_mpesa_phone: input.payment_method === "mpesa" ? (input.mpesa_phone ?? undefined) : undefined,
    p_notes: undefined,
  });

  if (error) {
    // the Postgres function raises descriptive exceptions — surface them directly
    throw new ApiCustomError(error.message, 400);
  }

  const order = data?.[0];

  if (!order) {
    throw new ApiCustomError("Order could not be created. Please try again.", 500);
  }

  return order as CreatedOrder;
}

// ── getOrder ──────────────────────────────────────────────────────────────
// fetches a single order by id — used on the checkout success page

export async function getOrder(orderId: string): Promise<OrderDetails> {
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      id,
      status,
      fulfillment_method,
      payment_method,
      payment_status,
      payment_reference,
      subtotal_ksh,
      shipping_ksh,
      total_ksh,
      created_at,
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
    `,
    )
    .eq("id", orderId)
    .single();

  if (error) {
    throw new ApiCustomError("Unable to load your order. Please contact support.", 404);
  }

  return data as unknown as OrderDetails;
}
