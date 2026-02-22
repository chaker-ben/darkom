'use client';

import { useState } from 'react';

import { Badge, Button, FilterTabs } from '@darkom/ui';
import { useTranslations } from 'next-intl';

import { Header } from '@/components/layout/header';
import { ListingCard } from '@/features/listings/components/listing-card';
import { ListingCardSkeleton } from '@/features/listings/components/listing-card-skeleton';
import { useListings } from '@/features/listings/hooks/use-listings';
import { Link } from '@/i18n/navigation';

import type { ListingCategory } from '@darkom/db';

export default function HomePage() {
  const t = useTranslations();
  const [category, setCategory] = useState<string>('all');

  const { data, isLoading } = useListings({
    category: category === 'all' ? undefined : (category as ListingCategory),
    limit: 6,
  });

  const categories = [
    { value: 'all', label: t('categories.all') },
    { value: 'APARTMENT', label: t('categories.apartment') },
    { value: 'HOUSE', label: t('categories.house') },
    { value: 'LAND', label: t('categories.land') },
    { value: 'COMMERCIAL', label: t('categories.commercial') },
    { value: 'OFFICE', label: t('categories.office') },
  ];

  return (
    <main className="min-h-screen">
      <Header />
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-700 to-primary-500 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          {/* Eyebrow */}
          <Badge variant="overlay" size="md" className="mb-6 border border-accent-400/40 bg-accent-400/20 text-accent-300">
            {t('hero.eyebrow')}
          </Badge>

          {/* Title */}
          <h1 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            {t.rich('hero.title', {
              highlight: (chunks) => (
                <span className="text-accent-400">{chunks}</span>
              ),
            })}
          </h1>

          {/* Subtitle */}
          <p className="mt-4 max-w-2xl text-lg text-white/70">
            {t('hero.subtitle')}
          </p>

          {/* Search Bar */}
          <div className="mt-8 flex max-w-2xl overflow-hidden rounded-2xl bg-white p-2 shadow-lg">
            <input
              type="text"
              placeholder={t('search.placeholder')}
              className="flex-1 border-none bg-transparent px-4 py-3 text-sm text-neutral-900 outline-none placeholder:text-neutral-400"
            />
            <Button size="md" className="rounded-xl px-6">
              {t('search.button')}
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-10 flex gap-8">
            <div className="text-white/80">
              <div className="text-2xl font-bold text-white">12,400+</div>
              <div className="text-sm">{t('stats.listings')}</div>
            </div>
            <div className="text-white/80">
              <div className="text-2xl font-bold text-white">3,200+</div>
              <div className="text-sm">{t('stats.pros')}</div>
            </div>
            <div className="text-white/80">
              <div className="text-2xl font-bold text-white">24</div>
              <div className="text-sm">{t('stats.governorates')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <FilterTabs items={categories} value={category} onValueChange={setCategory} />
      </section>

      {/* Recent listings */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold">{t('listing.recent')}</h2>
          <Link href="/buy">
            <Button variant="ghost" size="sm">
              {t('listing.seeAll')}
            </Button>
          </Link>
        </div>
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
      </section>
    </main>
  );
}
