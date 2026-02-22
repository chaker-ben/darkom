'use client';

import { Badge, Button } from '@darkom/ui';
import { formatPrice } from '@darkom/utils';
import { Check, X } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';

import type { PlanData } from '../constants/plans';

type PricingCardProps = {
  plan: PlanData;
  yearly: boolean;
};

export function PricingCard({ plan, yearly }: PricingCardProps) {
  const t = useTranslations('pricing');
  const locale = useLocale();
  const price = yearly ? plan.priceYearly : plan.priceMonthly;
  const monthlyEquivalent = yearly ? Math.round(plan.priceYearly / 12) : plan.priceMonthly;

  return (
    <div
      className={`relative flex flex-col rounded-2xl border p-6 transition-shadow ${
        plan.popular
          ? 'border-primary-500 shadow-lg shadow-primary-500/10'
          : 'border-neutral-200 shadow-sm'
      }`}
    >
      {plan.popular && (
        <Badge variant="verified" className="absolute -top-3 start-1/2 -translate-x-1/2">
          {t('popular')}
        </Badge>
      )}

      {/* Plan name */}
      <h3 className="text-lg font-semibold text-neutral-900">
        {t(`plans.${plan.id}`)}
      </h3>

      {/* Price */}
      <div className="mt-4">
        {price === 0 ? (
          <span className="text-3xl font-bold text-neutral-900">{t('free')}</span>
        ) : (
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-neutral-900">
              {formatPrice(monthlyEquivalent, locale, plan.currency)}
            </span>
            <span className="text-sm text-neutral-500">{t('perMonth')}</span>
          </div>
        )}
        {yearly && price > 0 && (
          <p className="mt-1 text-xs text-neutral-400">
            {formatPrice(plan.priceYearly, locale, plan.currency)} / {t('yearly').toLowerCase()}
          </p>
        )}
      </div>

      {/* Features */}
      <ul className="mt-6 flex-1 space-y-3">
        {plan.features.map((feature) => (
          <li key={feature.key} className="flex items-center gap-2 text-sm">
            {feature.included ? (
              <Check size={16} className="shrink-0 text-green-500" />
            ) : (
              <X size={16} className="shrink-0 text-neutral-300" />
            )}
            <span className={feature.included ? 'text-neutral-700' : 'text-neutral-400'}>
              {t(`features.${feature.key}`)}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <div className="mt-6">
        <Button
          variant={plan.popular ? 'primary' : 'outline'}
          className="w-full"
        >
          {price === 0 ? t('getStarted') : plan.id === 'premium' ? t('contactUs') : t('subscribe')}
        </Button>
      </div>
    </div>
  );
}
