import { getTranslations, setRequestLocale } from 'next-intl/server';

import { ListingsGrid } from '@/features/listings/components/listings-grid';

import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'rent' });
  return { title: t('title') };
}

export default async function RentPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'rent' });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <p className="mt-1 text-neutral-500">{t('subtitle')}</p>
      </div>
      <ListingsGrid fixedType="RENT" />
    </div>
  );
}
