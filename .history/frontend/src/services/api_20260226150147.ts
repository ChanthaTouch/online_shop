// src/services/api.ts
import axios, { AxiosError } from "axios";

const VITE_API_URL = import.meta.env.VITE_API_URL?.trim();
const isDev = import.meta.env.DEV;

let baseURL: string;

if (VITE_API_URL) {
  // Ensure we don't have multiple trailing slashes
  baseURL = VITE_API_URL.replace(/\/+$/, "");
} else if (isDev) {
  baseURL = "/api"; // Vite proxy in development
} else {
  baseURL = ""; 
  console.error("❌ VITE_API_URL is missing in production!");
}

const api = axios.create({
  baseURL,
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: false,
  timeout: 15000,
});

// Request Interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Allow browser to set boundary for file uploads
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  return config;
});

// Response Interceptor for Debugging
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    console.error("[API ERROR]", {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data,
    });
    return Promise.reject(error);
  }
);

export default api;