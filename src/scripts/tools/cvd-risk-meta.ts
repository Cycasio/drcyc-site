export const CVD_RISK_MODEL_VERSION = '1.0.0' as const;

export type CvdRiskSex = 'male' | 'female';

export interface CvdRiskBaseInputs {
  sex: CvdRiskSex;
  age: number;
  totalCholesterol: number;
  hdlCholesterol: number;
  systolicBloodPressure: number;
  diabetes: boolean;
  currentSmoker: boolean;
  bmi: number;
  egfr: number;
  antihypertensiveTreatment: boolean;
  statinUse: boolean;
}

export interface CvdRiskOutcomeRisks {
  totalCvd: number;
  ascvd: number;
  heartFailure: number;
}

export interface CvdRiskBaseResult {
  modelVersion: typeof CVD_RISK_MODEL_VERSION;
  tenYear: CvdRiskOutcomeRisks;
  thirtyYear: CvdRiskOutcomeRisks | null;
}

function isOutcomeRisks(value: unknown): value is CvdRiskOutcomeRisks {
  if (typeof value !== 'object' || value === null) return false;
  const item = value as Record<string, unknown>;
  return ['totalCvd', 'ascvd', 'heartFailure'].every((key) => {
    const risk = item[key];
    return typeof risk === 'number' && Number.isFinite(risk) && risk >= 0 && risk <= 100;
  });
}

export function isCvdRiskBaseResultForAge(value: unknown, age: number): value is CvdRiskBaseResult {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Partial<CvdRiskBaseResult>;
  if (candidate.modelVersion !== CVD_RISK_MODEL_VERSION || !isOutcomeRisks(candidate.tenYear)) return false;
  return age <= 59 ? isOutcomeRisks(candidate.thirtyYear) : candidate.thirtyYear === null;
}
