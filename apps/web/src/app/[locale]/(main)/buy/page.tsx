import { getTranslations, setRequestLocale } from 'next-intl/server';

import { BuyPageContent } from '@/features/listings/components/buy-page-content';

import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'buy' });
  return { title: t('title') };
}

export default async function BuyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'buy' });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <p className="mt-1 text-neutral-500">{t('subtitle')}</p>
      </div>
      <BuyPageContent />
    </div>
  );
}
