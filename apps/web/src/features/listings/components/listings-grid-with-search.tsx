'use client';

import { useTranslations } from 'next-intl';

import { FilterDrawer } from '@/features/search/components/filter-drawer';
import { SearchBar } from '@/features/search/components/search-bar';
import { useSearchFilters } from '@/features/search/hooks/use-search-params';

import { ListingsGrid } from './listings-grid';

import type { ListingType } from '@darkom/db';

type ListingsGridWithSearchProps = {
  fixedType?: ListingType;
};

export function ListingsGridWithSearch({ fixedType }: ListingsGridWithSearchProps) {
  const t = useTranslations();
  const { filters, setFilters } = useSearchFilters();

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      {/* Filter sidebar / drawer */}
      <FilterDrawer
        values={{
          governorate: filters.governorate,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
          rooms: filters.rooms,
        }}
        onChange={(vals) =>
          setFilters({
            governorate: vals.governorate,
            minPrice: vals.minPrice,
            maxPrice: vals.maxPrice,
            rooms: vals.rooms,
          })
        }
      />

      {/* Main content */}
      <div className="min-w-0 flex-1 space-y-6">
        {/* Search bar */}
        <SearchBar
          defaultValue={filters.search ?? ''}
          onSearch={(query) => setFilters({ search: query || undefined })}
        />

        {/* Search results info */}
        {filters.search && (
          <p className="text-sm text-neutral-500">
            {t('search.results', { count: 0, query: filters.search })}
          </p>
        )}

        {/* Listings grid */}
        <ListingsGrid
          fixedType={fixedType}
          externalSearch={filters.search}
          externalGovernorate={filters.governorate}
          externalMinPrice={filters.minPrice}
          externalMaxPrice={filters.maxPrice}
          externalRooms={filters.rooms}
        />
      </div>
    </div>
  );
}
