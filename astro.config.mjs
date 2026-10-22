import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { unified } from '@astrojs/markdown-remark';
import { articleDates, staticDates } from './scripts/sitemap-lastmod.mjs';

const SITE = 'https://www.drcyc.io';
const lastmod = new Map([...articleDates(fileURLToPath(new URL('./src/content/blog/', import.meta.url))), ...staticDates]);

export default defineConfig({
  site: SITE,
  trailingSlash: 'always',
  compressHTML: true,
  markdown: { processor: unified() },
  vite: {
    plugins: [tailwindcss()],
    build: { assetsInlineLimit: (filePath) => filePath.endsWith('.js') ? false : undefined },
  },
  integrations: [
    // Only verified content dates; unknown dates remain omitted.
    sitemap({
      // 舊的健康工具文章 hub 由 Cloudflare 301 到 /tools/，不要再放進 sitemap。
      filter: (page) => page !== `${SITE}/blog/health-tools/`,
      serialize: (item) => {
        const date = lastmod.get(new URL(item.url).pathname);
        return date ? { ...item, lastmod: new Date(date + 'T00:00:00+08:00') } : item;
      },
    }),
  ],
});
