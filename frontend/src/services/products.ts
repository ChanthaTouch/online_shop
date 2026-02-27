// src/services/products.ts
import api from "./api";
import { getImageUrl, normalizeImages } from "@/utils/image";

export interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  discount_price?: number | null;
  discount_percentage?: number | null;
  primary_image?: string | null;
  images?: string[];
  image_urls?: string[];
  variants?: any[];
  has_variants: boolean;
  is_on_sale: boolean;
  final_price?: number;
  lowest_price?: number;
  category?: any;
  display_image: string;
  description?: string;
  stock?: number;
  is_active?: boolean;
}

export const productService = {
  async getProducts(page = 1, category?: string, search?: string, discountPercentage?: number) {
    const { data: res } = await api.get("/products", {
      params: { page, category, search, discount_percentage: discountPercentage },
    });

    const products = (res.data || []).map((raw: any): Product => {
      const imgs = normalizeImages(raw.images || raw.image_urls);
      const primary =
        getImageUrl(raw.primary_image) ||
        imgs[0] ||
        "/images/placeholder-product.jpg";

      return {
        ...raw,
        price: Number(raw.price ?? 0),
        discount_price: raw.discount_price != null ? Number(raw.discount_price) : null,
        final_price: Number(raw.final_price ?? raw.price ?? 0),
        lowest_price: Number(raw.lowest_price ?? raw.price ?? 0),
        has_variants: Array.isArray(raw.variants) && raw.variants.length > 0,
        is_on_sale: !!raw.discount_price && raw.discount_price < raw.price,
        images: imgs,
        primary_image: primary,
        display_image: primary,
      };
    });

    return {
      ...res,
      data: products,
    };
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    try {
      const { data: raw } = await api.get(`/products/${slug}`);

      const imgs = normalizeImages(raw.images || raw.image_urls);
      const primary =
        getImageUrl(raw.primary_image) ||
        imgs[0] ||
        "/images/placeholder-product.jpg";

      return {
        ...raw,
        price: Number(raw.price ?? 0),
        discount_price: raw.discount_price != null ? Number(raw.discount_price) : null,
        final_price: Number(raw.final_price ?? raw.price ?? 0),
        lowest_price: Number(raw.lowest_price ?? raw.price ?? 0),
        has_variants: Array.isArray(raw.variants) && raw.variants.length > 0,
        is_on_sale: !!raw.discount_price && raw.discount_price < raw.discount_price,
        images: imgs,
        primary_image: primary,
        display_image: primary,
      };
    } catch (err: any) {
      if (err.response?.status === 404) return null;
      throw err;
    }
  },

  async getCategories() {
    const { data } = await api.get("/categories");
    return data;
  },

  async createProduct(formData: FormData) {
    const { data } = await api.post("/products", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  async updateProduct(id: number, formData: FormData) {
    const { data } = await api.post(`/products/${id}?_method=PUT`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  async deleteProduct(id: number) {
    const { data } = await api.delete(`/products/${id}`);
    return data;
  },
};

export default productService;