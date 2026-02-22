'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useFavorites() {
  return useQuery<string[]>({
    queryKey: ['favorites'],
    queryFn: async () => {
      const response = await fetch('/api/favorites');
      if (!response.ok) {
        throw new Error('Failed to fetch favorites');
      }
      const json = await response.json();
      return json.data;
    },
  });
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (listingId: string) => {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId }),
      });
      if (!response.ok) {
        throw new Error('Failed to toggle favorite');
      }
      return response.json();
    },
    onMutate: async (listingId: string) => {
      await queryClient.cancelQueries({ queryKey: ['favorites'] });
      const previous = queryClient.getQueryData<string[]>(['favorites']);

      queryClient.setQueryData<string[]>(['favorites'], (old) => {
        if (!old) return [listingId];
        return old.includes(listingId)
          ? old.filter((id) => id !== listingId)
          : [...old, listingId];
      });

      return { previous };
    },
    onError: (_err, _listingId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['favorites'], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
}
