'use client';

import { useCallback, useEffect, useState } from 'react';

import Image from 'next/image';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogOverlay,
} from '@darkom/ui';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

type ImageLightboxProps = {
  images: string[];
  title: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialIndex?: number;
};

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
  }),
};

const reducedMotionVariants = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0 },
};

export function ImageLightbox({
  images,
  title,
  open,
  onOpenChange,
  initialIndex = 0,
}: ImageLightboxProps) {
  const t = useTranslations('gallery');
  const locale = useLocale();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [direction, setDirection] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [pointerStart, setPointerStart] = useState<number | null>(null);

  // Sync initialIndex when dialog opens
  useEffect(() => {
    if (open) {
      setCurrentIndex(initialIndex);
      setDirection(0);
    }
  }, [open, initialIndex]);

  // Detect prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) =>
      setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const goNext = useCallback(() => {
    if (currentIndex < images.length - 1) {
      setDirection(1);
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex, images.length]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  // Keyboard navigation (RTL-aware)
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const isRtl = document.dir === 'rtl';

      if (e.key === 'ArrowRight') {
        if (isRtl) {
          goPrev();
        } else {
          goNext();
        }
      } else if (e.key === 'ArrowLeft') {
        if (isRtl) {
          goNext();
        } else {
          goPrev();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, goNext, goPrev]);

  // Touch/pointer swipe handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    setPointerStart(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (pointerStart === null) return;
    const diff = e.clientX - pointerStart;
    const threshold = 50;
    const isRtl = document.dir === 'rtl';

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        isRtl ? goNext() : goPrev();
      } else {
        isRtl ? goPrev() : goNext();
      }
    }
    setPointerStart(null);
  };

  const handleClose = () => onOpenChange(false);

  // Format counter with Intl for locale-aware numerals
  const counter = new Intl.NumberFormat(locale).format(currentIndex + 1);
  const total = new Intl.NumberFormat(locale).format(images.length);

  const variants = prefersReducedMotion ? reducedMotionVariants : slideVariants;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay onClose={handleClose} className="bg-black/90" />
      <DialogContent size="full" onClose={handleClose} className="bg-black">
        {/* Top bar with counter and close button */}
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-sm text-white/70">
            {t('counter', { current: counter, total })}
          </span>
          <DialogClose
            onClose={handleClose}
            className="text-white/70 hover:bg-white/10 hover:text-white"
            aria-label={t('close')}
          />
        </div>

        {/* Main image area with swipe support */}
        <div
          className="relative flex flex-1 items-center justify-center overflow-hidden"
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="relative h-full w-full"
            >
              <Image
                src={images[currentIndex] ?? ''}
                alt={`${title} - ${currentIndex + 1}`}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            </motion.div>
          </AnimatePresence>

          {/* Previous button (logical start positioning for RTL) */}
          {currentIndex > 0 && (
            <button
              type="button"
              onClick={goPrev}
              className="absolute start-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white/80 transition-colors hover:bg-black/70 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label={t('previous')}
            >
              <ChevronLeft size={24} className="rtl:rotate-180" />
            </button>
          )}

          {/* Next button (logical end positioning for RTL) */}
          {currentIndex < images.length - 1 && (
            <button
              type="button"
              onClick={goNext}
              className="absolute end-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white/80 transition-colors hover:bg-black/70 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label={t('next')}
            >
              <ChevronRight size={24} className="rtl:rotate-180" />
            </button>
          )}
        </div>

        {/* Thumbnail strip */}
        {images.length > 1 && (
          <div className="flex justify-center gap-2 overflow-x-auto px-4 py-3">
            {images.map((url, index) => (
              <button
                key={url}
                type="button"
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                }}
                className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                  index === currentIndex
                    ? 'border-white'
                    : 'border-transparent opacity-50 hover:opacity-80'
                }`}
                aria-label={`${title} ${index + 1}`}
              >
                <Image
                  src={url}
                  alt={`${title} ${index + 1}`}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
