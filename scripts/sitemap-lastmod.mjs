import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

export function contentDate(source) {
  const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1];
  if (!frontmatter) throw new Error('Missing frontmatter');
  const read = (key) => frontmatter.match(new RegExp('^' + key + ':\\s*["\']?(\\d{4}-\\d{2}-\\d{2})["\']?\\s*$', 'm'))?.[1];
  const date = read('updatedDate') ?? read('pubDate');
  if (!date || new Date(date).toISOString().slice(0, 10) !== date) throw new Error('Invalid content date');
  // Editorial dates are calendar days in Taiwan, not UTC build timestamps.
  const taiwanToday = new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString().slice(0, 10);
  if (date > taiwanToday) throw new Error('Future content date');
  return date;
}

export function articleDates(directory, prefix = '') {
  const dates = new Map();
  for (const item of readdirSync(directory, { withFileTypes: true })) {
    const relative = prefix + item.name;
    if (item.isDirectory()) {
      for (const entry of articleDates(join(directory, item.name), relative + '/')) dates.set(...entry);
    } else if (/\.mdx?$/.test(item.name)) {
      dates.set('/blog/' + relative.replace(/\.mdx?$/, '') + '/', contentDate(readFileSync(join(directory, item.name), 'utf8')));
    }
  }
  return dates;
}

// Dates represent actual content edits, never the date of a build.
export const staticDates = new Map([
  ['/weight-loss/', '2026-10-21'],
  ['/health-checkup/', '2026-10-19'],
  ['/qishan-clinic/', '2026-10-19'],
  ['/privacy/', '2026-10-19'],
  ['/services/', '2026-10-19'],
]);
