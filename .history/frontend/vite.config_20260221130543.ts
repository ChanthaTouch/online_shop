// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import laravel from 'laravel-vite-plugin'   // ← very helpful for Laravel
import path from 'path'

export default defineConfig({
  plugins: [
    laravel({
      input: [
        'resources/css/app.css',
        'resources/js/app.ts',     // or .js / .tsx — match your entry point
      ],
      refresh: true,
    }),
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
      '@': path.resolve(__dirname, 'resources/js'),   // adjust if your src is elsewhere
    },
  },

  server: {
    host: '0.0.0.0',          // important if using Docker / VM / accessing from phone
    port: 5173,
    strictPort: true,

    proxy: {
      // Proxy EVERYTHING starting with /api
      '^/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api'),   // keep /api prefix
        // If your Laravel routes are prefixed /api/* then use:
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },

      // Also proxy storage (very common need)
      '/storage': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
      },
    },

    // Helps with HMR in some environments
    hmr: {
      host: 'localhost',
    },
  },
})