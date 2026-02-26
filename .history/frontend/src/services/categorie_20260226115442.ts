// src/services/category.ts

import api from '@/services/api';
import { getImageUrl } from '@/utils/image'; // Import the central utility

/* ────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────── */

export interface Category {
  id:           number;
  name:         string;
  slug:         string | null;
  description?: string | null;
  image?:       string | null;     
  created_at:   string;
  updated_at:   string;
}

export interface NormalizedCategory extends Category {
  image: string | null;            // Always a full URL or null
}

/* ────────────────────────────────────────────────
   SERVICE
───────────────────────────────────────────────── */

export const categoryService = {
  /**
   * Fetch all product categories
   */
  async getCategories(): Promise<NormalizedCategory[]> {
    try {
      const response = await api.get('/categories');
      
      const raw = Array.isArray(response.data) 
        ? response.data 
        : (response.data?.data ?? []);

      const categories = raw.map((cat: any): NormalizedCategory => ({
        id:           Number(cat.id),
        name:         String(cat.name ?? ''),
        slug:         cat.slug ?? null,
        description:  cat.description ?? null,
        // Use the centralized utility to fix protocol/path issues
        image:        getImageUrl(cat.image), 
        created_at:   String(cat.created_at ?? ''),
        updated_at:   String(cat.updated_at ?? ''),
      }));

      if (import.meta.env.DEV) {
        console.log('[Categories] Normalized:', categories.map(c => ({ name: c.name, image: c.image })));
      }

      return categories;
    } catch (err) {
      console.warn('Failed to load categories:', err);
      return [];   
    }
  },

  /**
   * Fetch single category by slug
   */
  async getCategoryBySlug(slug: string): Promise<NormalizedCategory | null> {
    if (!slug?.trim()) return null;

    try {
      const response = await api.get(`/categories/${slug.trim()}`);
      const cat = response.data;

      if (!cat?.id) return null;

      return {
        id:           Number(cat.id),
        name:         String(cat.name ?? ''),
        slug:         cat.slug ?? null,
        description:  cat.description ?? null,
        image:        getImageUrl(cat.image), // Consistent normalization
        created_at:   String(cat.created_at ?? ''),
        updated_at:   String(cat.updated_at ?? ''),
      };
    } catch (err: any) {
      if (err?.response?.status === 404) return null;
      console.warn(`Failed to load category ${slug}:`, err);
      return null;
    }
  },

  /**
   * Create new category (admin only)
   */
  async createCategory(formData: FormData): Promise<NormalizedCategory> {
    try {
      const response = await api.post('/categories', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const cat = response.data;

      return {
        id:           Number(cat.id),
        name:         String(cat.name ?? ''),
        slug:         cat.slug ?? null,
        description:  cat.description ?? null,
        image:        getImageUrl(cat.image), // Normalized for immediate UI update
        created_at:   String(cat.created_at ?? ''),
        updated_at:   String(cat.updated_at ?? ''),
      };
    } catch (err) {
      console.error('Failed to create category:', err);
      throw err;   
    }
  },
};

export default categoryService;