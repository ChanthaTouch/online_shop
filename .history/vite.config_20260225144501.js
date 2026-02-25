// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'

// Optional: only if you're using the official @tailwindcss/vite plugin
// Most projects use PostCSS + tailwind.config.js instead — remove if not needed
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const isDev = mode === 'development'

  return {
    // Base path = '/' because in production the frontend is served from Laravel's public root
    base: '/',

    plugins: [
      vue({
        template: {
          transformAssetUrls: {
            base: null,
            includeAbsolute: false,
          },
        },
      }),
      // Remove tailwindcss() if you're using classic PostCSS setup (postcss.config.js + tailwind.config.js)
      // tailwindcss(),
    ],

    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        // Optional: helps with some legacy imports if needed
        '~': path.resolve(__dirname, './'),
      },
    },

    server: {
      // Recommended for local dev
      port: 5173,
      strictPort: true,           // fail if port is taken → easier debugging
      host: true,                 // allow access from network (useful in Docker / VM)

      proxy: {
        // ────────────────────────────────────────────────
        // Proxy API calls → Laravel (no rewrite needed!)
        // ────────────────────────────────────────────────
        '/api': {
          target: 'http://localhost:8000',   // change to your Laravel port if different
          changeOrigin: true,
          secure: false,
          // Do NOT add rewrite — keeps /api prefix intact (matches Laravel routes/api.php)
        },

        // ────────────────────────────────────────────────
        // Proxy storage files (images, uploads)
        // Very useful for local dev so images work without full URL
        // ────────────────────────────────────────────────
        '/storage': {
          target: 'http://localhost:8000',
          changeOrigin: true,
          secure: false,
        },

        // Optional: if you have other prefixes (e.g. /sanctum, /livewire)
        // '/sanctum': { target: 'http://localhost:8000', changeOrigin: true, secure: false },
      },

      // Optional: improve HMR in some Docker/WSL setups
      hmr: {
        host: 'localhost',
        // protocol: 'ws',          // usually auto-detected
      },
    },

    build: {
      outDir: 'dist',
      manifest: true,             // important — Laravel can read manifest.json if needed
      sourcemap: isDev,           // only in dev — smaller prod bundles
      rollupOptions: {
        output: {
          // Better chunk splitting for production
          manualChunks: {
            vendor: ['vue', 'vue-router', 'pinia', 'axios'],
            ui: ['@headlessui/vue', 'vue3-toastify'], // add your UI libs if any
          },
        },
      },
    },

    // Optional: faster dev server in large projects
    optimizeDeps: {
      include: ['vue', 'axios', 'lodash-es'], // common heavy deps
    },
  }
})