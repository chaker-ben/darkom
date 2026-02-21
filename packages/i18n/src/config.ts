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

export const localeNames: Record<Locale, string> = {
  fr: 'Fran\u00e7ais',
  ar: '\u0627\u0644\u0639\u0631\u0628\u064a\u0629',
  en: 'English',
};

export const localeFlags: Record<Locale, string> = {
  fr: '\ud83c\uddeb\ud83c\uddf7',
  ar: '\ud83c\uddf9\ud83c\uddf3',
  en: '\ud83c\uddec\ud83c\udde7',
};
