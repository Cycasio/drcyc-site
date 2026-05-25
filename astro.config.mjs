import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';

const SITE = 'https://www.drcyc.io';

// 各路徑的更新頻率與優先度（AI 與搜尋引擎用來判斷抓取頻率）
function getPagePriority(url) {
  const path = url.replace(SITE, '');
  if (path === '/' || path === '') return { changefreq: 'weekly', priority: 1.0 };
  if (path.startsWith('/health-checkup')) return { changefreq: 'monthly', priority: 0.95 };
  if (path === '/blog/' || path === '/about/' || path === '/services/') {
    return { changefreq: 'weekly', priority: 0.9 };
  }
  if (path.startsWith('/blog/') && !path.startsWith('/blog/health-tools')) {
    return { changefreq: 'monthly', priority: 0.85 };
  }
  if (path.startsWith('/tools') || path.startsWith('/blog/health-tools')) {
    return { changefreq: 'monthly', priority: 0.85 };
  }
  return { changefreq: 'monthly', priority: 0.7 };
}

export default defineConfig({
  site: SITE,
  trailingSlash: 'always',
  integrations: [
    sitemap({
      lastmod: new Date(),
      serialize(item) {
        const { changefreq, priority } = getPagePriority(item.url);
        return { ...item, changefreq, priority };
      },
    }),
    tailwind(),
  ],
  redirects: {
    '/health-tools': '/blog/health-tools/',
    '/health-tools/tdee-calculator': '/blog/health-tools/tdee-calculator/',
    '/tools/tdee': '/blog/health-tools/tdee-calculator/',
  },
});
