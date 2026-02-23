// src/services/categorie.ts

import api from "./api";


const API_BASE_URL = 'http://127.0.0.1:8000';  // Or use import.meta.env.VITE_API_URL for env var

/* ---------------- TYPES ---------------- */

export interface Category {
  id: number;
  name: string;
  slug: string | null;
  description: string | null;
  image: string | null;  // full URL after normalization
  created_at: string;
  updated_at: string;
}

/* ---------------- HELPERS ---------------- */

/**
 * Normalize category image to full URL (same-origin in dev to avoid ad-blocker blocking)
 */
const normalizeCategoryImage = (image: any): string | null => {
  if (!image || typeof image !== "string") return null;
  return toStorageImageUrl(image);
};

/* ---------------- SERVICE ---------------- */

export const categoryService = {
  /**
   * GET ALL CATEGORIES
   * Used on homepage / category listing
   */
  async getCategories(): Promise<Category[]> {
    const response = await api.get("/categories");
    const categories: any[] = response.data;

    const mapped = categories.map((cat) => ({
      ...cat,
      slug: cat.slug ?? null,
      description: cat.description ?? null,
      image: normalizeCategoryImage(cat.image),
      created_at: cat.created_at,
      updated_at: cat.updated_at,
    }));

    return mapped;
  },

  /**
   * Optional: GET SINGLE CATEGORY BY SLUG
   */
  async getCategoryBySlug(slug: string): Promise<Category> {
    const response = await api.get(`/categories/${slug}`);
    const category = response.data;

    return {
      ...category,
      slug: category.slug ?? null,
      description: category.description ?? null,
      image: normalizeCategoryImage(category.image),
      created_at: category.created_at,
      updated_at: category.updated_at,
    };
  },

  /**
   * Optional: CREATE CATEGORY (admin only)
   */
  async createCategory(formData: FormData): Promise<Category> {
    const response = await api.post("/categories", formData);
    const category = response.data;

    return {
      ...category,
      slug: category.slug ?? null,
      description: category.description ?? null,
      image: normalizeCategoryImage(category.image),
      created_at: category.created_at,
      updated_at: category.updated_at,
    };
  },
};