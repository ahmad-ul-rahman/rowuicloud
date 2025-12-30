import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false, // Disable sourcemaps in production to reduce bundle size
    minify: 'esbuild', // Use esbuild for faster and efficient minification
    target: 'es2015', // Ensure compatibility while keeping bundles relatively small
    chunkSizeWarningLimit: 1000, // Increase warning limit for larger vendor chunks
    rollupOptions: {
      output: {
        // Aggressive manual chunking to separate vendor libs
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-supabase': ['@supabase/supabase-js'],
          'vendor-ui': ['framer-motion', 'lucide-react', 'react-hot-toast', 'date-fns'],
          'vendor-editor': ['@tinymce/tinymce-react'], // Isolate heavy editor code
        },
      },
    },
  },
});