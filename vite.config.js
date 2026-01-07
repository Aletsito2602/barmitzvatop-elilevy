import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Configuración para Apache/Hostinger
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    
    // Optimizaciones para producción
    minify: 'esbuild',
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'chakra': ['@chakra-ui/react', '@emotion/react', '@emotion/styled', 'framer-motion']
        }
      }
    }
  },
  
  // Configuración de servidor de desarrollo
  server: {
    port: 5173,
    strictPort: false,
    host: true
  },
  
  // Configuración de preview
  preview: {
    port: 4173,
    strictPort: false,
    host: true
  },
  
  // Asegurar que las rutas funcionen correctamente
  base: '/'
})
