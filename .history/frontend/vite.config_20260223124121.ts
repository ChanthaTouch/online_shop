// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'   // keep if you're really using this plugin
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
    tailwindcss(),   // ← remove if you're using PostCSS + tailwind.config + vite-plugin not needed
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  server: {
    // host: '0.0.0.0',         // ← usually not needed (only if accessing from other devices)
    port: 5173,
    // strictPort: true,        // ← optional

    proxy: {
      // ── Important: NO rewrite for /api ──
      '/api': {
        target: 'http://localhost:8000',   // or 'http://127.0.0.1:8000'
        changeOrigin: true,
        secure: false,
        // rewrite: NEVER add this for Laravel + Sanctum + /api prefix
      },

      '/storage': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
    },

    // hmr: { host: 'localhost' },   // ← usually not needed
  },

  build: {
    outDir: 'dist',
    manifest: true,
  },
})