import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import fs from "fs";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "404-fallback",
      closeBundle() {
        const outDir = resolve(__dirname, "dist");
        const indexHtml = resolve(outDir, "index.html");
        const notFound = resolve(outDir, "404.html");
        if (fs.existsSync(indexHtml)) {
          fs.copyFileSync(indexHtml, notFound);
          console.log("✅ Copied index.html to 404.html for GitHub Pages fallback.");
        }
      },
    },
  ],
  base: "/react_blog/",
  build: {
    outDir: "dist",
  },
});
