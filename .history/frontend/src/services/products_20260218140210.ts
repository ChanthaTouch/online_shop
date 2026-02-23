// src/services/products.ts
import api from "./api";

/* ---------------- TYPES ---------------- */

export interface Variant {
  size: string | null;
  price: number;
  final_price: number;
  is_default: boolean;
  stock?: number | null;          // ← added (common field)
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

  // Appended / computed fields
  variants?: Variant[];
  final_price?: number;
  lowest_price?: number;
  has_variants?: boolean;
  is_on_sale?: boolean;

  // Frontend helpers (added by service)
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

/* ---------------- IMAGE NORMALIZATION ---------------- */

const normalizeImageUrl = (path: string | null | undefined): string => {
  if (!path || path.trim() === '') {
    return '/images/placeholder.jpg';
  }

  // Already absolute URL → return as-is
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('//')) {
    return path;
  }

  // Clean leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;

  // Use same base logic as your api.ts + cart.ts
  const backendBase = api.defaults.baseURL?.replace(/\/api\/?$/, '')
    || (import.meta.env.DEV ? 'http://127.0.0.1:8000' : 'https://your-production-domain.com');

  return `${backendBase}/storage/${cleanPath}`;
};

/* ---------------- HELPERS ---------------- */

const normalizeImages = (images: any): string[] => {
  if (!images) return [];

  if (typeof images === "string") {
    try {
      const parsed = JSON.parse(images);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      return [images];
    }
  }

  if (Array.isArray(images)) {
    return images;
  }

  return [];
};

/* ---------------- SERVICE ---------------- */

export const productService = {
  /* GET PRODUCTS (paginated list) */
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

    res.data = res.data.map((product: any) => {
      const primary = normalizeImageUrl(product.primary_image);
      const urls = normalizeImages(product.image_urls || product.images || []).map(normalizeImageUrl);

      return {
        ...product,
        price: Number(product.price),
        discount_price: product.discount_price != null ? Number(product.discount_price) : null,
        final_price: product.final_price ? Number(product.final_price) : null,
        lowest_price: product.lowest_price ? Number(product.lowest_price) : null,
        has_variants: !!product.variants?.length,
        is_on_sale: !!product.is_on_sale || (product.discount_price != null && product.discount_price < product.price),
        variants: product.variants ?? [],
        display_image: primary,
        all_images: urls.length > 0 ? urls : [primary],
      };
    });

    return res;
  },

  /* GET SINGLE PRODUCT BY SLUG (public) */
  async getProductBySlug(slug: string): Promise<Product> {
    const response = await api.get(`/products/${slug}`);
    const product = response.data;

    const primary = normalizeImageUrl(product.primary_image);
    const urls = normalizeImages(product.image_urls || product.images || []).map(normalizeImageUrl);

    return {
      ...product,
      price: Number(product.price),
      discount_price: product.discount_price != null ? Number(product.discount_price) : null,
      final_price: product.final_price ? Number(product.final_price) : null,
      lowest_price: product.lowest_price ? Number(product.lowest_price) : null,
      discount_percentage: product.discount_percentage != null ? Number(product.discount_percentage) : null,
      has_variants: !!product.variants?.length,
      is_on_sale: !!product.is_on_sale || (product.discount_price != null && product.discount_price < product.price),
      variants: product.variants ?? [],
      display_image: primary,
      all_images: urls.length > 0 ? urls : [primary],
      images: urls,                    // for backward compatibility if any component uses .images
      primary_image: primary,          // normalized
      image_urls: urls,                // normalized
    };
  },

  /* GET SINGLE PRODUCT BY ID (usually admin) */
  async getProductById(id: number): Promise<Product> {
    const response = await api.get(`/products/${id}`);
    const product = response.data;

    const primary = normalizeImageUrl(product.primary_image);
    const urls = normalizeImages(product.image_urls || product.images || []).map(normalizeImageUrl);

    return {
      ...product,
      price: Number(product.price),
      discount_price: product.discount_price != null ? Number(product.discount_price) : null,
      discount_percentage: product.discount_percentage != null ? Number(product.discount_percentage) : null,
      final_price: product.final_price ? Number(product.final_price) : null,
      lowest_price: product.lowest_price ? Number(product.lowest_price) : null,
      has_variants: !!product.variants?.length,
      is_on_sale: !!product.is_on_sale || (product.discount_price != null && product.discount_price < product.price),
      variants: product.variants ?? [],
      display_image: primary,
      all_images: urls.length > 0 ? urls : [primary],
      images: urls,
      primary_image: primary,
      image_urls: urls,
    };
  },

  /* CREATE PRODUCT (admin) */
  async createProduct(formData: FormData): Promise<Product> {
    const response = await api.post("/products", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const product = response.data;

    const primary = normalizeImageUrl(product.primary_image);
    const urls = normalizeImages(product.image_urls || product.images || []).map(normalizeImageUrl);

    return {
      ...product,
      price: Number(product.price),
      discount_price: product.discount_price != null ? Number(product.discount_price) : null,
      final_price: product.final_price ? Number(product.final_price) : null,
      lowest_price: product.lowest_price ? Number(product.lowest_price) : null,
      has_variants: !!product.variants?.length,
      is_on_sale: !!product.is_on_sale,
      variants: product.variants ?? [],
      display_image: primary,
      all_images: urls.length > 0 ? urls : [primary],
      images: urls,
      primary_image: primary,
      image_urls: urls,
    };
  },

  /* UPDATE PRODUCT (admin) */
  async updateProduct(id: number, formData: FormData): Promise<Product> {
    const response = await api.put(`/products/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const product = response.data;

    const primary = normalizeImageUrl(product.primary_image);
    const urls = normalizeImages(product.image_urls || product.images || []).map(normalizeImageUrl);

    return {
      ...product,
      price: Number(product.price),
      discount_price: product.discount_price != null ? Number(product.discount_price) : null,
      final_price: product.final_price ? Number(product.final_price) : null,
      lowest_price: product.lowest_price ? Number(product.lowest_price) : null,
      has_variants: !!product.variants?.length,
      is_on_sale: !!product.is_on_sale,
      variants: product.variants ?? [],
      display_image: primary,
      all_images: urls.length > 0 ? urls : [primary],
      images: urls,
      primary_image: primary,
      image_urls: urls,
    };
  },

  /* GET ALL CATEGORIES */
  async getCategories(): Promise<Category[]> {
    const response = await api.get("/categories");
    return response.data.map((cat: any) => ({
      ...cat,
      image: normalizeImageUrl(cat.image),
    }));
  },
};

export default productService;