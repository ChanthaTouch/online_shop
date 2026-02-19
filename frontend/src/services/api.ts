// src/services/api.ts
import axios, { AxiosHeaders } from "axios";
import router from '@/router'

// Normalize base URL. For local dev: use /api so Vite proxy forwards to local backend.
// For production: use VITE_API_URL (e.g. Railway). .env.local overrides .env.
const rawBase = import.meta.env.VITE_API_URL ?? 
  (import.meta.env.DEV ? '/api' : 'http://127.0.0.1:8000/api');
const baseURL = rawBase.replace(/\/+$/, "").endsWith("/api") ? rawBase.replace(/\/+$/, "") : `${rawBase.replace(/\/+$/, "")}/api`;

const api = axios.create({
  baseURL,
  headers: {
    Accept: "application/json",
  },
});

/* ✅ Attach token to every request */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    if (config.headers instanceof AxiosHeaders) {
      config.headers.set("Authorization", `Bearer ${token}`);
    } else {
      const headers = config.headers as Record<string, string>;
      config.headers = { ...headers, Authorization: `Bearer ${token}` } as typeof config.headers;
    }
  }

  // Let browser handle Content-Type for FormData
  if (config.data instanceof FormData) {
    if (config.headers instanceof AxiosHeaders) {
      config.headers.delete("Content-Type");
    } else if (config.headers) {
      delete (config.headers as any)["Content-Type"];
    }
  }

  return config;
});

/* ✅ Global response handling */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const reqUrl = (error.config && (error.config.url || '')) as string;

      // Don't treat login/register 401 as "session expired" — let the page show "Invalid credentials"
      const isAuthAttempt = /\/login$|\/register$/i.test(reqUrl.replace(/\?.*$/, ''));
      if (isAuthAttempt) {
        return Promise.reject(error);
      }

      // Don't redirect for public read endpoints; just reject so UI can show data when available
      const isPublicRead = /\/(categories|products)([\/\?]|$)/i.test(reqUrl);

      console.warn('Session expired — please login again');
      localStorage.removeItem('token');

      if (isPublicRead) {
        return Promise.reject(error);
      }

      try {
        const currentPath = window.location.pathname + window.location.search;
        if (router.currentRoute.value.name !== 'Login') {
          router.push({ name: 'Login', query: { redirect: currentPath } });
        }
      } catch (err) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;