// src/services/api.ts
import axios, { AxiosHeaders } from "axios";
import router from "@/router";

// Base URL setup
// - Local dev: use /api (Vite proxy forwards to Laravel backend)
// - Production: use VITE_API_URL (Railway backend domain)
const rawBase =
  import.meta.env.VITE_API_URL ?? '/api';
  (import.meta.env.DEV ? "/api" : "http://127.0.0.1:8000/api");

const baseURL = rawBase.replace(/\/+$/, "").endsWith("/api")
  ? rawBase.replace(/\/+$/, "")
  : `${rawBase.replace(/\/+$/, "")}/api`;

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
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      } as typeof config.headers;
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
      const reqUrl = (error.config?.url || "") as string;

      // Login/register should show "Invalid credentials"
      const isAuthAttempt = /\/login$|\/register$/i.test(
        reqUrl.replace(/\?.*$/, "")
      );
      if (isAuthAttempt) {
        return Promise.reject(error);
      }

      // Public read endpoints (categories/products) → don’t redirect
      const isPublicRead = /\/(categories|products)([\/\?]|$)/i.test(reqUrl);

      console.warn("Session expired — please login again");
      localStorage.removeItem("token");

      if (isPublicRead) {
        return Promise.reject(error);
      }

      try {
        const currentPath =
          window.location.pathname + window.location.search;
        if (router.currentRoute.value.name !== "Login") {
          router.push({ name: "Login", query: { redirect: currentPath } });
        }
      } catch {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
