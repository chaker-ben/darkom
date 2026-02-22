'use client';

import { Heart } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { useFavorites, useToggleFavorite } from '../hooks/use-favorites';

type FavoriteButtonProps = {
  listingId: string;
};

export function FavoriteButton({ listingId }: FavoriteButtonProps) {
  const t = useTranslations('favorites');
  const { data: favorites } = useFavorites();
  const { mutate: toggleFavorite, isPending } = useToggleFavorite();

  const isFavorited = favorites?.includes(listingId) ?? false;

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(listingId);
      }}
      disabled={isPending}
      className="flex h-8 w-8 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm transition-all hover:bg-white hover:scale-110 disabled:opacity-50"
      aria-label={isFavorited ? t('removed') : t('added')}
    >
      <Heart
        size={16}
        className={`transition-colors ${
          isFavorited
            ? 'fill-red-500 text-red-500'
            : 'fill-none text-neutral-600'
        }`}
      />
    </button>
  );
}
