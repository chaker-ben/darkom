import { getTranslations, setRequestLocale } from 'next-intl/server';

import { ProfileForm } from '@/features/profile/components/profile-form';
import { requireProfile } from '@/lib/auth';

import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'profile' });
  return { title: t('title') };
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'profile' });

  const profile = await requireProfile();

  const profileData = {
    id: profile.id,
    fullName: profile.fullName,
    email: profile.email,
    phone: profile.phone,
    avatarUrl: profile.avatarUrl,
    preferredLang: profile.preferredLang,
    createdAt: profile.createdAt.toISOString(),
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-2xl font-bold">{t('title')}</h1>
      <div className="rounded-xl border border-neutral-200 bg-white p-6">
        <ProfileForm profile={profileData} />
      </div>
    </div>
  );
}
