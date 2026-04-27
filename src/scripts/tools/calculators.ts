// 醫療計算機核心公式（純函式，無副作用）
// 公式來源於每個函式上方註明，臨床判讀請以醫師評估為準。

export type Sex = 'male' | 'female';
export type ActivityLevel = 1.2 | 1.375 | 1.55 | 1.725 | 1.9;

export interface ActivityOption {
  value: ActivityLevel;
  label: string;
  detail: string;
}

export const ACTIVITY_LEVELS: readonly ActivityOption[] = [
  { value: 1.2,   label: '久坐', detail: '辦公室工作、幾乎不運動' },
  { value: 1.375, label: '輕度活動', detail: '每週 1–3 次輕度運動或健走' },
  { value: 1.55,  label: '中度活動', detail: '每週 3–5 次中等強度運動' },
  { value: 1.725, label: '高度活動', detail: '每週 6–7 次運動，或勞力工作' },
  { value: 1.9,   label: '極高度活動', detail: '每天訓練或重度體力勞動' },
] as const;

// ─────────────────────────────────────────────
// BMI（國民健康署 成人肥胖分級）
// ─────────────────────────────────────────────
export function calcBmi(heightCm: number, weightKg: number): number {
  const m = heightCm / 100;
  return weightKg / (m * m);
}

export type BmiCategory =
  | 'underweight'
  | 'normal'
  | 'overweight'
  | 'obeseI'
  | 'obeseII'
  | 'obeseIII';

export interface BmiCategoryInfo {
  key: BmiCategory;
  label: string;
  range: string;
  tone: 'sky' | 'emerald' | 'amber' | 'orange' | 'red' | 'rose';
}

export const BMI_CATEGORY_INFO: Record<BmiCategory, BmiCategoryInfo> = {
  underweight: { key: 'underweight', label: '體重過輕', range: '< 18.5',  tone: 'sky' },
  normal:      { key: 'normal',      label: '健康體位', range: '18.5–24', tone: 'emerald' },
  overweight:  { key: 'overweight',  label: '體重過重', range: '24–27',   tone: 'amber' },
  obeseI:      { key: 'obeseI',      label: '輕度肥胖', range: '27–30',   tone: 'orange' },
  obeseII:     { key: 'obeseII',     label: '中度肥胖', range: '30–35',   tone: 'red' },
  obeseIII:    { key: 'obeseIII',    label: '重度肥胖', range: '≥ 35',    tone: 'rose' },
};

export function bmiCategory(bmi: number): BmiCategory {
  if (bmi < 18.5) return 'underweight';
  if (bmi < 24)   return 'normal';
  if (bmi < 27)   return 'overweight';
  if (bmi < 30)   return 'obeseI';
  if (bmi < 35)   return 'obeseII';
  return 'obeseIII';
}

// ─────────────────────────────────────────────
// 理想體重
// 健康體重以國健署常用之 BMI 22 × m² 為主。
// 健康範圍 BMI 18.5–24，Devine 公式作參考。
// ─────────────────────────────────────────────
export interface IdealWeight {
  bmi22Kg: number;
  healthyRangeMinKg: number;
  healthyRangeMaxKg: number;
  devineKg: number;
}

export function calcIdealWeight(heightCm: number, sex: Sex): IdealWeight {
  const m2 = (heightCm / 100) ** 2;
  const inches = heightCm / 2.54;
  const inchesOver5ft = Math.max(0, inches - 60);
  const devineKg =
    sex === 'male'
      ? 50 + 2.3 * inchesOver5ft
      : 45.5 + 2.3 * inchesOver5ft;
  return {
    bmi22Kg: 22 * m2,
    healthyRangeMinKg: 18.5 * m2,
    healthyRangeMaxKg: 24 * m2,
    devineKg,
  };
}

// ─────────────────────────────────────────────
// BMR（Mifflin-St Jeor，1990）
// 成人最準確公式之一
// ─────────────────────────────────────────────
export function calcBmr(
  sex: Sex,
  weightKg: number,
  heightCm: number,
  age: number,
): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return sex === 'male' ? base + 5 : base - 161;
}

