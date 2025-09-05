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
  updatedAt: string;
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
  setConversation: (id: string, conversation: ConversationDetail) => void;
  setLoading: (id: string, loading: boolean) => void;
  setError: (id: string, error: string | null) => void;
  clearConversation: (id: string) => void;
}

const useConversationDetailStore = create<ConversationDetailState>()(
  subscribeWithSelector((set, get) => ({
    conversations: {},
    loading: {},
    error: {},
    setConversation: (id, conversation) => {
      const state = get();
      set({
        conversations: { ...state.conversations, [id]: conversation },
        error: { ...state.error, [id]: null }
      });
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
    clearConversation: (id) => {
      const state = get();
      const { [id]: removedConv, ...restConversations } = state.conversations;
      const { [id]: removedLoading, ...restLoading } = state.loading;
      const { [id]: removedError, ...restError } = state.error;
      set({
        conversations: restConversations,
        loading: restLoading,
        error: restError
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
    setConversation, 
    setLoading, 
    setError 
  } = useConversationDetailStore();
  
  const { accessToken } = useAuthStore();

  const conversation = conversations[conversationId];
  const isLoading = loading[conversationId] || false;
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
    // Fetch immediately when we have accessToken and conversationId
    if (accessToken && conversationId) {
      console.log('Auto-fetching conversation:', conversationId);
      fetchConversation();
    }
  }, [accessToken, conversationId]); // Remove other dependencies to prevent infinite loops

  // Also fetch if conversation doesn't exist and we're not loading
  useEffect(() => {
    if (accessToken && conversationId && !conversation && !loading) {
      console.log('Conversation not found, fetching:', conversationId);
      fetchConversation();
    }
  }, [accessToken, conversationId, conversation, loading, fetchConversation]);

  return { conversation, loading, error, refetch: fetchConversation };
};

export default useConversationDetailStore;