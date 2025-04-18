import { defineConfig } from '@rsbuild/core';

export default defineConfig({
  server: {
    port: 3030,
  },
  source: {
    entry: {
      index: './src/index.ts',
    },
  },
  dev: {
    writeToDisk: true,
  },
  output: {
    target: 'node',
  },
});