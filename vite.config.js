import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api/suggestions': {
        target: 'https://suggestqueries-clients6.youtube.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/suggestions/, '/complete/search?client=youtube&hl=en&gs_ri=youtube&ds=yt'),
      },
      '/api/videos': {
        target: 'https://youtube.googleapis.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/videos/, '/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&regionCode=IN'),
      },
      '/api/video-details': {
        target: 'https://youtube.googleapis.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/video-details/, '/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics'), // Added contentDetails for consistency
      },
      '/api/youtube-search': {
        target: 'https://youtube.googleapis.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/youtube-search/, '/youtube/v3/search?part=snippet'),
      },
    },
  }
});
