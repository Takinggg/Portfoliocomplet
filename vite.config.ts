
  import { defineConfig } from 'vite';
  import react from '@vitejs/plugin-react-swc';
  import path from 'path';

  // Plugin de sécurité personnalisé
  function securityHeadersPlugin() {
    return {
      name: 'security-headers',
      configureServer(server: any) {
        server.middlewares.use((_req: any, res: any, next: any) => {
          // Content Security Policy stricte
          res.setHeader(
            'Content-Security-Policy',
            [
              "default-src 'self'",
              "script-src 'self' https://js.stripe.com https://cdn.jsdelivr.net",
              "style-src 'self' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com data:",
              "img-src 'self' data: https: blob:",
              "connect-src 'self' https://*.supabase.co https://api.stripe.com wss://*.supabase.co https://media.istockphoto.com https://*.istockphoto.com https://images.unsplash.com https://images.pexels.com https://cdn.pixabay.com",
              "frame-src 'self' https://js.stripe.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
              "upgrade-insecure-requests"
            ].join('; ')
          );

          // Autres headers de sécurité
          res.setHeader('X-Frame-Options', 'DENY');
          res.setHeader('X-Content-Type-Options', 'nosniff');
          res.setHeader('X-XSS-Protection', '1; mode=block');
          res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
          res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
          
          next();
        });
      }
    };
  }

  export default defineConfig({
    plugins: [react(), securityHeadersPlugin()],
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      alias: {
        'vaul@1.1.2': 'vaul',
        'sonner@2.0.3': 'sonner',
        'recharts@2.15.2': 'recharts',
        'react-resizable-panels@2.1.7': 'react-resizable-panels',
        'react-hook-form@7.55.0': 'react-hook-form',
        'react-day-picker@8.10.1': 'react-day-picker',
        'next-themes@0.4.6': 'next-themes',
        'lucide-react@0.487.0': 'lucide-react',
        'input-otp@1.4.2': 'input-otp',
        'hono@4': 'hono',
        'embla-carousel-react@8.6.0': 'embla-carousel-react',
        'cmdk@1.1.1': 'cmdk',
        'class-variance-authority@0.7.1': 'class-variance-authority',
        '@radix-ui/react-tooltip@1.1.8': '@radix-ui/react-tooltip',
        '@radix-ui/react-toggle@1.1.2': '@radix-ui/react-toggle',
        '@radix-ui/react-toggle-group@1.1.2': '@radix-ui/react-toggle-group',
        '@radix-ui/react-tabs@1.1.3': '@radix-ui/react-tabs',
        '@radix-ui/react-switch@1.1.3': '@radix-ui/react-switch',
        '@radix-ui/react-slot@1.1.2': '@radix-ui/react-slot',
        '@radix-ui/react-slider@1.2.3': '@radix-ui/react-slider',
        '@radix-ui/react-separator@1.1.2': '@radix-ui/react-separator',
        '@radix-ui/react-select@2.1.6': '@radix-ui/react-select',
        '@radix-ui/react-scroll-area@1.2.3': '@radix-ui/react-scroll-area',
        '@radix-ui/react-radio-group@1.2.3': '@radix-ui/react-radio-group',
        '@radix-ui/react-progress@1.1.2': '@radix-ui/react-progress',
        '@radix-ui/react-popover@1.1.6': '@radix-ui/react-popover',
        '@radix-ui/react-navigation-menu@1.2.5': '@radix-ui/react-navigation-menu',
        '@radix-ui/react-menubar@1.1.6': '@radix-ui/react-menubar',
        '@radix-ui/react-label@2.1.2': '@radix-ui/react-label',
        '@radix-ui/react-hover-card@1.1.6': '@radix-ui/react-hover-card',
        '@radix-ui/react-dropdown-menu@2.1.6': '@radix-ui/react-dropdown-menu',
        '@radix-ui/react-dialog@1.1.6': '@radix-ui/react-dialog',
        '@radix-ui/react-context-menu@2.2.6': '@radix-ui/react-context-menu',
        '@radix-ui/react-collapsible@1.1.3': '@radix-ui/react-collapsible',
        '@radix-ui/react-checkbox@1.1.4': '@radix-ui/react-checkbox',
        '@radix-ui/react-avatar@1.1.3': '@radix-ui/react-avatar',
        '@radix-ui/react-aspect-ratio@1.1.2': '@radix-ui/react-aspect-ratio',
        '@radix-ui/react-alert-dialog@1.1.6': '@radix-ui/react-alert-dialog',
        '@radix-ui/react-accordion@1.2.3': '@radix-ui/react-accordion',
        '@jsr/supabase__supabase-js@2.49.8': '@jsr/supabase__supabase-js',
        '@jsr/supabase__supabase-js@2': '@jsr/supabase__supabase-js',
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      target: 'esnext',
      outDir: 'dist',
      sourcemap: false, // Pas de sourcemaps en production pour la sécurité
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true, // Supprimer console.log en production
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.trace']
        },
        mangle: {
          safari10: true // Fix Safari 10/11 bugs
        },
        format: {
          comments: false // Supprimer tous les commentaires
        }
      },
      // Code splitting optimization
      rollupOptions: {
        output: {
          manualChunks: {
            // React vendor chunk
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            // UI vendor chunk (animations, icons, components)
            'ui-vendor': ['motion/react', 'lucide-react', 'canvas-confetti'],
            // Form vendor chunk
            'form-vendor': ['react-hook-form', '@hookform/resolvers', 'zod'],
            // Radix UI vendor chunk (all @radix-ui packages)
            'radix-vendor': [
              '@radix-ui/react-accordion',
              '@radix-ui/react-alert-dialog',
              '@radix-ui/react-avatar',
              '@radix-ui/react-checkbox',
              '@radix-ui/react-dialog',
              '@radix-ui/react-dropdown-menu',
              '@radix-ui/react-label',
              '@radix-ui/react-popover',
              '@radix-ui/react-select',
              '@radix-ui/react-separator',
              '@radix-ui/react-slot',
              '@radix-ui/react-tabs',
              '@radix-ui/react-tooltip',
            ],
            // Supabase vendor chunk
            'supabase-vendor': ['@jsr/supabase__supabase-js'],
          },
        },
      },
      // Optimize chunk size
      chunkSizeWarningLimit: 1000,
    },
    server: {
      port: 3000,
      open: true,
    },
  });