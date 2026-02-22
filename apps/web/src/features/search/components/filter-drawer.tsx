'use client';

import { useState } from 'react';

import { Button, Select } from '@darkom/ui';
import { SlidersHorizontal, X } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';

import { GOVERNORATES } from '@/features/listings/constants/governorates';

import type { Locale } from '@darkom/i18n';
import type { SelectOption } from '@darkom/ui';

type FilterValues = {
  governorate?: string;
  minPrice?: number;
  maxPrice?: number;
  rooms?: number;
};

type FilterDrawerProps = {
  values: FilterValues;
  onChange: (values: FilterValues) => void;
};

export function FilterDrawer({ values, onChange }: FilterDrawerProps) {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const [open, setOpen] = useState(false);

  const governorateOptions: SelectOption[] = [
    { value: '', label: t('filters.allGovernorates') },
    ...GOVERNORATES.map((g) => ({
      value: g.value,
      label: locale === 'ar' ? g.labelAr : locale === 'en' ? g.labelEn : g.labelFr,
    })),
  ];

  const roomOptions: SelectOption[] = [
    { value: '', label: t('filters.rooms') },
    { value: '1', label: '1+' },
    { value: '2', label: '2+' },
    { value: '3', label: '3+' },
    { value: '4', label: '4+' },
    { value: '5', label: '5+' },
  ];

  const handleReset = () => {
    onChange({});
    setOpen(false);
  };

  const handleApply = () => {
    setOpen(false);
  };

  const filterContent = (
    <div className="space-y-4">
      {/* Governorate */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-neutral-700">
          {t('filters.governorate')}
        </label>
        <Select
          options={governorateOptions}
          value={values.governorate ?? ''}
          onChange={(e) =>
            onChange({ ...values, governorate: e.target.value || undefined })
          }
          size="sm"
        />
      </div>

      {/* Price range */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-neutral-700">
          {t('filters.priceRange')}
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder={t('filters.minPrice')}
            value={values.minPrice ?? ''}
            onChange={(e) =>
              onChange({
                ...values,
                minPrice: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100"
          />
          <input
            type="number"
            placeholder={t('filters.maxPrice')}
            value={values.maxPrice ?? ''}
            onChange={(e) =>
              onChange({
                ...values,
                maxPrice: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100"
          />
        </div>
      </div>

      {/* Rooms */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-neutral-700">
          {t('filters.minRooms')}
        </label>
        <Select
          options={roomOptions}
          value={values.rooms !== undefined ? String(values.rooms) : ''}
          onChange={(e) =>
            onChange({
              ...values,
              rooms: e.target.value ? Number(e.target.value) : undefined,
            })
          }
          size="sm"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-2">
        <Button variant="outline" size="sm" className="flex-1" onClick={handleReset}>
          {t('filters.reset')}
        </Button>
        <Button size="sm" className="flex-1" onClick={handleApply}>
          {t('filters.apply')}
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <Button
        variant="outline"
        size="sm"
        className="lg:hidden"
        onClick={() => setOpen(true)}
      >
        <SlidersHorizontal size={16} />
        {t('filters.title')}
      </Button>

      {/* Desktop sidebar */}
      <div className="hidden w-64 shrink-0 lg:block">
        <div className="sticky top-24 rounded-xl border border-neutral-200 bg-white p-4">
          <h3 className="mb-4 text-sm font-semibold text-neutral-900">
            {t('filters.title')}
          </h3>
          {filterContent}
        </div>
      </div>

      {/* Mobile sheet overlay */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
            role="presentation"
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[80vh] overflow-y-auto rounded-t-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">{t('filters.title')}</h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
                aria-label={t('common.cancel')}
              >
                <X size={20} />
              </button>
            </div>
            {filterContent}
          </div>
        </div>
      )}
    </>
  );
}
