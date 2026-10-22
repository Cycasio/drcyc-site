import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { PACKAGES, EVIDENCE, TAIWAN_SCREENING, GENERAL_PREP, ENDO_PREP, BOWEL_PREP_CHECKLIST } from '../src/data/checkup.ts';

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('checkup data keeps HBV and HCV recommendations separate and sourced', () => {
  const hbv = EVIDENCE.find(e => e.name.includes('B 型肝炎'));
  const hcv = EVIDENCE.find(e => e.name.includes('C 型肝炎'));
  assert.ok(hbv && hcv && hbv !== hcv);
  assert.match(hbv.population, /高風險/);
  assert.match(hcv.population, /18–79/);
  assert.ok(EVIDENCE.every(e => 'sourceUrl' in e && String(e.sourceUrl).startsWith('https://www.uspreventiveservicestaskforce.org/')));
});

test('CAC and carotid screening are not presented as Grade B screening', () => {
  assert.equal(EVIDENCE.find(e => e.name.includes('CAC'))?.grade, 'I');
  assert.equal(EVIDENCE.find(e => e.name.includes('頸動脈'))?.grade, 'D');
  assert.equal(EVIDENCE.find(e => e.name === '心血管疾病風險評估'), undefined);
  assert.ok(!PACKAGES.some(p => /實證醫學上很穩|做一次安心好幾年|一次把全身癌症看完/.test(p.chenNote)));
});

test('package counts are derived from the dataset throughout entry pages', () => {
  for (const path of ['src/pages/index.astro', 'src/pages/services.astro', 'src/pages/health-checkup.astro', 'src/pages/llms.txt.ts', 'src/pages/llms-full.txt.ts']) {
    const source = read(path);
    assert.doesNotMatch(source, /16\s*(?:個健檢|個套餐|套?餐完整)/, path);
    assert.match(source, /PACKAGE_COUNT/, path);
  }
  assert.equal(new Set(PACKAGES.map(p => p.id)).size, PACKAGES.length);
});

test('official physician profile links the same person without upgrading credentials', () => {
  const layout = read('src/layouts/Layout.astro');
  assert.match(layout.slice(layout.indexOf('sameAs:')), /https:\/\/webreg\.edah\.org\.tw\/Register\/ChooseDoctorTime\/2675/);
  assert.match(layout, /尚未取得該科專科醫師資格/);
});

test('lipid article and calculator link together without treating Lp(a) or ApoB as inputs', () => {
  const article = read('src/content/blog/lpa-apob-health-checkup.md');
  const calculator = read('src/pages/blog/health-tools/cardiovascular-risk-estimator.astro');
  assert.match(article, /\/blog\/health-tools\/cardiovascular-risk-estimator\//);
  assert.match(calculator, /\/blog\/lpa-apob-health-checkup\//);
  assert.match(calculator, /不.*(?:Lp\(a\).*(?:ApoB)|ApoB.*Lp\(a\))/);
  assert.match(calculator.slice(calculator.indexOf('<header'), calculator.indexOf('</header>')), /PREVENT/);
});

test('Taiwan eligibility is separate from USPSTF grades and historical package prices', () => {
  assert.match(TAIWAN_SCREENING.find(e => e.name.includes('乳房'))!.eligibility, /40–74/);
  assert.match(TAIWAN_SCREENING.find(e => e.name.includes('抹片'))!.eligibility, /25–29/);
  assert.match(TAIWAN_SCREENING.find(e => e.name.includes('HPV'))!.eligibility, /35、45、65/);
  const page = read('src/pages/health-checkup.astro');
  assert.match(page, /id="taiwan-screening"/);
  assert.match(page, /非現行報價/);
  assert.doesNotMatch(page, /schema.org\/InStock/);
});

test('preparation guidance does not publish generic medication schedules or HowTo dosing', () => {
  const text = [...GENERAL_PREP, ...ENDO_PREP, ...BOWEL_PREP_CHECKLIST].join(' ');
  assert.match(text, /不要自行停用/);
  assert.match(text, /本次/);
  assert.doesNotMatch(text, /04:00|00:00|前一天與當天暫停/);
  assert.doesNotMatch(read('src/pages/health-checkup.astro'), /HowToStep|bowelPrepHowToSchemas/);
});

test('model branding stays independent and required version notices remain', () => {
  const page = read('src/pages/blog/health-tools/cardiovascular-risk-estimator.astro');
  assert.doesNotMatch(page.match(/<h1[\s\S]*?<\/h1>/)?.[0] ?? '', /PREVENT/);
  for (const text of ['The PREVENT', 'The information provided herein is based in part on PREVENT', 'The information derived from the use of PREVENT', '10.1161/CIRCULATIONAHA.123.067626', '10.1161/CIR.0000000000001191']) {
    assert.ok(page.includes(text), `missing attribution: ${text}`);
  }
});
