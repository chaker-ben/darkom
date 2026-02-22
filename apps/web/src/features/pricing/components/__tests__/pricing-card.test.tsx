import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string, params?: Record<string, unknown>) => {
    if (params) return `${key}(${JSON.stringify(params)})`;
    return key;
  },
  useLocale: () => 'fr',
}));

vi.mock('@darkom/ui', () => ({
  Button: ({ children, ...props }: { children: React.ReactNode } & Record<string, unknown>) => (
    <button {...props}>{children}</button>
  ),
  Badge: ({ children, ...props }: { children: React.ReactNode } & Record<string, unknown>) => (
    <span {...props}>{children}</span>
  ),
}));

vi.mock('@darkom/utils', () => ({
  formatPrice: (amount: number, _locale: string, currency: string) => `${amount} ${currency}`,
}));

import { PLANS } from '../../constants/plans';
import { PricingCard } from '../pricing-card';

const freePlan = PLANS[0] as (typeof PLANS)[number];
const proPlan = PLANS[1] as (typeof PLANS)[number];

afterEach(cleanup);

describe('PricingCard', () => {
  it('renders plan name and features', () => {
    render(<PricingCard plan={freePlan} yearly={false} />);
    expect(screen.getByText('plans.free')).toBeDefined();
    expect(screen.getByText('free')).toBeDefined();
  });

  it('renders popular badge for pro plan', () => {
    render(<PricingCard plan={proPlan} yearly={false} />);
    expect(screen.getByText('popular')).toBeDefined();
  });

  it('displays yearly pricing when yearly is true', () => {
    render(<PricingCard plan={proPlan} yearly={true} />);
    // Monthly equivalent of yearly price
    expect(screen.getByText(/279/)).toBeDefined();
  });
});
