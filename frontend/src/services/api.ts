// src/services/api.ts
import axios, { AxiosHeaders } from "axios";
import router from '@/router'

const api = axios.create({
  // ✅ FIXED: Use environment variable (Vite) with fallback for local dev
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api",

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
      };
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

      // Don't redirect for public endpoints
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