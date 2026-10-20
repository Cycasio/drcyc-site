import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

// Compile the enabled bundle to dist-events-test first. No real network or browser writes.
const enabled = readFileSync('dist-events-test/health-checkup/index.html', 'utf8');
const code = [...enabled.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]).find((s) => s.includes('/api/site-events'));
assert.ok(code, 'enabled analytics bundle must exist');
assert.ok(!readFileSync('dist/health-checkup/index.html', 'utf8').includes('/api/site-events'), 'default build must omit collection code');
function run(overrides = {}) {
  let click;
  const requests = [];
  class Element {
    constructor(href) { this.href = href; }
    closest() { return this; }
  }
  runInNewContext(code, {
    URL, Element,
    navigator: overrides.navigator ?? {},
    location: { origin: 'https://www.drcyc.io', pathname: '/health-checkup/', search: '?health=never-send', hash: '#private', ...overrides.location },
    document: { referrer: 'https://chatgpt.com/c/private-conversation?secret=never-send', addEventListener: (type, handler) => { if (type === 'click') click = handler; } },
    fetch: (url, options) => { requests.push({ url, options }); return Promise.resolve(); },
  });
  return { requests, click: (href, trusted = true) => click?.({ isTrusted: trusted, target: new Element(href) }) };
}
const active = run();
active.click('https://unapproved.example/');
active.click('tel:+88676622588', false);
assert.equal(active.requests.length, 0);
active.click('tel:+88676622588');
active.click('tel:+88676622588');
assert.equal(active.requests.length, 1, 'deduplicate same target within a page load');
assert.deepEqual(JSON.parse(active.requests[0].options.body), { event: 'phone_click', page: 'checkup', target: 'qishan_phone', source: 'chatgpt' });
assert.equal(active.requests[0].options.credentials, 'omit');
assert.equal(active.requests[0].options.referrerPolicy, 'no-referrer');
assert.ok(!JSON.stringify(active.requests).includes('never-send'));
for (const overrides of [
  { navigator: { doNotTrack: '1' } }, { navigator: { globalPrivacyControl: true } },
  { location: { origin: 'http://127.0.0.1:4331' } },
  { location: { origin: 'https://preview.pages.dev' } },
  { location: { pathname: '/blog/health-tools/cardiovascular-risk-estimator/' } },
]) {
  const disabled = run(overrides);
  disabled.click('tel:+88676622588');
  assert.equal(disabled.requests.length, 0);
}
console.log('Compiled analytics client passed: fixed payload, deduplication, preview and calculator exclusion, privacy preferences, default-off build.');
