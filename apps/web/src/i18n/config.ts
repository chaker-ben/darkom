export const locales = ['fr', 'ar', 'en'] as const;
export const defaultLocale = 'fr' as const;

export type Locale = (typeof locales)[number];

export const rtlLocales: readonly Locale[] = ['ar'] as const;

export function isRTL(locale: Locale): boolean {
  return (rtlLocales as readonly string[]).includes(locale);
}

export function getDirection(locale: Locale): 'ltr' | 'rtl' {
  return isRTL(locale) ? 'rtl' : 'ltr';
}
