/// <reference types="@testing-library/jest-dom/vitest" />
import React from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      'app.name': 'DARKOM',
      'footer.tagline': 'Your trusted real estate platform in Tunisia',
      'footer.realestate': 'Real Estate',
      'footer.services': 'Services',
      'footer.company': 'Company',
      'footer.about': 'About',
      'footer.terms': 'Terms of Service',
      'footer.privacy': 'Privacy Policy',
      'footer.contactLink': 'Contact',
      'footer.copyright': '2024 DARKOM. All rights reserved.',
      'nav.buy': 'Buy',
      'nav.rent': 'Rent',
      'nav.publish': 'Post a listing',
      'nav.pros': 'Craftsmen',
    };
    return translations[key] ?? key;
  },
}));

vi.mock('@/i18n/navigation', () => ({
  Link: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
    className?: string;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

import { Footer } from '../footer';

describe('Footer', () => {
  it('renders the brand name', () => {
    render(<Footer />);
    expect(screen.getByText('DARKOM')).toBeInTheDocument();
  });

  it('renders the tagline', () => {
    render(<Footer />);
    expect(
      screen.getByText('Your trusted real estate platform in Tunisia'),
    ).toBeInTheDocument();
  });

  it('renders real estate navigation links', () => {
    render(<Footer />);
    expect(screen.getByText('Buy')).toBeInTheDocument();
    expect(screen.getByText('Rent')).toBeInTheDocument();
    expect(screen.getByText('Post a listing')).toBeInTheDocument();
  });

  it('renders services navigation links', () => {
    render(<Footer />);
    expect(screen.getByText('Craftsmen')).toBeInTheDocument();
  });

  it('renders company links', () => {
    render(<Footer />);
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Terms of Service')).toBeInTheDocument();
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  it('renders section headings', () => {
    render(<Footer />);
    expect(screen.getByText('Real Estate')).toBeInTheDocument();
    expect(screen.getByText('Services')).toBeInTheDocument();
    expect(screen.getByText('Company')).toBeInTheDocument();
  });

  it('renders copyright text', () => {
    render(<Footer />);
    expect(
      screen.getByText('2024 DARKOM. All rights reserved.'),
    ).toBeInTheDocument();
  });

  it('renders navigation links with correct hrefs', () => {
    render(<Footer />);
    const buyLink = screen.getByText('Buy').closest('a');
    expect(buyLink).toHaveAttribute('href', '/buy');

    const rentLink = screen.getByText('Rent').closest('a');
    expect(rentLink).toHaveAttribute('href', '/rent');

    const publishLink = screen.getByText('Post a listing').closest('a');
    expect(publishLink).toHaveAttribute('href', '/listings/new');

    const prosLink = screen.getByText('Craftsmen').closest('a');
    expect(prosLink).toHaveAttribute('href', '/pros');
  });
});
