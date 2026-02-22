import type { Locale } from './config';

/**
 * Capitalize first letter: "fr" → "Fr"
 */
function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/**
 * Try to read a localized field from an object, supporting both
 * snake_case (`title_fr`) and camelCase (`titleFr`) conventions.
 */
function readField(obj: Record<string, unknown>, field: string, locale: string): unknown {
  return obj[`${field}_${locale}`] ?? obj[`${field}${capitalize(locale)}`];
}

export function getLocalizedField<T extends Record<string, unknown>>(
  obj: T,
  field: string,
  locale: Locale,
): string {
  const value = readField(obj, field, locale);
  if (typeof value === 'string' && value.length > 0) return value;

  const fallbackFr = readField(obj, field, 'fr');
  if (typeof fallbackFr === 'string' && fallbackFr.length > 0) return fallbackFr;

  const fallbackAr = readField(obj, field, 'ar');
  if (typeof fallbackAr === 'string' && fallbackAr.length > 0) return fallbackAr;

  const fallbackEn = readField(obj, field, 'en');
  if (typeof fallbackEn === 'string' && fallbackEn.length > 0) return fallbackEn;

  return '';
}
