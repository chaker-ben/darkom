import { getTranslations, setRequestLocale } from 'next-intl/server';

import { FavoritesPageContent } from '@/features/favorites/components/favorites-page-content';
import { requireProfile } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'favorites' });
  return { title: t('title') };
}

export default async function FavoritesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'favorites' });

  const profile = await requireProfile();

  const favorites = await prisma.favorite.findMany({
    where: { userId: profile.id },
    include: {
      listing: {
        select: {
          id: true,
          type: true,
          category: true,
          titleFr: true,
          titleAr: true,
          titleEn: true,
          price: true,
          priceCurrency: true,
          surface: true,
          rooms: true,
          bathrooms: true,
          governorate: true,
          city: true,
          images: true,
          status: true,
          featured: true,
          createdAt: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const listings = favorites.map((f) => f.listing);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-2xl font-bold">{t('title')}</h1>
      <FavoritesPageContent listings={listings} />
    </div>
  );
}
