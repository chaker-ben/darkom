import { notFound } from 'next/navigation';

import { getLocalizedField } from '@darkom/i18n';
import { setRequestLocale } from 'next-intl/server';

import { ListingDetail } from '@/features/listings/components/listing-detail';
import { ListingGallery } from '@/features/listings/components/listing-gallery';
import { prisma } from '@/lib/prisma';
import {
  generateBreadcrumbJsonLd,
  generateListingJsonLd,
} from '@/lib/structured-data';

import type { Locale } from '@darkom/i18n';
import type { Metadata } from 'next';

type PageProps = {
  params: Promise<{ locale: string; id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, id } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://darkom.com';

  const listing = await prisma.listing.findUnique({
    where: { id, status: 'VERIFIED' },
    select: {
      titleFr: true,
      titleAr: true,
      titleEn: true,
      descriptionFr: true,
      descriptionAr: true,
      descriptionEn: true,
      images: true,
      governorate: true,
      city: true,
    },
  });

  if (!listing) return { title: 'Not Found' };

  const title = getLocalizedField(listing, 'title', locale as Locale);
  const description = getLocalizedField(listing, 'description', locale as Locale);
  const truncatedDesc = description ? description.slice(0, 160) : undefined;
  const ogImage = listing.images[0] ?? undefined;

  return {
    title: `${title} | ${listing.city}, ${listing.governorate}`,
    description: truncatedDesc,
    openGraph: {
      title,
      description: truncatedDesc ?? undefined,
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : [],
      url: `${baseUrl}/${locale}/listings/${id}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: truncatedDesc ?? undefined,
      images: ogImage ? [ogImage] : [],
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
  const description = getLocalizedField(listing, 'description', locale as Locale);
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://darkom.com';

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

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateListingJsonLd({
              id: listing.id,
              title,
              description,
              price: Number(listing.price),
              priceCurrency: listing.priceCurrency,
              images: listing.images,
              governorate: listing.governorate,
              city: listing.city,
              category: listing.category,
              type: listing.type,
              surface: listing.surface ? Number(listing.surface) : null,
              rooms: listing.rooms,
              bathrooms: listing.bathrooms,
              url: `${baseUrl}/${locale}/listings/${listing.id}`,
            }),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateBreadcrumbJsonLd([
              {
                name: 'DARKOM',
                url: `${baseUrl}/${locale}`,
              },
              {
                name: listing.type === 'SALE' ? 'Buy' : 'Rent',
                url: `${baseUrl}/${locale}/${listing.type === 'SALE' ? 'buy' : 'rent'}`,
              },
              {
                name: title,
                url: `${baseUrl}/${locale}/listings/${listing.id}`,
              },
            ]),
          ),
        }}
      />
    </div>
  );
}
