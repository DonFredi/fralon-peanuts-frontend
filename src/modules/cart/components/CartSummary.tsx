// modules/cart/components/CartSummary.tsx
import Link from "next/link";
import { Separator } from "@/shared/components/ui/separator";
import { Button } from "@/shared/components/ui/button";

interface CartSummaryProps {
  subtotal: number;
  itemCount: number;
  isMutating: boolean;
  onCheckout?: () => void; // optional — allows drawer to close before navigating
}

export default function CartSummary({ subtotal, itemCount, isMutating, onCheckout }: CartSummaryProps) {
  return (
    <div className="space-y-3">
      <Separator />

      {/* ── Subtotal ── */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          Subtotal ({itemCount} item{itemCount !== 1 ? "s" : ""})
        </span>
        <span className="font-semibold text-base">KSH {subtotal.toLocaleString()}</span>
      </div>

      {/* ── Delivery note ── */}
      <p className="text-xs text-muted-foreground">Delivery calculated at checkout.</p>

      {/* ── Checkout CTA ── */}
      <Button className="w-full" disabled={isMutating || itemCount === 0} asChild onClick={onCheckout}>
        <Link href="/checkout">Proceed to checkout</Link>
      </Button>
    </div>
  );
}
