import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://positronikal.github.io',
  base: '/',
  output: 'static',
  trailingSlash: 'never',
  integrations: [
    tailwind(),
    sitemap()
  ],
  markdown: {
    shikiConfig: {
      theme: 'material-theme-darker',
      wrap: true
    }
  }
});
