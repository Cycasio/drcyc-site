import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { cp, mkdtemp, readFile, rm, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Match the restricted publisher: only dist/ and functions/ leave the source tree.
// This check is local-only and must not need an account or credentials.
const root = fileURLToPath(new URL('../', import.meta.url));
const stage = await mkdtemp(path.join(tmpdir(), 'drcyc-release-stage-'));
try {
  const log = path.join(stage, 'wrangler-null.log');
  await symlink('/dev/null', log);
  await cp(path.join(root, 'dist'), path.join(stage, 'dist'), { recursive: true });
  await cp(path.join(root, 'functions'), path.join(stage, 'functions'), { recursive: true });
  execFileSync(process.execPath, [
    path.join(root, 'node_modules/wrangler/bin/wrangler.js'),
    'pages', 'functions', 'build', 'functions',
    '--outfile', path.join(stage, 'worker.js'),
    '--output-config-path', path.join(stage, 'routes.json'),
  ], {
    cwd: stage,
    env: { PATH: process.env.PATH, LANG: 'en_US.UTF-8', WRANGLER_SEND_METRICS: 'false', WRANGLER_LOG_PATH: log, CI: 'true' },
    stdio: 'pipe',
    timeout: 60000,
  });
  const config = JSON.parse(await readFile(path.join(stage, 'routes.json'), 'utf8'));
  assert.deepEqual(config.routes.map((route) => route.routePath).sort(), ['/', '/api/site-events']);
  const worker = await readFile(path.join(stage, 'worker.js'), 'utf8');
  assert.ok(worker.includes('lpa-apob-health-health-checkup'), 'redirect aliases must be bundled');
  assert.ok(worker.includes('booking_click'), 'fixed event validation must be bundled');
  console.log('Isolated release stage: Functions bundle and exact routes passed.');
} finally {
  // Only remove the uniquely created temporary test directory.
  await rm(stage, { recursive: true, force: true });
}
