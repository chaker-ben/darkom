export function formatPrice(amount: number, locale: string, currency = 'TND'): string {
  return new Intl.NumberFormat(locale === 'ar' ? 'ar-TN' : locale === 'en' ? 'en-TN' : 'fr-TN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCompactPrice(amount: number, locale: string): string {
  return new Intl.NumberFormat(locale === 'ar' ? 'ar-TN' : locale === 'en' ? 'en-TN' : 'fr-TN', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(amount);
}

export function formatDate(date: Date | string, locale: string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-TN' : locale === 'en' ? 'en-TN' : 'fr-TN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}

export function formatRelativeDate(date: Date | string, locale: string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  const rtf = new Intl.RelativeTimeFormat(locale === 'ar' ? 'ar-TN' : locale === 'en' ? 'en-TN' : 'fr-TN', {
    numeric: 'auto',
  });

  if (diffDays === 0) return rtf.format(0, 'day');
  if (diffDays < 7) return rtf.format(-diffDays, 'day');
  if (diffDays < 30) return rtf.format(-Math.floor(diffDays / 7), 'week');
  if (diffDays < 365) return rtf.format(-Math.floor(diffDays / 30), 'month');
  return rtf.format(-Math.floor(diffDays / 365), 'year');
}

export function formatSurface(value: number, locale: string): string {
  return new Intl.NumberFormat(locale === 'ar' ? 'ar-TN' : locale === 'en' ? 'en-TN' : 'fr-TN').format(value) + ' m\u00b2';
}
