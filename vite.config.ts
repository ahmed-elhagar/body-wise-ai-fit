
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5 MB limit
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/rest\/v1\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'supabase-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 5 * 60, // 5 minutes for API data
              },
            },
          },
        ],
      },
      manifest: {
        name: 'FitFatta - AI Fitness Companion',
        short_name: 'FitFatta',
        description: 'AI-powered fitness companion with personalized meal plans and exercise programs',
        theme_color: '#3B82F6',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: '/favicon.ico',
            sizes: '64x64 32x32 24x24 16x16',
            type: 'image/x-icon'
          }
        ]
      }
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Framework chunks
          if (id.includes('react') || id.includes('react-dom')) {
            return 'vendor';
          }
          
          // Router chunk
          if (id.includes('react-router-dom')) {
            return 'router';
          }
          
          // UI library chunks
          if (id.includes('@radix-ui') || id.includes('lucide-react')) {
            return 'ui';
          }
          
          // Charts and visualization
          if (id.includes('recharts')) {
            return 'charts';
          }
          
          // Date utilities
          if (id.includes('date-fns')) {
            return 'dates';
          }
          
          // Form handling
          if (id.includes('react-hook-form') || id.includes('@hookform') || id.includes('zod')) {
            return 'forms';
          }
          
          // Backend services
          if (id.includes('@supabase/supabase-js')) {
            return 'supabase';
          }
          
          // Query management
          if (id.includes('@tanstack/react-query')) {
            return 'query';
          }
          
          // Feature-based chunking for better performance
          if (id.includes('src/features/admin')) {
            return 'feature-admin';
          }
          
          if (id.includes('src/features/food-tracker')) {
            return 'feature-food-tracker';
          }
          
          if (id.includes('src/features/meal-plan')) {
            return 'feature-meal-plan';
          }
          
          if (id.includes('src/features/exercise')) {
            return 'feature-exercise';
          }
          
          if (id.includes('src/features/dashboard')) {
            return 'feature-dashboard';
          }
          
          if (id.includes('src/features/profile')) {
            return 'feature-profile';
          }
          
          if (id.includes('src/features/coach')) {
            return 'feature-coach';
          }
          
          if (id.includes('src/features/chat')) {
            return 'feature-chat';
          }
          
          // Utilities
          if (id.includes('clsx') || id.includes('class-variance-authority') || id.includes('tailwind-merge')) {
            return 'utils';
          }
          
          // Node modules
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    },
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug']
      },
      mangle: {
        safari10: true
      }
    },
    chunkSizeWarningLimit: 1500, // Increased from 1000 to 1500 KB
    cssCodeSplit: true
  },
  esbuild: {
    treeShaking: true,
    legalComments: 'none',
    target: 'esnext'
  }
}));
