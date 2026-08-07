"use client";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/shared/components/ui/sheet";
import { Separator } from "@/shared/components/ui/separator";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { PackageCheck, CreditCard, MapPin } from "lucide-react";
import { useGetOrder } from "@/modules/orders/hooks/use-get-order";
import { getOrderStatus } from "@/shared/utils/order-status";
import { formatPrice } from "@/shared/utils/format-price";
import { dateFormatter } from "@/shared/utils/date-formatter";

interface Props {
  orderId: string | null;
  onClose: () => void;
}

export default function OrderDetailSheet({ orderId, onClose }: Props) {
  const { data: order, isPending } = useGetOrder(orderId);
  const status = order ? getOrderStatus(order.status) : null;
  const isDelivery = order?.fulfillment_method === "delivery";
  const isMpesa = order?.payment_method === "mpesa";

  return (
    <Sheet open={!!orderId} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-4 px-0">
          <SheetTitle className="font-bold">Order details</SheetTitle>
          {order && <SheetDescription className="font-mono text-xs break-all">#{order.id}</SheetDescription>}
        </SheetHeader>

        {/* ── loading skeleton ─────────────────────────────────── */}
        {isPending && (
          <div className="space-y-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-32 w-full rounded-lg" />
            <Skeleton className="h-20 w-full rounded-lg" />
          </div>
        )}

        {/* ── order content ────────────────────────────────────── */}
        {order && (
          <div className="flex flex-col gap-5">
            {/* status + date */}
            <div className="flex items-center justify-between text-sm">
              <span className={`font-medium ${status?.className}`}>{status?.label}</span>
              <span className="text-foreground-caption text-xs">{dateFormatter(order.created_at)}</span>
            </div>

            <Separator />

            {/* items */}
            <div className="flex flex-col gap-3">
              <p className="font-medium flex items-center gap-1.5">
                <PackageCheck className="size-4 text-foreground-caption" />
                Items
              </p>
              {order.order_items.map((item) => (
                <div key={item.id} className="flex items-start justify-between gap-3">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm">{item.product_name}</span>
                    {item.variant_name && <span className="text-xs text-foreground-caption">{item.variant_name}</span>}
                    <span className="text-xs text-foreground-caption">Qty: {item.quantity}</span>
                  </div>
                  <span className="text-sm font-medium shrink-0">{formatPrice(item.total_ksh)}</span>
                </div>
              ))}
            </div>

            <Separator />

            {/* amounts */}
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between text-foreground-caption">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal_ksh)}</span>
              </div>
              <div className="flex justify-between text-foreground-caption">
                <span>Shipping</span>
                <span>{order.shipping_ksh === 0 ? "Free" : formatPrice(order.shipping_ksh)}</span>
              </div>
              {order.discount_ksh > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>− {formatPrice(order.discount_ksh)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>{formatPrice(order.total_ksh)}</span>
              </div>
            </div>

            <Separator />

            {/* fulfillment */}
            <div className="flex flex-col gap-1.5">
              <p className="font-medium flex items-center gap-1.5">
                <MapPin className="size-4 text-foreground-caption" />
                {isDelivery ? "Delivery" : "Pickup"}
              </p>
              <p className="text-xs text-foreground-caption">
                {isDelivery
                  ? "Your order will be delivered to your provided address."
                  : "Collect your order from our store."}
              </p>
            </div>

            <Separator />

            {/* payment */}
            <div className="flex flex-col gap-1.5">
              <p className="font-medium flex items-center gap-1.5">
                <CreditCard className="size-4 text-foreground-caption" />
                Payment
              </p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-foreground-caption">Method</span>
                <span>{isMpesa ? "M-Pesa" : "Cash on Delivery"}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-foreground-caption">Status</span>
                <span
                  className={
                    order.payment_status === "paid" ? "text-green-600 font-medium" : "text-amber-500 font-medium"
                  }
                >
                  {order.payment_status === "paid" ? "Paid" : "Unpaid"}
                </span>
              </div>
              {isMpesa && order.payment_reference && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground-caption">Phone</span>
                  <span>{order.payment_reference}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
