'use client';

import { useRouter } from 'next/navigation';

import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useDeleteListing() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (listingId: string) => {
      const response = await fetch(`/api/listings/${listingId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = (await response.json()) as { error?: string };
        throw new Error(error.error ?? 'Failed to delete listing');
      }

      return response.json() as Promise<{ success: boolean }>;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['listings'] });
      router.refresh();
    },
  });
}
