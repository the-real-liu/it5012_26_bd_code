import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: true,
    proxy: {
      "/auth": {
        target: env.API_SERVER,
        changeOrigin: true,
      },
      "/api": {
        target: env.API_SERVER,
        changeOrigin: true,
      },
    },
  },
  build: {
    sourcemap: mode === "development",
  },
  base: "./",
}});
