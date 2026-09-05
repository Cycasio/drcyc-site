import type { CvdRiskBaseInputs, CvdRiskSex } from './cvd-risk-meta';

export type CvdRiskField =
  | 'knownCvd'
  | 'sex'
  | 'age'
  | 'totalCholesterol'
  | 'hdlCholesterol'
  | 'systolicBloodPressure'
  | 'bmi'
  | 'egfr'
  | 'diabetes'
  | 'currentSmoker'
  | 'antihypertensiveTreatment'
  | 'statinUse';

export interface CvdRiskDraft {
  knownCvd: boolean | null;
  sex: CvdRiskSex | null;
  age: number | null;
  totalCholesterol: number | null;
  hdlCholesterol: number | null;
  systolicBloodPressure: number | null;
  bmi: number | null;
  egfr: number | null;
  diabetes: boolean | null;
  currentSmoker: boolean | null;
  antihypertensiveTreatment: boolean | null;
  statinUse: boolean | null;
}

export interface CvdRiskValidationIssue {
  field: CvdRiskField;
  message: string;
}

export type CvdRiskValidationResult =
  | { ok: true; value: CvdRiskBaseInputs }
  | { ok: false; issues: CvdRiskValidationIssue[] };

export const CVD_RISK_INPUT_LIMITS = {
  age: { min: 30, max: 79 },
  totalCholesterol: { min: 130, max: 320 },
  hdlCholesterol: { min: 20, max: 100 },
  systolicBloodPressure: { min: 90, max: 200 },
  bmi: { min: 18.5, max: 39.9 },
  egfr: { min: 15, max: 140 },
} as const;

function validateNumber(
  issues: CvdRiskValidationIssue[],
  field: CvdRiskField,
  value: number | null,
  label: string,
  min: number,
  max: number,
  integer = false,
): value is number {
  if (value == null || !Number.isFinite(value)) {
    issues.push({ field, message: `請填寫${label}。` });
    return false;
  }
  if (integer && !Number.isInteger(value)) {
    issues.push({ field, message: `${label}請填整數。` });
    return false;
  }
  if (value < min || value > max) {
    issues.push({ field, message: `${label}需介於 ${min}–${max}。` });
    return false;
  }
  return true;
}

function validateChoice(
  issues: CvdRiskValidationIssue[],
  field: CvdRiskField,
  value: boolean | null,
  label: string,
): value is boolean {
  if (value == null) {
    issues.push({ field, message: `請選擇${label}。` });
    return false;
  }
  return true;
}

function isCompleteDraft(
  draft: CvdRiskDraft,
): draft is CvdRiskDraft & CvdRiskBaseInputs & { knownCvd: false } {
  return (
    draft.knownCvd === false &&
    draft.sex !== null &&
    typeof draft.age === 'number' &&
    typeof draft.totalCholesterol === 'number' &&
    typeof draft.hdlCholesterol === 'number' &&
    typeof draft.systolicBloodPressure === 'number' &&
    typeof draft.bmi === 'number' &&
    typeof draft.egfr === 'number' &&
    typeof draft.diabetes === 'boolean' &&
    typeof draft.currentSmoker === 'boolean' &&
    typeof draft.antihypertensiveTreatment === 'boolean' &&
    typeof draft.statinUse === 'boolean'
  );
}

export function validateCvdRiskDraft(draft: CvdRiskDraft): CvdRiskValidationResult {
  const issues: CvdRiskValidationIssue[] = [];

  if (draft.knownCvd == null) {
    issues.push({ field: 'knownCvd', message: '請選擇是否曾有 ASCVD 或心臟衰竭。' });
  } else if (draft.knownCvd) {
    return {
      ok: false,
      issues: [{
        field: 'knownCvd',
        message: '此基本模型僅適用於沒有既往 ASCVD 或心臟衰竭的初級預防成人；請改由醫師評估。',
      }],
    };
  }

  if (draft.sex == null) {
    issues.push({ field: 'sex', message: '請選擇公式使用的生理性別。' });
  }

  const ageValid = validateNumber(
    issues,
    'age',
    draft.age,
    '年齡',
    CVD_RISK_INPUT_LIMITS.age.min,
    CVD_RISK_INPUT_LIMITS.age.max,
    true,
  );
  const totalCholesterolValid = validateNumber(
    issues,
    'totalCholesterol',
    draft.totalCholesterol,
    '總膽固醇',
    CVD_RISK_INPUT_LIMITS.totalCholesterol.min,
    CVD_RISK_INPUT_LIMITS.totalCholesterol.max,
  );
  const hdlValid = validateNumber(
    issues,
    'hdlCholesterol',
    draft.hdlCholesterol,
    'HDL 膽固醇',
    CVD_RISK_INPUT_LIMITS.hdlCholesterol.min,
    CVD_RISK_INPUT_LIMITS.hdlCholesterol.max,
  );
  const systolicBloodPressureValid = validateNumber(
    issues,
    'systolicBloodPressure',
    draft.systolicBloodPressure,
    '收縮壓',
    CVD_RISK_INPUT_LIMITS.systolicBloodPressure.min,
    CVD_RISK_INPUT_LIMITS.systolicBloodPressure.max,
  );
  const bmiValid = validateNumber(
    issues,
    'bmi',
    draft.bmi,
    'BMI',
    CVD_RISK_INPUT_LIMITS.bmi.min,
    CVD_RISK_INPUT_LIMITS.bmi.max,
  );
  const egfrValid = validateNumber(
    issues,
    'egfr',
    draft.egfr,
    'eGFR',
    CVD_RISK_INPUT_LIMITS.egfr.min,
    CVD_RISK_INPUT_LIMITS.egfr.max,
  );
  const diabetesValid = validateChoice(issues, 'diabetes', draft.diabetes, '是否有糖尿病');
  const currentSmokerValid = validateChoice(
    issues,
    'currentSmoker',
    draft.currentSmoker,
    '目前是否吸菸',
  );
  const antihypertensiveTreatmentValid = validateChoice(
    issues,
    'antihypertensiveTreatment',
    draft.antihypertensiveTreatment,
    '是否正在接受降壓藥治療',
  );
  const statinUseValid = validateChoice(issues, 'statinUse', draft.statinUse, '目前是否使用 statin');

  if (
    issues.length > 0 ||
    !isCompleteDraft(draft) ||
    !ageValid ||
    !totalCholesterolValid ||
    !hdlValid ||
    !systolicBloodPressureValid ||
    !bmiValid ||
    !egfrValid ||
    !diabetesValid ||
    !currentSmokerValid ||
    !antihypertensiveTreatmentValid ||
    !statinUseValid
  ) {
    return { ok: false, issues };
  }

  return {
    ok: true,
    value: {
      sex: draft.sex,
      age: draft.age,
      totalCholesterol: draft.totalCholesterol,
      hdlCholesterol: draft.hdlCholesterol,
      systolicBloodPressure: draft.systolicBloodPressure,
      diabetes: draft.diabetes,
      currentSmoker: draft.currentSmoker,
      bmi: draft.bmi,
      egfr: draft.egfr,
      antihypertensiveTreatment: draft.antihypertensiveTreatment,
      statinUse: draft.statinUse,
    },
  };
}
