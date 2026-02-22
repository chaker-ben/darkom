'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { UpdateListingInput } from '../types/schemas';

export function useUpdateListing(listingId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateListingInput) => {
      const response = await fetch(`/api/listings/${listingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = (await response.json()) as { error?: string };
        throw new Error(error.error ?? 'Failed to update listing');
      }

      return response.json() as Promise<unknown>;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['listings'] });
    },
  });
}
