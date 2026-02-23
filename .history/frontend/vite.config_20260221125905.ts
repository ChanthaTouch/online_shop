// vite.config.ts
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite' // or '@tailwindcss/vite' depending on exact package
import path from 'path'

export default defineConfig(({ mode }) => {
  // Load environment variables for the current mode (development / production)
  const env = loadEnv(mode, process.cwd(), '')

  // In production on Railway, you usually DON'T want the dev proxy
  // The backend (php artisan serve / nginx) already serves /api and /storage
  const isDev = mode === 'development' || mode === 'local'

  return {
    plugins: [
      vue(),
      tailwindcss(),
    ],

    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },

    server: {
      // Only apply proxy in development
      ...(isDev && {
        proxy: {
          // Laravel API routes
          '/api': {
            target: env.VITE_API_URL || 'http://127.0.0.1:8000',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ''),
            secure: false,
          },

          // Public storage files (images, uploads, etc.)
          '/storage': {
            target: env.VITE_API_URL || 'http://127.0.0.1:8000',
            changeOrigin: true,
            secure: false,
          },
        },
      }),

      // Optional: helps with some network / Docker / Railway local tunnel situations
      host: true,
      port: 5173, // default Vite port — you can change if needed
    },

    // Important for correct asset URLs in production
    base: env.VITE_BASE_URL || '/',

    build: {
      // Recommended for Laravel + Vite
      manifest: true,
      outDir: path.resolve(__dirname, 'public/build'),
      assetsDir: '',
      rollupOptions: {
        // If you have multiple entry points, you can define them here
      },
    },
  }
})