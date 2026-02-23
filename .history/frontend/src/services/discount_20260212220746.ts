// src/services/discount.ts
import api from "./api";

/* ────────────── TYPES ────────────── */

export interface Discount {
  id: number;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  title?: string;
  description?: string;
  link?: string;
  min_order_amount?: number | null;
  max_uses?: number | null;
  uses?: number;
  expires_at?: string | null;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface DiscountResponse {
  data: Discount[];
  current_page: number;
  last_page: number;
  total: number;
  from?: number;
  to?: number;
}

export interface CreateDiscountInput {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  title?: string;
  description?: string;
  link?: string;
  min_order_amount?: number | null;
  max_uses?: number | null;
  expires_at?: string | null;
  active?: boolean;
}

export interface UpdateDiscountInput {
  code?: string;
  type?: 'percentage' | 'fixed';
  value?: number;
  title?: string;
  description?: string;
  link?: string;
  min_order_amount?: number | null;
  max_uses?: number | null;
  expires_at?: string | null;
  active?: boolean;
}

/* ────────────── SERVICE ────────────── */

export const discountService = {
  /* GET ALL DISCOUNTS (Admin) */
  async getDiscounts(page = 1): Promise<DiscountResponse> {
    const response = await api.get("/discounts", {
      params: { page },
    });
    return response.data;
  },

  /* GET SINGLE DISCOUNT */
  async getDiscountById(id: number): Promise<Discount> {
    const response = await api.get(`/discounts/${id}`);
    return response.data;
  },

  /* CREATE DISCOUNT (Admin) */
  async createDiscount(data: CreateDiscountInput): Promise<Discount> {
    const response = await api.post("/discounts", data);
    return response.data.discount || response.data;
  },

  /* UPDATE DISCOUNT (Admin) */
  async updateDiscount(id: number, data: UpdateDiscountInput): Promise<Discount> {
    const response = await api.put(`/discounts/${id}`, data);
    return response.data.discount || response.data;
  },

  /* DELETE DISCOUNT (Admin) */
  async deleteDiscount(id: number): Promise<{ message: string }> {
    const response = await api.delete(`/discounts/${id}`);
    return response.data;
  },

  /* APPLY DISCOUNT CODE (Public) */
  async applyDiscount(code: string): Promise<{ success: boolean; code: string; discount_amount: number; message: string }> {
    const response = await api.post("/discounts/apply", { code });
    return response.data;
  },

  /* GET ACTIVE SPECIAL OFFERS (Public) */
  async getActiveOffers(): Promise<Discount[]> {
    const response = await api.get("/discounts");
    // Filter for active discounts and percentage type
    return response.data.data.filter((discount: Discount) => 
      discount.active && discount.type === 'percentage'
    );
  },
};
