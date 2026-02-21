'use client';

import { useState } from 'react';

import { Badge, Button, Card, CardBody, FilterTabs, Skeleton } from '@darkom/ui';
import { useTranslations } from 'next-intl';

import { Header } from '@/components/layout/header';

export default function HomePage() {
  const t = useTranslations();
  const [category, setCategory] = useState('all');

  const categories = [
    { value: 'all', label: t('categories.all') },
    { value: 'apartment', label: t('categories.apartment') },
    { value: 'house', label: t('categories.house') },
    { value: 'land', label: t('categories.land') },
    { value: 'commercial', label: t('categories.commercial') },
    { value: 'office', label: t('categories.office') },
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

      {/* Placeholder for listings grid */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold">{t('listing.recent')}</h2>
          <Button variant="ghost" size="sm">
            {t('listing.seeAll')}
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <Skeleton className="h-48 w-full rounded-none" />
              <CardBody>
                <Skeleton className="mb-2 h-5 w-24" />
                <Skeleton className="mb-1 h-4 w-full" />
                <Skeleton className="h-3 w-2/3" />
              </CardBody>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
