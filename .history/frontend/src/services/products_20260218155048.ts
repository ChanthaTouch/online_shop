// src/services/products.ts
import api from "./api";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000";

/* ---------------- TYPES ---------------- */
export interface Variant {
  size: string | null;
  price: number;
  final_price: number;
  is_default: boolean;
  stock?: number | null;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  image?: string | null;
}

export interface Product {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  description?: string | null;
  price: number;
  discount_price?: number | null;
  discount_percentage?: number | null;
  images?: string[];           // ← from DB (array of paths)
  primary_image?: string | null;
  image_urls?: string[];
  variants?: Variant[];
  final_price?: number;
  lowest_price?: number;
  has_variants?: boolean;
  is_on_sale?: boolean;
  display_image?: string;
  all_images?: string[];
  category?: Category;
}

export interface ProductResponse {
  data: Product[];
  current_page: number;
  last_page: number;
  total: number;
  from?: number;
  to?: number;
}

/* ---------------- IMAGE NORMALIZATION ---------------- */
const normalizeImageUrl = (path: string | null | undefined): string => {
  if (!path || typeof path !== "string" || path.trim() === "") {
    return "/images/placeholder.jpg";
  }

  if (/^https?:\/\//i.test(path) || path.startsWith("//")) {
    return path;
  }

  const clean = path
    .replace(/^\/?public\//, "")
    .replace(/^\/?storage\//, "")
    .replace(/^\//, "");

  return `${API_BASE_URL}/storage/${clean}`;
};

const normalizeImages = (input: any): string[] => {
  if (!input) return [];

  let arr: string[] = [];
  if (typeof input === "string") {
    try {
      const parsed = JSON.parse(input);
      arr = Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      arr = [input];
    }
  } else if (Array.isArray(input)) {
    arr = input;
  }

  return arr
    .filter((img): img is string => typeof img === "string" && img.trim() !== "")
    .map(normalizeImageUrl);
};

/* ---------------- SERVICE ---------------- */
export const productService = {
  async getProducts(
    page = 1,
    category?: string,
    search?: string,
    discountPercentage?: number
  ): Promise<ProductResponse> {
    const response = await api.get("/products", {
      params: { page, category, search, discount_percentage: discountPercentage },
    });

    const res = response.data as any;

    res.data = res.data.map((p: any) => {
      // FIXED: Use primary_image OR first image from images array
      let primary = normalizeImageUrl(p.primary_image);

      if (primary === "/images/placeholder.jpg") {
        const urls = normalizeImages(p.image_urls || p.images || []);
        primary = urls[0] || "/images/placeholder.jpg";
      }

      const urls = normalizeImages(p.image_urls || p.images || []);

      return {
        ...p,
        price: Number(p.price),
        discount_price: p.discount_price != null ? Number(p.discount_price) : null,
        final_price: p.final_price ? Number(p.final_price) : null,
        lowest_price: p.lowest_price ? Number(p.lowest_price) : null,
        has_variants: !!p.variants?.length,
        is_on_sale: !!p.is_on_sale || (p.discount_price != null && p.discount_price < p.price),
        variants: p.variants ?? [],
        display_image: primary,
        all_images: urls.length > 0 ? urls : [primary],
      };
    });

    return res;
  },

  async getProductBySlug(slug: string): Promise<Product> {
    const response = await api.get(`/products/${slug}`);
    const p = response.data;

    const primary = normalizeImageUrl(p.primary_image);
    const urls = normalizeImages(p.image_urls || p.images || []);

    return {
      ...p,
      price: Number(p.price),
      discount_price: p.discount_price != null ? Number(p.discount_price) : null,
      final_price: p.final_price ? Number(p.final_price) : null,
      lowest_price: p.lowest_price ? Number(p.lowest_price) : null,
      discount_percentage: p.discount_percentage != null ? Number(p.discount_percentage) : null,
      has_variants: !!p.variants?.length,
      is_on_sale: !!p.is_on_sale || (p.discount_price != null && p.discount_price < p.price),
      variants: p.variants ?? [],
      display_image: primary,
      all_images: urls.length > 0 ? urls : [primary],
      images: urls,
      primary_image: primary,
      image_urls: urls,
    };
  },
};

export default productService;