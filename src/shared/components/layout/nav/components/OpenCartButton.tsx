"use client";
import { Button } from "@/shared/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";

export default function OpenCartButton() {
  const router = useRouter();
  return (
    <Button onClick={() => router.push("/cart")} variant="ghost" className="rounded-sm p-2">
      <ShoppingCart className="size-6" />
    </Button>
  );
}
