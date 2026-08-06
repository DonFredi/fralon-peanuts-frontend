"use client";
import { useQuery } from "@tanstack/react-query";
import { ordersService } from "../services/orders.service";
import { orderKeys } from "../lib/order-query-keys";

export function useGetOrders() {
  return useQuery({
    queryKey: orderKeys.all(),
    queryFn: () => ordersService.getOrders(),
  });
}
