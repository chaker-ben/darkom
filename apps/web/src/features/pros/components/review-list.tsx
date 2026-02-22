'use client';

import Image from 'next/image';

import { useLocale } from 'next-intl';

import { StarRating } from './star-rating';

import type { ReviewData } from '../types';

type ReviewListProps = {
  reviews: ReviewData[];
};

export function ReviewList({ reviews }: ReviewListProps) {
  const locale = useLocale();

  if (reviews.length === 0) return null;

  return (
    <div className="space-y-4">
      {reviews.map((review) => {
        const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
        const daysDiff = Math.round(
          (new Date(review.createdAt).getTime() - Date.now()) /
            (1000 * 60 * 60 * 24),
        );
        const relativeDate = rtf.format(daysDiff, 'day');

        return (
          <div
            key={review.id}
            className="rounded-lg border border-neutral-100 p-4"
          >
            <div className="flex items-start gap-3">
              {review.author.avatarUrl ? (
                <Image
                  src={review.author.avatarUrl}
                  alt={review.author.fullName ?? ''}
                  width={36}
                  height={36}
                  className="rounded-full"
                />
              ) : (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-sm font-semibold text-neutral-600">
                  {review.author.fullName?.charAt(0)?.toUpperCase() ?? '?'}
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">
                    {review.author.fullName}
                  </p>
                  <span className="text-xs text-neutral-400">
                    {relativeDate}
                  </span>
                </div>
                <StarRating value={review.rating} size={12} className="mt-1" />
                {review.comment && (
                  <p className="mt-2 text-sm text-neutral-600">
                    {review.comment}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
