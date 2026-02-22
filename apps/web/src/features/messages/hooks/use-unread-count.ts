'use client';

import { useQuery } from '@tanstack/react-query';

export function useUnreadCount() {
  return useQuery<number>({
    queryKey: ['unread-count'],
    queryFn: async () => {
      const response = await fetch('/api/messages/unread');
      if (!response.ok) {
        throw new Error('Failed to fetch unread count');
      }
      const json = await response.json();
      return json.data.count;
    },
    refetchInterval: 30_000,
  });
}
