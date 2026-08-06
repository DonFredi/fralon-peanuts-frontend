import { ordersRepository } from "../repository/orders.repository";

export const ordersService = {
  getOrder(orderId: string) {
    return ordersRepository.getOrder(orderId);
  },

  getOrders() {
    return ordersRepository.getOrders();
  },
};
