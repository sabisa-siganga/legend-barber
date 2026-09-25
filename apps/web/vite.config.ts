import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

import { normalizeViteBase } from "./src/lib/siteBase.ts";

export default defineConfig({
  base: normalizeViteBase(process.env.VITE_BASE_PATH),
  plugins: [react(), tailwindcss()],
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
  },
});
