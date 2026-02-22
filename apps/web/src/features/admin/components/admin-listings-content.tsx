'use client';

import { useState } from 'react';

import { FileText } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { ListingModerationRow } from './listing-moderation-row';

type AdminListing = {
  id: string;
  titleFr: string;
  titleAr: string | null;
  titleEn: string | null;
  images: string[];
  status: string;
  governorate: string;
  city: string;
  createdAt: string;
  user: {
    fullName: string | null;
    email: string | null;
  };
};

type AdminListingsContentProps = {
  listings: AdminListing[];
};

export function AdminListingsContent({ listings: initial }: AdminListingsContentProps) {
  const t = useTranslations('admin');
  const [listings, setListings] = useState(initial);

  const handleModerate = (id: string) => {
    setListings((prev) => prev.filter((l) => l.id !== id));
  };

  if (listings.length === 0) {
    return (
      <div>
        <h1 className="mb-6 text-2xl font-bold">{t('listings')}</h1>
        <div className="flex flex-col items-center justify-center py-20">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
            <FileText size={28} className="text-neutral-400" />
          </div>
          <p className="text-neutral-500">{t('noResults')}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('listings')}</h1>
        <span className="text-sm text-neutral-500">
          {t('pending')}: {listings.length}
        </span>
      </div>
      <div className="space-y-3">
        {listings.map((listing) => (
          <ListingModerationRow
            key={listing.id}
            listing={listing}
            onModerate={handleModerate}
          />
        ))}
      </div>
    </div>
  );
}
