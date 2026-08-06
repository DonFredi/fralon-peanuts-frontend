// modules/cart/components/CartItemSkeleton.tsx
import { Skeleton } from "@/shared/components/ui/skeleton";

export default function CartItemSkeleton() {
  return (
    <div className="flex items-start gap-4 py-4">
      <Skeleton className="h-20 w-20 shrink-0 rounded-lg" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/4" />
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-8 w-24 mt-2" />
      </div>
      <Skeleton className="h-4 w-16" />
    </div>
  );
}
