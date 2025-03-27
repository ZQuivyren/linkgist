
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      // Proxy redirect requests in development to Supabase Edge Function
      '/api/redirect': {
        target: 'https://ppgabecfmbwfvqqkyqdb.supabase.co/functions/v1/redirect',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/redirect/, ''),
      }
    }
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
