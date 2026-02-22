'use client';

import { useTranslations } from 'next-intl';

import { ConversationList } from './conversation-list';

type InboxLayoutProps = {
  children?: React.ReactNode;
};

export function InboxLayout({ children }: InboxLayoutProps) {
  const t = useTranslations('messages');

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold">{t('title')}</h1>
      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
        <div className="flex min-h-[500px]">
          {/* Conversation list - always visible on desktop, hidden when thread selected on mobile */}
          <div
            className={`w-full border-e border-neutral-100 md:w-80 ${children ? 'hidden md:block' : ''}`}
          >
            <div className="border-b border-neutral-100 px-4 py-3">
              <h2 className="text-sm font-semibold text-neutral-500">
                {t('inbox')}
              </h2>
            </div>
            <ConversationList />
          </div>

          {/* Thread area */}
          <div
            className={`flex-1 ${children ? '' : 'hidden md:flex md:items-center md:justify-center'}`}
          >
            {children ?? (
              <p className="text-sm text-neutral-400">{t('noMessagesDesc')}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
