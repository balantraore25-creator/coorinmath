import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import fs from 'fs'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    {
      name: 'copy-redirects',
      apply: 'build',
      closeBundle() {
        const source = path.resolve(__dirname, '_redirects')
        const destination = path.resolve(__dirname, 'dist/_redirects')

        if (fs.existsSync(source)) {
          fs.copyFileSync(source, destination)
          console.log('✅ Fichier _redirects copié dans dist/')
        } else {
          console.warn('⚠️ Aucun fichier _redirects trouvé à la racine du projet.')
        }
      },
    },
  ],
  build: {
    rollupOptions: {
      output: {
        // Découpage manuel des chunks pour éviter les bundles trop lourds
        manualChunks: {
          react: ['react', 'react-dom'],
          ui: ['@chakra-ui/react', '@emotion/react', '@emotion/styled'],
          math: ['mathjs', 'katex'],
        },
      },
    },
    chunkSizeWarningLimit: 1000, // augmente la limite d’avertissement
  },
})


/*import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths"


// https://vite.dev/config/
export default defineConfig({
   plugins: [react(), tsconfigPaths()],
})*/
