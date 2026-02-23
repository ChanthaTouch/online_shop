// src/services/products.ts
import api from "./api";

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
      display_image: product.primary_image || "/images/placeholder.jpg",
      all_images: product.image_urls?.length > 0 ? product.image_urls : ["/images/placeholder.jpg"],
    }));

    return res;
  },

  /* GET SINGLE PRODUCT */
  async getProductBySlug(slug: string): Promise<Product> {
    const response = await api.get(`/products/${slug}`);
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

  /* GET SINGLE PRODUCT BY ID (admin) */
  async getProductById(id: number): Promise<Product> {
    const response = await api.get(`/products/${id}`);
    const product = response.data;

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
      images: normalizeImages(product.images || product.image_urls),
      image_urls: product.image_urls || [],
      primary_image: product.primary_image,
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