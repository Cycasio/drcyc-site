// 病患指標 localStorage store + 跨 widget 廣播
// 所有資料只存在使用者瀏覽器，不上傳。

import type { ActivityLevel, Comorbidities, Sex } from './calculators';
import { EMPTY_COMORBIDITIES } from './calculators';

const STORAGE_KEY = 'drcyc-tools-metrics';
const SCHEMA_VERSION = 1;

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

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

export function loadMetrics(): PatientMetrics {
  if (!isBrowser()) return EMPTY_METRICS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_METRICS;
    const parsed = JSON.parse(raw) as Partial<PatientMetrics>;
    if (parsed?.schemaVersion !== SCHEMA_VERSION) return EMPTY_METRICS;
    return {
      ...EMPTY_METRICS,
      ...parsed,
      comorbidities: { ...EMPTY_METRICS.comorbidities, ...(parsed.comorbidities ?? {}) },
      weightHistory: { ...EMPTY_METRICS.weightHistory, ...(parsed.weightHistory ?? {}) },
    };
  } catch {
    return EMPTY_METRICS;
  }
}

export function saveMetrics(patch: MetricsPatch): PatientMetrics {
  if (!isBrowser()) return EMPTY_METRICS;
  const current = loadMetrics();
  const next: PatientMetrics = {
    ...current,
    ...patch,
    comorbidities: {
      ...current.comorbidities,
      ...(patch.comorbidities ?? {}),
    },
    weightHistory: {
      ...current.weightHistory,
      ...(patch.weightHistory ?? {}),
    },
    schemaVersion: SCHEMA_VERSION,
    updatedAt: Date.now(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent<PatientMetrics>(METRICS_CHANGE_EVENT, { detail: next }));
  return next;
}

export function clearMetrics(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent<PatientMetrics>(METRICS_CHANGE_EVENT, { detail: EMPTY_METRICS }));
}

export function onMetricsChange(handler: (m: PatientMetrics) => void): () => void {
  if (!isBrowser()) return () => {};
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
