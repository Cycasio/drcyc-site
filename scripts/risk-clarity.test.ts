import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { describeRiskFrequency } from '../src/scripts/tools/cvd-risk-display.ts';
import { PACKAGES, PACKAGE_LAST_CHECKED, PACKAGE_PRICE_LAST_CHECKED, PUBLIC_EMPLOYEE_PDF_SOURCES, PREMIUM_PRICE_SOURCES } from '../src/data/checkup.ts';

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('each risk explanation names its own outcome and time horizon', () => {
  assert.equal(describeRiskFrequency(5, 10, 'ASCVD'), '依模型估計，每 100 位風險因子相近的人中，約 5 位可能在未來 10 年發生 ASCVD。');
  assert.equal(describeRiskFrequency(12.3, 30, '心臟衰竭'), '依模型估計，每 100 位風險因子相近的人中，約 12.3 位可能在未來 30 年發生心臟衰竭。');
  assert.match(describeRiskFrequency(0.2, 10, '心臟衰竭'), /每 1,000 位.*約 2 位.*10 年.*心臟衰竭/);
  assert.match(describeRiskFrequency(0.001, 30, 'ASCVD'), /少於 0.1 位/);
  assert.match(describeRiskFrequency(0, 10, 'ASCVD'), /0 位/);
  for (const value of [-1, 101, NaN, Infinity]) assert.throws(() => describeRiskFrequency(value, 10, 'ASCVD'), RangeError);
});

test('all six result cards have an outcome-specific explanation', () => {
  const component = read('src/components/tools/CvdRiskCalculator.astro');
  for (const period of [10, 30]) {
    for (const outcome of ['total', 'ascvd', 'hf']) {
      assert.ok(component.includes(`id="cvd-risk-${period}-${outcome}-explanation"`));
      assert.ok(component.includes(`setText('cvd-risk-${period}-${outcome}-explanation', describeRiskFrequency(`));
    }
  }
  assert.match(component, /不是血管狹窄百分比，也不是預測幾歲發病/);
});

test('lipid article communicates limits and relative rather than absolute benefits', () => {
  const article = read('src/content/blog/hyperlipidemia-ldl-lower-better.md');
  assert.doesNotMatch(article, /至少驗一次就好|它不傷腎|多為心理預期|這一段必須更新/);
  assert.match(article, /相對.*22%/);
  assert.match(article, /10%.*8%.*2 個百分點/);
  assert.match(article, /深色尿/);
  assert.match(article, /id="ldl-exposure"/);
  assert.match(article, /每個時段/);
  assert.doesNotMatch(article, /8,?500|8,?750/);
  assert.match(read('src/content/blog/lpa-apob-health-checkup.md'), /hyperlipidemia-ldl-lower-better\/#ldl-exposure/);
});

test('AI clinic FAQ includes both locations, complete address and booking routes', () => {
  const short = read('src/pages/llms.txt.ts');
  const answer = short.split('**Q: 陳醫師的門診在哪裡？**')[1].split('**Q:')[0];
  for (const value of ['義大醫院', '旗山大政診所', '延平一路 337 號', '18:00–21:00', '07-662-2588', 'ChooseDoctorTime/2675']) assert.ok(answer.includes(value), value);
  assert.ok(short.includes('- 地址：高雄市旗山區瑞吉里延平一路 337 號'));
});

test('homepage labels historical package verification separately from screening updates', () => {
  const home = read('src/pages/index.astro');
  assert.match(home, /PACKAGE_LAST_CHECKED/);
  assert.match(home, /SCREENING_LAST_CHECKED/);
  assert.match(home, /PACKAGE_PRICE_LAST_CHECKED/);
  assert.doesNotMatch(home, /實證選購・2026 更新/);
});

test('verified public prices do not overwrite full-content dates or imply all A items in B', () => {
  assert.equal(PACKAGE_LAST_CHECKED, '2026-05-26');
  assert.equal(PACKAGE_PRICE_LAST_CHECKED, '2026-09-21');
  assert.deepEqual(PACKAGES.map(p=>p.price), [8900,10000,14000,14000,16000,16000,18800,18800,15000,22000,27000,31000,46000,68000,196000]);
  assert.equal(PUBLIC_EMPLOYEE_PDF_SOURCES.length,4);
  assert.ok(PUBLIC_EMPLOYEE_PDF_SOURCES.every(s=>s.url.includes('/2026/Governmental/')));
  assert.equal(PREMIUM_PRICE_SOURCES.length,7);
  assert.doesNotMatch(PACKAGES.find(p=>p.id==='B')!.highlights.join(' '), /專案 A 全部內容/);
  assert.match(PACKAGES.find(p=>p.id==='C')!.highlights.join(' '), /未包含同半胱胺酸及骨密度/);
  assert.doesNotMatch(PACKAGES.find(p=>p.id==='E')!.highlights.join(' '), /IMT|頸動脈/);
  assert.doesNotMatch(PACKAGES.find(p=>p.id==='G')!.highlights.join(' '), /完整/);
});
