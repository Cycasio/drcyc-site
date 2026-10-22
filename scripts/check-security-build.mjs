import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../dist/', import.meta.url));
const headers = await readFile(path.join(root, '_headers'), 'utf8');
const policy = headers.match(/Content-Security-Policy:\s*(.+)/)?.[1] ?? '';
assert.ok(policy.includes("script-src-attr 'none'"));
assert.ok(policy.includes("object-src 'none'"));
assert.ok(policy.includes("form-action 'self'"));
assert.ok(!/script-src\s+[^;]*'unsafe-inline'/.test(policy));
for (const line of headers.split('\n')) assert.ok(line.length <= 2000, 'Cloudflare header line limit');
const files = (await readdir(root, { recursive: true })).filter(p => p.endsWith('.html'));
assert.ok(files.length >= 60, 'Expected all existing pages');
let externalScripts = 0;
for (const file of files) {
  const html = await readFile(path.join(root, file), 'utf8');
  assert.ok(!/<[^>]+\son[a-z]+\s*=/i.test(html), `${file}: inline event handler`);
  assert.ok(!/\b(?:href|action)\s*=\s*["']javascript:/i.test(html), `${file}: executable URL`);
  for (const [, attrs, body] of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    const type = attrs.match(/\btype=["']([^"']+)["']/)?.[1];
    if (type === 'application/ld+json') { JSON.parse(body); continue; }
    const src = attrs.match(/\bsrc=["']([^"']+)["']/)?.[1];
    assert.ok(src, `${file}: executable inline script is forbidden`);
    const url = new URL(src, 'https://www.drcyc.io/');
    if (url.origin === 'https://www.drcyc.io') {
      assert.ok((await stat(path.join(root, decodeURIComponent(url.pathname)))).isFile(), `${file}: missing JS asset ${src}`);
    } else assert.equal(url.origin, 'https://static.cloudflareinsights.com');
    externalScripts++;
  }
}
console.log(`Security build: ${files.length} pages, ${externalScripts} external scripts; no executable inline scripts or event attributes.`);
