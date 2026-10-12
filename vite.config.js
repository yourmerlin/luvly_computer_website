import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// BASE_PATH is set by the github pages workflow (e.g. /luvly_computer_website/)
export default defineConfig({
  plugins: [react()],
  base: process.env.BASE_PATH || "/",
});
