/// <reference types="vitest" >
import { resolve } from 'node:path';
import babel from '@rolldown/plugin-babel';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({
      presets: [reactCompilerPreset()],
    }),
    vanillaExtractPlugin(),
  ],
  test: {
    include: ['**/*.test.{ts,tsx}'],
    globals: true,
    setupFiles: ['setupTest.ts'],
    environment: 'jsdom',
    reporters: ['default'],
    coverage: {
      reporter: ['json', 'html'],
      thresholds: {
        statements: 90,
        functions: 90,
        branches: 90,
        lines: 90,
      },
    },
    pool: 'vmThreads',
  },
  resolve: {
    alias: {
      '@/': `${resolve(import.meta.dirname, 'src')}/`,
    },
  },
});
