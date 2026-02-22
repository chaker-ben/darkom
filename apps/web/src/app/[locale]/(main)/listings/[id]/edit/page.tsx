import { redirect } from 'next/navigation';

import { auth } from '@clerk/nextjs/server';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { EditListingForm } from '@/features/listings/components/edit-listing-form';
import { prisma } from '@/lib/prisma';

import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'listing' });
  return { title: t('editTitle') };
}

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

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

  const listing = await prisma.listing.findUnique({
    where: { id },
  });

  if (!listing || listing.userId !== profile.id) {
    redirect(`/${locale}/dashboard`);
  }

  // Convert Decimal types to numbers and null to undefined for client component serialization
  const listingData = {
    id: listing.id,
    type: listing.type as 'SALE' | 'RENT',
    category: listing.category as 'APARTMENT' | 'HOUSE' | 'LAND' | 'COMMERCIAL' | 'OFFICE',
    titleFr: listing.titleFr,
    titleAr: listing.titleAr ?? undefined,
    titleEn: listing.titleEn ?? undefined,
    descriptionFr: listing.descriptionFr ?? undefined,
    descriptionAr: listing.descriptionAr ?? undefined,
    descriptionEn: listing.descriptionEn ?? undefined,
    price: Number(listing.price),
    surface: listing.surface ? Number(listing.surface) : undefined,
    rooms: listing.rooms ?? undefined,
    bathrooms: listing.bathrooms ?? undefined,
    governorate: listing.governorate,
    city: listing.city,
    address: listing.address ?? undefined,
    images: listing.images,
  };

  const t = await getTranslations({ locale, namespace: 'listing' });

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold">{t('editTitle')}</h1>
      <EditListingForm listing={listingData} />
    </div>
  );
}
