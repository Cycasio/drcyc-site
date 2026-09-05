import assert from 'node:assert/strict';
import test from 'node:test';

import {
  validateCvdRiskDraft,
  type CvdRiskDraft,
} from '../src/scripts/tools/cvd-risk-validation.ts';
import {
  isCvdRiskBaseResultForAge,
  type CvdRiskBaseResult,
} from '../src/scripts/tools/cvd-risk-meta.ts';

const validDraft: CvdRiskDraft = {
  knownCvd: false,
  sex: 'female',
  age: 45,
  totalCholesterol: 200,
  hdlCholesterol: 60,
  systolicBloodPressure: 120,
  diabetes: false,
  currentSmoker: false,
  bmi: 25,
  egfr: 95,
  antihypertensiveTreatment: false,
  statinUse: false,
};

test('accepts a complete eligible cardiovascular risk draft', () => {
  assert.equal(validateCvdRiskDraft(validDraft).ok, true);
});

test('rejects prior ASCVD or heart failure', () => {
  const result = validateCvdRiskDraft({ ...validDraft, knownCvd: true });
  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.issues.length, 1);
    assert.equal(result.issues[0]?.field, 'knownCvd');
  }
});

test('requires every yes/no selection', () => {
  const result = validateCvdRiskDraft({ ...validDraft, diabetes: null, statinUse: null });
  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.deepEqual(result.issues.map((issue) => issue.field), ['diabetes', 'statinUse']);
  }
});

test('rejects values outside the documented calculator ranges', () => {
  const result = validateCvdRiskDraft({
    ...validDraft,
    age: 29,
    totalCholesterol: 321,
    hdlCholesterol: 19,
    systolicBloodPressure: 201,
    bmi: 40,
    egfr: 14.9,
  });
  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.deepEqual(result.issues.map((issue) => issue.field), [
      'age',
      'totalCholesterol',
      'hdlCholesterol',
      'systolicBloodPressure',
      'bmi',
      'egfr',
    ]);
  }
});

const baseResult: CvdRiskBaseResult = {
  modelVersion: '1.0.0',
  tenYear: { totalCvd: 3.4, ascvd: 2.1, heartFailure: 1.7 },
  thirtyYear: { totalCvd: 20.6, ascvd: 12, heartFailure: 12.8 },
};

test('requires 30-year results through the age-59 boundary', () => {
  assert.equal(isCvdRiskBaseResultForAge(baseResult, 59), true);
  assert.equal(isCvdRiskBaseResultForAge({ ...baseResult, thirtyYear: null }, 59), false);
});

test('rejects 30-year results from age 60 through 79', () => {
  assert.equal(isCvdRiskBaseResultForAge({ ...baseResult, thirtyYear: null }, 60), true);
  assert.equal(isCvdRiskBaseResultForAge(baseResult, 60), false);
  assert.equal(isCvdRiskBaseResultForAge({ ...baseResult, thirtyYear: null }, 79), true);
  assert.equal(isCvdRiskBaseResultForAge(baseResult, 79), false);
});
