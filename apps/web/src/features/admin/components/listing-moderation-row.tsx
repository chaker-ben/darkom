'use client';

import { useState } from 'react';

import Image from 'next/image';

import { getLocalizedField } from '@darkom/i18n';
import { Badge, Button } from '@darkom/ui';
import { Check, X } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';

import type { Locale } from '@darkom/i18n';


type ModerationListing = {
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

type ListingModerationRowProps = {
  listing: ModerationListing;
  onModerate: (id: string, status: 'VERIFIED' | 'REJECTED') => void;
};

export function ListingModerationRow({
  listing,
  onModerate,
}: ListingModerationRowProps) {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const [loading, setLoading] = useState<string | null>(null);

  const title = getLocalizedField(listing, 'title', locale);

  const handleModerate = async (status: 'VERIFIED' | 'REJECTED') => {
    setLoading(status);
    try {
      const response = await fetch(`/api/admin/listings/${listing.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        onModerate(listing.id, status);
      }
    } catch (error) {
      console.error('Failed to moderate listing:', error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex items-center gap-4 rounded-lg border border-neutral-200 bg-white p-4">
      {/* Image */}
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">
        {listing.images[0] ? (
          <Image
            src={listing.images[0]}
            alt={title}
            fill
            sizes="64px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-neutral-100 text-xs text-neutral-400">
            {t('listing.noImage')}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-semibold text-neutral-900">
          {title}
        </h3>
        <p className="text-xs text-neutral-500">
          {listing.city}, {listing.governorate}
        </p>
        <p className="text-xs text-neutral-400">
          {listing.user.fullName ?? listing.user.email}
        </p>
      </div>

      {/* Status */}
      <Badge
        variant={
          listing.status === 'PENDING'
            ? 'secondary'
            : listing.status === 'VERIFIED'
              ? 'default'
              : 'destructive'
        }
        size="sm"
      >
        {t(`dashboard.status.${listing.status}`)}
      </Badge>

      {/* Actions */}
      <div className="flex shrink-0 gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleModerate('VERIFIED')}
          disabled={loading !== null}
          className="text-green-600 hover:bg-green-50 hover:text-green-700"
        >
          <Check size={14} />
          <span className="hidden sm:inline">{t('admin.approve')}</span>
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleModerate('REJECTED')}
          disabled={loading !== null}
          className="text-red-600 hover:bg-red-50 hover:text-red-700"
        >
          <X size={14} />
          <span className="hidden sm:inline">{t('admin.reject')}</span>
        </Button>
      </div>
    </div>
  );
}
