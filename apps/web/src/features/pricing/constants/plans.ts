export type PlanFeature = {
  key: string;
  included: boolean;
};

export type PlanData = {
  id: 'free' | 'pro' | 'premium';
  priceMonthly: number;
  priceYearly: number;
  currency: string;
  popular: boolean;
  features: PlanFeature[];
};

export const PLANS: PlanData[] = [
  {
    id: 'free',
    priceMonthly: 0,
    priceYearly: 0,
    currency: 'TND',
    popular: false,
    features: [
      { key: 'listings', included: true },
      { key: 'verifiedBadge', included: false },
      { key: 'priority', included: false },
      { key: 'featured', included: false },
      { key: 'analytics', included: false },
      { key: 'support', included: false },
    ],
  },
  {
    id: 'pro',
    priceMonthly: 29,
    priceYearly: 279,
    currency: 'TND',
    popular: true,
    features: [
      { key: 'unlimitedListings', included: true },
      { key: 'verifiedBadge', included: true },
      { key: 'priority', included: true },
      { key: 'featured', included: false },
      { key: 'analytics', included: false },
      { key: 'support', included: false },
    ],
  },
  {
    id: 'premium',
    priceMonthly: 79,
    priceYearly: 759,
    currency: 'TND',
    popular: false,
    features: [
      { key: 'unlimitedListings', included: true },
      { key: 'verifiedBadge', included: true },
      { key: 'priority', included: true },
      { key: 'featured', included: true },
      { key: 'analytics', included: true },
      { key: 'support', included: true },
    ],
  },
];
