import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import fs from "fs";

// Read package.json and @myorg/ui version dynamically
const frontendPkg = JSON.parse(
  fs.readFileSync(resolve(__dirname, "./package.json"), "utf-8"),
);

let uiPkg = { version: "0.1.0" };
try {
  uiPkg = JSON.parse(
    fs.readFileSync(
      resolve(__dirname, "./node_modules/@myorg/ui/package.json"),
      "utf-8",
    ),
  );
} catch {
  // fallback
}

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    host: true,
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
  preview: {
    port: 3000,
    host: true,
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    minify: "esbuild",
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
        },
      },
    },
  },
  define: {
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV ?? "development"),
    __APP_VERSION__: JSON.stringify(frontendPkg.version),
    __UI_LIB_VERSION__: JSON.stringify(uiPkg.version),
    __DEPENDENCIES__: JSON.stringify(frontendPkg.dependencies ?? {}),
    __DEV_DEPENDENCIES__: JSON.stringify(frontendPkg.devDependencies ?? {}),
    __BUILD_TIMESTAMP__: JSON.stringify(new Date().toISOString()),
  },
});
