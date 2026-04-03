import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://drcyc.io',
  integrations: [sitemap(), tailwind()],
  redirects: {
    '/workplace-health': '/services',
    '/health-checkup': '/services',
    '/community-health': '/services',
  },
});
