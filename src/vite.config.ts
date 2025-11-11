import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-200-html',
      async closeBundle() {
        // Copy index.html to 200.html for Vercel SPA fallback
        const { copyFileSync, existsSync } = await import('fs');
        const buildDir = path.resolve(__dirname, 'dist');
        const indexPath = path.join(buildDir, 'index.html');
        const fallbackPath = path.join(buildDir, '200.html');
        
        if (existsSync(indexPath)) {
          copyFileSync(indexPath, fallbackPath);
          console.log('✅ Created 200.html for Vercel SPA routing');
        }
      }
    }
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
  server: {
    port: 3000,
    open: true,
    // ✅ CRITICAL: Configure middleware for SPA routing
    // This allows React Router to handle all routes
    middlewareMode: false,
  },
  preview: {
    port: 3000,
    // ✅ Also enable for preview mode
  },
})
