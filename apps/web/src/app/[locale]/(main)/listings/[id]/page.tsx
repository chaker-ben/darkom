import { notFound } from 'next/navigation';

import { getLocalizedField } from '@darkom/i18n';
import { setRequestLocale } from 'next-intl/server';

import { prisma } from '@/lib/prisma';
import { ListingDetail } from '@/features/listings/components/listing-detail';
import { ListingGallery } from '@/features/listings/components/listing-gallery';

import type { Locale } from '@darkom/i18n';
import type { Metadata } from 'next';

type PageProps = {
  params: Promise<{ locale: string; id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, id } = await params;

  const listing = await prisma.listing.findUnique({
    where: { id, status: 'VERIFIED' },
    select: { titleFr: true, titleAr: true, titleEn: true, images: true },
  });

  if (!listing) return { title: 'Not Found' };

  const title = getLocalizedField(listing, 'title', locale as Locale);

  return {
    title,
    openGraph: {
      images: listing.images[0] ? [listing.images[0]] : [],
    },
  };
}

export default async function ListingDetailPage({ params }: PageProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const listing = await prisma.listing.update({
    where: { id, status: 'VERIFIED' },
    data: { viewsCount: { increment: 1 } },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          avatarUrl: true,
          phone: true,
        },
      },
    },
  });

  if (!listing) {
    notFound();
  }

  const title = getLocalizedField(listing, 'title', locale as Locale);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        {/* Gallery */}
        <div className="lg:col-span-3">
          <ListingGallery images={listing.images} title={title} />
        </div>

        {/* Details */}
        <div className="lg:col-span-2">
          <ListingDetail listing={listing} />
        </div>
      </div>
    </div>
  );
}
