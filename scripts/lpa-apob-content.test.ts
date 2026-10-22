import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const article = readFileSync(new URL('../src/content/blog/lpa-apob-health-checkup.md', import.meta.url), 'utf8');
const checkup = readFileSync(new URL('../src/pages/health-checkup.astro', import.meta.url), 'utf8');

test('Lp(a)/ApoB article and health-checkup section link to each other', () => {
  assert.match(article, /\]\(\/health-checkup\/#lpa-apob\)/);
  assert.match(checkup, /href="\/blog\/lpa-apob-health-checkup\/"/);
  assert.match(checkup, /id="lpa-apob"/);
  assert.match(article, /pubDate: 2026-09-15/);
});

test('content preserves clinical and hospital-offering limits', () => {
  for (const phrase of ['不是 ApoA1', '不要拿網路上的固定係數', '不是人人每年', '藥廠公布的初步結果', '不代表每種套餐', '不要自行停藥']) {
    assert.ok(article.includes(phrase), `missing safety context: ${phrase}`);
  }
  assert.doesNotMatch(article, /\$350|\$700|350 元|700 元/);
  assert.match(checkup, /dateModified: PAGE_UPDATED/);
  // 局部內容來源核對不應宣稱整頁已完成醫療審閱。
  assert.doesNotMatch(checkup, /lastReviewed:/);
  assert.match(checkup, /SCREENING_LAST_CHECKED/);
});
