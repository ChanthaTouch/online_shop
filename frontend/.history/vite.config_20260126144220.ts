import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'


// https://vite.dev/config/
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}