import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://merritts-auto-recycling.com',
  output: 'static',
  trailingSlash: 'never',
  build: {
    format: 'file',
  },
  vite: {
    build: {
      cssMinify: 'lightningcss',
    },
  },
});
