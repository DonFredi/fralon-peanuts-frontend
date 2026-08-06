"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOrder } from "./checkout.api";

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      // clear the cart cache so the cart icon and any cart page reflect empty immediately
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}
