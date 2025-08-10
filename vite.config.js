import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api/suggestions': {
           target: 'https://suggestqueries-clients6.youtube.com',
           changeOrigin: true, // This is essential for the target server to accept the request.
           // Rewrite the path: remove '/api/suggestions' and add the necessary YouTube parameters.
           rewrite: (path) => path.replace(/^\/api\/suggestions/, '/complete/search?client=youtube&hl=en&gs_ri=youtube&ds=yt'),
      },
    },
  }
});