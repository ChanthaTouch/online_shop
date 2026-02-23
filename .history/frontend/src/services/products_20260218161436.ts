// src/services/products.ts
import api from "./api";

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
  display_image?: string;
}

export const productService = {
  async getProducts(page = 1, category?: string, search?: string, discountPercentage?: number) {
    const response = await api.get("/products", {
      params: { page, category, search, discount_percentage: discountPercentage },
    });

    const res = response.data;

    console.log("🔥 RAW API RESPONSE (first product):", JSON.stringify(res.data[0], null, 2));

    res.data = res.data.map((p: any) => {
      // Take the first available full URL (your backend already gives full URLs)
      let displayImage = "/images/placeholder.jpg";

      if (p.primary_image && p.primary_image.startsWith("http")) {
        displayImage = p.primary_image;
      } else if (p.image_urls?.[0] && p.image_urls[0].startsWith("http")) {
        displayImage = p.image_urls[0];
      } else if (p.images?.[0] && p.images[0].startsWith("http")) {
        displayImage = p.images[0];
      }

      return {
        ...p,
        display_image: displayImage,
        has_variants: !!p.variants?.length,
        is_on_sale: !!p.is_on_sale || (p.discount_price != null && p.discount_price < p.price),
        price: Number(p.price),
        discount_price: p.discount_price != null ? Number(p.discount_price) : null,
        final_price: p.final_price ? Number(p.final_price) : null,
        lowest_price: p.lowest_price ? Number(p.lowest_price) : null,
      };
    });

    return res;
  },

  async getProductBySlug(slug: string) {
    const response = await api.get(`/products/${slug}`);
    return response.data;
  },
};

export default productService;