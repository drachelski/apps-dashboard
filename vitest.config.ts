import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    exclude: ['docs/**', 'node_modules/**'],
    restoreMocks: true,
    unstubEnvs: true,
    css: false,
    // Mirrors `trailingSlash: true` from next.config.ts (next build sets this flag for next/link).
    env: { __NEXT_TRAILING_SLASH: 'true' },
  },
});
