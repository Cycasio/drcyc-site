import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// 字型只讀一次,所有 OG 圖共用(build 期從專案根目錄解析,避免 bundle 後路徑跑掉)
// 單一完整子集:常用漢字 + CJK/全形標點 + 拉丁,涵蓋所有標題用字
const tcFont = readFileSync(resolve(process.cwd(), 'src/assets/fonts/NotoSansTC-700.ttf'));

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map((post) => ({ params: { slug: post.slug }, props: { post } }));
}

// 用 satori 組標題卡(JSX-free,直接用物件 VDOM)
function card(title: string, category: string) {
  return {
    type: 'div',
    props: {
      style: {
        width: '1200px',
        height: '630px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: 'linear-gradient(135deg, #022448 0%, #006a60 100%)',
        padding: '64px 72px',
        fontFamily: 'Noto Sans TC',
        color: '#ffffff',
      },
      children: [
        // 頂部:分類標籤
        {
          type: 'div',
          props: {
            style: { display: 'flex', alignItems: 'center' },
            children: {
              type: 'div',
              props: {
                style: {
                  fontSize: '28px',
                  fontWeight: 700,
                  color: '#8cf5e4',
                  border: '2px solid #8cf5e4',
                  borderRadius: '999px',
                  padding: '8px 28px',
                },
                children: category || '健康衛教',
              },
            },
          },
        },
        // 中段:標題
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              fontSize: title.length > 28 ? '60px' : '72px',
              fontWeight: 700,
              lineHeight: 1.3,
              letterSpacing: '-1px',
            },
            children: title,
          },
        },
        // 底部:醫師署名
        {
          type: 'div',
          props: {
            style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
            children: [
              {
                type: 'div',
                props: {
                  style: { display: 'flex', flexDirection: 'column' },
                  children: [
                    { type: 'div', props: { style: { fontSize: '34px', fontWeight: 700 }, children: '陳昱彰醫師 Dr. Yu-Chang Chen' } },
                    { type: 'div', props: { style: { fontSize: '24px', color: '#8aa4cf', marginTop: '6px' }, children: '義大醫院家醫科 · 家醫/肥胖/骨鬆三專科' } },
                  ],
                },
              },
              { type: 'div', props: { style: { fontSize: '28px', fontWeight: 700, color: '#8cf5e4' }, children: 'drcyc.io' } },
            ],
          },
        },
      ],
    },
  };
}

export const GET: APIRoute = async ({ props }) => {
  const { post } = props as { post: { data: { title: string; category?: string } } };

  const svg = await satori(card(post.data.title, post.data.category ?? '') as any, {
    width: 1200,
    height: 630,
    fonts: [
      { name: 'Noto Sans TC', data: tcFont, weight: 700, style: 'normal' },
    ],
  });

  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();

  return new Response(png, {
    headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=31536000, immutable' },
  });
};
