import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const root = process.argv[2] ?? 'dist';
const dateTimePattern = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d+)?(Z|([+-])(\d{2}):(\d{2}))$/;
const checkedProperties = new Map([
  ['ProfilePage', ['dateCreated', 'dateModified']],
  ['Article', ['datePublished', 'dateModified']],
  ['NewsArticle', ['datePublished', 'dateModified']],
  ['BlogPosting', ['datePublished', 'dateModified']],
]);

async function collectHtmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await collectHtmlFiles(path));
    else if (entry.name.endsWith('.html')) files.push(path);
  }
  return files;
}

function schemaTypes(node) {
  const value = node?.['@type'];
  const types = Array.isArray(value) ? value : value ? [value] : [];
  return types.map((type) =>
    typeof type === 'string' ? type.replace(/^https?:\/\/schema\.org\//u, '') : type,
  );
}

function isValidDateTime(value) {
  if (typeof value !== 'string') return false;
  const match = value.match(dateTimePattern);
  if (!match) return false;

  const [, yearText, monthText, dayText, hourText, minuteText, secondText, zone, , zoneHourText, zoneMinuteText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const hour = Number(hourText);
  const minute = Number(minuteText);
  const second = Number(secondText);
  const maxDay = month >= 1 && month <= 12
    ? new Date(Date.UTC(year, month, 0)).getUTCDate()
    : 0;

  if (day < 1 || day > maxDay || hour > 23 || minute > 59 || second > 59) return false;
  if (zone !== 'Z') {
    const zoneHour = Number(zoneHourText);
    const zoneMinute = Number(zoneMinuteText);
    if (zoneHour > 14 || zoneMinute > 59 || (zoneHour === 14 && zoneMinute !== 0)) return false;
  }
  return !Number.isNaN(Date.parse(value));
}

function inspectNode(node, file, location, failures) {
  if (Array.isArray(node)) {
    node.forEach((item, index) => inspectNode(item, file, `${location}[${index}]`, failures));
    return;
  }
  if (!node || typeof node !== 'object') return;

  const properties = new Set(
    schemaTypes(node).flatMap((type) => checkedProperties.get(type) ?? []),
  );
  for (const property of properties) {
    if (!(property in node)) continue;
    const value = node[property];
    if (!isValidDateTime(value)) {
      failures.push({ file, location, property, value });
    }
  }

  for (const [key, value] of Object.entries(node)) {
    inspectNode(value, file, `${location}.${key}`, failures);
  }
}

const failures = [];
const scriptPattern = /<script\b[^>]*\btype\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/giu;

for (const file of await collectHtmlFiles(root)) {
  const html = await readFile(file, 'utf8');
  let scriptIndex = 0;
  for (const match of html.matchAll(scriptPattern)) {
    scriptIndex += 1;
    try {
      inspectNode(JSON.parse(match[1]), file, `jsonLd[${scriptIndex}]`, failures);
    } catch (error) {
      failures.push({
        file,
        location: `jsonLd[${scriptIndex}]`,
        property: 'JSON',
        value: error instanceof Error ? error.message : String(error),
      });
    }
  }
}

if (failures.length > 0) {
  console.error(`發現 ${failures.length} 個 Google 結構化資料日期問題：`);
  for (const failure of failures) {
    console.error(
      `- ${relative(process.cwd(), failure.file)} ${failure.location}.${failure.property}: ` +
      `${JSON.stringify(failure.value)}`,
    );
  }
  process.exit(1);
}

console.log('Google 結構化資料日期檢查通過。');
