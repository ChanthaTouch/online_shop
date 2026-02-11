// src/services/cart.ts
import api from './api';  // ← Use the shared axios instance

export interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  product?: {
    id: number;
    name: string;
    price: number;
    discount_price?: number | null;
    images?: string[];
    primary_image?: string | null;
    stock?: number | null;
    slug?: string | null;
  };
}

export interface CartResponse {
  id: number;
  user_id: number;
  items: CartItem[];
  total: number;
  total_items: number;
}

// Helper – converts relative storage paths → full URLs
function normalizeImagePath(path?: string | null): string | null {
  if (!path) return null;
  if (path.startsWith('http') || path.startsWith('//')) return path;

  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  // Use the same base as api (remove /api suffix if present)
  const base = api.defaults.baseURL?.replace(/\/api\/?$/, '') || 'http://127.0.0.1:8000';
  return `${base}/storage/${cleanPath}`;
}

function normalizeCartImages(cart: CartResponse): CartResponse {
  cart.items = cart.items.map((item) => {
    if (item.product) {
      item.product.images = (item.product.images || [])
        .map(normalizeImagePath)
        .filter((p): p is string => !!p);

      item.product.primary_image = normalizeImagePath(item.product.primary_image);
    }
    return item;
  });
  return cart;
}

export const cartService = {
  async getCart(): Promise<CartResponse> {
    try {
      const response = await api.get('/cart');
      return normalizeCartImages(response.data);
    } catch (error: any) {
      console.error('Failed to fetch cart:', error);
      throw new Error(error.response?.data?.message || 'Could not load cart');
    }
  },

  async addItem(productId: number, quantity: number = 1): Promise<CartResponse> {
    try {
      const response = await api.post('/cart/items', {
        product_id: productId,
        quantity,
      });
      return normalizeCartImages(response.data);
    } catch (error: any) {
      console.error('Add to cart failed:', error);
      throw new Error(
        error.response?.data?.message ||
          `Failed to add product #${productId} (qty: ${quantity})`
      );
    }
  },

  async updateItem(itemId: number, quantity: number): Promise<CartResponse> {
    if (quantity < 1) throw new Error('Quantity must be at least 1');

    try {
      // Note: your original CartController uses PATCH or PUT?
      // Most REST APIs use PATCH for partial updates → try .patch first
      const response = await api.patch(`/cart/items/${itemId}`, { quantity });
      // If your backend expects PUT instead → change to .put()
      return normalizeCartImages(response.data);
    } catch (error: any) {
      console.error('Update cart item failed:', error);
      throw new Error(error.response?.data?.message || 'Failed to update quantity');
    }
  },

  async removeItem(itemId: number): Promise<CartResponse> {
    try {
      const response = await api.delete(`/cart/items/${itemId}`);
      return normalizeCartImages(response.data);
    } catch (error: any) {
      console.error('Remove item failed:', error);
      throw new Error(error.response?.data?.message || 'Failed to remove item');
    }
  },

  async clearCart(): Promise<{ success: boolean; message?: string }> {
    try {
      // Your original controller has clear() but no dedicated route shown
      // Adjust method & path to match your actual route
      // Option A: DELETE /cart
      const response = await api.delete('/cart');
      // Option B: if you have POST /cart/clear → use api.post('/cart/clear')
      return response.data;
    } catch (error: any) {
      console.error('Clear cart failed:', error);
      throw new Error(error.response?.data?.message || 'Failed to clear cart');
    }
  },

  // Useful for cart badge / navbar count
  async getItemCount(): Promise<number> {
    try {
      const cart = await this.getCart();
      return cart.total_items ?? cart.items.reduce((sum, i) => sum + i.quantity, 0);
    } catch {
      return 0;
    }
  },
};

export default cartService;