'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@darkom/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { useForm } from 'react-hook-form';

import { ListingFormFields } from './listing-form-fields';
import { useImageUpload } from '../hooks/use-image-upload';
import { useUpdateListing } from '../hooks/use-update-listing';
import { createListingSchema } from '../types/schemas';

import type { CreateListingInput } from '../types/schemas';
import type { Locale } from '@darkom/i18n';

type EditListingFormProps = {
  listing: CreateListingInput & { id: string };
};

export function EditListingForm({ listing }: EditListingFormProps) {
  const t = useTranslations('listing');
  const tCommon = useTranslations('common');
  const locale = useLocale() as Locale;
  const router = useRouter();

  const { images, uploading, error: uploadError, uploadFiles, removeImage } = useImageUpload(listing.images);
  const updateListing = useUpdateListing(listing.id);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateListingInput>({
    resolver: zodResolver(createListingSchema),
    defaultValues: {
      type: listing.type,
      category: listing.category,
      titleFr: listing.titleFr,
      titleAr: listing.titleAr ?? undefined,
      titleEn: listing.titleEn ?? undefined,
      descriptionFr: listing.descriptionFr ?? undefined,
      descriptionAr: listing.descriptionAr ?? undefined,
      descriptionEn: listing.descriptionEn ?? undefined,
      price: listing.price,
      surface: listing.surface ?? undefined,
      rooms: listing.rooms ?? undefined,
      bathrooms: listing.bathrooms ?? undefined,
      governorate: listing.governorate,
      city: listing.city,
      address: listing.address ?? undefined,
      images: listing.images,
    },
  });

  const onSubmit = (data: CreateListingInput) => {
    updateListing.mutate(
      { ...data, images },
      {
        onSuccess: () => {
          router.push(`/${locale}/dashboard`);
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Pending notice */}
      <div className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        <AlertTriangle size={18} className="shrink-0" />
        <p>{t('editPendingNotice')}</p>
      </div>

      <ListingFormFields
        register={register}
        errors={errors}
        images={images}
        uploading={uploading}
        uploadError={uploadError}
        onUpload={uploadFiles}
        onRemove={removeImage}
      />

      {updateListing.error && (
        <p className="text-sm text-error-500">{updateListing.error.message}</p>
      )}

      <div className="flex justify-end gap-3">
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          {tCommon('cancel')}
        </Button>
        <Button
          type="submit"
          disabled={updateListing.isPending || uploading || images.length === 0}
        >
          {updateListing.isPending ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              {tCommon('loading')}
            </>
          ) : (
            t('editSubmit')
          )}
        </Button>
      </div>
    </form>
  );
}
