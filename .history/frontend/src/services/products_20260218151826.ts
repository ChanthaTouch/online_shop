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
  discount_starts_at?: string | null;
  discount_ends_at?: string | null;
  images?: string[];
  stock?: number | null;
  sugar_level?: number | null;
  primary_image?: string | null;
  image_urls?: string[];
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;

  variants?: Variant[];
  final_price?: number;
  lowest_price?: number;
  has_variants?: boolean;
  is_on_sale?: boolean;

  display_image?: string;
  all_images?: string[];
}

export interface ProductResponse {
  data: Product[];
  current_page: number;
  last_page: number;
  total: number;
  from?: number;
  to?: number;
}

/* ---------------- IMAGE NORMALIZATION (Improved) ---------------- */

const normalizeImageUrl = (path: string | null | undefined): string => {
  if (!path || path.trim() === '') {
    return '/images/placeholder.jpg';
  }

  // Already full URL → keep as is
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('//')) {
    return path;
  }

  // Remove leading slash, storage/ prefix, public/ prefix if present
  let clean = path.replace(/^(\/|public\/|storage\/)*/i, '');

  // Common Laravel storage paths
  const backendBase = api.defaults.baseURL?.replace(/\/api\/?$/, '')
    || (import.meta.env.DEV ? 'http://127.0.0.1:8000' : 'https://your-domain.com');

  return `${backendBase}/storage/${clean}`;
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

  // Filter invalid & normalize
  return arr
    .filter((img): img is string => typeof img === 'string' && img.trim() !== '')
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

    const res = response.data as ProductResponse;

    res.data = res.data.map((p: any) => {
      const primary = normalizeImageUrl(p.primary_image);
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

  // ... (getProductById, createProduct, updateProduct, getCategories remain similar)
  // Just make sure they also use the updated normalizeImageUrl & normalizeImages
};

export default productService;