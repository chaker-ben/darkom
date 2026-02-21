'use client';

import Image from 'next/image';
import { useCallback, useRef } from 'react';

import { Button } from '@darkom/ui';
import { ImagePlus, Trash2, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

type ImageUploaderProps = {
  images: string[];
  uploading: boolean;
  error: string | null;
  onUpload: (files: File[]) => void;
  onRemove: (index: number) => void;
};

export function ImageUploader({
  images,
  uploading,
  error,
  onUpload,
  onRemove,
}: ImageUploaderProps) {
  const t = useTranslations('listing.form');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList) return;
      const files = Array.from(fileList).filter((f) =>
        f.type.startsWith('image/'),
      );
      if (files.length > 0) {
        onUpload(files);
      }
    },
    [onUpload],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  return (
    <div>
      {/* Drop zone */}
      <div
        className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-neutral-200 p-8 transition-colors hover:border-primary-400 hover:bg-primary-50/30"
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        aria-label={t('uploadImages')}
      >
        {uploading ? (
          <Loader2 size={32} className="animate-spin text-primary-500" />
        ) : (
          <ImagePlus size={32} className="text-neutral-400" />
        )}
        <p className="mt-2 text-sm text-neutral-500">
          {uploading ? t('uploading') : t('dragOrClick')}
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {/* Error */}
      {error && <p className="mt-2 text-xs text-error-500">{error}</p>}

      {/* Preview grid */}
      {images.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
          {images.map((url, index) => (
            <div key={url} className="group relative aspect-square overflow-hidden rounded-lg">
              <Image
                src={url}
                alt={`${t('image')} ${index + 1}`}
                fill
                sizes="120px"
                className="object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute end-1 top-1 h-7 w-7 p-0 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(index);
                }}
                aria-label={t('removeImage')}
              >
                <Trash2 size={14} />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
