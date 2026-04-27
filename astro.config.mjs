import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://www.drcyc.io',
  trailingSlash: 'always',
  integrations: [sitemap(), tailwind()],
  redirects: {
    '/workplace-health': '/services',
    '/community-health': '/services',
    '/health-tools': '/blog/health-tools/',
    '/health-tools/tdee-calculator': '/blog/health-tools/tdee-calculator/',
    '/tools/tdee': '/blog/health-tools/tdee-calculator/',
  },
});
