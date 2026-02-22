import Image from 'next/image';
import { redirect } from 'next/navigation';

import { auth } from '@clerk/nextjs/server';
import { getLocalizedField } from '@darkom/i18n';
import { Badge, Button } from '@darkom/ui';
import { formatPrice } from '@darkom/utils';
import { Plus } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { DashboardStats } from '@/features/dashboard/components/dashboard-stats';
import { ListingActions } from '@/features/dashboard/components/listing-actions';
import { Link } from '@/i18n/navigation';
import { prisma } from '@/lib/prisma';

import type { Locale } from '@darkom/i18n';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'dashboard' });
  return { title: t('title') };
}

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'warning' | 'overlay' | 'verified'> = {
  VERIFIED: 'verified',
  PENDING: 'warning',
  REJECTED: 'secondary',
  DRAFT: 'overlay',
  SOLD: 'default',
};

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'dashboard' });
  const tListing = await getTranslations({ locale, namespace: 'listing' });

  const { userId } = await auth();
  if (!userId) {
    redirect(`/${locale}/sign-in`);
  }

  const profile = await prisma.profile.findUnique({
    where: { clerkId: userId },
    select: { id: true },
  });

  if (!profile) {
    redirect(`/${locale}/sign-in`);
  }

  const listings = await prisma.listing.findMany({
    where: { userId: profile.id },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      titleFr: true,
      titleAr: true,
      titleEn: true,
      price: true,
      priceCurrency: true,
      images: true,
      status: true,
      viewsCount: true,
      createdAt: true,
    },
  });

  const stats = {
    total: listings.length,
    active: listings.filter((l) => l.status === 'VERIFIED').length,
    totalViews: listings.reduce((sum, l) => sum + l.viewsCount, 0),
    pending: listings.filter((l) => l.status === 'PENDING').length,
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <Link href="/listings/new">
          <Button size="sm">
            <Plus size={16} />
            {t('newListing')}
          </Button>
        </Link>
      </div>

      <div className="mb-8">
        <DashboardStats {...stats} />
      </div>

      {listings.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-neutral-200 py-16">
          <p className="mb-4 text-neutral-500">{t('empty')}</p>
          <Link href="/listings/new">
            <Button size="sm">
              <Plus size={16} />
              {t('newListing')}
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {listings.map((listing) => {
            const title = getLocalizedField(listing, 'title', locale as Locale);
            return (
              <div
                key={listing.id}
                className="flex items-center gap-4 rounded-xl border border-neutral-100 bg-white p-4 shadow-sm"
              >
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg">
                  {listing.images[0] ? (
                    <Image
                      src={listing.images[0]}
                      alt={title}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-neutral-100 text-xs text-neutral-400">
                      {tListing('noImage')}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-neutral-900">{title}</h3>
                  <p className="text-sm text-primary-700">
                    {formatPrice(Number(listing.price), listing.priceCurrency, locale)}
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge
                      variant={STATUS_VARIANT[listing.status] ?? 'overlay'}
                      size="sm"
                    >
                      {t(`status.${listing.status}`)}
                    </Badge>
                    <span className="text-xs text-neutral-400">
                      {t('views', { count: listing.viewsCount })}
                    </span>
                  </div>
                </div>
                <ListingActions listingId={listing.id} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
