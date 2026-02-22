'use client';

import { useQuery } from '@tanstack/react-query';

import type { ListingCardData, ListingFilters } from '../types';

type ListingsResponse = {
  data: ListingCardData[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

function buildQueryString(filters: ListingFilters): string {
  const params = new URLSearchParams();

  if (filters.type) params.set('type', filters.type);
  if (filters.category) params.set('category', filters.category);
  if (filters.governorate) params.set('governorate', filters.governorate);
  if (filters.minPrice) params.set('minPrice', String(filters.minPrice));
  if (filters.maxPrice) params.set('maxPrice', String(filters.maxPrice));
  if (filters.rooms !== undefined) params.set('rooms', String(filters.rooms));
  if (filters.search) params.set('search', filters.search);
  if (filters.page) params.set('page', String(filters.page));
  if (filters.limit) params.set('limit', String(filters.limit));

  return params.toString();
}

export function useListings(filters: ListingFilters = {}) {
  return useQuery<ListingsResponse>({
    queryKey: ['listings', filters],
    queryFn: async () => {
      const qs = buildQueryString(filters);
      const response = await fetch(`/api/listings${qs ? `?${qs}` : ''}`);

      if (!response.ok) {
        throw new Error('Failed to fetch listings');
      }

      return response.json();
    },
  });
}
