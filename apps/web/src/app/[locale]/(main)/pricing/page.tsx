import { getTranslations, setRequestLocale } from 'next-intl/server';

import { PricingGrid } from '@/features/pricing/components/pricing-grid';

import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pricing' });
  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'pricing' });

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold text-neutral-900">{t('title')}</h1>
        <p className="mt-3 text-neutral-500">{t('subtitle')}</p>
      </div>
      <PricingGrid />
    </div>
  );
}
