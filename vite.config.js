import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// BASE_PATH only matters if the site is hosted in a subfolder (netlify serves it at /)
export default defineConfig({
  plugins: [react()],
  base: process.env.BASE_PATH || "/",
});
