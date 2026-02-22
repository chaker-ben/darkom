'use client';

import Image from 'next/image';

import { Skeleton } from '@darkom/ui';
import { MessageSquare } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';

import { useConversations } from '../hooks/use-messages';

export function ConversationList() {
  const t = useTranslations('messages');
  const { data: conversations, isLoading } = useConversations();

  if (isLoading) {
    return (
      <div className="space-y-3 p-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-40" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!conversations || conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <MessageSquare size={40} className="mb-3 text-neutral-300" />
        <p className="font-medium text-neutral-500">{t('noMessages')}</p>
        <p className="mt-1 text-sm text-neutral-400">{t('noMessagesDesc')}</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-neutral-100">
      {conversations.map((conv) => {
        const timeAgo = formatRelativeTime(new Date(conv.lastMessage.createdAt));
        const preview =
          conv.lastMessage.content.length > 50
            ? conv.lastMessage.content.slice(0, 50) + '...'
            : conv.lastMessage.content;

        return (
          <Link
            key={conv.otherUser.id}
            href={`/messages/${conv.otherUser.id}`}
            className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-neutral-50"
          >
            {/* Avatar */}
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-neutral-100">
              {conv.otherUser.avatarUrl ? (
                <Image
                  src={conv.otherUser.avatarUrl}
                  alt={conv.otherUser.fullName ?? ''}
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm font-medium text-neutral-400">
                  {(conv.otherUser.fullName ?? '?').charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span
                  className={`truncate text-sm ${conv.unreadCount > 0 ? 'font-semibold text-neutral-900' : 'font-medium text-neutral-700'}`}
                >
                  {conv.otherUser.fullName ?? t('you')}
                </span>
                <span className="shrink-0 text-xs text-neutral-400">
                  {timeAgo}
                </span>
              </div>
              <p
                className={`truncate text-sm ${conv.unreadCount > 0 ? 'font-medium text-neutral-800' : 'text-neutral-500'}`}
              >
                {preview}
              </p>
            </div>

            {/* Unread indicator */}
            {conv.unreadCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-600 px-1.5 text-xs font-medium text-white">
                {conv.unreadCount}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffMins = Math.floor(diffMs / 60_000);
  const diffHours = Math.floor(diffMs / 3_600_000);
  const diffDays = Math.floor(diffMs / 86_400_000);

  if (diffMins < 1) return 'now';
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
}
