import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // TypeScript path aliases (e.g. @/) are not understood by eslint-plugin-n.
      // Module resolution is handled correctly by TypeScript and Next.js.
      "n/no-missing-import": "off",
    },
  },
]);

export default eslintConfig;
