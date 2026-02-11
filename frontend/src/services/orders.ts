// src/services/orders.ts
import api from "./api";

export interface OrderItem {
  id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  line_total: number;
  attributes?: Record<string, any>;
  product?: {
    id: number;
    name: string;
    slug: string;
    price: number;
    discount_price?: number;
    primary_image?: string;
    image_urls?: string[];
  };
}

export interface Order {
  id: number;
  user_id: number;
  order_number: string;
  status: string;
  subtotal: number;
  discount: number;
  shipping_fee: number;
  total: number;
  payment_method: string;
  shipping_address?: Record<string, any>;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface OrderResponse {
  data: Order[];
  current_page: number;
  last_page: number;
  total: number;
}

export const orderService = {
  async getOrders(page = 1): Promise<OrderResponse> {
    const response = await api.get("/orders", {
      params: { page },
    });
    return response.data;
  },

  async getOrder(id: number): Promise<Order> {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  async checkout(
    shippingAddress: Record<string, any>,
    paymentMethod: string,
    discountCode?: string // Optional – only sent if provided
  ): Promise<{ message: string; order: Order }> {
    const payload: any = {
      shipping_address: shippingAddress,
      payment_method: paymentMethod,
    };

    // Only include discount_code if a non-empty value is provided
    if (discountCode && discountCode.trim() !== '') {
      payload.discount_code = discountCode.trim();
    }

    const response = await api.post("/orders/checkout", payload);
    return response.data;
  },

  async cancelOrder(id: number): Promise<{ message: string }> {
    const response = await api.post(`/orders/${id}/cancel`);
    return response.data;
  },
};