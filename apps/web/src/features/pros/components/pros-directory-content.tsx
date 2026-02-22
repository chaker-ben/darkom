'use client';

import { useState } from 'react';

import { Button, FilterTabs, Skeleton } from '@darkom/ui';
import { useTranslations } from 'next-intl';

import { SearchBar } from '@/features/search/components/search-bar';

import { ProCard } from './pro-card';
import { PRO_CATEGORIES } from '../constants/categories';
import { usePros } from '../hooks/use-pros';

export function ProsDirectoryContent() {
  const t = useTranslations('pro');
  const [category, setCategory] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const categoryItems = [
    { value: 'all', label: t('allCategories') },
    ...PRO_CATEGORIES.map((cat) => ({
      value: cat.value,
      label: t(`categories.${cat.value}`),
    })),
  ];

  const { data, isLoading } = usePros({
    category: category === 'all' ? undefined : category,
    search: search || undefined,
    page,
    limit: 12,
  });

  return (
    <div>
      {/* Search */}
      <div className="mb-6">
        <SearchBar
          onSearch={(q) => {
            setSearch(q);
            setPage(1);
          }}
          variant="inline"
        />
      </div>

      {/* Category filters */}
      <div className="mb-8 overflow-x-auto">
        <FilterTabs
          items={categoryItems}
          value={category}
          onValueChange={(val) => {
            setCategory(val);
            setPage(1);
          }}
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div
                key={`skeleton-${String(i)}`}
                className="space-y-3 rounded-2xl border border-neutral-100 p-4"
              >
                <div className="flex gap-3">
                  <Skeleton className="h-14 w-14 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              </div>
            ))
          : data?.data.map((pro) => <ProCard key={pro.id} pro={pro} />)}
      </div>

      {/* Empty state */}
      {!isLoading && data?.data.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16">
          <p className="text-neutral-500">{t('empty')}</p>
          <p className="mt-1 text-sm text-neutral-400">{t('emptyAction')}</p>
        </div>
      )}

      {/* Pagination */}
      {data && data.pagination.totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            &larr;
          </Button>
          <span className="text-sm text-neutral-500">
            {page} / {data.pagination.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= data.pagination.totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            &rarr;
          </Button>
        </div>
      )}
    </div>
  );
}
