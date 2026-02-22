import { getTranslations, setRequestLocale } from 'next-intl/server';

import { AdminListingsContent } from '@/features/admin/components/admin-listings-content';
import { prisma } from '@/lib/prisma';

import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'admin' });
  return { title: t('listings') };
}

export default async function AdminListingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const listings = await prisma.listing.findMany({
    where: { status: 'PENDING' },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      titleFr: true,
      titleAr: true,
      titleEn: true,
      images: true,
      status: true,
      governorate: true,
      city: true,
      createdAt: true,
      user: {
        select: {
          fullName: true,
          email: true,
        },
      },
    },
  });

  const serialized = listings.map((l) => ({
    ...l,
    createdAt: l.createdAt.toISOString(),
  }));

  return <AdminListingsContent listings={serialized} />;
}
