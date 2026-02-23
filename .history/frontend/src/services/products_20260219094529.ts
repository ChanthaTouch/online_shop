// src/services/products.ts
import api from "./api";
import { getImageUrl, normalizeImages } from '@/utils/image';  // make sure this file exists

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
  display_image: string;  // guaranteed to exist
}

// 1. Define the helper HERE at the top so both functions can use it
const parseImageUrl = (url?: string | null) => {
  if (!url) return null;
  
  // If it's already a full URL
  if (url.startsWith('http')) {
    // Force HTTPS in production to prevent Mixed Content blocked errors
    if (import.meta.env.PROD) {
      return url.replace(/^http:\/\//i, 'https://');
    }
    return url;
  }
  
  // If it's a relative path, pass it to your original utility
  return getImageUrl(url);
};

export const productService = {
  async getProducts(page = 1, category?: string, search?: string, discountPercentage?: number) {
    const response = await api.get("/products", {
      params: { page, category, search, discount_percentage: discountPercentage },
    });

    const res = response.data;

    if (import.meta.env.DEV) {
      console.log("🔥 RAW first product (list):", JSON.stringify(res.data?.[0], null, 2));
    }

    res.data = res.data.map((raw: any): Product => {
      // 2. Use parseImageUrl here
      const primary  = parseImageUrl(raw.primary_image);
      const firstImg = parseImageUrl(raw.images?.[0] ?? raw.image_urls?.[0]);

      return {
        ...raw,
        price: Number(raw.price ?? 0),
        discount_price: raw.discount_price != null ? Number(raw.discount_price) : null,
        final_price: raw.final_price != null ? Number(raw.final_price) : null,
        lowest_price: raw.lowest_price != null ? Number(raw.lowest_price) : null,
        has_variants: !!raw.variants?.length,
        is_on_sale: !!raw.is_on_sale || (raw.discount_price != null && raw.discount_price < raw.price),
        primary_image: primary,
        images: normalizeImages(raw.images),
        image_urls: normalizeImages(raw.image_urls),
        display_image: primary || firstImg || '/images/placeholder.jpg',
      };
    });

    return res;
  },

  async getProductBySlug(slug: string): Promise<Product> {
    const { data: raw } = await api.get(`/products/${slug}`);

    if (import.meta.env.DEV) {
      console.log("🔥 RAW single product:", JSON.stringify(raw, null, 2));
    }

    // 3. And use parseImageUrl here as well!
    const primary  = parseImageUrl(raw.primary_image);
    const firstImg = parseImageUrl(raw.images?.[0] ?? raw.image_urls?.[0]);

    return {
      ...raw,
      price: Number(raw.price ?? 0),
      discount_price: raw.discount_price != null ? Number(raw.discount_price) : null,
      final_price: raw.final_price != null ? Number(raw.final_price) : null,
      lowest_price: raw.lowest_price != null ? Number(raw.lowest_price) : null,
      has_variants: !!raw.variants?.length,
      is_on_sale: !!raw.is_on_sale || (raw.discount_price != null && raw.discount_price < raw.price),
      primary_image: primary,
      images: normalizeImages(raw.images),
      image_urls: normalizeImages(raw.image_urls),
      display_image: primary || firstImg || '/images/placeholder.jpg',
    };
  },
};

export default productService;