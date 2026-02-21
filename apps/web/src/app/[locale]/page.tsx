import { useTranslations } from 'next-intl';

export default function HomePage() {
  const t = useTranslations();

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-700 to-primary-500 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          {/* Eyebrow */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent-400/40 bg-accent-400/20 px-4 py-1.5 text-sm font-semibold text-accent-300">
            {t('hero.eyebrow')}
          </div>

          {/* Title */}
          <h1 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            {t.rich('hero.title', {
              highlight: (chunks) => (
                <span className="text-accent-400">{chunks}</span>
              ),
            })}
          </h1>

          {/* Subtitle */}
          <p className="mt-4 max-w-2xl text-lg text-white/70">
            {t('hero.subtitle')}
          </p>

          {/* Search Bar */}
          <div className="mt-8 flex max-w-2xl overflow-hidden rounded-2xl bg-white p-2 shadow-lg">
            <input
              type="text"
              placeholder={t('search.placeholder')}
              className="flex-1 border-none bg-transparent px-4 py-3 text-sm text-neutral-900 outline-none placeholder:text-neutral-400"
            />
            <button className="flex items-center gap-2 rounded-xl bg-primary-700 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-800">
              {t('search.button')}
            </button>
          </div>

          {/* Stats */}
          <div className="mt-10 flex gap-8">
            <div className="text-white/80">
              <div className="text-2xl font-bold text-white">12,400+</div>
              <div className="text-sm">{t('stats.listings')}</div>
            </div>
            <div className="text-white/80">
              <div className="text-2xl font-bold text-white">3,200+</div>
              <div className="text-sm">{t('stats.pros')}</div>
            </div>
            <div className="text-white/80">
              <div className="text-2xl font-bold text-white">24</div>
              <div className="text-sm">{t('stats.governorates')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {['all', 'apartment', 'house', 'land', 'commercial', 'office'].map(
            (category, i) => (
              <button
                key={category}
                className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${
                  i === 0
                    ? 'bg-primary-700 text-white'
                    : 'border border-neutral-200 bg-white text-neutral-500 hover:border-primary-300 hover:text-primary-700'
                }`}
              >
                {t(`categories.${category}`)}
              </button>
            ),
          )}
        </div>
      </section>

      {/* Placeholder for listings grid */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold">{t('listing.recent')}</h2>
          <button className="text-sm font-medium text-primary-500 hover:text-primary-700">
            {t('listing.seeAll')}
          </button>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* Skeleton placeholder cards */}
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="overflow-hidden rounded-2xl bg-white shadow-card"
            >
              <div className="h-48 animate-pulse bg-neutral-100" />
              <div className="p-4">
                <div className="mb-2 h-5 w-24 animate-pulse rounded bg-neutral-100" />
                <div className="mb-1 h-4 w-full animate-pulse rounded bg-neutral-100" />
                <div className="h-3 w-2/3 animate-pulse rounded bg-neutral-100" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
