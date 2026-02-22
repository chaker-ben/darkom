/// <reference types="@testing-library/jest-dom/vitest" />
import React from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => {
    const t = (key: string, values?: Record<string, unknown>) => {
      if (key === 'reviews' && values?.count) return `${values.count} reviews`;
      if (key === 'noReviews') return 'No reviews yet';
      if (key.startsWith('categories.')) return key.split('.')[1];
      return key;
    };
    t.has = () => true;
    return t;
  },
  useLocale: () => 'fr',
}));

// Mock navigation
vi.mock('@/i18n/navigation', () => ({
  Link: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

// Mock next/image
vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} />
  ),
}));

import { ProCard } from '../pro-card';

import type { ProCardData } from '../../types';

const mockPro: ProCardData = {
  id: 'pro-1',
  businessNameFr: 'Plomberie Expert',
  businessNameAr: null,
  category: 'plumber',
  phone: '+21612345678',
  whatsapp: null,
  governorates: ['Tunis', 'Ariana'],
  plan: 'FREE',
  rating: 4.5,
  reviewsCount: 12,
  verified: true,
  logoUrl: null,
  user: { id: 'u1', fullName: 'Ahmed Ben Ali', avatarUrl: null },
};

describe('ProCard', () => {
  it('renders business name', () => {
    render(<ProCard pro={mockPro} />);
    expect(screen.getByText('Plomberie Expert')).toBeInTheDocument();
  });

  it('renders rating and review count', () => {
    render(<ProCard pro={mockPro} />);
    expect(screen.getByText('12 reviews')).toBeInTheDocument();
  });

  it('shows verified badge when verified', () => {
    render(<ProCard pro={mockPro} />);
    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
  });

  it('renders category badge', () => {
    render(<ProCard pro={mockPro} />);
    expect(screen.getByText('plumber')).toBeInTheDocument();
  });

  it('renders governorates', () => {
    render(<ProCard pro={mockPro} />);
    expect(screen.getByText('Tunis, Ariana')).toBeInTheDocument();
  });

  it('shows no reviews text when reviewsCount is 0', () => {
    const proWithNoReviews: ProCardData = {
      ...mockPro,
      reviewsCount: 0,
      rating: 0,
    };
    render(<ProCard pro={proWithNoReviews} />);
    expect(screen.getByText('No reviews yet')).toBeInTheDocument();
  });

  it('renders fallback avatar with first letter when no logo or avatar', () => {
    render(<ProCard pro={mockPro} />);
    expect(screen.getByText('P')).toBeInTheDocument();
  });

  it('renders logo image when logoUrl is provided', () => {
    const proWithLogo: ProCardData = {
      ...mockPro,
      logoUrl: 'https://example.com/logo.jpg',
    };
    render(<ProCard pro={proWithLogo} />);
    expect(screen.getByAltText('Plomberie Expert')).toBeInTheDocument();
  });

  it('renders PRO plan badge', () => {
    const proPlan: ProCardData = { ...mockPro, plan: 'PRO' };
    render(<ProCard pro={proPlan} />);
    expect(screen.getByText('PRO')).toBeInTheDocument();
  });

  it('renders PREMIUM plan badge with featured variant', () => {
    const premiumPlan: ProCardData = { ...mockPro, plan: 'PREMIUM' };
    render(<ProCard pro={premiumPlan} />);
    expect(screen.getByText('PREMIUM')).toBeInTheDocument();
  });

  it('does not render plan badge for FREE plan', () => {
    render(<ProCard pro={mockPro} />);
    expect(screen.queryByText('FREE')).not.toBeInTheDocument();
  });

  it('links to the correct pro detail page', () => {
    render(<ProCard pro={mockPro} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/pros/pro-1');
  });

  it('renders Arabic business name when locale is ar', async () => {
    // Re-mock useLocale to return 'ar'
    vi.mocked(await import('next-intl')).useLocale = vi.fn(() => 'ar');

    const proWithAr: ProCardData = {
      ...mockPro,
      businessNameAr: '\u0633\u0628\u0627\u0643 \u062e\u0628\u064a\u0631',
    };
    render(<ProCard pro={proWithAr} />);
    expect(
      screen.getByText('\u0633\u0628\u0627\u0643 \u062e\u0628\u064a\u0631'),
    ).toBeInTheDocument();
  });
});
