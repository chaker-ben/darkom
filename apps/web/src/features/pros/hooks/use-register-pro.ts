'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { CreateProInput } from '../types/schemas';

export function useRegisterPro() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateProInput) => {
      const response = await fetch('/api/pros', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error: { error?: string } = await response.json();
        throw new Error(error.error ?? 'Failed to register');
      }

      return response.json() as Promise<unknown>;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['pros'] });
    },
  });
}
