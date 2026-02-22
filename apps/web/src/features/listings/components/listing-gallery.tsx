'use client';

import { useState } from 'react';

import Image from 'next/image';

import { cn } from '@darkom/ui';
import { Expand } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { ImageLightbox } from './image-lightbox';

type ListingGalleryProps = {
  images: string[];
  title: string;
};

export function ListingGallery({ images, title }: ListingGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const t = useTranslations('gallery');

  if (images.length === 0) {
    return (
      <div className="flex aspect-[16/9] items-center justify-center rounded-xl bg-neutral-100 text-neutral-400">
        {t('noImages')}
      </div>
    );
  }

  return (
    <div>
      {/* Main image — clickable to open lightbox */}
      <button
        type="button"
        onClick={() => setLightboxOpen(true)}
        className="group relative aspect-[16/9] w-full overflow-hidden rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
        aria-label={t('expand')}
      >
        <Image
          src={images[activeIndex] ?? images[0] ?? ''}
          alt={`${title} - ${activeIndex + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 60vw"
          className="object-cover"
          priority
        />

        {/* Expand icon overlay on hover */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/20">
          <div className="rounded-full bg-black/50 p-3 opacity-0 transition-opacity group-hover:opacity-100">
            <Expand size={24} className="text-white" />
          </div>
        </div>
      </button>

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

      {/* Lightbox */}
      <ImageLightbox
        images={images}
        title={title}
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
        initialIndex={activeIndex}
      />
    </div>
  );
}
