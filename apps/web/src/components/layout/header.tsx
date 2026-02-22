'use client';

import { useState } from 'react';

import {
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';
import { Button } from '@darkom/ui';
import { Heart, Menu, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Link, usePathname } from '@/i18n/navigation';
import { clerkAppearance } from '@/lib/clerk-appearance';

import { LanguageSwitcher } from './language-switcher';

const navLinks = [
  { href: '/', labelKey: 'nav.home' },
  { href: '/buy', labelKey: 'nav.buy' },
  { href: '/rent', labelKey: 'nav.rent' },
  { href: '/pros', labelKey: 'nav.pros' },
] as const;

export function Header() {
  const t = useTranslations();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-100 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-extrabold tracking-tight text-primary-700">
            DARKOM
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                }`}
              >
                {t(link.labelKey)}
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="hidden items-center gap-3 md:flex">
          <LanguageSwitcher />
          <SignedIn>
            <Link
              href="/favorites"
              className="rounded-lg p-2 text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
              aria-label={t('nav.favorites')}
            >
              <Heart size={18} />
            </Link>
          </SignedIn>
          <SignedOut>
            <Link href="/sign-in">
              <Button variant="ghost" size="sm">
                {t('nav.login')}
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button size="sm">
                {t('nav.register')}
              </Button>
            </Link>
          </SignedOut>
          <SignedIn>
            <UserButton
              appearance={clerkAppearance}
              afterSignOutUrl="/"
            />
          </SignedIn>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          className="rounded-lg p-2 text-neutral-600 hover:bg-neutral-100 md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-neutral-100 bg-white md:hidden">
          <nav className="flex flex-col px-4 py-3">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-neutral-600 hover:bg-neutral-50'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t(link.labelKey)}
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-neutral-100 px-4 py-3">
            <div className="mb-3 flex items-center justify-between">
              <LanguageSwitcher />
              <SignedIn>
                <Link
                  href="/favorites"
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Heart size={16} />
                  {t('nav.favorites')}
                </Link>
              </SignedIn>
            </div>
            <SignedOut>
              <div className="flex flex-col gap-2">
                <Link href="/sign-in" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full">
                    {t('nav.login')}
                  </Button>
                </Link>
                <Link href="/sign-up" onClick={() => setMobileMenuOpen(false)}>
                  <Button size="sm" className="w-full">
                    {t('nav.register')}
                  </Button>
                </Link>
              </div>
            </SignedOut>
            <SignedIn>
              <UserButton
                appearance={clerkAppearance}
                afterSignOutUrl="/"
              />
            </SignedIn>
          </div>
        </div>
      )}
    </header>
  );
}
