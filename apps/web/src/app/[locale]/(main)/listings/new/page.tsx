import { getTranslations, setRequestLocale } from 'next-intl/server';

import { CreateListingForm } from '@/features/listings/components/create-listing-form';

import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'listing.form' });
  return { title: t('pageTitle') };
}

export default async function NewListingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'listing.form' });

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-2xl font-bold">{t('pageTitle')}</h1>
      <CreateListingForm />
    </div>
  );
}
