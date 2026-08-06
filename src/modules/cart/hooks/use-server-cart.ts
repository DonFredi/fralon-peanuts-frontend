// modules/cart/hooks/use-server-cart.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cartRepository } from "../repository/cart.repository";
import { cartKeys } from "../lib/cart-query-keys";
import { toast } from "sonner";

/**
 * Manages the server-side cart for authenticated users.
 * cartId must be resolved before calling mutations.
 */
export function useServerCart(cartId: string | null) {
  const queryClient = useQueryClient();

  const itemsQuery = useQuery({
    queryKey: cartKeys.items(),
    queryFn: () => cartRepository.getCartItems(cartId!),
    enabled: !!cartId,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: cartKeys.items() });

  const addMutation = useMutation({
    mutationFn: ({ variantId, productId }: { variantId: string; productId: string }) =>
      cartRepository.addItem(cartId!, variantId, productId),
    onSuccess: () => {
      toast.success("Item added to cart successfully");
      invalidate();
    },
    onError: () => {
      toast.error("Failed to add item to cart");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ cartItemId, quantity }: { cartItemId: string; quantity: number }) =>
      cartRepository.updateQuantity(cartItemId, quantity),
    onSuccess: () => {
      invalidate();
    },
    onError: () => {
      toast.error("Failed to update item quantity");
    },
  });

  const removeMutation = useMutation({
    mutationFn: (cartItemId: string) => cartRepository.removeItem(cartItemId),
    onSuccess: () => {
      invalidate();
    },
    onError: () => {
      toast.error("Failed to remove item from cart");
    },
  });

  const clearMutation = useMutation({
    mutationFn: () => cartRepository.clearCart(cartId!),
    onSuccess: () => {
      invalidate();
    },
    onError: () => {
      toast.error("Failed to clear cart");
    },
  });

  const isMutating =
    addMutation.isPending || updateMutation.isPending || removeMutation.isPending || clearMutation.isPending;

  return {
    itemsQuery,
    isMutating,
    addMutation,
    updateMutation,
    removeMutation,
    clearMutation,
  };
}
