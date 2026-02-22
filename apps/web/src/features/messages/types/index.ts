/** Conversation summary for inbox list */
export type ConversationDTO = {
  otherUser: {
    id: string;
    fullName: string | null;
    avatarUrl: string | null;
  };
  lastMessage: {
    id: string;
    content: string;
    createdAt: Date;
    fromId: string;
  };
  unreadCount: number;
};

/** Single message in a thread */
export type MessageDTO = {
  id: string;
  fromId: string;
  toId: string;
  listingId: string | null;
  content: string;
  read: boolean;
  createdAt: Date;
};
