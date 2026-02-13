// src/services/api.ts
import axios, { AxiosHeaders } from "axios";
import router from '@/router'

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
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
  
  /**
   * IMPORTANT:
   * If sending FormData, let the browser set Content-Type
   * (multipart/form-data with boundary)
   */
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
      const reqUrl = (error.config && (error.config.url || '')) as string

      // Don't redirect to login for public read endpoints (Home data)
      const isPublicRead = /\/(categories|products)([\/\?]|$)/i.test(reqUrl)

      console.warn('Session expired — please login again')
      localStorage.removeItem('token')

      if (isPublicRead) {
        // Allow the component to handle the 401 (show placeholder UI)
        console.info('Public endpoint returned 401 — skipping login redirect')
        return Promise.reject(error)
      }

      // Use the router for SPA navigation and preserve the attempted path
      try {
        const currentPath = window.location.pathname + window.location.search
        if (router.currentRoute.value.name !== 'Login') {
          router.push({ name: 'Login', query: { redirect: currentPath } })
        }
      } catch (err) {
        // Fallback to full reload if router isn't available for any reason
        window.location.href = '/login'
      }
    }

    return Promise.reject(error);
  }
);

export default api;
