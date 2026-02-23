// src/services/products.ts
import api from "./api";

/* ---------------- TYPES ---------------- */
export interface Variant {
  size: string | null;
  price: number;
  final_price: number;
  is_default: boolean;
  stock?: number | null;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  price: number;
  discount_price?: number | null;
  image_urls?: string[];
  primary_image?: string | null;
  variants?: Variant[];
  // Calculated fields
  display_image?: string;
  all_images?: string[];
}

/* ---------------- IMAGE NORMALIZATION ---------------- */

const normalizeImageUrl = (path: string | null | undefined): string => {
  if (!path || path.trim() === '') return '/images/placeholder.jpg';
  if (path.startsWith('http')) return path;

  // Get base URL from axios or env
  const backendBase = api.defaults.baseURL?.replace(/\/api\/?$/, '') 
    || 'http://127.0.0.1:8000';

  // Remove public/ and leading slashes
  let cleanPath = path.replace(/^(\/|public\/)*/i, '');
  
  // Ensure storage/ prefix exists
  if (!cleanPath.startsWith('storage/')) {
    cleanPath = `storage/${cleanPath}`;
  }

  return `${backendBase}/${cleanPath}`;
};

const normalizeImages = (input: any): string[] => {
  if (!input) return [];
  let arr: string[] = [];
  
  if (typeof input === 'string') {
    try {
      const parsed = JSON.parse(input);
      arr = Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      arr = [input];
    }
  } else if (Array.isArray(input)) {
    arr = input;
  }

  return arr.map(normalizeImageUrl);
};

/* ---------------- SERVICE ---------------- */

export const productService = {
  async getProducts(page = 1, category?: string, search?: string) {
    const response = await api.get("/products", {
      params: { page, category, search },
    });

    const res = response.data;
    res.data = res.data.map((p: any) => {
      const primary = normalizeImageUrl(p.primary_image);
      const urls = normalizeImages(p.image_urls || p.images);
      return {
        ...p,
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
    const urls = normalizeImages(p.image_urls || p.images);

    return {
      ...p,
      primary_image: primary,
      image_urls: urls.length > 0 ? urls : [primary],
      display_image: primary,
      all_images: urls.length > 0 ? urls : [primary],
    };
  }
};

export default productService;