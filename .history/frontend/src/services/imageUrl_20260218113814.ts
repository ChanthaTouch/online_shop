/**
 * Build full URL for backend storage images.
 * - In development: use same-origin /api/storage/... so the existing /api proxy forwards to backend
 *   and the backend serves the file (avoids 404 from /storage proxy and ad-blocker blocking).
 * - In production: use backend origin + /storage/... (Laravel public/storage link).
 */
import api from "./api";

function getBackendOrigin(): string {
  const base = api.defaults.baseURL ?? "";
  return base.replace(/\/api\/?$/, "").trim() || "http://127.0.0.1:8000";
}

/** Get relative storage path (e.g. "categories/xxx.jpg") from pathOrUrl */
function getStorageRelativePath(pathOrUrl: string): string {
  const trimmed = pathOrUrl.trim();
  if (trimmed.startsWith("http:") || trimmed.startsWith("https:") || trimmed.startsWith("//")) {
    try {
      const pathname = new URL(trimmed).pathname;
      const withSlash = pathname.startsWith("/") ? pathname : `/${pathname}`;
      return withSlash.replace(/^\/storage\/?/, ""); // "categories/xxx.jpg"
    } catch {
      return trimmed.replace(/^\/storage\/?/, "");
    }
  }
  const clean = trimmed.startsWith("/") ? trimmed.slice(1) : trimmed;
  return clean.startsWith("storage/") ? clean.replace(/^storage\/?/, "") : clean;
}

/**
 * @param pathOrUrl - Relative path (e.g. "categories/x.jpg", "products/x.jpg") or full URL from API
 * @returns Full URL to use in img src
 */
export function toStorageImageUrl(pathOrUrl?: string | null): string | null {
  if (!pathOrUrl || typeof pathOrUrl !== "string") return null;
  const trimmed = pathOrUrl.trim();
  if (!trimmed) return null;

  const isDev = import.meta.env.DEV && typeof window !== "undefined";
  const origin = isDev ? window.location.origin : null;
  const backend = getBackendOrigin();
  const relativePath = getStorageRelativePath(trimmed);
  if (!relativePath) return null;

  // In dev: use /api/storage/relativePath so the /api proxy forwards to backend and Laravel serves the file
  if (isDev && origin) {
    return `${origin}/api/storage/${relativePath}`;
  }
  // Production: use backend /storage/... (Laravel public storage link)
  return `${backend}/storage/${relativePath}`;
}