// ─────────────────────────────────────────────
// TDEE = BMR × 活動係數
// ─────────────────────────────────────────────
export function calcTdee(bmr: number, activityLevel: ActivityLevel): number {
  return bmr * activityLevel;
}

// ─────────────────────────────────────────────
// 減重熱量缺口（每週減 0.5 / 1 kg）
// 1 kg 脂肪 ≈ 7700 kcal
// 安全攝取下限：成年男 1500、女 1200 kcal
// ─────────────────────────────────────────────
export type DeficitGoal = 0.5 | 1;

export interface CalorieDeficitPlan {
  perWeekKg: DeficitGoal;
  deficitKcal: number;
  rawTargetKcal: number;
  safeTargetKcal: number;
  belowSafetyFloor: boolean;
  safetyFloorKcal: number;
}

export function calcDeficit(
  tdee: number,
  sex: Sex,
  perWeekKg: DeficitGoal,
): CalorieDeficitPlan {
  const deficitKcal = Math.round((perWeekKg * 7700) / 7);
  const rawTargetKcal = Math.round(tdee - deficitKcal);
  const safetyFloorKcal = sex === 'male' ? 1500 : 1200;
  return {
    perWeekKg,
    deficitKcal,
    rawTargetKcal,
    safeTargetKcal: Math.max(safetyFloorKcal, rawTargetKcal),
    belowSafetyFloor: rawTargetKcal < safetyFloorKcal,
    safetyFloorKcal,
  };
}

// ─────────────────────────────────────────────
// 體脂率粗估（Deurenberg, 1991）
// 僅供概略，臨床請以 InBody / DXA 為準
// ─────────────────────────────────────────────
export function calcBodyFat(bmi: number, age: number, sex: Sex): number {
  const sexN = sex === 'male' ? 1 : 0;
  return 1.20 * bmi + 0.23 * age - 10.8 * sexN - 5.4;
}

export interface BodyFatRange {
  athletic: [number, number];
  fitness:  [number, number];
  acceptable: [number, number];
  obesity:  number;
}

// ACE 體脂分類（一般人參考值）
export const BODY_FAT_RANGES: Record<Sex, BodyFatRange> = {
  male:   { athletic: [6, 13],  fitness: [14, 17], acceptable: [18, 24], obesity: 25 },
  female: { athletic: [16, 20], fitness: [21, 24], acceptable: [25, 31], obesity: 32 },
};

export type BodyFatBand = 'athletic' | 'fitness' | 'acceptable' | 'obesity';

export function bodyFatBand(bodyFatPct: number, sex: Sex): BodyFatBand {
  const r = BODY_FAT_RANGES[sex];
  if (bodyFatPct <= r.athletic[1]) return 'athletic';
  if (bodyFatPct <= r.fitness[1])  return 'fitness';
  if (bodyFatPct < r.obesity)      return 'acceptable';
  return 'obesity';
}

// ─────────────────────────────────────────────
// 腰圍指標
// WHtR（腰圍/身高）：< 0.5 健康；0.5–0.6 升高；≥ 0.6 高風險
// WHR（腰圍/臀圍）：男 ≥ 0.9 / 女 ≥ 0.85 中央型肥胖
// 國健署：腰圍 男 ≥ 90 cm / 女 ≥ 80 cm 為腰圍過粗（代謝症候群）
// ─────────────────────────────────────────────
export type WaistRisk = 'low' | 'increased' | 'high';

export interface WaistMetrics {
  whtR: number;
  whtRRisk: WaistRisk;
  whR: number | null;
  whRRisk: 'low' | 'high' | null;
  isCentralObesityTW: boolean;
}

export function calcWaistMetrics(
  waistCm: number,
  heightCm: number,
  hipCm: number | null,
  sex: Sex,
): WaistMetrics {
  const whtR = waistCm / heightCm;
  const whtRRisk: WaistRisk =
    whtR < 0.5 ? 'low' : whtR < 0.6 ? 'increased' : 'high';
  let whR: number | null = null;
  let whRRisk: 'low' | 'high' | null = null;
  if (hipCm && hipCm > 0) {
    whR = waistCm / hipCm;
    const cutoff = sex === 'male' ? 0.9 : 0.85;
    whRRisk = whR < cutoff ? 'low' : 'high';
  }
  const isCentralObesityTW = sex === 'male' ? waistCm >= 90 : waistCm >= 80;
  return { whtR, whtRRisk, whR, whRRisk, isCentralObesityTW };
}

