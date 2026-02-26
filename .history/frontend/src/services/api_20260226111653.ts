// src/services/api.ts  ← FULL CORRECTED & IMPROVED VERSION
import axios, { AxiosError } from "axios";
import router from "@/router";

const VITE_API_URL = import.meta.env.VITE_API_URL?.trim();
const isDev = import.meta.env.DEV;

let baseURL: string;

if (VITE_API_URL) {
  baseURL = VITE_API_URL.replace(/\/+$/, "");
} else if (isDev) {
  baseURL = "/api";                    // Vite proxy in development
} else {
  throw new Error(
    "❌ VITE_API_URL is required in production!\n" +
    "Please set it in Railway → Frontend Service → Variables"
  );
}

// Helpful logs (you can remove after everything works)
console.log("[API] MODE:", import.meta.env.MODE);
console.log("[API] DEV:", isDev);
console.log("[API] VITE_API_URL from env:", VITE_API_URL || "not set (using dev proxy)");
console.log("[API] Final baseURL:", baseURL);

const api = axios.create({
  baseURL,
  headers: {
    Accept: "application/json",
  },
  withCredentials: false,
  timeout: 60000,           // prevents infinite hanging
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Let browser set correct boundary for FormData (important for image uploads)
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Detailed logging so you can see exactly what fails
    console.error("[API ERROR]", {
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.message,
      data: error.response?.data,
    });

    if (error.response?.status === 401) {
      const url = error.config?.url || "";
      if (
        /\/(login|register|logout)$/i.test(url) ||
        /\/(products|categories)(\/|$|\?)/i.test(url)
      ) {
        return Promise.reject(error);
      }

      localStorage.removeItem("token");
      router.push({ name: "Login", query: { redirect: window.location.pathname } });
    }

    return Promise.reject(error);
  }
);

export default api;