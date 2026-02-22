import { getTranslations, setRequestLocale } from 'next-intl/server';

import { ProsDirectoryContent } from '@/features/pros/components/pros-directory-content';

import type { Metadata } from 'next';

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pro' });

  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

export default async function ProsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'pro' });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <p className="mt-1 text-neutral-500">{t('subtitle')}</p>
      </div>
      <ProsDirectoryContent />
    </div>
  );
}
