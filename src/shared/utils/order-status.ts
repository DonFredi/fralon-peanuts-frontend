// maps every order status to a display label and a Tailwind text color class
// used on both the order card and inside the detail sheet

export const orderStatusConfig: Record<
  string,
  { label: string; className: string }
> = {
  pending:    { label: "Pending",    className: "text-amber-500" },
  confirmed:  { label: "Confirmed",  className: "text-blue-500" },
  processing: { label: "Processing", className: "text-blue-600" },
  shipped:    { label: "Shipped",    className: "text-purple-500" },
  delivered:  { label: "Delivered",  className: "text-green-600" },
  cancelled:  { label: "Cancelled",  className: "text-red-500" },
  refunded:   { label: "Refunded",   className: "text-orange-500" },
};

export function getOrderStatus(status: string) {
  return orderStatusConfig[status] ?? { label: status, className: "text-foreground" };
}
