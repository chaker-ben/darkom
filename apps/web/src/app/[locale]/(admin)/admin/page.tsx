import { getTranslations, setRequestLocale } from 'next-intl/server';

import { prisma } from '@/lib/prisma';

import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'admin' });
  return { title: t('title') };
}

export default async function AdminDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'admin' });

  const [totalListings, pendingListings, totalUsers] =
    await prisma.$transaction([
      prisma.listing.count(),
      prisma.listing.count({ where: { status: 'PENDING' } }),
      prisma.profile.count(),
    ]);

  const stats = [
    { label: t('totalListings'), value: totalListings },
    { label: t('pending'), value: pendingListings },
    { label: t('totalUsers'), value: totalUsers },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">{t('title')}</h1>

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-neutral-200 bg-white p-6"
          >
            <p className="text-sm text-neutral-500">{stat.label}</p>
            <p className="mt-1 text-3xl font-bold text-neutral-900">
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
