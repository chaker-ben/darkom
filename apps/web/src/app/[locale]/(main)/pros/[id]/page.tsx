import Image from 'next/image';
import { notFound } from 'next/navigation';


import { Badge, Button } from '@darkom/ui';
import { MapPin, Phone, Shield } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { ReviewList } from '@/features/pros/components/review-list';
import { StarRating } from '@/features/pros/components/star-rating';
import { prisma } from '@/lib/prisma';

import type { Metadata } from 'next';

type PageProps = {
  params: Promise<{ locale: string; id: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, id } = await params;

  const pro = await prisma.pro.findUnique({
    where: { id },
    select: { businessNameFr: true, businessNameAr: true, category: true },
  });

  if (!pro) return { title: 'Not Found' };

  const name =
    locale === 'ar' && pro.businessNameAr
      ? pro.businessNameAr
      : pro.businessNameFr;

  return {
    title: name,
  };
}

export default async function ProDetailPage({ params }: PageProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'pro' });

  const pro = await prisma.pro.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          avatarUrl: true,
        },
      },
      reviews: {
        include: {
          author: {
            select: {
              id: true,
              fullName: true,
              avatarUrl: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!pro) notFound();

  const name =
    locale === 'ar' && pro.businessNameAr
      ? pro.businessNameAr
      : pro.businessNameFr;
  const bio =
    locale === 'ar' && pro.bioAr ? pro.bioAr : pro.bioFr;
  const rating = Number(pro.rating);
  const phoneNumber = pro.phone?.replace(/\s/g, '');
  const whatsappUrl = pro.whatsapp
    ? `https://wa.me/${pro.whatsapp.startsWith('+') ? pro.whatsapp.slice(1) : `216${pro.whatsapp}`}`
    : null;

  const categoryLabel = t.has(`categories.${pro.category}`)
    ? t(`categories.${pro.category}`)
    : pro.category;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        {/* Avatar */}
        {pro.logoUrl ?? pro.user.avatarUrl ? (
          <Image
            src={(pro.logoUrl ?? pro.user.avatarUrl) as string}
            alt={name}
            width={96}
            height={96}
            className="rounded-2xl object-cover"
          />
        ) : (
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-3xl font-bold text-primary-600">
            {name.charAt(0).toUpperCase()}
          </div>
        )}

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{name}</h1>
            {pro.verified && (
              <Badge variant="default" size="sm" className="gap-1">
                <Shield size={12} />
                {t('verified')}
              </Badge>
            )}
          </div>

          <Badge variant="secondary" size="sm" className="mt-2">
            {categoryLabel}
          </Badge>

          {/* Rating */}
          <div className="mt-3 flex items-center gap-2">
            <StarRating value={rating} size={18} />
            <span className="text-sm text-neutral-500">
              {t('rating', { rating: rating.toFixed(1) })}
              {' \u00b7 '}
              {pro.reviewsCount > 0
                ? t('reviews', { count: pro.reviewsCount })
                : t('noReviews')}
            </span>
          </div>

          {/* Contact buttons */}
          <div className="mt-4 flex gap-3">
            {pro.phone && (
              <a href={`tel:${phoneNumber}`}>
                <Button variant="outline" size="sm">
                  <Phone size={14} />
                  {t('call')}
                </Button>
              </a>
            )}
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="accent" size="sm">
                  {t('whatsapp')}
                </Button>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Bio */}
      {bio && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold">{t('bio')}</h2>
          <p className="mt-2 whitespace-pre-line text-sm text-neutral-600">
            {bio}
          </p>
        </div>
      )}

      {/* Service areas */}
      {pro.governorates.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold">{t('serviceAreas')}</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {pro.governorates.map((gov) => (
              <Badge key={gov} variant="secondary" size="sm">
                <MapPin size={12} />
                {gov}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Reviews */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold">
          {t('reviews', { count: pro.reviewsCount })}
        </h2>
        <div className="mt-4">
          <ReviewList reviews={pro.reviews} />
        </div>
        {pro.reviews.length === 0 && (
          <p className="text-sm text-neutral-400">{t('noReviews')}</p>
        )}
      </div>
    </div>
  );
}
