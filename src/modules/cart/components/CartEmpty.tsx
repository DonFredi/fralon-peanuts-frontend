// modules/cart/components/CartEmpty.tsx
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

interface CartEmptyProps {
  onClose?: () => void; // passed by the drawer to close it on navigate
}

export default function CartEmpty({ onClose }: CartEmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
      <div className="rounded-full bg-muted p-4 mb-4">
        <ShoppingBag className="size-14 text-muted-foreground" />
      </div>
      <p className="text-sm font-medium">Your cart is empty</p>
      <p className="text-xs text-muted-foreground mt-1 max-w-xs">Browse our products and add something you love.</p>
      <Button size="sm" variant="outline" className="mt-5" asChild onClick={onClose}>
        <Link href="/products">Browse products</Link>
      </Button>
    </div>
  );
}
