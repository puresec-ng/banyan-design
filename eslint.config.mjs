import { defineConfig, globalIgnores } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

// ESLint 9 flat config for Next.js 16 + TypeScript
export default defineConfig([
  // Next.js recommended rules (Core Web Vitals + TypeScript support)
  ...nextCoreWebVitals,

  // Project-specific overrides
  {
    rules: {
      // Our app intentionally initializes or syncs state inside effects
      // (e.g. from cookies, localStorage, search params). This is safe and
      // avoids a lot of boilerplate, so we relax this React 19 rule.
      "react-hooks/set-state-in-effect": "off",
    },
  },

  // Global ignores so lint runs fast and doesn't touch build output
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "node_modules/**",
    "next-env.d.ts",
  ]),
]);
