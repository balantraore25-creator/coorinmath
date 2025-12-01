import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import path from 'path'

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  base: '/', // nécessaire pour Render
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks: {
          // 📦 découpage des bibliothèques lourdes
          react: ['react', 'react-dom'],
          motion: ['framer-motion'],
          icons: ['react-icons'],
          chakra: ['@chakra-ui/react'],
        },
      },
    },
  },
})



/*import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths"


// https://vite.dev/config/
export default defineConfig({
   plugins: [react(), tsconfigPaths()],
    base: '/', // ✅ important pour Render
    build: {
    outDir: 'dist', // par défaut
  },
   
})*/
