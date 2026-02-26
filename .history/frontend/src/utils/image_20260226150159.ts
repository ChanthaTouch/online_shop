// src/utils/image.ts

/**
 * Gets the base URL for storage by stripping the /api suffix from the API URL.
 */
export function getStorageBase(): string {
  const apiUrl = import.meta.env.VITE_API_URL || "";
  if (!apiUrl) return "";

  // 1. Remove /api from the end if it exists
  // 2. Remove any trailing slashes
  let base = apiUrl.replace(/\/api\/?$/, "").replace(/\/+$/, "");

  // Force HTTPS in production to prevent "Mixed Content" errors
  if (import.meta.env.PROD && base.startsWith("http:")) {
    base = base.replace(/^http:/, "https:");
  }
  
  return base;
}

/**
 * Normalizes an image path into a full, valid URL.
 */
export function getImageUrl(path?: string | null): string | null {
  if (!path || typeof path !== "string" || path.trim() === "") {
    return null;
  }

  // If it's already a full URL, just return it
  if (/^https?:\/\//i.test(path) || path.startsWith("//")) {
    return path;
  }

  // Clean the path: remove 'public/', 'storage/', and leading slashes
  const cleanPath = path
    .replace(/^\/?public\//, "")
    .replace(/^\/?storage\//, "")
    .replace(/^\//, "");

  const base = getStorageBase();
  
  // If we have a base (production), use it. Otherwise fallback to relative /storage/
  const finalUrl = base 
    ? `${base}/storage/${cleanPath}` 
    : `/storage/${cleanPath}`;

  // Final Production Safety: Ensure everything is HTTPS
  if (import.meta.env.PROD) {
    return finalUrl.replace(/^http:\/\//i, "https://");
  }

  return finalUrl;
}

/**
 * Converts an array of image paths into an array of full URLs.
 */
export function normalizeImages(images: any): string[] {
  if (!images) return [];
  const imageArray = Array.isArray(images) ? images : [images];
  
  return imageArray
    .map((img) => (typeof img === "string" ? getImageUrl(img) : getImageUrl(img?.path)))
    .filter((url): url is string => url !== null);
}