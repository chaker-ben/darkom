'use client';

import Image from 'next/image';
import { useState } from 'react';

import { cn } from '@darkom/ui';

type ListingGalleryProps = {
  images: string[];
  title: string;
};

export function ListingGallery({ images, title }: ListingGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="flex aspect-[16/9] items-center justify-center rounded-xl bg-neutral-100 text-neutral-400">
        No images
      </div>
    );
  }

  return (
    <div>
      {/* Main image */}
      <div className="relative aspect-[16/9] overflow-hidden rounded-xl">
        <Image
          src={images[activeIndex] ?? images[0] ?? ''}
          alt={`${title} - ${activeIndex + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 60vw"
          className="object-cover"
          priority
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((url, index) => (
            <button
              key={url}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={cn(
                'relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-colors',
                index === activeIndex
                  ? 'border-primary-500'
                  : 'border-transparent opacity-70 hover:opacity-100',
              )}
              aria-label={`Image ${index + 1}`}
            >
              <Image
                src={url}
                alt={`${title} ${index + 1}`}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
