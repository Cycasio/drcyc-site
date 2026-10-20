import test from 'node:test';
import assert from 'node:assert/strict';
import { handleSiteEvent } from '../functions/api/site-events.ts';
import { pageId, sourceClass, linkTarget, validEvent, SITE_ORIGIN } from '../functions/_shared/site-events.ts';
import { knownArticleRedirect } from '../functions/_shared/known-article-redirects.ts';
import { contentDate } from './sitemap-lastmod.mjs';

const sample = { event: 'booking_click', page: 'checkup', target: 'edah_booking', source: 'google' };
function request(body: unknown = sample, headers: Record<string, string> = {}, origin = SITE_ORIGIN) {
  return new Request(origin + '/api/site-events', {
    method: 'POST', headers: { Origin: SITE_ORIGIN, 'Content-Type': 'application/json', ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}
function mock() {
  const points: unknown[] = [];
  return { points, env: { SITE_EVENTS_ENABLED: 'true', SITE_EVENTS: { writeDataPoint: (p: unknown) => points.push(p) } } };
}
test('strict fixed schema and event/target relation', () => {
  assert.ok(validEvent(sample));
  for (const extra of ['url', 'referrer', 'ldl', 'age', 'result', 'email', 'ip', 'userId']) {
    assert.equal(validEvent({ ...sample, [extra]: 'private' }), false);
  }
  for (const invalid of [null, [], {}, { ...sample, page: '/private' }, { ...sample, event: 'phone_click' }]) assert.equal(validEvent(invalid), false);
});
test('only explicit pages, targets and referrer categories', () => {
  assert.equal(pageId('/health-checkup/'), 'checkup');
  assert.equal(pageId('/blog/health-tools/cardiovascular-risk-estimator/'), undefined);
  assert.equal(pageId('/health-checkup/?ldl=123'), undefined);
  assert.equal(linkTarget('tel:+886-7-662-2588'), 'qishan_phone');
  assert.equal(linkTarget('https://evil.example/register'), undefined);
  assert.equal(sourceClass('https://chatgpt.com/c/private?x=secret'), 'chatgpt');
  assert.equal(sourceClass('https://chatgpt.com.evil.example/'), 'other');
  assert.equal(sourceClass('https://www.google.com.tw/search?q=secret'), 'google');
  assert.equal(sourceClass(SITE_ORIGIN + '/secret'), 'internal');
  assert.equal(sourceClass(''), 'direct_unknown');
});
test('valid request writes only fixed dimensions and count', async () => {
  const { points, env } = mock();
  const response = await handleSiteEvent(request(), env);
  assert.equal(response.status, 204);
  assert.deepEqual(points, [{ blobs: ['booking_click', 'checkup', 'edah_booking', 'google'], doubles: [1] }]);
  assert.equal(response.headers.get('cache-control'), 'no-store, private');
  assert.equal(response.headers.get('access-control-allow-origin'), null);
  assert.equal(response.headers.get('set-cookie'), null);
});
test('disabled, missing binding, preview and cross-origin cannot write', async () => {
  const { points, env } = mock();
  assert.equal((await handleSiteEvent(request(), {})).status, 503);
  assert.equal((await handleSiteEvent(request(), { ...env, SITE_EVENTS_ENABLED: 'false' })).status, 503);
  assert.equal((await handleSiteEvent(request(sample, {}, 'https://preview.pages.dev'), env)).status, 403);
  assert.equal((await handleSiteEvent(request(sample, { Origin: 'https://evil.example' }), env)).status, 403);
  assert.equal((await handleSiteEvent(new Request(SITE_ORIGIN + '/api/site-events'), env)).status, 405);
  assert.deepEqual(points, []);
});
test('DNT/GPC and malformed/oversized bodies do not write', async () => {
  const { points, env } = mock();
  for (const headers of [{ DNT: '1' }, { 'Sec-GPC': '1' }]) assert.equal((await handleSiteEvent(request(sample, headers), env)).status, 204);
  assert.equal((await handleSiteEvent(request(sample, { 'Content-Type': 'text/plain' }), env)).status, 415);
  assert.equal((await handleSiteEvent(request('{'), env)).status, 400);
  assert.equal((await handleSiteEvent(request({ ...sample, health: 'secret' }), env)).status, 400);
  assert.equal((await handleSiteEvent(request('x'.repeat(513)), env)).status, 413);
  assert.equal((await handleSiteEvent(request(sample, { 'Content-Length': '99999' }), env)).status, 413);
  assert.deepEqual(points, []);
});
test('precise redirects accept encoding and slash without broad matching', () => {
  const chinese = '/blog/甲狀腺亢進與低下：症狀、抽血怎麼看、什麼時候該治療';
  for (const path of [chinese, chinese + '/', encodeURI(chinese), encodeURI(chinese) + '/']) {
    assert.equal(knownArticleRedirect(path), '/blog/thyroid-hyperthyroidism-hypothyroidism/');
  }
  assert.equal(knownArticleRedirect('/blog/lpa-apob-health-health-checkup/'), '/blog/lpa-apob-health-checkup/');
  assert.equal(knownArticleRedirect('/blog/masld-mash-fatty-linear/'), '/blog/masld-mash-fatty-liver/');
  for (const path of ['/blog/unknown/', '/blog/lpa-apob-health-checkup/', '/blog/%broken', '/api/prevent']) assert.equal(knownArticleRedirect(path), undefined);
});
test('binding failure does not report a successful collection', async () => {
  const env = { SITE_EVENTS_ENABLED: 'true', SITE_EVENTS: { writeDataPoint() { throw new Error('unavailable'); } } };
  assert.equal((await handleSiteEvent(request(), env)).status, 503);
});
test('lastmod uses content dates, not build dates', () => {
  assert.equal(contentDate('---\npubDate: 2025-01-01\nupdatedDate: 2025-03-02\n---\n'), '2025-03-02');
  assert.equal(contentDate('---\npubDate: 2025-01-01\n---\n'), '2025-01-01');
  assert.throws(() => contentDate('---\npubDate: 2025-02-31\n---\n'));
  assert.throws(() => contentDate('---\npubDate: 2099-01-01\n---\n'));
});
