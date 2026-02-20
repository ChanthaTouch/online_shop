// src/services/orders.ts
import api from "./api";

export interface Order {
  id: number;
  total: number;
  status: string;
  created_at: string;
}

export const orderService = {
  async checkout(
    shipping_address: Record<string, any>,
    payment_method: string
  ): Promise<any> {
    try {
      const response = await api.post("/orders/checkout", {
        shipping_address,
        payment_method,
      });
      return response.data;
    } catch (error: any) {
      console.error("Checkout failed:", error);
      throw error;
    }
  },

  async getOrders(): Promise<Order[]> {
    try {
      const response = await api.get("/orders");
      return response.data;
    } catch (error: any) {
      console.error("Failed to fetch orders:", error);
      throw error;
    }
  },

  async getOrder(id: number): Promise<Order> {
    try {
      const response = await api.get(`/orders/${id}`);
      return response.data;
    } catch (error: any) {
      console.error("Failed to fetch order:", error);
      throw error;
    }
  },
};
