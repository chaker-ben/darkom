'use client';

import { useState } from 'react';

import { cn } from '@darkom/ui';
import { Star } from 'lucide-react';

type StarRatingProps = {
  value: number;
  max?: number;
  size?: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
  className?: string;
};

export function StarRating({
  value,
  max = 5,
  size = 16,
  interactive = false,
  onChange,
  className,
}: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState(0);

  const displayValue = interactive && hoverValue > 0 ? hoverValue : value;

  return (
    <div
      className={cn('flex items-center gap-0.5', className)}
      role={interactive ? 'radiogroup' : 'img'}
      aria-label={`${value} out of ${max}`}
    >
      {Array.from({ length: max }, (_, i) => {
        const starValue = i + 1;
        const isFilled = starValue <= Math.round(displayValue);

        if (interactive) {
          return (
            <button
              key={starValue}
              type="button"
              onClick={() => onChange?.(starValue)}
              onMouseEnter={() => setHoverValue(starValue)}
              onMouseLeave={() => setHoverValue(0)}
              className="rounded-sm p-0.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              aria-label={`${starValue} star${starValue > 1 ? 's' : ''}`}
            >
              <Star
                size={size}
                className={
                  isFilled
                    ? 'fill-accent-400 text-accent-400'
                    : 'text-neutral-300'
                }
              />
            </button>
          );
        }

        return (
          <Star
            key={starValue}
            size={size}
            className={
              isFilled
                ? 'fill-accent-400 text-accent-400'
                : 'text-neutral-300'
            }
          />
        );
      })}
    </div>
  );
}
