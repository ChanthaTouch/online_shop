// src/utils/image.ts

/**
 * Gets the base URL for storage from environment variables.
 * Ensures no trailing slashes are present.
 */
export function getStorageBase(): string {
  const apiUrl = import.meta.env.VITE_API_URL || "";
  if (!apiUrl) return "";

  // Remove /api suffix if present and any trailing slashes
  const base = apiUrl.replace(/\/api$/, "").replace(/\/+$/, "");

  // Force HTTPS in production to prevent Mixed Content blocking
  if (import.meta.env.PROD && base.startsWith("http:")) {
    return base.replace(/^http:/, "https:");
  }
  return base;
}

/**
 * Normalizes an image path into a full, valid URL.
 * Handles absolute URLs, relative storage paths, and protocol enforcement.
 */
export function getImageUrl(path?: string | null): string | null {
  if (!path || typeof path !== "string" || path.trim() === "") {
    return null;
  }

  let finalUrl: string;

  // 1. Check if it's already an absolute URL
  if (/^https?:\/\//i.test(path) || path.startsWith("//")) {
    finalUrl = path;
  } else {
    // 2. It's a relative storage path. 
    // Clean common prefixes (public/, storage/) and leading slashes
    const clean = path
      .replace(/^\/?public\//, "")
      .replace(/^\/?storage\//, "")
      .replace(/^\//, "");

    const base = getStorageBase();
    if (base) {
      finalUrl = `${base}/storage/${clean}`;
    } else {
      // Fallback for local development or proxy setups
      finalUrl = `/storage/${clean}`;
    }
  }

  // 3. Final safety check: Force HTTPS in production for the entire URL
  if (import.meta.env.PROD) {
    return finalUrl.replace(/^http:\/\//i, "https://");
  }

  return finalUrl;
}

/**
 * Converts an array of image paths into an array of full URLs.
 */
export function normalizeImages(images?: (string | null)[] | null): string[] {
  if (!Array.isArray(images)) return [];
  return images
    .map(getImageUrl)
    .filter((url): url is string => !!url);
}