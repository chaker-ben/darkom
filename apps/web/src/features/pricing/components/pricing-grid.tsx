'use client';

import { useState } from 'react';

import { useTranslations } from 'next-intl';

import { PricingCard } from './pricing-card';
import { PLANS } from '../constants/plans';

export function PricingGrid() {
  const t = useTranslations('pricing');
  const [yearly, setYearly] = useState(false);

  return (
    <div className="space-y-8">
      {/* Toggle monthly/yearly */}
      <div className="flex items-center justify-center gap-3">
        <span
          className={`text-sm font-medium ${!yearly ? 'text-neutral-900' : 'text-neutral-400'}`}
        >
          {t('monthly')}
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={yearly}
          onClick={() => setYearly(!yearly)}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
            yearly ? 'bg-primary-600' : 'bg-neutral-200'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition-transform ${
              yearly ? 'translate-x-5 rtl:-translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
        <span
          className={`text-sm font-medium ${yearly ? 'text-neutral-900' : 'text-neutral-400'}`}
        >
          {t('yearly')}
        </span>
        {yearly && (
          <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
            {t('yearlyDiscount')}
          </span>
        )}
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {PLANS.map((plan) => (
          <PricingCard key={plan.id} plan={plan} yearly={yearly} />
        ))}
      </div>
    </div>
  );
}
