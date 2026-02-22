'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { ConversationDTO, MessageDTO } from '../types';
import type { SendMessageInput } from '../types/schemas';

export function useConversations() {
  return useQuery<ConversationDTO[]>({
    queryKey: ['conversations'],
    queryFn: async () => {
      const response = await fetch('/api/messages');
      if (!response.ok) {
        throw new Error('Failed to fetch conversations');
      }
      const json = await response.json();
      return json.data;
    },
    refetchInterval: 30_000,
  });
}

export function useMessages(userId: string) {
  return useQuery<MessageDTO[]>({
    queryKey: ['messages', userId],
    queryFn: async () => {
      const response = await fetch(`/api/messages/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
      const json = await response.json();
      return json.data;
    },
    refetchInterval: 10_000,
    enabled: Boolean(userId),
  });
}

export function useMarkRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const response = await fetch(`/api/messages/${userId}`, {
        method: 'PATCH',
      });
      if (!response.ok) {
        throw new Error('Failed to mark messages as read');
      }
      return response.json();
    },
    onSuccess: (_data, userId) => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      queryClient.invalidateQueries({ queryKey: ['messages', userId] });
    },
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: SendMessageInput) => {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      return response.json();
    },
    onSuccess: (_data, input) => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      queryClient.invalidateQueries({ queryKey: ['messages', input.toId] });
    },
  });
}
