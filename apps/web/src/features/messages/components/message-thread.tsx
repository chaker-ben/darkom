'use client';

import { useEffect, useRef, useState } from 'react';

import Image from 'next/image';

import { Button, Input } from '@darkom/ui';
import { ArrowLeft, Loader2, Send } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';

import { useMarkRead, useMessages, useSendMessage } from '../hooks/use-messages';

import type { MessageDTO } from '../types';

type MessageThreadProps = {
  conversationUserId: string;
  currentUserId: string;
  otherUserName?: string;
  otherUserAvatar?: string;
};

export function MessageThread({
  conversationUserId,
  currentUserId,
  otherUserName,
  otherUserAvatar,
}: MessageThreadProps) {
  const t = useTranslations('messages');
  const { data: messages, isLoading } = useMessages(conversationUserId);
  const markRead = useMarkRead();
  const sendMessage = useSendMessage();
  const [content, setContent] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mark as read on mount and when new messages arrive
  useEffect(() => {
    if (conversationUserId) {
      markRead.mutate(conversationUserId);
    }
  }, [conversationUserId, messages?.length]); // markRead is a stable mutation

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    const trimmed = content.trim();
    if (!trimmed) return;

    sendMessage.mutate(
      { toId: conversationUserId, content: trimmed },
      {
        onSuccess: () => {
          setContent('');
          inputRef.current?.focus();
        },
      },
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-neutral-100 px-4 py-3">
        <Link
          href="/messages"
          className="rounded-lg p-1 text-neutral-500 hover:bg-neutral-100 md:hidden"
        >
          <ArrowLeft size={20} />
        </Link>
        <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full bg-neutral-100">
          {otherUserAvatar ? (
            <Image
              src={otherUserAvatar}
              alt={otherUserName ?? ''}
              fill
              sizes="32px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs font-medium text-neutral-400">
              {(otherUserName ?? '?').charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <span className="font-medium text-neutral-900">{otherUserName}</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto px-4 py-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 size={24} className="animate-spin text-neutral-400" />
          </div>
        ) : !messages || messages.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-sm text-neutral-400">{t('noMessages')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg: MessageDTO) => {
              const isMine = msg.fromId === currentUserId;
              return (
                <div
                  key={msg.id}
                  className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                      isMine
                        ? 'bg-primary-600 text-white'
                        : 'bg-neutral-100 text-neutral-900'
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">
                      {msg.content}
                    </p>
                    <p
                      className={`mt-1 text-end text-xs ${
                        isMine ? 'text-primary-200' : 'text-neutral-400'
                      }`}
                    >
                      {new Intl.DateTimeFormat(undefined, {
                        hour: '2-digit',
                        minute: '2-digit',
                      }).format(new Date(msg.createdAt))}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-neutral-100 px-4 py-3">
        <div className="flex items-center gap-2">
          <Input
            ref={inputRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('typeMessage')}
            className="flex-1"
            disabled={sendMessage.isPending}
          />
          <Button
            size="icon"
            onClick={handleSend}
            disabled={!content.trim() || sendMessage.isPending}
            aria-label={t('send')}
          >
            {sendMessage.isPending ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Send size={18} />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
