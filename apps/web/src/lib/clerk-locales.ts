import { arSA, enUS, frFR } from '@clerk/localizations';

import type { Locale } from '@/i18n/config';

type ClerkLocalization = typeof frFR;

const clerkLocaleMap: Record<Locale, ClerkLocalization> = {
  fr: frFR,
  ar: arSA,
  en: enUS,
};

export function getClerkLocalization(locale: Locale): ClerkLocalization {
  return clerkLocaleMap[locale];
}
