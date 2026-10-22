// Shared with the browser bundle; kept inside the isolated Functions release.
export const SITE_ORIGIN = 'https://www.drcyc.io';
const pagePaths = [
  '/', '/services/', '/qishan-clinic/', '/health-checkup/',
  '/blog/mounjaro-weight-loss/', '/blog/thyroid-hyperthyroidism-hypothyroidism/',
  '/blog/lpa-apob-health-checkup/', '/blog/hyperlipidemia-ldl-lower-better/',
  '/blog/hearing-conservation-program/', '/blog/ergonomic-hazard-prevention-plan/',
  '/blog/workplace-violence-prevention-plan/',
] as const;
export const pageIds = [
  'home', 'services', 'qishan', 'checkup', 'mounjaro', 'thyroid',
  'lpa_apob', 'ldl', 'hearing', 'ergonomics', 'violence',
] as const;
export const sources = ['chatgpt', 'perplexity', 'google', 'other', 'internal', 'direct_unknown'] as const;
export const targets = ['edah_booking', 'edah_phone', 'qishan_phone'] as const;
export type SiteEvent = {
  event: 'booking_click' | 'phone_click';
  page: typeof pageIds[number];
  target: typeof targets[number];
  source: typeof sources[number];
};
export function pageId(path: string) {
  const index = pagePaths.indexOf(path as typeof pagePaths[number]);
  return index < 0 ? undefined : pageIds[index];
}
export function sourceClass(referrer: string): SiteEvent['source'] {
  if (!referrer) return 'direct_unknown';
  try {
    const host = new URL(referrer).hostname;
    const belongs = (name: string) => host === name || host.endsWith('.' + name);
    if (belongs('drcyc.io')) return 'internal';
    if (belongs('chatgpt.com') || host === 'chat.openai.com') return 'chatgpt';
    if (belongs('perplexity.ai')) return 'perplexity';
    if (['google.com', 'google.com.tw'].some(belongs)) return 'google';
    return 'other';
  } catch { return 'direct_unknown'; }
}
export function linkTarget(href: string): SiteEvent['target'] | undefined {
  if (href === 'https://webreg.edah.org.tw/Register/ChooseDoctorTime/2675') return 'edah_booking';
  const phone = href.replace(/[\s()-]/g, '');
  if (phone === 'tel:+88676150011' || phone === 'tel:076150011') return 'edah_phone';
  if (phone === 'tel:+88676622588' || phone === 'tel:076622588') return 'qishan_phone';
}
export function validEvent(value: unknown): value is SiteEvent {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const v = value as Record<string, unknown>;
  if (Object.keys(v).sort().join(',') !== 'event,page,source,target') return false;
  return pageIds.includes(v.page as SiteEvent['page'])
    && sources.includes(v.source as SiteEvent['source'])
    && targets.includes(v.target as SiteEvent['target'])
    && v.event === (v.target === 'edah_booking' ? 'booking_click' : 'phone_click');
}
