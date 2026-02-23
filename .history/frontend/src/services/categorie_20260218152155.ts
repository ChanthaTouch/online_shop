// src/services/category.ts    ← recommended filename (singular or plural is fine, but consistent naming helps)

import api from '@/services/api';   // assuming this is your axios instance

// If you want to keep it configurable via env (strongly recommended)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL 
  ?? 'http://127.0.0.1:8000';     // fallback for local dev

/* ────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────── */

export interface Category {
  id:           number;
  name:         string;
  slug:         string | null;
  description?: string | null;
  image?:       string | null;     // path from backend (e.g. "categories/coffee.jpg")
  created_at:   string;
  updated_at:   string;
}

export interface NormalizedCategory extends Category {
  image: string | null;            // always full URL or null
}

/* ────────────────────────────────────────────────
   IMAGE URL NORMALIZATION
───────────────────────────────────────────────── */

function normalizeImageUrl(imagePath: string | null | undefined): string | null {
  if (!imagePath || typeof imagePath !== 'string' || imagePath.trim() === '') {
    return null;
  }

  // Already absolute URL → return as-is
  if (/^https?:\/\//i.test(imagePath) || imagePath.startsWith('//')) {
    return imagePath;
  }

  // Common Laravel storage patterns
  let cleanPath = imagePath
    .replace(/^\/?public\//, '')
    .replace(/^\/?storage\//, '')
    .replace(/^\//, '');

  return `${API_BASE_URL}/storage/${cleanPath}`;
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
      
      // Handle both { data: [...] } and direct array responses
      const raw = Array.isArray(response.data) 
        ? response.data 
        : (response.data?.data ?? []);

      const categories = raw.map((cat: any): NormalizedCategory => ({
        id:           Number(cat.id),
        name:         String(cat.name ?? ''),
        slug:         cat.slug ?? null,
        description:  cat.description ?? null,
        image:        normalizeImageUrl(cat.image),
        created_at:   String(cat.created_at ?? ''),
        updated_at:   String(cat.updated_at ?? ''),
      }));

      // Optional: debug in development only
      if (import.meta.env.DEV) {
        console.log('Loaded categories:', 
          categories.map(c => ({ 
            name: c.name, 
            slug: c.slug, 
            image: c.image 
          }))
        );
      }

      return categories;
    } catch (err) {
      console.warn('Failed to load categories:', err);
      return [];   // graceful fallback – UI usually handles empty array well
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
        image:        normalizeImageUrl(cat.image),
        created_at:   String(cat.created_at ?? ''),
        updated_at:   String(cat.updated_at ?? ''),
      };
    } catch (err: any) {
      if (err?.response?.status === 404) {
        return null;
      }
      console.warn(`Failed to load category ${slug}:`, err);
      return null;
    }
  },


  /**
   * Create new category (admin only)
   * Expects FormData with fields: name, slug?, description?, image (file)
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
        image:        normalizeImageUrl(cat.image),
        created_at:   String(cat.created_at ?? ''),
        updated_at:   String(cat.updated_at ?? ''),
      };
    } catch (err) {
      console.error('Failed to create category:', err);
      throw err;   // let caller handle error (show toast, etc.)
    }
  },

  // Bonus: if you later need update/delete
  // async updateCategory(id: number, formData: FormData): Promise<NormalizedCategory> { ... }
  // async deleteCategory(id: number): Promise<void> { ... }
};

export default categoryService;