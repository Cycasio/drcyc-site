import test from 'node:test';
import assert from 'node:assert/strict';
import { createMetricsStore, METRICS_STORAGE_KEY, REMEMBER_DURATION_MS } from '../src/scripts/tools/metrics-store.ts';

function fixture(seed?: string) {
  const values = new Map<string, string>(seed ? [[METRICS_STORAGE_KEY, seed]] : []);
  let now = 1_800_000_000_000;
  const storage = {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => { values.set(key, value); },
    removeItem: (key: string) => { values.delete(key); },
  };
  return { values, storage, clock: () => now, advance: (ms: number) => { now += ms; } };
}
test('default inputs stay in memory and do not survive a new page', () => {
  const f = fixture(); const s = createMetricsStore(f.storage, f.clock);
  s.save({ age: 40, weightKg: 70, comorbidities: { t2dm: true } });
  assert.equal(s.load().age, 40);
  assert.equal(s.load().comorbidities.t2dm, true);
  assert.equal(f.values.size, 0);
  assert.equal(createMetricsStore(f.storage, f.clock).load().age, null);
});
test('explicit opt-in survives reload for a fixed seven days, not sliding expiry', () => {
  const f = fixture(); const s = createMetricsStore(f.storage, f.clock);
  s.save({ age: 40, comorbidities: { t2dm: true } }); s.remember(true);
  const expiry = s.persistence().expiresAt;
  assert.equal(expiry, f.clock() + REMEMBER_DURATION_MS);
  f.advance(1000); s.save({ age: 41 });
  assert.equal(s.persistence().expiresAt, expiry);
  assert.equal(createMetricsStore(f.storage, f.clock).load().age, 41);
  assert.equal(createMetricsStore(f.storage, f.clock).load().comorbidities.t2dm, true);
  f.advance(REMEMBER_DURATION_MS);
  assert.equal(s.load().age, null);
  assert.equal(s.persistence().remembered, false);
  assert.equal(f.values.size, 0);
});
test('legacy auto-saved data is removed, not treated as consent', () => {
  const f = fixture(JSON.stringify({ schemaVersion: 1, age: 55 }));
  const s = createMetricsStore(f.storage, f.clock);
  assert.equal(s.load().age, null); assert.equal(f.values.size, 0);
});
test('turning off remembering removes storage but retains the current calculation', () => {
  const f = fixture(); const s = createMetricsStore(f.storage, f.clock);
  s.save({ age: 40 }); s.remember(true); s.remember(false);
  assert.equal(s.load().age, 40); assert.equal(f.values.size, 0);
  assert.equal(s.persistence().remembered, false);
});
test('clear removes input and consent; following inputs are not stored', () => {
  const f = fixture(); const s = createMetricsStore(f.storage, f.clock);
  s.save({ age: 40 }); s.remember(true); s.clear(); s.save({ age: 20 });
  assert.equal(f.values.size, 0); assert.equal(s.persistence().remembered, false);
});
test('malformed and invalid-expiry storage fails closed', () => {
  for (const seed of ['{', '{}', JSON.stringify({ schemaVersion: 2, consent: true, expiresAt: 1e30, metrics: { age: 50 } })]) {
    const f = fixture(seed); const s = createMetricsStore(f.storage, f.clock);
    assert.equal(s.load().age, null); assert.equal(f.values.size, 0);
  }
});
test('storage failures do not break in-memory calculations or claim successful consent', () => {
  const s = createMetricsStore({ getItem() { throw Error(); }, setItem() { throw Error(); }, removeItem() { throw Error(); } });
  s.save({ age: 40 }); s.remember(true);
  assert.equal(s.load().age, 40); assert.equal(s.persistence().remembered, false);
  assert.equal(s.persistence().storageError, true);
});
test('snapshots and stored data cannot inject extra fields or mutate shared state', () => {
  const f = fixture(); const s = createMetricsStore(f.storage, f.clock);
  s.save({ age: 40 }); const snapshot = s.load(); snapshot.age = 999;
  assert.equal(s.load().age, 40);
  s.save({ age: NaN, arbitrary: 'secret' } as never); s.remember(true);
  assert.equal(s.load().age, null);
  assert.equal(JSON.stringify([...f.values.values()]).includes('arbitrary'), false);
});
test('external clear can reload without retaining previous remembered data', () => {
  const f = fixture(); const s = createMetricsStore(f.storage, f.clock);
  s.save({ age: 40 }); s.remember(true); f.storage.removeItem(METRICS_STORAGE_KEY); s.reload();
  assert.equal(s.load().age, null); assert.equal(s.persistence().remembered, false);
});
