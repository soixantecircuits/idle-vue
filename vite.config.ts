import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite-plus";

export default defineConfig({
  plugins: [vue()],
  pack: {
    entry: ["src/index.ts", "src/pinia.ts"],
    dts: true,
    format: ["esm"],
    sourcemap: true,
  },
  lint: {
    ignorePatterns: ["dist/**"],
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
  fmt: {},
});
