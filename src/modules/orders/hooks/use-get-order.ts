"use client";
import { useQuery } from "@tanstack/react-query";
import { ordersService } from "../services/orders.service";
import { orderKeys } from "../lib/order-query-keys";

export function useGetOrder(orderId: string | null) {
  return useQuery({
    queryKey: orderKeys.detail(orderId ?? ""),
    queryFn: () => ordersService.getOrder(orderId!),
    enabled: !!orderId,
    // order data is immutable once placed — no need to refetch
    staleTime: Infinity,
  });
}
