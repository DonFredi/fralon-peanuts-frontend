"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import {
  CheckCircle2,
  Copy,
  Check,
  MapPin,
  CreditCard,
  ShoppingBag,
  PackageCheck,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import { Skeleton } from "@/shared/components/ui/skeleton";
import PageWrapper from "@/shared/components/shared/PageWrapper";
import SectionWrapper from "@/shared/components/shared/SectionWrapper";
import { useGetOrder } from "../hooks/use-get-order";
import { formatPrice } from "@/shared/utils/format-price";

// update this to your actual store pickup address
const STORE_PICKUP_ADDRESS = "Fralon Store, Nairobi, Kenya";

export default function OrderSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [copied, setCopied] = useState(false);

  const { data: order, isPending, isError } = useGetOrder(orderId);

  const handleCopyOrderId = async () => {
    if (!orderId) return;
    await navigator.clipboard.writeText(orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── loading skeleton ───────────────────────────────────────────
  if (isPending) {
    return (
      <PageWrapper>
        <SectionWrapper className="max-w-2xl mx-auto space-y-4 py-12">
          <div className="flex flex-col items-center gap-3">
            <Skeleton className="h-16 w-16 rounded-full" />
            <Skeleton className="h-7 w-56" />
            <Skeleton className="h-4 w-72" />
          </div>
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </SectionWrapper>
      </PageWrapper>
    );
  }

  // ── error state ────────────────────────────────────────────────
  if (isError || !order) {
    return (
      <PageWrapper>
        <SectionWrapper className="max-w-2xl mx-auto py-12 text-center space-y-4">
          <p className="text-muted-foreground">
            We couldn't load your order details. Your order was placed — please check
            your orders history or contact support.
          </p>
          <Button onClick={() => router.push("/")}>Back to home</Button>
        </SectionWrapper>
      </PageWrapper>
    );
  }

  const isDelivery = order.fulfillment_method === "delivery";
  const isMpesa = order.payment_method === "mpesa";

  return (
    <PageWrapper>
      <SectionWrapper className="max-w-2xl mx-auto py-10 space-y-6">

        {/* ── success header ─────────────────────────────────────── */}
        <div className="flex flex-col items-center text-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <CheckCircle2 className="h-9 w-9 text-green-600 dark:text-green-400" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold">Order placed successfully</h1>
            <p className="text-sm text-muted-foreground max-w-sm">
              Thank you for your order. We have received it and will{" "}
              {isDelivery ? "deliver it to your address" : "have it ready for pickup"} shortly.
            </p>
          </div>
        </div>

        {/* ── order id card ──────────────────────────────────────── */}
        <Card>
          <CardContent className="flex items-center justify-between gap-4 py-4">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-muted-foreground">Order ID</span>
              <span className="text-sm font-mono font-medium break-all">{order.id}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyOrderId}
              className="shrink-0"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-green-600" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  Copy
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* ── order items ────────────────────────────────────────── */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              Items ordered
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {order.order_items.map((item) => (
              <div key={item.id} className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium">{item.product_name}</span>
                  {item.variant_name && (
                    <span className="text-xs text-muted-foreground">{item.variant_name}</span>
                  )}
                  <span className="text-xs text-muted-foreground">Qty: {item.quantity}</span>
                </div>
                <span className="text-sm font-medium shrink-0">
                  {formatPrice(item.total_ksh)}
                </span>
              </div>
            ))}

            <Separator />

            {/* amounts breakdown */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal_ksh)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Shipping</span>
                <span>
                  {order.shipping_ksh === 0 ? "Free" : formatPrice(order.shipping_ksh)}
                </span>
              </div>
              {order.discount_ksh > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount</span>
                  <span>− {formatPrice(order.discount_ksh)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between text-base font-semibold">
                <span>Total</span>
                <span>{formatPrice(order.total_ksh)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── fulfillment card ───────────────────────────────────── */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <PackageCheck className="h-4 w-4 text-muted-foreground" />
              {isDelivery ? "Delivery details" : "Pickup details"}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
              <div className="flex flex-col gap-0.5">
                {isDelivery ? (
                  <>
                    <span className="text-sm font-medium">Delivery address</span>
                    <span className="text-sm text-muted-foreground">
                      Your delivery will be arranged based on the address you provided.
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-sm font-medium">Pickup location</span>
                    <span className="text-sm text-muted-foreground">{STORE_PICKUP_ADDRESS}</span>
                    <span className="text-xs text-muted-foreground mt-0.5">
                      We'll notify you when your order is ready for collection.
                    </span>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── payment card ───────────────────────────────────────── */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              Payment
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Method</span>
              <span className="text-sm font-medium capitalize">
                {isMpesa ? "M-Pesa" : "Cash on Delivery"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-0">
                Unpaid
              </Badge>
            </div>
            {isMpesa && order.payment_reference && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Phone</span>
                <span className="text-sm font-medium">{order.payment_reference}</span>
              </div>
            )}
            {!isMpesa && (
              <p className="text-xs text-muted-foreground mt-1">
                Payment will be collected at the time of{" "}
                {isDelivery ? "delivery" : "pickup"}.
              </p>
            )}
          </CardContent>
        </Card>

        {/* ── cta buttons ────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => router.push("/")}
          >
            Continue shopping
          </Button>
          <Button
            className="flex-1"
            onClick={() => router.push("/orders")}
          >
            View my orders
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

      </SectionWrapper>
    </PageWrapper>
  );
}
