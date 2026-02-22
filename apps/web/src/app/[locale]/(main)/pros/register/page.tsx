import { redirect } from 'next/navigation';

import { auth } from '@clerk/nextjs/server';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { ProRegistrationForm } from '@/features/pros/components/pro-registration-form';
import { prisma } from '@/lib/prisma';

import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pro' });
  return { title: t('registerTitle') };
}

export default async function ProRegisterPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const { userId } = await auth();
  if (!userId) {
    redirect(`/${locale}/sign-in`);
  }

  const profile = await prisma.profile.findUnique({
    where: { clerkId: userId },
    select: { id: true, role: true },
  });

  if (!profile) {
    redirect(`/${locale}/sign-in`);
  }

  if (profile.role === 'PRO') {
    redirect(`/${locale}/dashboard`);
  }

  const t = await getTranslations({ locale, namespace: 'pro' });

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold">{t('registerTitle')}</h1>
        <p className="mt-2 text-neutral-500">{t('registerSubtitle')}</p>
      </div>
      <ProRegistrationForm />
    </div>
  );
}
