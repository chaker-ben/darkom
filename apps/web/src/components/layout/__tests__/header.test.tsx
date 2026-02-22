/// <reference types="@testing-library/jest-dom/vitest" />
import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@clerk/nextjs', () => ({
  SignedIn: ({ children }: { children: React.ReactNode }) =>
    React.createElement('div', { 'data-testid': 'signed-in' }, children),
  SignedOut: ({ children }: { children: React.ReactNode }) =>
    React.createElement('div', { 'data-testid': 'signed-out' }, children),
  UserButton: () => React.createElement('div', { 'data-testid': 'user-button' }),
}));

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      'nav.home': 'Accueil',
      'nav.buy': 'Acheter',
      'nav.rent': 'Louer',
      'nav.pros': 'Artisans',
      'nav.login': 'Connexion',
      'nav.register': 'Inscription',
      'nav.favorites': 'Favoris',
      'messages.title': 'Messages',
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
    onClick?: () => void;
    className?: string;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
  usePathname: () => '/',
}));

vi.mock('@/lib/clerk-appearance', () => ({
  clerkAppearance: {},
}));

vi.mock('../language-switcher', () => ({
  LanguageSwitcher: () => React.createElement('div', { 'data-testid': 'language-switcher' }),
}));

vi.mock('@/features/messages/hooks/use-unread-count', () => ({
  useUnreadCount: () => ({ data: 0 }),
}));

import { Header } from '../header';

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the DARKOM logo', () => {
    render(<Header />);
    expect(screen.getByText('DARKOM')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<Header />);
    expect(screen.getAllByText('Accueil').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Acheter').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Louer').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Artisans').length).toBeGreaterThan(0);
  });

  it('renders sign-in and sign-up buttons when signed out', () => {
    render(<Header />);
    const signedOutSections = screen.getAllByTestId('signed-out');
    expect(signedOutSections.length).toBeGreaterThan(0);
    expect(screen.getAllByText('Connexion').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Inscription').length).toBeGreaterThan(0);
  });

  it('renders UserButton when signed in', () => {
    render(<Header />);
    const userButtons = screen.getAllByTestId('user-button');
    expect(userButtons.length).toBeGreaterThan(0);
  });

  it('toggles mobile menu on button click', async () => {
    const user = userEvent.setup();
    render(<Header />);

    const menuButton = screen.getByRole('button', { name: 'Open menu' });
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');

    await user.click(menuButton);

    const closeButton = screen.getByRole('button', { name: 'Close menu' });
    expect(closeButton).toHaveAttribute('aria-expanded', 'true');
  });
});
