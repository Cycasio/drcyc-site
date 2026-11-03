import assert from 'node:assert/strict';
import { readFileSync, realpathSync } from 'node:fs';
import { dirname, resolve, sep } from 'node:path';
import { runInNewContext } from 'node:vm';

// Default: compare dist-events-test (enabled) with dist (disabled).
// --production: verify the actual enabled dist against a separate disabled build.
// No real network or browser writes; only these fixed build directories are accepted.
assert.ok(process.argv.length === 2 || (process.argv.length === 3 && process.argv[2] === '--production'), 'usage: node scripts/check-site-events-bundle.mjs [--production]');
const production = process.argv[2] === '--production';
function readClient(build) {
  const html = readFileSync(`${build}/health-checkup/index.html`, 'utf8');
  const sources = [...html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"[^>]*>/g)]
    .map((match) => match[1]).filter((src) => /^\/_astro\/SiteEvents\.[A-Za-z0-9_.-]+\.js$/.test(src));
  assert.equal(sources.length, 1, `${build}: rebuild with exactly one external SiteEvents client`);
  const assetRoot = realpathSync(resolve(build, '_astro'));
  const asset = realpathSync(resolve(build, `.${sources[0]}`));
  assert.ok(asset.startsWith(`${assetRoot}${sep}`) && dirname(asset) === assetRoot, 'client must stay inside its build asset directory');
  return readFileSync(asset, 'utf8');
}
const code = readClient(production ? 'dist' : 'dist-events-test');
assert.ok(code, 'enabled analytics bundle must exist');
const defaultCode = readClient(production ? 'dist-events-disabled' : 'dist');
assert.ok(!defaultCode.includes('/api/site-events'), 'default build must omit collection code');
function run(overrides = {}, clientCode = code) {
  let click;
  const requests = [];
  class Element {
    constructor(href) { this.href = href; }
    closest() { return this; }
  }
  runInNewContext(clientCode, {
    URL, Element,
    navigator: overrides.navigator ?? {},
    location: { origin: 'https://www.drcyc.io', pathname: '/health-checkup/', search: '?health=never-send', hash: '#private', ...overrides.location },
    document: { referrer: 'https://chatgpt.com/c/private-conversation?secret=never-send', addEventListener: (type, handler) => { if (type === 'click') click = handler; } },
    fetch: (url, options) => { requests.push({ url, options }); return Promise.resolve(); },
  });
  return { requests, hasClickHandler: !!click, click: (href, trusted = true) => click?.({ isTrusted: trusted, target: new Element(href) }) };
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
for (const [pathname, page] of [['/weight-loss/', 'weight_loss'], ['/osteoporosis/', 'osteoporosis']]) {
  const pageClient = run({ location: { pathname } });
  pageClient.click('https://webreg.edah.org.tw/Register/ChooseDoctorTime/2675');
  assert.equal(pageClient.requests.length, 1);
  assert.deepEqual(JSON.parse(pageClient.requests[0].options.body), { event: 'booking_click', page, target: 'edah_booking', source: 'chatgpt' });
}
for (const pathname of ['/health-checkup/', '/weight-loss/', '/osteoporosis/']) {
  const inactive = run({ location: { pathname } }, defaultCode);
  inactive.click('tel:+88676622588');
  assert.equal(inactive.hasClickHandler, false, 'default build must not register collection handlers');
  assert.equal(inactive.requests.length, 0);
}
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