// ─────────────────────────────────────────────
// GLP-1 / 減重藥 適應症
// 國際肥胖學會與 FDA 標示常用門檻：
//   BMI ≥ 30，或 BMI ≥ 27 + 至少一項體重相關共病
// 共病範例：T2DM、HTN、Dyslipidemia、OSA、CVD、NAFLD
// ─────────────────────────────────────────────
export interface Comorbidities {
  t2dm: boolean;
  htn: boolean;
  dyslipidemia: boolean;
  osa: boolean;
  cvd: boolean;
  nafld: boolean;
}

export const EMPTY_COMORBIDITIES: Comorbidities = {
  t2dm: false,
  htn: false,
  dyslipidemia: false,
  osa: false,
  cvd: false,
  nafld: false,
};

export const COMORBIDITY_LABELS: Record<keyof Comorbidities, string> = {
  t2dm: '第二型糖尿病',
  htn: '高血壓',
  dyslipidemia: '高血脂',
  osa: '阻塞型睡眠呼吸中止症',
  cvd: '心血管疾病（冠心病、中風）',
  nafld: '非酒精性脂肪肝',
};

export type Glp1Reason =
  | 'bmi30'
  | 'bmi27WithComorbidity'
  | 'bmi27NoComorbidity'
  | 'belowThreshold';

export interface Glp1Eligibility {
  eligible: boolean;
  reason: Glp1Reason;
  comorbidityCount: number;
  suggestedDrugs: string[];
}

const COMMON_DRUGS = [
  'Semaglutide（Wegovy / Ozempic）',
  'Tirzepatide（Mounjaro）',
  'Liraglutide（Saxenda）',
];

export function evalGlp1Eligibility(
  bmi: number,
  c: Comorbidities,
): Glp1Eligibility {
  const comorbidityCount = Object.values(c).filter(Boolean).length;
  if (bmi >= 30) {
    return {
      eligible: true,
      reason: 'bmi30',
      comorbidityCount,
      suggestedDrugs: COMMON_DRUGS,
    };
  }
  if (bmi >= 27) {
    if (comorbidityCount >= 1) {
      return {
        eligible: true,
        reason: 'bmi27WithComorbidity',
        comorbidityCount,
        suggestedDrugs: COMMON_DRUGS,
      };
    }
    return {
      eligible: false,
      reason: 'bmi27NoComorbidity',
      comorbidityCount,
      suggestedDrugs: [],
    };
  }
  return {
    eligible: false,
    reason: 'belowThreshold',
    comorbidityCount,
    suggestedDrugs: [],
  };
}

// ─────────────────────────────────────────────
// 減重進度
// ─────────────────────────────────────────────
export interface WeightProgress {
  lostKg: number;
  lostPctOfStart: number;
  toGoalKg: number;
  goalProgressPct: number;
  reachedGoal: boolean;
}

export function calcWeightProgress(
  startKg: number,
  currentKg: number,
  targetKg: number,
): WeightProgress {
  const totalToLose = startKg - targetKg;
  const lostKg = startKg - currentKg;
  const goalProgressPct =
    totalToLose > 0 ? (lostKg / totalToLose) * 100 : 0;
  return {
    lostKg,
    lostPctOfStart: startKg > 0 ? (lostKg / startKg) * 100 : 0,
    toGoalKg: currentKg - targetKg,
    goalProgressPct,
    reachedGoal: currentKg <= targetKg,
  };
}

// ─────────────────────────────────────────────
// 數值格式化（共用）
// ─────────────────────────────────────────────
export function fmtNumber(n: number, digits = 1): string {
  if (!Number.isFinite(n)) return '—';
  return n.toFixed(digits);
}

export function fmtKg(kg: number, digits = 1): string {
  return `${fmtNumber(kg, digits)} kg`;
}

export function fmtKcal(kcal: number): string {
  if (!Number.isFinite(kcal)) return '—';
  return `${Math.round(kcal).toLocaleString('en-US')} kcal`;
}

export function fmtPct(pct: number, digits = 1): string {
  return `${fmtNumber(pct, digits)}%`;
}
