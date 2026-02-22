'use client';

import Image from 'next/image';

import { Badge, Card, CardBody } from '@darkom/ui';
import { MapPin, Shield } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';

import { StarRating } from './star-rating';

import type { ProCardData } from '../types';
import type { Locale } from '@darkom/i18n';

type ProCardProps = {
  pro: ProCardData;
};

export function ProCard({ pro }: ProCardProps) {
  const t = useTranslations('pro');
  const locale = useLocale() as Locale;

  const name =
    locale === 'ar' && pro.businessNameAr
      ? pro.businessNameAr
      : pro.businessNameFr;

  const categoryKey = `categories.${pro.category}` as const;
  const categoryLabel = t.has(categoryKey) ? t(categoryKey) : pro.category;

  return (
    <Link href={`/pros/${pro.id}` as '/'}>
      <Card interactive className="h-full">
        <CardBody>
          <div className="flex items-start gap-3">
            {/* Logo / Avatar */}
            {pro.logoUrl ? (
              <Image
                src={pro.logoUrl}
                alt={name}
                width={56}
                height={56}
                className="rounded-xl object-cover"
              />
            ) : pro.user.avatarUrl ? (
              <Image
                src={pro.user.avatarUrl}
                alt={name}
                width={56}
                height={56}
                className="rounded-xl object-cover"
              />
            ) : (
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-xl font-bold text-primary-600">
                {name.charAt(0).toUpperCase()}
              </div>
            )}

            <div className="min-w-0 flex-1">
              {/* Name + verified */}
              <div className="flex items-center gap-2">
                <h3 className="truncate text-sm font-semibold">{name}</h3>
                {pro.verified && (
                  <Shield size={14} className="shrink-0 text-primary-500" />
                )}
              </div>

              {/* Category badge */}
              <Badge variant="secondary" size="sm" className="mt-1">
                {categoryLabel}
              </Badge>

              {/* Rating */}
              <div className="mt-2 flex items-center gap-2">
                <StarRating value={pro.rating} size={14} />
                <span className="text-xs text-neutral-500">
                  {pro.reviewsCount > 0
                    ? t('reviews', { count: pro.reviewsCount })
                    : t('noReviews')}
                </span>
              </div>
            </div>
          </div>

          {/* Service areas */}
          {pro.governorates.length > 0 && (
            <div className="mt-3 flex items-center gap-1 text-xs text-neutral-500">
              <MapPin size={12} />
              <span className="truncate">
                {pro.governorates.join(', ')}
              </span>
            </div>
          )}

          {/* Plan badge */}
          {pro.plan !== 'FREE' && (
            <Badge
              variant={pro.plan === 'PREMIUM' ? 'featured' : 'default'}
              size="sm"
              className="mt-2"
            >
              {pro.plan}
            </Badge>
          )}
        </CardBody>
      </Card>
    </Link>
  );
}
