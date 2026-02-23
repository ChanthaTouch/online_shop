// src/utils/image.ts
const getBase = () =>
  import.meta.env.VITE_API_URL
    ?.replace(/\/api\/?$/, '')
    ?? (import.meta.env.DEV ? 'http://127.0.0.1:8000' : '');

export const getImageUrl = (path?: string | null): string => {
  if (!path || path.trim() === '') return '/images/placeholder.jpg';

  // Already full absolute URL → trust it
  if (/^https?:\/\//i.test(path) || path.startsWith('//')) {
    return path;
  }

  // Clean common Laravel patterns
  const clean = path
    .replace(/^\/?public\//, '')
    .replace(/^\/?storage\//, '')
    .replace(/^\//, '');

  return `${getBase()}/storage/${clean}`;
};

export const normalizeImages = (arr?: (string | null | undefined)[] | null): string[] =>
  Array.isArray(arr) ? arr.map(getImageUrl).filter(Boolean) as string[] : [];