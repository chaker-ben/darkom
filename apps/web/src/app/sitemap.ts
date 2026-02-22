import { prisma } from '@/lib/prisma';

import type { MetadataRoute } from 'next';


const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://darkom.com';
const LOCALES = ['fr', 'ar', 'en'] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = ['', '/buy', '/rent', '/pros'];

  const staticEntries = staticPages.flatMap((page) =>
    LOCALES.map((locale) => ({
      url: `${BASE_URL}/${locale}${page}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: page === '' ? 1.0 : 0.8,
    })),
  );

  const listings = await prisma.listing.findMany({
    where: { status: 'VERIFIED' },
    select: { id: true, updatedAt: true },
    orderBy: { updatedAt: 'desc' },
    take: 5000,
  });

  const listingEntries = listings.flatMap((listing) =>
    LOCALES.map((locale) => ({
      url: `${BASE_URL}/${locale}/listings/${listing.id}`,
      lastModified: listing.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    })),
  );

  return [...staticEntries, ...listingEntries];
}
