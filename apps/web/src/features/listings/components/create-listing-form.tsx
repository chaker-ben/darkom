'use client';

import { useRouter } from 'next/navigation';

import { Button, Input, Select, Textarea } from '@darkom/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { useForm } from 'react-hook-form';

import { ImageUploader } from './image-uploader';
import { GOVERNORATES } from '../constants/governorates';
import { useCreateListing } from '../hooks/use-create-listing';
import { useImageUpload } from '../hooks/use-image-upload';
import { createListingSchema } from '../types/schemas';

import type { CreateListingInput } from '../types/schemas';
import type { Locale } from '@darkom/i18n';
import type { SelectOption } from '@darkom/ui';

function getGovernorateOptions(locale: Locale): SelectOption[] {
  const labelKey = locale === 'ar' ? 'labelAr' : locale === 'en' ? 'labelEn' : 'labelFr';
  return GOVERNORATES.map((g) => ({
    value: g.value,
    label: g[labelKey],
  }));
}

export function CreateListingForm() {
  const t = useTranslations('listing.form');
  const tCommon = useTranslations('common');
  const locale = useLocale() as Locale;
  const router = useRouter();

  const { images, uploading, error: uploadError, uploadFiles, removeImage } = useImageUpload();
  const createListing = useCreateListing();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateListingInput>({
    resolver: zodResolver(createListingSchema),
    defaultValues: {
      type: 'SALE',
      category: 'APARTMENT',
      images: [],
    },
  });

  const onSubmit = (data: CreateListingInput) => {
    createListing.mutate(
      { ...data, images },
      {
        onSuccess: () => {
          router.push(`/${locale}/dashboard`);
        },
      },
    );
  };

  const typeOptions: SelectOption[] = [
    { value: 'SALE', label: t('typeSale') },
    { value: 'RENT', label: t('typeRent') },
  ];

  const categoryOptions: SelectOption[] = [
    { value: 'APARTMENT', label: t('categoryApartment') },
    { value: 'HOUSE', label: t('categoryHouse') },
    { value: 'LAND', label: t('categoryLand') },
    { value: 'COMMERCIAL', label: t('categoryCommercial') },
    { value: 'OFFICE', label: t('categoryOffice') },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Type & Category */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium">{t('type')}</label>
          <Select options={typeOptions} {...register('type')} error={errors.type?.message} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">{t('category')}</label>
          <Select
            options={categoryOptions}
            {...register('category')}
            error={errors.category?.message}
          />
        </div>
      </div>

      {/* Title FR (required) */}
      <div>
        <label className="mb-1.5 block text-sm font-medium">{t('titleFr')}</label>
        <Input {...register('titleFr')} error={errors.titleFr?.message} />
      </div>

      {/* Title AR & EN (optional) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium">{t('titleAr')}</label>
          <Input {...register('titleAr')} dir="rtl" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">{t('titleEn')}</label>
          <Input {...register('titleEn')} />
        </div>
      </div>

      {/* Description FR */}
      <div>
        <label className="mb-1.5 block text-sm font-medium">{t('descriptionFr')}</label>
        <Textarea {...register('descriptionFr')} error={errors.descriptionFr?.message} />
      </div>

      {/* Price */}
      <div>
        <label className="mb-1.5 block text-sm font-medium">{t('price')}</label>
        <Input
          type="number"
          step="0.01"
          {...register('price', { valueAsNumber: true })}
          error={errors.price?.message}
        />
      </div>

      {/* Specs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1.5 block text-sm font-medium">{t('surface')}</label>
          <Input
            type="number"
            {...register('surface', { valueAsNumber: true })}
            error={errors.surface?.message}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">{t('rooms')}</label>
          <Input
            type="number"
            {...register('rooms', { valueAsNumber: true })}
            error={errors.rooms?.message}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">{t('bathrooms')}</label>
          <Input
            type="number"
            {...register('bathrooms', { valueAsNumber: true })}
            error={errors.bathrooms?.message}
          />
        </div>
      </div>

      {/* Location */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium">{t('governorate')}</label>
          <Select
            options={getGovernorateOptions(locale)}
            placeholder={t('selectGovernorate')}
            {...register('governorate')}
            error={errors.governorate?.message}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">{t('city')}</label>
          <Input {...register('city')} error={errors.city?.message} />
        </div>
      </div>

      {/* Images */}
      <div>
        <label className="mb-1.5 block text-sm font-medium">{t('images')}</label>
        <ImageUploader
          images={images}
          uploading={uploading}
          error={uploadError}
          onUpload={uploadFiles}
          onRemove={removeImage}
        />
        {errors.images?.message && (
          <p className="mt-1 text-xs text-error-500">{errors.images.message}</p>
        )}
      </div>

      {/* Submit */}
      {createListing.error && (
        <p className="text-sm text-error-500">{createListing.error.message}</p>
      )}

      <div className="flex justify-end gap-3">
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          {tCommon('cancel')}
        </Button>
        <Button
          type="submit"
          disabled={createListing.isPending || uploading || images.length === 0}
        >
          {createListing.isPending ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              {tCommon('loading')}
            </>
          ) : (
            t('submit')
          )}
        </Button>
      </div>
    </form>
  );
}
