// 預設只在目前頁面記憶體運算；明確同意後才保存，期限不自動延長。

import type { ActivityLevel, Comorbidities, Sex } from './calculators.ts';
import { EMPTY_COMORBIDITIES } from './calculators.ts';

export const METRICS_STORAGE_KEY = 'drcyc-tools-metrics';
export const REMEMBER_DURATION_MS = 7 * 24 * 60 * 60 * 1000;
const SCHEMA_VERSION = 2;

export interface WeightHistory {
  startWeightKg: number | null;
  targetWeightKg: number | null;
}

export interface PatientMetrics {
  schemaVersion: number;
  sex: Sex | null;
  age: number | null;
  heightCm: number | null;
  weightKg: number | null;
  waistCm: number | null;
  hipCm: number | null;
  activityLevel: ActivityLevel | null;
  comorbidities: Comorbidities;
  weightHistory: WeightHistory;
  updatedAt: number;
}

export const EMPTY_METRICS: PatientMetrics = {
  schemaVersion: SCHEMA_VERSION,
  sex: null,
  age: null,
  heightCm: null,
  weightKg: null,
  waistCm: null,
  hipCm: null,
  activityLevel: null,
  comorbidities: { ...EMPTY_COMORBIDITIES },
  weightHistory: { startWeightKg: null, targetWeightKg: null },
  updatedAt: 0,
};

export const METRICS_CHANGE_EVENT = 'drcyc:metrics:change';

export type MetricsPatch = Partial<Omit<PatientMetrics, 'comorbidities' | 'weightHistory' | 'schemaVersion' | 'updatedAt'>> & {
  comorbidities?: Partial<Comorbidities>;
  weightHistory?: Partial<WeightHistory>;
};

type StoragePort = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;
const copy = (m: PatientMetrics): PatientMetrics => ({ ...m, comorbidities: { ...m.comorbidities }, weightHistory: { ...m.weightHistory } });
const record = (v: unknown): Record<string, unknown> => v !== null && typeof v === 'object' && !Array.isArray(v) ? v as Record<string, unknown> : {};
const number = (v: unknown): number | null => typeof v === 'number' && Number.isFinite(v) && v >= 0 ? v : null;
function sanitize(value: unknown): PatientMetrics {
  const v = record(value); const m = copy(EMPTY_METRICS);
  m.sex = v.sex === 'male' || v.sex === 'female' ? v.sex : null;
  for (const key of ['age', 'heightCm', 'weightKg', 'waistCm', 'hipCm'] as const) m[key] = number(v[key]);
  m.activityLevel = [1.2, 1.375, 1.55, 1.725, 1.9].includes(v.activityLevel as number) ? v.activityLevel as ActivityLevel : null;
  for (const key of Object.keys(m.comorbidities) as (keyof Comorbidities)[]) m.comorbidities[key] = record(v.comorbidities)[key] === true;
  m.weightHistory.startWeightKg = number(record(v.weightHistory).startWeightKg);
  m.weightHistory.targetWeightKg = number(record(v.weightHistory).targetWeightKg);
  m.updatedAt = number(v.updatedAt) ?? 0;
  return m;
}

export function createMetricsStore(storage: StoragePort, now = Date.now) {
  let metrics = copy(EMPTY_METRICS);
  let expiresAt: number | null = null;
  let initialized = false;
  let storageError = false;
  function remove() {
    try { storage.removeItem(METRICS_STORAGE_KEY); } catch { storageError = true; }
  }
  function load(): PatientMetrics {
    if (!initialized) {
      initialized = true;
      try {
        const raw = storage.getItem(METRICS_STORAGE_KEY);
        if (raw) {
          const saved = record(JSON.parse(raw));
          if (saved.schemaVersion === SCHEMA_VERSION && saved.consent === true &&
              typeof saved.expiresAt === 'number' && Number.isFinite(saved.expiresAt) &&
              saved.expiresAt > now() && saved.expiresAt <= now() + REMEMBER_DURATION_MS) {
            expiresAt = saved.expiresAt; metrics = sanitize(saved.metrics);
          } else remove(); // 舊版自動保存不等於同意，不自動轉入新版本。
        }
      } catch { storageError = true; remove(); }
    }
    if (expiresAt !== null && expiresAt <= now()) {
      expiresAt = null; metrics = copy(EMPTY_METRICS); remove();
    }
    return copy(metrics);
  }
  function persist() {
    if (expiresAt === null) return;
    try {
      storage.setItem(METRICS_STORAGE_KEY, JSON.stringify({ schemaVersion: SCHEMA_VERSION, consent: true, expiresAt, metrics }));
      storageError = false;
    } catch { storageError = true; expiresAt = null; remove(); }
  }
  return {
    load,
    save(patch: MetricsPatch) {
      const current = load();
      metrics = sanitize({ ...current, ...patch, comorbidities: { ...current.comorbidities, ...patch.comorbidities },
        weightHistory: { ...current.weightHistory, ...patch.weightHistory }, updatedAt: now() });
      persist(); return copy(metrics);
    },
    remember(enabled: boolean) {
      load();
      expiresAt = enabled ? expiresAt ?? now() + REMEMBER_DURATION_MS : null;
      if (enabled) persist(); else remove();
    },
    persistence() { load(); return { remembered: expiresAt !== null, expiresAt, storageError }; },
    clear() { initialized = true; metrics = copy(EMPTY_METRICS); expiresAt = null; remove(); },
    reload() { initialized = false; metrics = copy(EMPTY_METRICS); expiresAt = null; load(); },
  };
}

let browserStore: ReturnType<typeof createMetricsStore> | undefined;
function store() {
  if (typeof window === 'undefined') return undefined;
  if (!browserStore) {
    // Access storage only inside guarded methods: privacy settings may throw.
    browserStore = createMetricsStore({
      getItem: key => window.localStorage.getItem(key),
      setItem: (key, value) => window.localStorage.setItem(key, value),
      removeItem: key => window.localStorage.removeItem(key),
    });
    window.addEventListener('storage', event => {
      if (event.key === METRICS_STORAGE_KEY || event.key === null) { browserStore?.reload(); announce(); }
    });
    window.addEventListener('pageshow', event => {
      if (event.persisted) { browserStore?.reload(); announce(); }
    });
  }
  return browserStore;
}
function announce() {
  if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent<PatientMetrics>(METRICS_CHANGE_EVENT, { detail: loadMetrics() }));
}
export function loadMetrics(): PatientMetrics { return store()?.load() ?? copy(EMPTY_METRICS); }
export function saveMetrics(patch: MetricsPatch): PatientMetrics {
  const next = store()?.save(patch) ?? copy(EMPTY_METRICS); announce(); return next;
}
export function metricsPersistence() { return store()?.persistence() ?? { remembered: false, expiresAt: null, storageError: false }; }
export function rememberMetrics(enabled: boolean) { store()?.remember(enabled); announce(); }
export function clearMetrics(): void { store()?.clear(); announce(); }

export function onMetricsChange(handler: (m: PatientMetrics) => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const listener = (e: Event) => handler((e as CustomEvent<PatientMetrics>).detail);
  window.addEventListener(METRICS_CHANGE_EVENT, listener);
  return () => window.removeEventListener(METRICS_CHANGE_EVENT, listener);
}

// 工具：從 form input string 安全解析數字（空字串/非數字 → null）
export function parseNumberInput(value: string): number | null {
  if (value === '' || value == null) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}
