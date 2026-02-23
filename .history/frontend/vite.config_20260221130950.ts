// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    vue({
      template: {
        transformAssetUrls: {
          base: null,
          includeAbsolute: false,
        },
      },
    }),
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),  // your src/ folder
    },
  },

  server: {
    host: '0.0.0.0',       // allow access from network (good for testing)
    port: 5173,
    strictPort: true,

    proxy: {
      // All /api requests → forward to Laravel backend
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),  // strip /api prefix
      },

      // Storage files (uploads, images)
      '/storage': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
      },
    },

    hmr: {
      host: 'localhost',
    },
  },

  // Optional: for production build output
  build: {
    outDir: 'dist',           // or 'public' if you serve from Laravel public/
    manifest: true,           // useful if you later want to read manifest.json
  },
})