import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig(({ command }) => ({
  // Build (GitHub Pages) için repo alt yolu, yerel geliştirme (npm run dev) için kök dizin '/'
  base: command === "build" ? "/react-tailwind-click-frame-animation/" : "/",
  root: "playground",
  publicDir: path.resolve(__dirname, "public"),
  plugins: [react()],
  resolve: {
    alias: {
      "react-tailwind-click-frame-animation": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3001,
    open: true,
  },
  build: {
    // Çıktıyı kök dizinde 'dist-demo' klasörüne toplar
    outDir: path.resolve(__dirname, "dist-demo"),
    emptyOutDir: true,
  },
}));