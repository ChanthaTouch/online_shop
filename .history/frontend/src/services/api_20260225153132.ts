// src/services/api.ts
import axios, { AxiosHeaders, AxiosError } from "axios";
import router from "@/router";

const isDev = import.meta.env.DEV;

const baseURL = isDev
  ? "/api"                                   // Vite proxy → no CORS in dev
  : (import.meta.env.VITE_API_URL || "https://onlineshop-production-2b886.up.railway.app/api")
      .replace(/\/+$/, "");                  // no trailing slash
console.log('[API] Using baseURL:', baseURL);
console.log('[API] Full env VITE_API_URL:', import.meta.env.VITE_API_URL);
const api = axios.create({
  baseURL,
  headers: {
    Accept: "application/json",
  },
  withCredentials: false,                    // using Bearer → false is safer
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    if (config.headers instanceof AxiosHeaders) {
      config.headers.set("Authorization", `Bearer ${token}`);
    } else {
      config.headers = { ...config.headers, Authorization: `Bearer ${token}` };
    }
  }

  // Let browser set Content-Type for FormData automatically
  if (config.data instanceof FormData) {
    if (config.headers instanceof AxiosHeaders) {
      config.headers.delete("Content-Type");
    }
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      const url = error.config?.url || "";

      // Skip redirect on auth endpoints & public reads
      if (
        /\/(login|register|logout)$/i.test(url) ||
        /\/(products|categories)(\/|$|\?)/i.test(url)
      ) {
        return Promise.reject(error);
      }

      localStorage.removeItem("token");
      // Clear other user data if you store them
      router.push({ name: "Login", query: { redirect: window.location.pathname } });
    }

    return Promise.reject(error);
  }
);

export default api;