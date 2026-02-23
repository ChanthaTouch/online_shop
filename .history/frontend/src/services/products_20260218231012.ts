// src/services/products.ts
import api from "./api";
import { getImageUrl, normalizeImages } from '@/utils/image';

export interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  discount_price?: number | null;
  discount_percentage?: number | null;
  primary_image?: string | null;
  image_urls?: string[] | null;
  images?: string[] | null;
  variants?: any[];
  has_variants?: boolean;
  is_on_sale?: boolean;
  lowest_price?: number;
  final_price?: number;
  category?: any;
  display_image: string;     // now required - always has value
}

export const productService = {
  async getProducts(
    page = 1,
    category?: string,
    search?: string,
    discountPercentage?: number
  ) {
    const response = await api.get("/products", {
      params: { page, category, search, discount_percentage: discountPercentage },
    });

    const res = response.data;

    if (import.meta.env.DEV) {
      console.log("🔥 RAW first product:", JSON.stringify(res.data?.[0], null, 2));
    }

    res.data = res.data.map((raw: any): Product => {
      const primary = getImageUrl(raw.primary_image);
      const firstImage = getImageUrl(raw.image_urls?.[0] ?? raw.images?.[0]);

      return {
        ...raw,
        price: Number(raw.price),
        discount_price: raw.discount_price != null ? Number(raw.discount_price) : null,
        final_price: raw.final_price != null ? Number(raw.final_price) : null,
        lowest_price: raw.lowest_price != null ? Number(raw.lowest_price) : null,
        has_variants: Array.isArray(raw.variants) && raw.variants.length > 0,
        is_on_sale: !!raw.is_on_sale || (raw.discount_price != null && raw.discount_price < raw.price),
        primary_image: primary,
        images: normalizeImages(raw.images),
        image_urls: normalizeImages(raw.image_urls),
        display_image: primary || firstImage || '/images/placeholder.jpg',
        category: raw.category ?? null,
      };
    });

    return res;
  },

  async getProductBySlug(slug: string): Promise<Product> {
    const response = await api.get(`/products/${slug}`);
    const raw = response.data;

    const primary = getImageUrl(raw.primary_image);
    const firstImage = getImageUrl(raw.image_urls?.[0] ?? raw.images?.[0]);

    return {
      ...raw,
      price: Number(raw.price),
      discount_price: raw.discount_price != null ? Number(raw.discount_price) : null,
      final_price: raw.final_price != null ? Number(raw.final_price) : null,
      lowest_price: raw.lowest_price != null ? Number(raw.lowest_price) : null,
      has_variants: Array.isArray(raw.variants) && raw.variants.length > 0,
      is_on_sale: !!raw.is_on_sale || (raw.discount_price != null && raw.discount_price < raw.price),
      primary_image: primary,
      images: normalizeImages(raw.images),
      image_urls: normalizeImages(raw.image_urls),
      display_image: primary || firstImage || '/images/placeholder.jpg',
      category: raw.category ?? null,
    };
  },
};

export default productService;