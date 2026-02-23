// src/utils/image.ts

const getBase = () => {
  // Get URL from .env and remove trailing slashes and /api suffix
  const envUrl = import.meta.env.VITE_API_URL || '';
  return envUrl.replace(/\/api\/?$/, '').replace(/\/$/, '');
};

export const getImageUrl = (path?: string | null): string => {
  if (!path || path.trim() === '') return '/images/placeholder.jpg';

  // FIX: If path is already a full URL (starts with http), return it exactly as is.
  // This prevents https://railway.app/storage/http://127.0.0.1...
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  // Clean the path of common prefixes to avoid /storage/storage/
  const cleanPath = path
    .replace(/^\//, '')
    .replace(/^public\//, '')
    .replace(/^storage\//, '');

  const base = getBase();
  
  // If we are in local dev and no VITE_API_URL is set
  if (!base && import.meta.env.DEV) {
    return `http://127.0.0.1:8000/storage/${cleanPath}`;
  }

  return `${base}/storage/${cleanPath}`;
};

export const normalizeImages = (arr?: (string | null | undefined)[] | null): string[] =>
  Array.isArray(arr) ? arr.map(getImageUrl).filter(Boolean) as string[] : [];