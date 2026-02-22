'use client';

import { Button } from '@darkom/ui';
import { Heart } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { ListingCard } from '@/features/listings/components/listing-card';
import type { ListingCardData } from '@/features/listings/types';
import { Link } from '@/i18n/navigation';

type FavoritesPageContentProps = {
  listings: ListingCardData[];
};

export function FavoritesPageContent({ listings }: FavoritesPageContentProps) {
  const t = useTranslations('favorites');

  if (listings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
          <Heart size={28} className="text-neutral-400" />
        </div>
        <p className="mb-4 text-neutral-500">{t('empty')}</p>
        <Link href="/buy">
          <Button size="sm">{t('emptyAction')}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}
