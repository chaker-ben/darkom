'use client';

import { useState } from 'react';

import { Badge, Button, FilterTabs } from '@darkom/ui';
import { useTranslations } from 'next-intl';

import { Header } from '@/components/layout/header';
import { ListingCard } from '@/features/listings/components/listing-card';
import { ListingCardSkeleton } from '@/features/listings/components/listing-card-skeleton';
import { useListings } from '@/features/listings/hooks/use-listings';
import { SearchBar } from '@/features/search/components/search-bar';
import { Link, useRouter } from '@/i18n/navigation';

import type { ListingCategory } from '@darkom/db';

export default function HomePage() {
  const t = useTranslations();
  const router = useRouter();
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

  const handleHeroSearch = (query: string) => {
    if (query.trim()) {
      router.push(`/buy?search=${encodeURIComponent(query.trim())}` as '/');
    }
  };

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
          <div className="mt-8">
            <SearchBar onSearch={handleHeroSearch} variant="hero" />
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

      {/* How it works */}
      <section className="border-t border-neutral-100 bg-neutral-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold">{t('landing.howItWorks')}</h2>
          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {[
              { icon: '\u{1F50D}', title: t('landing.step1Title'), desc: t('landing.step1Desc') },
              { icon: '\u{1F4AC}', title: t('landing.step2Title'), desc: t('landing.step2Desc') },
              { icon: '\u{1F3E0}', title: t('landing.step3Title'), desc: t('landing.step3Desc') },
            ].map((step) => (
              <div key={step.title} className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 text-3xl">
                  {step.icon}
                </div>
                <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-neutral-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-primary-700 to-primary-900 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white">{t('landing.ctaTitle')}</h2>
          <div className="mt-6">
            <Link href="/listings/new">
              <Button variant="accent" size="lg">
                {t('landing.ctaButton')}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
