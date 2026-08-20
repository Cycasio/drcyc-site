import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';

const SITE = 'https://www.drcyc.io';

export default defineConfig({
  site: SITE,
  trailingSlash: 'always',
  integrations: [
    // 不用 build 時間假裝全站內容更新；沒有可驗證的單頁日期時就省略 lastmod。
    sitemap(),
    tailwind(),
  ],
});
