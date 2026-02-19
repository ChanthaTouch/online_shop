// src/utils/image.ts

/**
 * Get the backend base URL for storage assets (images).
 * - In DEV: always use '' so /storage goes through Vite proxy (avoids 307/CORS).
 * - In PROD: use full backend URL from VITE_API_URL when set.
 */
export const getStorageBase = (): string => {
  if (import.meta.env.DEV) return '';
  const envUrl = (import.meta.env.VITE_API_URL || '').trim();
  const normalized = envUrl.replace(/\/api\/?$/, '').replace(/\/+$/, '');
  const isLocal = !normalized || /localhost|127\.0\.0\.1|^\/api/i.test(normalized);
  if (isLocal) return '';
  return normalized;
};

export const PLACEHOLDER_IMAGE = '/images/placeholder.svg';

/**
 * Build full URL for a storage path (e.g. "products/abc.jpg").
 * - DEV: uses relative /storage/xxx so Vite proxy forwards to local backend (no CORS/307)
 * - PROD: uses full backend URL from VITE_API_URL
 */
export const getImageUrl = (path?: string | null): string => {
  if (!path || path.trim() === '') return PLACEHOLDER_IMAGE;

  if (/^https?:\/\//i.test(path)) return path;

  const cleanPath = path
    .replace(/^\//, '')
    .replace(/^public\//, '')
    .replace(/^storage\//, '');

  const base = getStorageBase();
  if (!base) {
    return `/storage/${cleanPath}`;
  }
  return `${base}/storage/${cleanPath}`;
};

export const normalizeImages = (arr?: (string | null | undefined)[] | null): string[] =>
  Array.isArray(arr) ? arr.map(getImageUrl).filter(Boolean) as string[] : [];