'use client';

import { useState } from 'react';

import { Button } from '@darkom/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

import { updateProfileSchema } from '../types/schemas';

import type { UpdateProfileInput } from '../types/schemas';

type ProfileData = {
  id: string;
  fullName: string | null;
  email: string | null;
  phone: string | null;
  avatarUrl: string | null;
  preferredLang: 'FR' | 'AR' | 'EN';
  createdAt: string;
};

type ProfileFormProps = {
  profile: ProfileData;
};

export function ProfileForm({ profile }: ProfileFormProps) {
  const t = useTranslations('profile');
  const tCommon = useTranslations('common');
  const [saved, setSaved] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      fullName: profile.fullName ?? '',
      phone: profile.phone ?? '',
      preferredLang: profile.preferredLang,
      avatarUrl: profile.avatarUrl ?? '',
    },
  });

  const onSubmit = async (data: UpdateProfileInput) => {
    try {
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const memberSince = new Intl.DateTimeFormat(
    profile.preferredLang === 'AR' ? 'ar-TN' : profile.preferredLang === 'EN' ? 'en-US' : 'fr-TN',
    { year: 'numeric', month: 'long' },
  ).format(new Date(profile.createdAt));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Avatar */}
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-xl font-bold text-primary-700">
          {profile.fullName?.[0]?.toUpperCase() ?? '?'}
        </div>
        <div>
          <p className="text-sm text-neutral-500">
            {t('memberSince', { date: memberSince })}
          </p>
          {profile.email && (
            <p className="text-sm text-neutral-400">{profile.email}</p>
          )}
        </div>
      </div>

      {/* Full Name */}
      <div>
        <label htmlFor="fullName" className="mb-1.5 block text-sm font-medium text-neutral-700">
          {t('fullName')}
        </label>
        <input
          id="fullName"
          type="text"
          {...register('fullName')}
          className="w-full rounded-lg border border-neutral-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary-300 focus:ring-2 focus:ring-primary-100"
        />
        {errors.fullName && (
          <p className="mt-1 text-xs text-red-500">{errors.fullName.message}</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-neutral-700">
          {t('phone')}
        </label>
        <input
          id="phone"
          type="tel"
          dir="ltr"
          {...register('phone')}
          className="w-full rounded-lg border border-neutral-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary-300 focus:ring-2 focus:ring-primary-100"
        />
        {errors.phone && (
          <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>
        )}
      </div>

      {/* Preferred Language */}
      <div>
        <label htmlFor="preferredLang" className="mb-1.5 block text-sm font-medium text-neutral-700">
          {t('language')}
        </label>
        <select
          id="preferredLang"
          {...register('preferredLang')}
          className="w-full rounded-lg border border-neutral-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary-300 focus:ring-2 focus:ring-primary-100"
        >
          <option value="FR">Fran\u00e7ais</option>
          <option value="AR">\u0627\u0644\u0639\u0631\u0628\u064a\u0629</option>
          <option value="EN">English</option>
        </select>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full sm:w-auto"
      >
        {isSubmitting ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            {tCommon('loading')}
          </>
        ) : saved ? (
          <>
            <Check size={16} />
            {t('saved')}
          </>
        ) : (
          tCommon('save')
        )}
      </Button>
    </form>
  );
}
