import { Expand } from "lucide-react";
import { P } from "@/shared/components/ui/Typography";
import { getOrderStatus } from "@/shared/utils/order-status";
import { formatPrice } from "@/shared/utils/format-price";
import { dateFormatter } from "@/shared/utils/date-formatter";
import type { OrderListItem } from "@/modules/orders/types/orders.types";

interface Props {
  order: OrderListItem;
  onClick: () => void;
}

export default function OrderHistoryItem({ order, onClick }: Props) {
  const { label, className } = getOrderStatus(order.status);

  return (
    <div onClick={onClick} className="border border-foreground-border radius-card p-4 flex flex-col gap-1">
      <div className="flex items-center justify-between gap-4">
        <P className="font-semibold truncate">Order#: {order.id.slice(0, 8).toUpperCase()}</P>
        <Expand className="size-5 text-foreground-border shrink-0" />
      </div>

      <small className="text-caption-base text-foreground-caption">
        Status: <span className={className}>{label}</span>
      </small>

      <div className="flex items-center justify-between gap-4">
        <small className="text-caption-base text-foreground-caption">{dateFormatter(order.created_at)}</small>
        <P className="font-semibold">{formatPrice(order.total_ksh)}</P>
      </div>
    </div>
  );
}
