// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  site: 'https://7harshitsingh.github.io',
  outDir: process.env.ASTRO_OUT_DIR ?? './dist',
});
