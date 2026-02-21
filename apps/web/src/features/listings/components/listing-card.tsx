import Image from 'next/image';

import { Badge, Card, CardBody } from '@darkom/ui';
import { getLocalizedField } from '@darkom/i18n';
import { formatPrice, formatSurface } from '@darkom/utils';
import { BedDouble, Bath, Maximize } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';

import { Link } from '@/i18n/navigation';

import type { ListingCardData } from '../types';

import type { Locale } from '@darkom/i18n';

export type ListingCardProps = {
  listing: ListingCardData;
};

export function ListingCard({ listing }: ListingCardProps) {
  const t = useTranslations();
  const locale = useLocale() as Locale;

  const title = getLocalizedField(listing, 'title', locale);
  const price = formatPrice(Number(listing.price), listing.priceCurrency, locale);
  const isRent = listing.type === 'RENT';

  return (
    <Link href={`/listings/${listing.id}`}>
      <Card interactive className="h-full">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          {listing.images[0] ? (
            <Image
              src={listing.images[0]}
              alt={title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-neutral-100 text-neutral-400">
              <Maximize size={32} />
            </div>
          )}

          {/* Badges */}
          <div className="absolute start-3 top-3 flex gap-2">
            <Badge variant={isRent ? 'secondary' : 'default'} size="sm">
              {isRent ? t('listing.forRent') : t('listing.forSale')}
            </Badge>
            {listing.featured && (
              <Badge variant="featured" size="sm">
                {t('listing.featured')}
              </Badge>
            )}
          </div>
        </div>

        {/* Content */}
        <CardBody>
          {/* Price */}
          <p className="text-lg font-bold text-primary-700">
            {price}
            {isRent && (
              <span className="text-sm font-normal text-neutral-500">
                {t('listing.perMonth')}
              </span>
            )}
          </p>

          {/* Title */}
          <h3 className="mt-1 line-clamp-1 text-sm font-semibold text-neutral-900">
            {title}
          </h3>

          {/* Location */}
          <p className="mt-0.5 text-xs text-neutral-500">
            {listing.city}, {listing.governorate}
          </p>

          {/* Specs */}
          <div className="mt-3 flex items-center gap-3 text-xs text-neutral-500">
            {listing.rooms !== null && listing.rooms !== undefined && (
              <span className="flex items-center gap-1">
                <BedDouble size={14} />
                {t('listing.rooms', { count: listing.rooms })}
              </span>
            )}
            {listing.bathrooms !== null && listing.bathrooms !== undefined && (
              <span className="flex items-center gap-1">
                <Bath size={14} />
                {t('listing.bathrooms', { count: listing.bathrooms })}
              </span>
            )}
            {listing.surface !== null && listing.surface !== undefined && (
              <span className="flex items-center gap-1">
                <Maximize size={14} />
                {formatSurface(Number(listing.surface), locale)}
              </span>
            )}
          </div>
        </CardBody>
      </Card>
    </Link>
  );
}
