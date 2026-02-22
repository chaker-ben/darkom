'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { Button, Input, Select, Textarea } from '@darkom/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight, Check, Loader2 } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

import { GOVERNORATES } from '@/features/listings/constants/governorates';

import { PRO_CATEGORIES } from '../constants/categories';
import { useRegisterPro } from '../hooks/use-register-pro';
import { createProSchema } from '../types/schemas';

import type { CreateProInput } from '../types/schemas';
import type { Locale } from '@darkom/i18n';
import type { SelectOption } from '@darkom/ui';

function getLabelKey(locale: Locale): 'labelAr' | 'labelEn' | 'labelFr' {
  if (locale === 'ar') return 'labelAr';
  if (locale === 'en') return 'labelEn';
  return 'labelFr';
}

export function ProRegistrationForm() {
  const t = useTranslations('pro');
  const locale = useLocale() as Locale;
  const router = useRouter();
  const [step, setStep] = useState(1);
  const registerPro = useRegisterPro();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    trigger,
  } = useForm<CreateProInput>({
    resolver: zodResolver(createProSchema),
    defaultValues: {
      governorates: [],
    },
  });

  const watchedValues = watch();
  const selectedGovernorates = watch('governorates') ?? [];

  const labelKey = getLabelKey(locale);

  const categoryOptions: SelectOption[] = PRO_CATEGORIES.map((cat) => ({
    value: cat.value,
    label: cat[labelKey],
  }));

  const governorateOptions = GOVERNORATES.map((g) => ({
    value: g.value,
    label: g[labelKey],
  }));

  const handleNext = async () => {
    if (step === 1) {
      const valid = await trigger(['businessNameFr', 'category', 'phone']);
      if (valid) setStep(2);
    } else if (step === 2) {
      const valid = await trigger(['governorates']);
      if (valid) setStep(3);
    }
  };

  const handlePrev = () => {
    setStep((s) => Math.max(1, s - 1));
  };

  const toggleGovernorate = (value: string) => {
    const current = selectedGovernorates;
    const updated = current.includes(value)
      ? current.filter((g) => g !== value)
      : [...current, value];
    setValue('governorates', updated, { shouldValidate: true });
  };

  const onSubmit = (data: CreateProInput) => {
    registerPro.mutate(data, {
      onSuccess: () => {
        router.push(`/${locale}/dashboard`);
      },
    });
  };

  const steps = [
    { num: 1, label: t('step1') },
    { num: 2, label: t('step2') },
    { num: 3, label: t('step3') },
  ];

  return (
    <div className="space-y-8">
      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2">
        {steps.map((s, i) => (
          <div key={s.num} className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                step >= s.num
                  ? 'bg-primary-600 text-white'
                  : 'bg-neutral-100 text-neutral-400'
              }`}
            >
              {step > s.num ? <Check size={16} /> : s.num}
            </div>
            <span
              className={`text-sm ${step >= s.num ? 'text-neutral-900' : 'text-neutral-400'}`}
            >
              {s.label}
            </span>
            {i < steps.length - 1 && (
              <div
                className={`h-px w-8 ${step > s.num ? 'bg-primary-600' : 'bg-neutral-200'}`}
              />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Step 1: Business Info */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                {t('businessName')}
              </label>
              <Input
                {...register('businessNameFr')}
                error={errors.businessNameFr?.message}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                {t('businessName')} ({'\u0639\u0631\u0628\u064a'})
              </label>
              <Input {...register('businessNameAr')} dir="rtl" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                {t('category')}
              </label>
              <Select
                options={categoryOptions}
                {...register('category')}
                error={errors.category?.message}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                {t('phone')}
              </label>
              <Input
                type="tel"
                {...register('phone')}
                error={errors.phone?.message}
                dir="ltr"
              />
            </div>
          </div>
        )}

        {/* Step 2: Services & Areas */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                {t('bio')}
              </label>
              <Textarea
                {...register('bioFr')}
                error={errors.bioFr?.message}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                {t('bio')} ({'\u0639\u0631\u0628\u064a'})
              </label>
              <Textarea {...register('bioAr')} dir="rtl" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                {t('serviceAreas')}
              </label>
              {errors.governorates?.message && (
                <p className="mb-2 text-xs text-error-500">
                  {errors.governorates.message}
                </p>
              )}
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {governorateOptions.map((gov) => (
                  <button
                    key={gov.value}
                    type="button"
                    onClick={() => toggleGovernorate(gov.value)}
                    className={`rounded-lg border px-3 py-2 text-start text-sm transition-colors ${
                      selectedGovernorates.includes(gov.value)
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-neutral-200 text-neutral-600 hover:border-neutral-300'
                    }`}
                  >
                    {gov.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Review & Confirm */}
        {step === 3 && (
          <div className="space-y-4 rounded-xl border border-neutral-100 bg-neutral-50 p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium text-neutral-500">
                  {t('businessName')}
                </p>
                <p className="text-sm font-semibold">
                  {watchedValues.businessNameFr}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-neutral-500">
                  {t('category')}
                </p>
                <p className="text-sm font-semibold">
                  {categoryOptions.find(
                    (c) => c.value === watchedValues.category,
                  )?.label}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-neutral-500">
                  {t('phone')}
                </p>
                <p className="text-sm font-semibold" dir="ltr">
                  {watchedValues.phone}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-neutral-500">
                  {t('serviceAreas')}
                </p>
                <p className="text-sm font-semibold">
                  {selectedGovernorates
                    .map(
                      (g) =>
                        governorateOptions.find((go) => go.value === g)?.label,
                    )
                    .filter(Boolean)
                    .join(', ')}
                </p>
              </div>
            </div>
            {watchedValues.bioFr && (
              <div>
                <p className="text-xs font-medium text-neutral-500">
                  {t('bio')}
                </p>
                <p className="text-sm">{watchedValues.bioFr}</p>
              </div>
            )}
          </div>
        )}

        {/* Error */}
        {registerPro.error && (
          <p className="text-sm text-error-500">{registerPro.error.message}</p>
        )}

        {/* Navigation */}
        <div className="flex justify-between">
          {step > 1 ? (
            <Button type="button" variant="ghost" onClick={handlePrev}>
              <ArrowLeft size={16} />
              {t('previous')}
            </Button>
          ) : (
            <div />
          )}
          {step < 3 ? (
            <Button type="button" onClick={handleNext}>
              {t('next')}
              <ArrowRight size={16} />
            </Button>
          ) : (
            <Button type="submit" disabled={registerPro.isPending}>
              {registerPro.isPending ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  <Check size={16} />
                  {t('submit')}
                </>
              )}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
