import { useState, useEffect } from 'react';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import useAuthStore from './auth';
import apiClient from 'services/api-service';

// Conversation types
interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  _count: {
    messages: number;
  };
}

// Conversation Store - Global state
interface ConversationState {
  conversations: Conversation[];
  loading: boolean;
  error: string | null;
  setConversations: (conversations: Conversation[]) => void;
  addConversation: (conversation: Conversation) => void;
  updateConversation: (id: string, updates: Partial<Conversation>) => void;
  removeConversation: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearConversations: () => void;
}

const useConversationStore = create<ConversationState>()(
  subscribeWithSelector((set, get) => ({
    conversations: [],
    loading: false,
    error: null,
    setConversations: (conversations) => set({ conversations, error: null }),
    addConversation: (conversation) => {
      const current = get().conversations;
      set({ conversations: [conversation, ...current] });
    },
    updateConversation: (id, updates) => {
      const current = get().conversations;
      set({
        conversations: current.map(conv => 
          conv.id === id ? { ...conv, ...updates } : conv
        )
      });
    },
    removeConversation: (id) => {
      const current = get().conversations;
      set({ conversations: current.filter(conv => conv.id !== id) });
    },
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
    clearConversations: () => set({ conversations: [], error: null, loading: false }),
  }))
);

// Hook untuk fetch conversations
export const useConversations = () => {
  const { 
    conversations, 
    loading, 
    error, 
    setConversations, 
    addConversation,
    updateConversation,
    removeConversation,
    setLoading, 
    setError 
  } = useConversationStore();
  const { accessToken } = useAuthStore();

  const fetchConversations = async () => {
    if (!accessToken) {
      setError('No access token');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.get('/conversation');
      
      setConversations(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch conversations');
      console.error('Error fetching conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  const createConversation = async (title: string) => {
    if (!accessToken) {
      setError('No access token');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.post('/conversation', { title });
      
      addConversation(response.data);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create conversation');
      console.error('Error creating conversation:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const renameConversation = async (id: string, title: string) => {
    if (!accessToken) {
      setError('No access token');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.patch(`/conversation/${id}`, { title });
      
      updateConversation(id, response.data);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to rename conversation');
      console.error('Error renaming conversation:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteConversation = async (id: string) => {
    if (!accessToken) {
      setError('No access token');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      await apiClient.delete(`/conversation/${id}`);
      
      removeConversation(id);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete conversation');
      console.error('Error deleting conversation:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    conversations,
    loading,
    error,
    fetchConversations,
    createConversation,
    renameConversation,
    deleteConversation,
    refetch: fetchConversations,
  };
};

// Hook untuk auto-fetch conversations saat komponen mount
export const useAutoFetchConversations = () => {
  const { fetchConversations, conversations, loading, error } = useConversations();
  const { accessToken } = useAuthStore();
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    if (accessToken && !hasInitialized) {
      fetchConversations();
      setHasInitialized(true);
    }
  }, [accessToken, hasInitialized, fetchConversations]);

  return { conversations, loading, error, refetch: fetchConversations };
};

export default useConversationStore;