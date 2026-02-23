/**
 * Build full URL for backend storage images.
 * Always uses /api/storage/... because your route is in routes/api.php
 * Works perfectly in both development and production.
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
      return withSlash.replace(/^\/storage\/?/, "").replace(/^\/api\/storage\/?/, "");
    } catch {
      return trimmed.replace(/^\/(storage|api\/storage)\/?/, "");
    }
  }
  const clean = trimmed.startsWith("/") ? trimmed.slice(1) : trimmed;
  return clean.replace(/^\/?(storage|api\/storage)\/?/, "");
}

/**
 * @param pathOrUrl - Relative path or full URL from API
 * @returns Full URL to use in <img src>
 */
export function toStorageImageUrl(pathOrUrl?: string | null): string | null {
  if (!pathOrUrl || typeof pathOrUrl !== "string") return null;

  const trimmed = pathOrUrl.trim();
  if (!trimmed) return null;

  const relativePath = getStorageRelativePath(trimmed);
  if (!relativePath) return null;

  const backend = getBackendOrigin();

  // ALWAYS use /api/storage/... (matches your Laravel route)
  return `${backend}/api/storage/${relativePath}`;
}