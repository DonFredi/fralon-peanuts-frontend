"use client";
import { useState } from "react";
import SectionWrapper from "@/shared/components/shared/SectionWrapper";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { ShoppingBag } from "lucide-react";
import { useGetOrders } from "@/modules/orders/hooks/use-get-orders";
import OrderHistoryItem from "../components/OrderHistoryItem";
import OrderDetailSheet from "../components/OrderDetailSheet";

export default function OrderHistorySection() {
  const { data: orders = [], isPending } = useGetOrders();
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  return (
    <SectionWrapper>
      <div className="max-w-210 mx-auto flex flex-col gap-4">

        {/* ── loading skeletons ──────────────────────────────── */}
        {isPending &&
          Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}

        {/* ── empty state ────────────────────────────────────── */}
        {!isPending && orders.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-20 text-foreground-caption">
            <ShoppingBag className="size-10 opacity-30" />
            <p className="text-sm font-medium">No orders yet</p>
            <p className="text-xs text-center max-w-xs">
              You haven't placed any orders yet. Start shopping to see your order
              history here.
            </p>
          </div>
        )}

        {/* ── order list ─────────────────────────────────────── */}
        {!isPending &&
          orders.map((order) => (
            <OrderHistoryItem
              key={order.id}
              order={order}
              onClick={() => setSelectedOrderId(order.id)}
            />
          ))}
      </div>

      {/* single sheet instance shared across all order cards    */}
      {/* only fetches the selected order — not all at once      */}
      <OrderDetailSheet
        orderId={selectedOrderId}
        onClose={() => setSelectedOrderId(null)}
      />
    </SectionWrapper>
  );
}
