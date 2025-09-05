import { useState, useEffect } from 'react';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import useAuthStore from './auth';
import apiClient from 'services/api-service';


// Types
interface Message {
  id: string;
  content: string;
  sender: 'USER' | 'BOT';
  createdAt: string;
  updatedAt?: string;
  sourceUrls?: string[];
}

interface ConversationDetail {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
}

// Store for conversation details
interface ConversationDetailState {
  conversations: Record<string, ConversationDetail>;
  loading: Record<string, boolean>;
  error: Record<string, string | null>;
  streaming: Record<string, boolean>;
  setConversation: (id: string, conversation: ConversationDetail) => void;
  updateConversationMeta: (id: string, meta: Partial<ConversationDetail>) => void;
  setLoading: (id: string, loading: boolean) => void;
  setError: (id: string, error: string | null) => void;
  setStreaming: (id: string, streaming: boolean) => void;
  addMessage: (conversationId: string, message: Message) => void;
  updateMessage: (conversationId: string, messageId: string, content: string) => void;
  updateMessageComplete: (conversationId: string, messageId: string, message: Message) => void;
  clearConversation: (id: string) => void;
}

const useConversationDetailStore = create<ConversationDetailState>()(
  subscribeWithSelector((set, get) => ({
    conversations: {},
    loading: {},
    error: {},
    streaming: {},
    setConversation: (id, conversation) => {
      const state = get();
      set({
        conversations: { ...state.conversations, [id]: conversation },
        error: { ...state.error, [id]: null }
      });
    },
    updateConversationMeta: (id, meta) => {
      const state = get();
      const existingConversation = state.conversations[id];
      if (existingConversation) {
        set({
          conversations: {
            ...state.conversations,
            [id]: {
              ...existingConversation,
              ...meta
            }
          }
        });
      }
    },
    setLoading: (id, loading) => {
      const state = get();
      set({
        loading: { ...state.loading, [id]: loading }
      });
    },
    setError: (id, error) => {
      const state = get();
      set({
        error: { ...state.error, [id]: error }
      });
    },
    setStreaming: (id, streaming) => {
      const state = get();
      set({
        streaming: { ...state.streaming, [id]: streaming }
      });
    },
    addMessage: (conversationId, message) => {
      const state = get();
      const conversation = state.conversations[conversationId];
      if (conversation) {
        // Check for duplicate messages
        const messageExists = conversation.messages.some(m => m.id === message.id);
        if (!messageExists) {
          set({
            conversations: {
              ...state.conversations,
              [conversationId]: {
                ...conversation,
                messages: [...conversation.messages, message]
              }
            }
          });
        }
      }
    },
    updateMessage: (conversationId, messageId, content) => {
      const state = get();
      const conversation = state.conversations[conversationId];
      if (conversation) {
        const updatedMessages = conversation.messages.map(msg =>
          msg.id === messageId ? { ...msg, content } : msg
        );
        set({
          conversations: {
            ...state.conversations,
            [conversationId]: {
              ...conversation,
              messages: updatedMessages
            }
          }
        });
      }
    },
    updateMessageComplete: (conversationId, messageId, message) => {
      const state = get();
      const conversation = state.conversations[conversationId];
      if (conversation) {
        const updatedMessages = conversation.messages.map(msg =>
          msg.id === messageId ? message : msg
        );
        set({
          conversations: {
            ...state.conversations,
            [conversationId]: {
              ...conversation,
              messages: updatedMessages
            }
          }
        });
      }
    },
    clearConversation: (id) => {
      const state = get();
      const { [id]: removedConv, ...restConversations } = state.conversations;
      const { [id]: removedLoading, ...restLoading } = state.loading;
      const { [id]: removedError, ...restError } = state.error;
      const { [id]: removedStreaming, ...restStreaming } = state.streaming;
      set({
        conversations: restConversations,
        loading: restLoading,
        error: restError,
        streaming: restStreaming
      });
    },
  }))
);

// Hook untuk fetch conversation detail
export const useConversationDetail = (conversationId: string) => {
  const { 
    conversations, 
    loading, 
    error,
    streaming,
    setConversation, 
    setLoading, 
    setError 
  } = useConversationDetailStore();
  
  const { accessToken } = useAuthStore();

  const conversation = conversations[conversationId];
  const isLoading = loading[conversationId] || false;
  const isStreaming = streaming[conversationId] || false;
  const errorMessage = error[conversationId];

  const fetchConversation = async () => {
    if (!accessToken || !conversationId) {
      setError(conversationId, 'No access token or conversation ID');
      return;
    }

    try {
      setLoading(conversationId, true);
      setError(conversationId, null);
      
      const response = await apiClient.get(`/conversation/${conversationId}`);
      console.log('Conversation data:', response.data);
      
      setConversation(conversationId, response.data);
    } catch (err: any) {
      setError(conversationId, err.response?.data?.message || 'Failed to fetch conversation');
      console.error('Error fetching conversation:', err);
    } finally {
      setLoading(conversationId, false);
    }
  };

  return {
    conversation,
    loading: isLoading,
    streaming: isStreaming,
    error: errorMessage,
    fetchConversation,
    refetch: fetchConversation,
  };
};

// Hook untuk auto-fetch conversation saat komponen mount
export const useAutoFetchConversationDetail = (conversationId: string) => {
  const { fetchConversation, conversation, loading, error } = useConversationDetail(conversationId);
  const { accessToken } = useAuthStore();

  useEffect(() => {
    if (accessToken && conversationId) {
      console.log('Auto-fetching conversation:', conversationId);
      fetchConversation();
    }
  }, [accessToken, conversationId]);

  useEffect(() => {
    if (accessToken && conversationId && !conversation && !loading) {
      console.log('Conversation not found, fetching:', conversationId);
      fetchConversation();
    }
  }, [accessToken, conversationId, conversation, loading, fetchConversation]);

  return { conversation, loading, error, refetch: fetchConversation };
};

export default useConversationDetailStore;