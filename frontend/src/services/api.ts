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
  timeout: 60000, // Increased to 60 seconds
});

// Check for mock tokens and clear them
const token = localStorage.getItem("token");
if (token === "mock-token") {
  console.warn("⚠️ Mock token detected - clearing authentication. Please login again.");
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("userName");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userRole");
}

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
    // Log detailed error information
    console.error("[API ERROR]", {
      url: error.config?.url,
      baseURL: error.config?.baseURL,
      fullURL: error.config?.baseURL + error.config?.url,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data,
      code: error.code,
    });
    
    // Handle 401 Unauthorized - token might be invalid
    if (error.response?.status === 401) {
      console.warn("🔒 Unauthorized - token may be invalid. Please login again.");
      // Optionally clear auth and redirect to login
      // localStorage.clear();
      // window.location.href = '/login';
    }
    
    // Provide user-friendly error messages
    if (error.code === 'ECONNABORTED') {
      console.error('⏱️ Request timeout - backend may be slow or down');
    } else if (error.code === 'ERR_NETWORK') {
      console.error('🌐 Network error - check if backend is accessible');
    }
    
    return Promise.reject(error);
  }
);

export default api;