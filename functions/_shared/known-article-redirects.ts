// No onRequest export: this helper does not create a public Functions route.
const aliases: Record<string, string> = {
  '/blog/masld-mash-fatty-linear': '/blog/masld-mash-fatty-liver/',
  '/blog/lpa-apob-health-health-checkup': '/blog/lpa-apob-health-checkup/',
  '/blog/甲狀腺亢進與低下：症狀、抽血怎麼看、什麼時候該治療': '/blog/thyroid-hyperthyroidism-hypothyroidism/',
};
export function knownArticleRedirect(pathname: string): string | undefined {
  try {
    const key = decodeURIComponent(pathname).replace(/\/$/, '');
    return Object.hasOwn(aliases, key) ? aliases[key] : undefined;
  } catch {
    return undefined;
  }
}
