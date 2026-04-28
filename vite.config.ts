import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

const tanstackRoot = path.resolve(__dirname, "node_modules/.bun/@tanstack+react-query@5.83.0+f4eacebf2041cd4f/node_modules/@tanstack");

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    dedupe: ["react", "react-dom", "@tanstack/react-query"],
    alias: {
      "@tanstack/react-query": path.join(tanstackRoot, "react-query"),
      "@tanstack/query-core": path.join(tanstackRoot, "query-core"),
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: ["@tanstack/react-query"],
  },
}));
