/// <reference types="@testing-library/jest-dom/vitest" />
import React from 'react';

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock('next/image', () => ({
  default: (props: Record<string, unknown>) => <img {...props} />,
}));

vi.mock('@/i18n/navigation', () => ({
  Link: ({
    children,
    ...props
  }: { children: React.ReactNode } & Record<string, unknown>) => (
    <a {...props}>{children}</a>
  ),
}));

vi.mock('@darkom/ui', () => ({
  Skeleton: ({ className }: { className?: string }) => (
    <div className={className} data-testid="skeleton" />
  ),
}));

const mockUseConversations = vi.fn();
vi.mock('../../hooks/use-messages', () => ({
  useConversations: () => mockUseConversations(),
}));

import { ConversationList } from '../conversation-list';

afterEach(cleanup);

describe('ConversationList', () => {
  it('renders loading skeletons', () => {
    mockUseConversations.mockReturnValue({ data: undefined, isLoading: true });
    render(<ConversationList />);
    expect(screen.getAllByTestId('skeleton').length).toBeGreaterThan(0);
  });

  it('renders empty state when no conversations', () => {
    mockUseConversations.mockReturnValue({ data: [], isLoading: false });
    render(<ConversationList />);
    expect(screen.getByText('noMessages')).toBeInTheDocument();
  });

  it('renders conversations with user name', () => {
    mockUseConversations.mockReturnValue({
      data: [
        {
          otherUser: { id: 'u1', fullName: 'Alice', avatarUrl: null },
          lastMessage: {
            id: 'm1',
            content: 'Hello there',
            createdAt: new Date(),
            fromId: 'u1',
          },
          unreadCount: 0,
        },
      ],
      isLoading: false,
    });
    render(<ConversationList />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Hello there')).toBeInTheDocument();
  });

  it('renders unread indicator when unreadCount > 0', () => {
    mockUseConversations.mockReturnValue({
      data: [
        {
          otherUser: { id: 'u1', fullName: 'Alice', avatarUrl: null },
          lastMessage: {
            id: 'm1',
            content: 'Hello there',
            createdAt: new Date(),
            fromId: 'u1',
          },
          unreadCount: 3,
        },
      ],
      isLoading: false,
    });
    render(<ConversationList />);
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('truncates long message preview', () => {
    const longMessage = 'A'.repeat(60);
    mockUseConversations.mockReturnValue({
      data: [
        {
          otherUser: { id: 'u1', fullName: 'Bob', avatarUrl: null },
          lastMessage: {
            id: 'm1',
            content: longMessage,
            createdAt: new Date(),
            fromId: 'u1',
          },
          unreadCount: 0,
        },
      ],
      isLoading: false,
    });
    render(<ConversationList />);
    expect(screen.getByText('A'.repeat(50) + '...')).toBeInTheDocument();
  });

  it('renders avatar image when avatarUrl is provided', () => {
    mockUseConversations.mockReturnValue({
      data: [
        {
          otherUser: {
            id: 'u1',
            fullName: 'Alice',
            avatarUrl: 'https://example.com/avatar.jpg',
          },
          lastMessage: {
            id: 'm1',
            content: 'Hi',
            createdAt: new Date(),
            fromId: 'u1',
          },
          unreadCount: 0,
        },
      ],
      isLoading: false,
    });
    render(<ConversationList />);
    const img = screen.getByAltText('Alice');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/avatar.jpg');
  });

  it('renders fallback initial when no avatar', () => {
    mockUseConversations.mockReturnValue({
      data: [
        {
          otherUser: { id: 'u1', fullName: 'Alice', avatarUrl: null },
          lastMessage: {
            id: 'm1',
            content: 'Hi',
            createdAt: new Date(),
            fromId: 'u1',
          },
          unreadCount: 0,
        },
      ],
      isLoading: false,
    });
    render(<ConversationList />);
    expect(screen.getByText('A')).toBeInTheDocument();
  });
});
