// @ts-check
import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';

export default defineConfig({
  output: 'static',
  site: 'https://7harshitsingh.github.io',
  outDir: process.env.ASTRO_OUT_DIR ?? './dist',
  build: { inlineStylesheets: 'always' },
  markdown: { processor: satteri({ features: { math: true } }) },
});
