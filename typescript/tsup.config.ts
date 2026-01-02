import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "react/index": "react/index.ts",
    "svelte/index": "svelte/index.ts",
  },
  dts: true,
  format: ["esm", "cjs"],
  splitting: false,
  clean: true,
});
