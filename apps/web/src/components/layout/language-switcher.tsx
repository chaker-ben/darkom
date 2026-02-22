'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { locales, localeNames, localeFlags } from '@darkom/i18n';
import { ChevronDown } from 'lucide-react';
import { useLocale } from 'next-intl';

import { usePathname, useRouter } from '@/i18n/navigation';

import type { Locale } from '@darkom/i18n';

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const switchLocale = useCallback(
    (newLocale: Locale) => {
      router.replace(pathname, { locale: newLocale });
      setOpen(false);
    },
    [router, pathname],
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
        aria-label="Change language"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className="text-base">{localeFlags[locale]}</span>
        <ChevronDown
          size={14}
          className={`transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Select language"
          className="absolute end-0 top-full z-50 mt-1 min-w-[160px] overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-lg"
        >
          {locales.map((l) => (
            <button
              key={l}
              type="button"
              role="option"
              aria-selected={l === locale}
              onClick={() => switchLocale(l)}
              className={`flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                l === locale
                  ? 'bg-primary-50 font-medium text-primary-700'
                  : 'text-neutral-700 hover:bg-neutral-50'
              }`}
            >
              <span className="text-base">{localeFlags[l]}</span>
              <span>{localeNames[l]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
