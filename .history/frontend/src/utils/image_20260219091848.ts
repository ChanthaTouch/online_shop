// src/utils/image.ts

const getBase = () => {
  // Get URL from .env (https://onlineshop-production-f1eb.up.railway.app/)
  const envUrl = import.meta.env.VITE_API_URL || '';
  // Remove /api and remove any trailing slashes to avoid // in URLs
  return envUrl.replace(/\/api\/?$/, '').replace(/\/$/, '');
};

export const getImageUrl = (path?: string | null): string => {
  if (!path || path.trim() === '') return '/images/placeholder.jpg';

  // CRITICAL FIX: If path starts with http, it's already a full URL. 
  // Return it as is and DO NOT add the Railway URL to it.
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  // Clean the path to avoid /storage/storage/ issues
  const cleanPath = path
    .replace(/^\//, '')
    .replace(/^public\//, '')
    .replace(/^storage\//, '');

  const base = getBase();
  
  // If no base is found in .env, fallback to local dev
  if (!base && import.meta.env.DEV) {
    return `http://127.0.0.1:8000/storage/${cleanPath}`;
  }

  return `${base}/storage/${cleanPath}`;
};

export const normalizeImages = (arr?: (string | null | undefined)[] | null): string[] =>
  Array.isArray(arr) ? arr.map(getImageUrl).filter(Boolean) as string[] : [];