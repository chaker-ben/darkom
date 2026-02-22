'use client';

import { useState } from 'react';

import { Button, FilterTabs } from '@darkom/ui';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { ListingCard } from './listing-card';
import { ListingCardSkeleton } from './listing-card-skeleton';
import { useListings } from '../hooks/use-listings';

import type { ListingFilters } from '../types';
import type { ListingType } from '@darkom/db';

type ListingsGridProps = {
  fixedType?: ListingType;
  externalSearch?: string;
  externalGovernorate?: string;
  externalMinPrice?: number;
  externalMaxPrice?: number;
  externalRooms?: number;
};

export function ListingsGrid({
  fixedType,
  externalSearch,
  externalGovernorate,
  externalMinPrice,
  externalMaxPrice,
  externalRooms,
}: ListingsGridProps) {
  const t = useTranslations();

  const [filters, setFilters] = useState<ListingFilters>({
    type: fixedType,
    page: 1,
  });

  const mergedFilters: ListingFilters = {
    ...filters,
    ...(externalSearch !== undefined && { search: externalSearch }),
    ...(externalGovernorate !== undefined && { governorate: externalGovernorate }),
    ...(externalMinPrice !== undefined && { minPrice: externalMinPrice }),
    ...(externalMaxPrice !== undefined && { maxPrice: externalMaxPrice }),
    ...(externalRooms !== undefined && { rooms: externalRooms }),
  };

  const { data, isLoading } = useListings(mergedFilters);

  const categoryTabs = [
    { value: 'all', label: t('categories.all') },
    { value: 'APARTMENT', label: t('categories.apartment') },
    { value: 'HOUSE', label: t('categories.house') },
    { value: 'LAND', label: t('categories.land') },
    { value: 'COMMERCIAL', label: t('categories.commercial') },
    { value: 'OFFICE', label: t('categories.office') },
  ];

  const handleCategoryChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      category: value === 'all' ? undefined : (value as ListingFilters['category']),
      page: 1,
    }));
  };

  return (
    <div className="space-y-6">
      {/* Category Tabs */}
      <FilterTabs
        items={categoryTabs}
        value={filters.category ?? 'all'}
        onValueChange={handleCategoryChange}
      />

      {/* Results count */}
      {data && (
        <p className="text-sm text-neutral-500">
          {t('filters.results', { count: data.pagination.total })}
        </p>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <ListingCardSkeleton key={i} />
            ))
          : data?.data.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
      </div>

      {/* Empty state */}
      {!isLoading && data?.data.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16">
          <p className="text-neutral-500">{t('common.noResults')}</p>
        </div>
      )}

      {/* Pagination */}
      {data && data.pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="sm"
            disabled={data.pagination.page <= 1}
            onClick={() =>
              setFilters((prev) => ({ ...prev, page: (prev.page ?? 1) - 1 }))
            }
          >
            <ChevronLeft size={16} />
            {t('filters.previous')}
          </Button>
          <span className="text-sm text-neutral-500">
            {t('filters.page', {
              current: data.pagination.page,
              total: data.pagination.totalPages,
            })}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={data.pagination.page >= data.pagination.totalPages}
            onClick={() =>
              setFilters((prev) => ({ ...prev, page: (prev.page ?? 1) + 1 }))
            }
          >
            {t('filters.next')}
            <ChevronRight size={16} />
          </Button>
        </div>
      )}
    </div>
  );
}
