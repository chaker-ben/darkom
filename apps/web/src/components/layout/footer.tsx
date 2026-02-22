import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';

export function Footer() {
  const t = useTranslations();

  const realEstateLinks = [
    { href: '/buy' as const, label: t('nav.buy') },
    { href: '/rent' as const, label: t('nav.rent') },
    { href: '/listings/new' as const, label: t('nav.publish') },
  ];

  const servicesLinks = [
    { href: '/pros' as const, label: t('nav.pros') },
  ];

  const companyLinks = [
    { label: t('footer.about') },
    { label: t('footer.terms') },
    { label: t('footer.privacy') },
    { label: t('footer.contactLink') },
  ];

  return (
    <footer className="border-t border-neutral-100 bg-neutral-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <p className="text-xl font-bold text-primary-700">{t('app.name')}</p>
            <p className="mt-2 text-sm text-neutral-500">
              {t('footer.tagline')}
            </p>
          </div>

          {/* Real Estate */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-900">
              {t('footer.realestate')}
            </h3>
            <ul className="mt-3 space-y-2">
              {realEstateLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-500 transition-colors hover:text-primary-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-900">
              {t('footer.services')}
            </h3>
            <ul className="mt-3 space-y-2">
              {servicesLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-500 transition-colors hover:text-primary-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-900">
              {t('footer.company')}
            </h3>
            <ul className="mt-3 space-y-2">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <span className="text-sm text-neutral-500 cursor-default">
                    {link.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 border-t border-neutral-200 pt-6">
          <p className="text-center text-xs text-neutral-400">
            {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
}
