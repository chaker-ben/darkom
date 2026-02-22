import '../globals.css';

import { notFound } from 'next/navigation';

import { ClerkProvider } from '@clerk/nextjs';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';

import { Providers } from '@/components/providers';
import { getDirection, isRTL } from '@/i18n/config';
import type { Locale } from '@/i18n/config';
import { routing } from '@/i18n/navigation';
import { getClerkLocalization } from '@/lib/clerk-locales';

import type { Metadata } from 'next';


export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = await getMessages();
  const metadata = messages.metadata as Record<string, string>;

  return {
    title: {
      default: metadata?.title ?? 'DARKOM',
      template: '%s | DARKOM',
    },
    description: metadata?.description ?? '',
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://darkom.com'),
    alternates: {
      languages: {
        fr: '/fr',
        ar: '/ar',
        en: '/en',
      },
    },
    openGraph: {
      type: 'website',
      locale,
      siteName: 'DARKOM',
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();
  const dir = getDirection(locale as Locale);
  const rtl = isRTL(locale as Locale);

  return (
    <ClerkProvider
      localization={getClerkLocalization(locale as Locale)}
      signInUrl={`/${locale}/sign-in`}
      signUpUrl={`/${locale}/sign-up`}
      afterSignOutUrl={`/${locale}`}
    >
      <html lang={locale} dir={dir} suppressHydrationWarning>
        <body className={rtl ? 'font-arabic' : 'font-sans'}>
          <NextIntlClientProvider messages={messages}>
            <Providers>{children}</Providers>
          </NextIntlClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
