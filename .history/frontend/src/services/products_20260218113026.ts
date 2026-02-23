// src/services/products.ts
import api from "./api";
import { toStorageImageUrl } from "./imageUrl";

/* ---------------- TYPES ---------------- */

export interface Variant {
  size: string | null;
  price: number;
  final_price: number;
  is_default: boolean;
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

  // New appended fields
  variants?: Variant[];
  final_price?: number;
  lowest_price?: number;
  has_variants?: boolean;
  is_on_sale?: boolean;
}

export interface ProductResponse {
  data: Product[];
  current_page: number;
  last_page: number;
  total: number;
}

/* ---------------- HELPERS ---------------- */

/** Placeholder when no image: inline SVG so we never request a missing file (avoids text/html) */
export const PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect fill='%23e5e7eb' width='400' height='400'/%3E%3C/svg%3E";

/** Build full URL for storage image; same-origin in dev to avoid ad-blocker blocking */
function toFullImageUrl(path?: string | null): string | null {
  return toStorageImageUrl(path);
}

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

  return Array.isArray(images) ? images : [];
};

/** Normalize image URL or array of URLs to full URLs; fallback to placeholder for display */
function normalizeProductImageUrls(urls: string[] | undefined): string[] {
  if (!urls?.length) return [PLACEHOLDER_IMAGE];
  const mapped = urls.map((u) => toFullImageUrl(u) ?? PLACEHOLDER_IMAGE);
  const hasReal = mapped.some((u) => u !== PLACEHOLDER_IMAGE);
  return hasReal ? mapped : [PLACEHOLDER_IMAGE];
}

function normalizeProductPrimaryImage(url: string | undefined | null): string {
  const full = toFullImageUrl(url);
  return full ?? PLACEHOLDER_IMAGE;
}

/* ---------------- SERVICE ---------------- */

export const productService = {
  /* GET PRODUCTS */
  async getProducts(
    page = 1,
    category?: string,
    search?: string,
    discountPercentage?: number
  ): Promise<ProductResponse> {
    const response = await api.get("/products", {
      params: { page, category, search, discount_percentage: discountPercentage },
    });

    const res = response.data;

    res.data = res.data.map((product: any) => ({
      ...product,
      price: Number(product.price),
      discount_price: product.discount_price != null ? Number(product.discount_price) : null,
      final_price: product.final_price ? Number(product.final_price) : null,
      lowest_price: product.lowest_price ? Number(product.lowest_price) : null,
      has_variants: !!product.has_variants,
      is_on_sale: !!product.is_on_sale,
      variants: product.variants ?? [],
      display_image: normalizeProductPrimaryImage(product.primary_image),
      all_images: normalizeProductImageUrls(product.image_urls),
    }));

    return res;
  },

  /* GET SINGLE PRODUCT */
  async getProductBySlug(slug: string): Promise<Product> {
    const response = await api.get(`/products/${slug}`);
    const product = response.data;
    const imageUrls = normalizeProductImageUrls(product.image_urls);
    const primary = toFullImageUrl(product.primary_image) ?? imageUrls[0] ?? PLACEHOLDER_IMAGE;

    return {
      ...product,
      price: Number(product.price),
      discount_price: product.discount_price != null ? Number(product.discount_price) : null,
      final_price: product.final_price ? Number(product.final_price) : null,
      lowest_price: product.lowest_price ? Number(product.lowest_price) : null,
      has_variants: !!product.has_variants,
      is_on_sale: !!product.is_on_sale,
      variants: product.variants ?? [],
      images: imageUrls,
      image_urls: imageUrls,
      primary_image: primary,
    };
  },

  /* GET SINGLE PRODUCT BY ID (admin) */
  async getProductById(id: number): Promise<Product> {
    const response = await api.get(`/products/${id}`);
    const product = response.data;
    const imageUrls = normalizeProductImageUrls(product.image_urls);
    const primary = toFullImageUrl(product.primary_image) ?? imageUrls[0] ?? PLACEHOLDER_IMAGE;

    return {
      ...product,
      price: Number(product.price),
      discount_price: product.discount_price != null ? Number(product.discount_price) : null,
      discount_percentage: product.discount_percentage != null ? Number(product.discount_percentage) : null,
      final_price: product.final_price ? Number(product.final_price) : null,
      lowest_price: product.lowest_price ? Number(product.lowest_price) : null,
      has_variants: !!product.has_variants,
      is_on_sale: !!product.is_on_sale,
      variants: product.variants ?? [],
      images: imageUrls,
      image_urls: imageUrls,
      primary_image: primary,
    };
  },

  /* Other methods (create/update) - add same mapping for new fields */
  async createProduct(formData: FormData): Promise<Product> {
    const response = await api.post("/products", formData);
    const product = response.data;

    return {
      ...product,
      price: Number(product.price),
      discount_price: product.discount_price != null ? Number(product.discount_price) : null,
      final_price: product.final_price ? Number(product.final_price) : null,
      lowest_price: product.lowest_price ? Number(product.lowest_price) : null,
      has_variants: !!product.has_variants,
      is_on_sale: !!product.is_on_sale,
      variants: product.variants ?? [],
      images: normalizeImages(product.images || product.image_urls),
    };
  },

  async updateProduct(id: number, formData: FormData): Promise<Product> {
    const response = await api.put(`/products/${id}`, formData);
    const product = response.data;

    return {
      ...product,
      price: Number(product.price),
      discount_price: product.discount_price != null ? Number(product.discount_price) : null,
      final_price: product.final_price ? Number(product.final_price) : null,
      lowest_price: product.lowest_price ? Number(product.lowest_price) : null,
      has_variants: !!product.has_variants,
      is_on_sale: !!product.is_on_sale,
      variants: product.variants ?? [],
      images: normalizeImages(product.images || product.image_urls),
    };
  },

  async getCategories(): Promise<Category[]> {
    const response = await api.get("/categories");
    return response.data;
  },
};