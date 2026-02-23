// src/utils/image.ts

const getBase = () => {
  const url = import.meta.env.VITE_API_URL || '';
  // 1. Remove /api if it exists
  // 2. Remove the trailing slash so we can control it manually
  return url.replace(/\/api\/?$/, '').replace(/\/$/, '');
};

export const getImageUrl = (path?: string | null): string => {
  if (!path || path.trim() === '') return '/images/placeholder.jpg';

  // If it's already a full URL (like your primary_image in the JSON), return it as is
  if (/^https?:\/\//i.test(path) || path.startsWith('//')) {
    return path;
  }

  // Clean the path: remove leading slashes and redundant storage/ prefixes
  const cleanPath = path
    .replace(/^\//, '')              // Remove leading slash
    .replace(/^public\//, '')        // Remove public/
    .replace(/^storage\//, '');      // Remove storage/

  // Construct the URL ensuring only one slash between parts
  return `${getBase()}/storage/${cleanPath}`;
};

export const normalizeImages = (arr?: (string | null | undefined)[] | null): string[] =>
  Array.isArray(arr) ? arr.map(getImageUrl).filter(Boolean) as string[] : [];