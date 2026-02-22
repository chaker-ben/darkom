'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { Button } from '@darkom/ui';
import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';

type SearchBarProps = {
  defaultValue?: string;
  onSearch: (query: string) => void;
  variant?: 'hero' | 'inline';
};

export function SearchBar({
  defaultValue = '',
  onSearch,
  variant = 'inline',
}: SearchBarProps) {
  const t = useTranslations('search');
  const [value, setValue] = useState(defaultValue);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const handleChange = useCallback(
    (newValue: string) => {
      setValue(newValue);
      if (variant === 'inline') {
        if (debounceRef.current) {
          clearTimeout(debounceRef.current);
        }
        debounceRef.current = setTimeout(() => {
          onSearch(newValue);
        }, 300);
      }
    },
    [onSearch, variant],
  );

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    onSearch(value);
  };

  if (variant === 'hero') {
    return (
      <form
        onSubmit={handleSubmit}
        className="flex max-w-2xl overflow-hidden rounded-2xl bg-white p-2 shadow-lg"
      >
        <div className="flex flex-1 items-center gap-2 px-4">
          <Search size={18} className="shrink-0 text-neutral-400" />
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={t('placeholder')}
            className="w-full border-none bg-transparent py-3 text-sm text-neutral-900 outline-none placeholder:text-neutral-400"
          />
        </div>
        <Button type="submit" size="md" className="rounded-xl px-6">
          {t('button')}
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-md">
      <Search
        size={16}
        className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-neutral-400"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={t('placeholder')}
        className="w-full rounded-lg border border-neutral-200 bg-white py-2 pe-4 ps-9 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-primary-300 focus:ring-2 focus:ring-primary-100"
      />
    </form>
  );
}
