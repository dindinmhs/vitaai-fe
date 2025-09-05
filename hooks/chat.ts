import { useState } from 'react';
import { useNavigate } from 'react-router';
import useAuthStore from './auth';
import useConversationDetailStore from './conversation-detail';

export const useChat = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { accessToken } = useAuthStore();
  const navigate = useNavigate();
  
  const { 
    addMessage, 
    updateMessage, 
    updateMessageComplete,
    setConversation,
    updateConversationMeta,
    setStreaming,
    conversations 
  } = useConversationDetailStore();

  const sendMessage = async (
    message: string, 
    conversationId?: string, 
    isNewConversation: boolean = false
  ) => {
    if (!accessToken || !message.trim()) return;

    setIsSubmitting(true);
    
    try {
      const requestData = {
        question: message.trim(),
        conversationId: conversationId || undefined,
        isNewConversation
      };

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/conversation/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      
      if (contentType?.includes('text/event-stream')) {
        // Handle streaming response
        await handleStreamingResponse(response, conversationId);
      } else {
        // Handle regular JSON response
        const data = await response.json();
        handleJsonResponse(data, conversationId);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStreamingResponse = async (response: Response, currentConversationId?: string) => {
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    
    let actualConversationId = currentConversationId;
    let userMessage: any = null;
    let botMessageId: string | null = null;
    let botContent = '';

    if (!reader) throw new Error('Failed to get response reader');

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              switch (data.type) {
                case 'metadata':
                  // Handle conversation creation/update
                  actualConversationId = data.conversation.id;
                  
                  // Get existing conversation
                  const existingConversation = conversations[actualConversationId];
                  
                  if (existingConversation) {
                    // Update conversation metadata tanpa mengubah messages
                    updateConversationMeta(actualConversationId, {
                      title: data.conversation.title,
                      updatedAt: data.conversation.updatedAt
                    });
                  } else {
                    // Create new conversation
                    setConversation(actualConversationId, {
                      ...data.conversation,
                      messages: []
                    });
                  }
                  
                  // Add user message
                  userMessage = data.userMessage;
                  addMessage(actualConversationId, userMessage);

                  // Navigate to conversation if it's new
                  if (!currentConversationId) {
                    navigate(`/chat/${actualConversationId}`, { replace: true });
                  }

                  // Create placeholder bot message
                  botMessageId = `temp-${Date.now()}`;
                  const placeholderBotMessage = {
                    id: botMessageId,
                    content: '',
                    sender: 'BOT' as const,
                    createdAt: new Date().toISOString(),
                    sourceUrls: []
                  };
                  addMessage(actualConversationId, placeholderBotMessage);
                  setStreaming(actualConversationId, true);
                  break;

                // ...rest of the cases remain the same
                case 'content':
                  if (botMessageId && actualConversationId) {
                    botContent += data.text;
                    updateMessage(actualConversationId, botMessageId, botContent);
                  }
                  break;

                case 'bot_message':
                  if (botMessageId && actualConversationId) {
                    updateMessageComplete(actualConversationId, botMessageId, data.botMessage);
                    setStreaming(actualConversationId, false);
                  }
                  break;

                case 'end':
                  setStreaming(actualConversationId!, false);
                  break;
              }
            } catch (parseError) {
              console.error('Error parsing SSE data:', parseError);
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  };

  const handleJsonResponse = (data: any, conversationId?: string) => {
    const actualConversationId = data.conversation.id;
    
    // Preserve existing messages untuk conversation yang sudah ada
    const existingConversation = conversations[actualConversationId];
    const existingMessages = existingConversation?.messages || [];
    
    // Set conversation dengan preserve messages
    setConversation(actualConversationId, {
      ...data.conversation,
      messages: [...existingMessages, ...(data.messages || [])]
    });

    // Navigate if new conversation
    if (!conversationId) {
      navigate(`/chat/${actualConversationId}`, { replace: true });
    }

    // Add messages individually untuk better control
    data.messages?.forEach((message: any) => {
      // Check if message already exists to avoid duplicates
      const messageExists = existingMessages.some(m => m.id === message.id);
      if (!messageExists) {
        addMessage(actualConversationId, message);
      }
    });
  };

  return {
    sendMessage,
    isSubmitting
  };
};