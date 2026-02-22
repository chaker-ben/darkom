'use client';

import { useCallback, useState } from 'react';

type UploadState = {
  images: string[];
  uploading: boolean;
  error: string | null;
};

type CloudinarySignResponse = {
  signature: string;
  timestamp: number;
  folder: string;
  apiKey: string;
  cloudName: string;
};

export function useImageUpload(initialImages: string[] = [], maxImages = 20) {
  const [state, setState] = useState<UploadState>({
    images: initialImages,
    uploading: false,
    error: null,
  });

  const uploadFiles = useCallback(
    async (files: File[]) => {
      if (state.images.length + files.length > maxImages) {
        setState((prev) => ({
          ...prev,
          error: `Maximum ${maxImages} images allowed`,
        }));
        return;
      }

      setState((prev) => ({ ...prev, uploading: true, error: null }));

      try {
        const signResponse = await fetch('/api/upload', { method: 'POST' });
        if (!signResponse.ok) {
          throw new Error('Failed to get upload signature');
        }

        const { signature, timestamp, folder, apiKey, cloudName } =
          (await signResponse.json()) as CloudinarySignResponse;

        const uploadPromises = files.map(async (file) => {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('signature', signature);
          formData.append('timestamp', String(timestamp));
          formData.append('folder', folder);
          formData.append('api_key', apiKey);

          const res = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            { method: 'POST', body: formData },
          );

          if (!res.ok) {
            throw new Error('Upload failed');
          }

          const data = (await res.json()) as { secure_url: string };
          return data.secure_url;
        });

        const urls = await Promise.all(uploadPromises);

        setState((prev) => ({
          ...prev,
          images: [...prev.images, ...urls],
          uploading: false,
        }));
      } catch (error) {
        setState((prev) => ({
          ...prev,
          uploading: false,
          error: error instanceof Error ? error.message : 'Upload failed',
        }));
      }
    },
    [state.images.length, maxImages],
  );

  const removeImage = useCallback((index: number) => {
    setState((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  }, []);

  const setImages = useCallback((images: string[]) => {
    setState((prev) => ({ ...prev, images }));
  }, []);

  return {
    images: state.images,
    uploading: state.uploading,
    error: state.error,
    uploadFiles,
    removeImage,
    setImages,
  };
}
