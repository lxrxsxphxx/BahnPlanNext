import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: './app/components/theme/theme-check.ts',
  clean: false,
  outputOptions: {
    dir: undefined,
    file: './app/components/theme/theme-check.iife.js',
  },
  platform: 'browser',
  format: 'iife',
  target: 'es6',
  dts: false,
  minify: true,
  treeshake: true,
});
