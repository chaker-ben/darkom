import type { Locale } from './config';

export function getLocalizedField<T extends Record<string, unknown>>(
  obj: T,
  field: string,
  locale: Locale,
): string {
  const value = obj[`${field}_${locale}`];
  if (typeof value === 'string' && value.length > 0) return value;

  const fallbackFr = obj[`${field}_fr`];
  if (typeof fallbackFr === 'string' && fallbackFr.length > 0) return fallbackFr;

  const fallbackAr = obj[`${field}_ar`];
  if (typeof fallbackAr === 'string' && fallbackAr.length > 0) return fallbackAr;

  const fallbackEn = obj[`${field}_en`];
  if (typeof fallbackEn === 'string' && fallbackEn.length > 0) return fallbackEn;

  return '';
}
