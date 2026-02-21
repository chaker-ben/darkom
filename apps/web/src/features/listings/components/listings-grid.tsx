'use client';

import { useState } from 'react';

import { Button, FilterTabs, Select } from '@darkom/ui';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';

import { GOVERNORATES } from '../constants/governorates';
import { useListings } from '../hooks/use-listings';
import { ListingCard } from './listing-card';
import { ListingCardSkeleton } from './listing-card-skeleton';

import type { Locale } from '@darkom/i18n';
import type { ListingFilters } from '../types';
import type { SelectOption } from '@darkom/ui';
import type { ListingType } from '@darkom/db';

type ListingsGridProps = {
  fixedType?: ListingType;
};

export function ListingsGrid({ fixedType }: ListingsGridProps) {
  const t = useTranslations();
  const locale = useLocale() as Locale;

  const [filters, setFilters] = useState<ListingFilters>({
    type: fixedType,
    page: 1,
  });

  const { data, isLoading } = useListings(filters);

  const categoryTabs = [
    { value: 'all', label: t('categories.all') },
    { value: 'APARTMENT', label: t('categories.apartment') },
    { value: 'HOUSE', label: t('categories.house') },
    { value: 'LAND', label: t('categories.land') },
    { value: 'COMMERCIAL', label: t('categories.commercial') },
    { value: 'OFFICE', label: t('categories.office') },
  ];

  const governorateOptions: SelectOption[] = [
    { value: '', label: t('filters.allGovernorates') },
    ...GOVERNORATES.map((g) => ({
      value: g.value,
      label: locale === 'ar' ? g.labelAr : locale === 'en' ? g.labelEn : g.labelFr,
    })),
  ];

  const handleCategoryChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      category: value === 'all' ? undefined : (value as ListingFilters['category']),
      page: 1,
    }));
  };

  const handleGovernorateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((prev) => ({
      ...prev,
      governorate: e.target.value || undefined,
      page: 1,
    }));
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <FilterTabs
          items={categoryTabs}
          value={filters.category ?? 'all'}
          onValueChange={handleCategoryChange}
        />
        <div className="w-full sm:w-48">
          <Select
            options={governorateOptions}
            value={filters.governorate ?? ''}
            onChange={handleGovernorateChange}
            size="sm"
          />
        </div>
      </div>

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
