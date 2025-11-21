import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    watch: {
      ignored: ["**/public/*.json", "**/data/*.json"],
    },
    proxy: {
      "/api": "http://localhost:3000",
    },
  },
});
