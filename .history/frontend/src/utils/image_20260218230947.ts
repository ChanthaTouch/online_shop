// src/utils/image.ts
export const getImageUrl = (path: string | null | undefined): string => {
  if (!path || path.trim() === '') {
    return '/images/placeholder.jpg';
  }

  // Already full URL
  if (/^https?:\/\//i.test(path) || path.startsWith('//')) {
    return path;
  }

  // Clean Laravel storage patterns
  const clean = path
    .replace(/^\/?public\//, '')
    .replace(/^\/?storage\//, '')
    .replace(/^\//, '');

  const base = import.meta.env.VITE_API_BASE_URL
    ?.replace(/\/api\/?$/, '')
    ?? (import.meta.env.DEV ? 'http://127.0.0.1:8000' : ''); // fallback

  return `${base}/storage/${clean}`;
};

export const normalizeImages = (images?: (string | null | undefined)[] | null): string[] => {
  if (!images || !Array.isArray(images)) return [];
  return images.map(getImageUrl).filter(Boolean) as string[];
};