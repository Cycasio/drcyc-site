import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { articleDates, staticDates } from './sitemap-lastmod.mjs';

const read = (route) => readFileSync('dist' + route + 'index.html', 'utf8');
for (const slug of ['motivational-interviewing', 'sarcopenia-resistance-training', 'osteoporosis-screening-guide', 'weight-loss-comb-model', 'workplace-health-guide']) {
  const html = read('/blog/' + slug + '/');
  assert.equal((html.match(/<h2[^>]*>常見問題/g) ?? []).length, 1, slug + ' FAQ count');
  assert.equal((html.match(/"@type":"FAQPage"/g) ?? []).length, 1, slug + ' FAQ schema count');
  const scripts = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  const nodes = scripts.flatMap((m) => { const j = JSON.parse(m[1]); return j['@graph'] ?? [j]; });
  const faq = nodes.find((n) => n['@type'] === 'FAQPage');
  for (const q of faq.mainEntity) assert.ok(html.includes(q.name), slug + ' missing visible question');
}
assert.ok(read('/health-checkup/').includes('id="booking"'));
assert.ok(read('/health-checkup/').includes('id="next-step"'));
assert.ok(!read('/qishan-clinic/').includes('"@type":"FAQPage"'));
const entries = [...readFileSync('dist/sitemap-0.xml', 'utf8').matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => m[1]);
const dates = new Map([...articleDates('src/content/blog'), ...staticDates]);
let verifiedDates = 0;
for (const entry of entries) {
  const route = new URL(entry.match(/<loc>(.*?)<\/loc>/)[1]).pathname;
  const date = dates.get(route);
  if (date) {
    assert.ok(entry.includes('<lastmod>' + new Date(date + 'T00:00:00+08:00').toISOString() + '</lastmod>'), route);
    verifiedDates++;
  } else assert.ok(!entry.includes('<lastmod>'), route + ' unverifiable date');
}
assert.ok(!entries.some((e) => /<loc>https:\/\/www.drcyc.io\/blog\/health-tools\/<\/loc>/.test(e)));
const llms = readFileSync('dist/llms-full.txt', 'utf8');
for (const [route] of articleDates('src/content/blog')) {
  assert.ok(llms.includes('> 原文：https://www.drcyc.io' + route), route + ' original attribution');
}
for (const route of ['/services/', '/qishan-clinic/', '/health-checkup/', '/blog/health-tools/cardiovascular-risk-estimator/', '/blog/masld-mash-fatty-liver/', '/blog/lpa-apob-health-checkup/', '/blog/thyroid-hyperthyroidism-hypothyroidism/']) {
  assert.ok(existsSync('dist' + route + 'index.html'), route);
}
console.log('GEO build checks passed: 5 consolidated FAQs, ' + verifiedDates + ' content dates, internal routes and article attribution.');
