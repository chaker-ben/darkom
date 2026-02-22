'use client';

import { useCallback, useMemo } from 'react';

import { useSearchParams as useNextSearchParams } from 'next/navigation';

import { usePathname, useRouter } from '@/i18n/navigation';

type SearchFilters = {
  search?: string;
  governorate?: string;
  minPrice?: number;
  maxPrice?: number;
  rooms?: number;
  category?: string;
  page?: number;
};

export function useSearchFilters() {
  const searchParams = useNextSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const filters = useMemo<SearchFilters>(() => {
    const search = searchParams.get('search') ?? undefined;
    const governorate = searchParams.get('governorate') ?? undefined;
    const minPrice = searchParams.get('minPrice')
      ? Number(searchParams.get('minPrice'))
      : undefined;
    const maxPrice = searchParams.get('maxPrice')
      ? Number(searchParams.get('maxPrice'))
      : undefined;
    const rooms = searchParams.get('rooms')
      ? Number(searchParams.get('rooms'))
      : undefined;
    const category = searchParams.get('category') ?? undefined;
    const page = searchParams.get('page')
      ? Number(searchParams.get('page'))
      : undefined;

    return { search, governorate, minPrice, maxPrice, rooms, category, page };
  }, [searchParams]);

  const setFilters = useCallback(
    (newFilters: Partial<SearchFilters>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(newFilters).forEach(([key, value]) => {
        if (value === undefined || value === '' || value === null) {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });

      // Reset page when filters change (unless page itself is being set)
      if (!('page' in newFilters)) {
        params.delete('page');
      }

      const qs = params.toString();
      router.replace(`${pathname}${qs ? `?${qs}` : ''}` as '/');
    },
    [searchParams, pathname, router],
  );

  return { filters, setFilters };
}
