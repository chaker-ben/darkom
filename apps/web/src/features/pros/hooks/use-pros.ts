'use client';

import { useQuery } from '@tanstack/react-query';

import type { ProCardData, ProDTO, ProFilters } from '../types';

type ProsResponse = {
  data: ProCardData[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

type ProResponse = {
  data: ProDTO;
};

function buildQueryString(filters: ProFilters): string {
  const params = new URLSearchParams();

  if (filters.category) params.set('category', filters.category);
  if (filters.governorate) params.set('governorate', filters.governorate);
  if (filters.search) params.set('search', filters.search);
  if (filters.page) params.set('page', String(filters.page));
  if (filters.limit) params.set('limit', String(filters.limit));

  return params.toString();
}

export function usePros(filters: ProFilters = {}) {
  return useQuery<ProsResponse>({
    queryKey: ['pros', filters],
    queryFn: async () => {
      const qs = buildQueryString(filters);
      const response = await fetch(`/api/pros${qs ? `?${qs}` : ''}`);

      if (!response.ok) {
        throw new Error('Failed to fetch pros');
      }

      return response.json();
    },
  });
}

export function usePro(id: string) {
  return useQuery<ProResponse>({
    queryKey: ['pro', id],
    queryFn: async () => {
      const response = await fetch(`/api/pros/${id}`);

      if (!response.ok) {
        throw new Error('Failed to fetch pro');
      }

      return response.json();
    },
    enabled: !!id,
  });
}
