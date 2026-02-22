import { redirect } from 'next/navigation';

import { auth } from '@clerk/nextjs/server';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { InboxLayout } from '@/features/messages/components/inbox-layout';
import { MessageThread } from '@/features/messages/components/message-thread';
import { prisma } from '@/lib/prisma';

import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'messages' });
  return { title: t('title') };
}

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ locale: string; userId: string }>;
}) {
  const { locale, userId: conversationUserId } = await params;
  setRequestLocale(locale);

  const { userId: clerkId } = await auth();
  if (!clerkId) {
    redirect(`/${locale}/sign-in`);
  }

  const [currentProfile, otherProfile] = await Promise.all([
    prisma.profile.findUnique({
      where: { clerkId },
      select: { id: true },
    }),
    prisma.profile.findUnique({
      where: { id: conversationUserId },
      select: { id: true, fullName: true, avatarUrl: true },
    }),
  ]);

  if (!currentProfile) {
    redirect(`/${locale}/sign-in`);
  }

  if (!otherProfile) {
    redirect(`/${locale}/messages`);
  }

  return (
    <InboxLayout>
      <MessageThread
        conversationUserId={conversationUserId}
        currentUserId={currentProfile.id}
        otherUserName={otherProfile.fullName ?? undefined}
        otherUserAvatar={otherProfile.avatarUrl ?? undefined}
      />
    </InboxLayout>
  );
}
