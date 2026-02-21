import { useTranslations } from 'next-intl';

export default function NotFound() {
  const t = useTranslations('common');

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <h1 className="text-6xl font-extrabold text-primary-700">404</h1>
      <p className="mt-4 text-lg text-neutral-500">{t('noResults')}</p>
      <a
        href="/"
        className="mt-6 rounded-xl bg-primary-700 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-800"
      >
        {t('back')}
      </a>
    </main>
  );
}
