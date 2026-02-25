// src/utils/image.ts
export function getStorageBase(): string {
  const apiUrl = import.meta.env.VITE_API_URL || "";
  if (!apiUrl) return "";

  // Remove /api suffix if present
  const base = apiUrl.replace(/\/api$/, "");

  // Force HTTPS in production
  if (import.meta.env.PROD && base.startsWith("http:")) {
    return base.replace(/^http:/, "https:");
  }
  return base;
}

export function getImageUrl(path?: string | null): string | null {
  if (!path || typeof path !== "string" || path.trim() === "") {
    return null;
  }

  // Already absolute → normalize protocol in prod
  if (/^https?:\/\//i.test(path)) {
    if (import.meta.env.PROD) {
      return path.replace(/^http:\/\//i, "https://");
    }
    return path;
  }

  // Relative storage path → clean and prefix
  let clean = path
    .replace(/^\/?public\//, "")
    .replace(/^\/?storage\//, "")
    .replace(/^\//, "");

  const base = getStorageBase();
  if (base) {
    return `${base}/storage/${clean}`;
  }

  // Fallback for local / proxy
  return `/storage/${clean}`;
}

export function normalizeImages(images?: (string | null)[] | null): string[] {
  if (!Array.isArray(images)) return [];
  return images
    .map(getImageUrl)
    .filter((url): url is string => !!url);
}