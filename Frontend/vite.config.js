import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve("./src"),
    },
  },
  server: {
    host: "0.0.0.0",
    proxy: {
      "/api": "http://192.168.1.6:5000",
    },
    allowedHosts: [
      "77f468a5d410.ngrok-free.app", // 👈 add your ngrok domain here
    ],
  },
});
