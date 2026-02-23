// src/services/products.ts
import api from "./api";
import { getImageUrl, normalizeImages } from '@/utils/image';

export interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  discount_price?: number | null;
  primary_image?: string | null;
  images?: string[] | null;
  display_image: string; 
  stock: number;
  category?: any;
}

export const productService = {
  async getProducts(page = 1, category?: string, search?: string, discountPercentage?: number) {
    const response = await api.get("/products", {
      params: { page, category, search, discount_percentage: discountPercentage },
    });

    const res = response.data;

    res.data = res.data.map((raw: any): Product => {
      // Process the images
      const primary = getImageUrl(raw.primary_image);
      const firstImg = (raw.images && raw.images.length > 0) ? getImageUrl(raw.images[0]) : null;

      return {
        ...raw,
        price: Number(raw.price ?? 0),
        primary_image: primary,
        images: normalizeImages(raw.images),
        // Use primary if exists, otherwise first image in array, otherwise placeholder
        display_image: primary || firstImg || '/images/placeholder.jpg',
      };
    });

    return res;
  }
};