'use client';

import { useState } from 'react';

import Image from 'next/image';

import { getLocalizedField } from '@darkom/i18n';
import { Badge, Button } from '@darkom/ui';
import { formatPrice, formatSurface } from '@darkom/utils';
import { Bath, BedDouble, Building2, Eye, MapPin, Maximize, Phone } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

import { ContactModal } from './contact-modal';

import type { ListingDTO } from '../types';
import type { Locale } from '@darkom/i18n';

type ListingDetailProps = {
  listing: ListingDTO;
};

export function ListingDetail({ listing }: ListingDetailProps) {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const [contactOpen, setContactOpen] = useState(false);

  const title = getLocalizedField(listing, 'title', locale);
  const description = getLocalizedField(listing, 'description', locale);
  const price = formatPrice(Number(listing.price), listing.priceCurrency, locale);
  const isRent = listing.type === 'RENT';

  return (
    <div className="space-y-6">
      {/* Price & badges */}
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={isRent ? 'secondary' : 'default'} size="md">
            {isRent ? t('listing.forRent') : t('listing.forSale')}
          </Badge>
          {listing.featured && (
            <Badge variant="featured" size="md">
              {t('listing.featured')}
            </Badge>
          )}
        </div>
        <p className="mt-3 text-3xl font-bold text-primary-700">
          {price}
          {isRent && (
            <span className="text-lg font-normal text-neutral-500">
              {t('listing.perMonth')}
            </span>
          )}
        </p>
        <h1 className="mt-2 text-xl font-semibold">{title}</h1>
        <p className="mt-1 flex items-center gap-1 text-sm text-neutral-500">
          <MapPin size={14} />
          {listing.city}, {listing.governorate}
        </p>
      </div>

      {/* Specs */}
      <div className="grid grid-cols-2 gap-4 rounded-xl bg-neutral-50 p-4 sm:grid-cols-4">
        {listing.rooms !== null && listing.rooms !== undefined && (
          <div className="flex flex-col items-center gap-1">
            <BedDouble size={20} className="text-primary-600" />
            <span className="text-sm font-semibold">{listing.rooms}</span>
            <span className="text-xs text-neutral-500">{t('listing.detail.specs')}</span>
          </div>
        )}
        {listing.bathrooms !== null && listing.bathrooms !== undefined && (
          <div className="flex flex-col items-center gap-1">
            <Bath size={20} className="text-primary-600" />
            <span className="text-sm font-semibold">{listing.bathrooms}</span>
            <span className="text-xs text-neutral-500">{t('listing.bathrooms', { count: listing.bathrooms })}</span>
          </div>
        )}
        {listing.surface !== null && listing.surface !== undefined && (
          <div className="flex flex-col items-center gap-1">
            <Maximize size={20} className="text-primary-600" />
            <span className="text-sm font-semibold">{formatSurface(Number(listing.surface), locale)}</span>
            <span className="text-xs text-neutral-500">{t('listing.detail.specs')}</span>
          </div>
        )}
        {listing.floor !== null && listing.floor !== undefined && (
          <div className="flex flex-col items-center gap-1">
            <Building2 size={20} className="text-primary-600" />
            <span className="text-sm font-semibold">{listing.floor}</span>
            <span className="text-xs text-neutral-500">Floor</span>
          </div>
        )}
      </div>

      {/* Description */}
      {description && (
        <div>
          <h2 className="mb-2 text-lg font-semibold">{t('listing.detail.description')}</h2>
          <p className="whitespace-pre-line text-sm leading-relaxed text-neutral-600">
            {description}
          </p>
        </div>
      )}

      {/* Views */}
      <p className="flex items-center gap-1 text-xs text-neutral-400">
        <Eye size={14} />
        {t('listing.detail.views', { count: listing.viewsCount })}
      </p>

      {/* Contact */}
      <div className="rounded-xl border border-neutral-100 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-3">
          {listing.user.avatarUrl && (
            <Image
              src={listing.user.avatarUrl}
              alt={listing.user.fullName ?? ''}
              width={48}
              height={48}
              className="rounded-full"
            />
          )}
          <div className="flex-1">
            <p className="font-semibold">{listing.user.fullName}</p>
            {listing.user.phone && (
              <p className="text-sm text-neutral-500">{listing.user.phone}</p>
            )}
          </div>
          <Button size="sm" onClick={() => setContactOpen(true)}>
            <Phone size={16} />
            {t('listing.detail.contact')}
          </Button>
        </div>
      </div>

      <ContactModal
        open={contactOpen}
        onOpenChange={setContactOpen}
        seller={listing.user}
        listingId={listing.id}
      />
    </div>
  );
}
