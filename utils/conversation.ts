import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  _count: {
    messages: number;
  };
}

export const formatConversationForUI = (conversations: Conversation[]) => {
  return conversations.map((conv, index) => ({
    id: conv.id,
    title: conv.title,
    timestamp: formatDistanceToNow(new Date(conv.updatedAt), { 
      addSuffix: true,
      locale: id 
    }),
    preview: `${conv._count.messages} pesan`,
    originalData: conv
  }));
};

export const generateChatPreview = (conversation: Conversation) => {
  const messageCount = conversation._count.messages;
  if (messageCount === 0) return 'Belum ada pesan';
  if (messageCount === 1) return '1 pesan';
  return `${messageCount} pesan`;
};