import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // Satori (next/og) renders plain <img> only. Set here rather than inline: the rule recognises this
    // file by path on Linux but not on Windows, so an inline disable is "unused" on one of them.
    files: ['src/app/opengraph-image.tsx'],
    rules: { '@next/next/no-img-element': 'off' },
  },
  globalIgnores(['.next/**', 'node_modules/**', 'legacy/**', 'next-env.d.ts']),
]);
