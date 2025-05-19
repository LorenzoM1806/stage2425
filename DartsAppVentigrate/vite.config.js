import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
      react(),
  ],
  base: './',
    build: {
        cssCodeSplit: true,  // Ensures that CSS is split correctly for better handling
        minify: false,       // Disable minification temporarily to debug
    },
})
