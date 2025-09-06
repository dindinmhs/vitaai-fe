import { useEffect, useRef } from "react";
import { PromptInput } from "./promt-input";
import { motion, AnimatePresence } from "framer-motion";
import { MessageBubble } from "./bubble";
import { useAutoFetchConversationDetail } from "hooks/conversation-detail";

interface ChatConversationProps {
  conversationId: string;
}

export const ChatConversation = ({ conversationId }: ChatConversationProps) => {
  const { conversation, loading, error } = useAutoFetchConversationDetail(conversationId);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new messages are added
  useEffect(() => {
    if (conversation?.messages?.length) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversation?.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="h-6 bg-gray-200 rounded animate-pulse mb-2 w-48"></div>
          <div className="h-4 bg-gray-100 rounded animate-pulse w-32"></div>
        </div>
        
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto mb-4"></div>
            <p className="text-gray-500">Memuat percakapan...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b border-gray-200 p-4">
          <h1 className="text-xl font-semibold text-gray-800">Error</h1>
        </div>
        
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Gagal Memuat Percakapan</h2>
            <p className="text-gray-600 mb-2">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b border-gray-200 p-4">
          <h1 className="text-xl font-semibold text-gray-800">Percakapan Tidak Ditemukan</h1>
        </div>
        
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Percakapan Tidak Ditemukan</h2>
            <p className="text-gray-600">Percakapan yang Anda cari tidak ditemukan atau telah dihapus.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">{conversation.title}</h1>
            <p className="text-sm text-gray-500">
              {conversation.messages?.length || 0} pesan
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={scrollToBottom}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              title="Scroll ke bawah"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <AnimatePresence>
            {conversation.messages && conversation.messages.length > 0 ? (
              <div className="space-y-1">
                {conversation.messages.map((message, index) => (
                  <MessageBubble 
                    key={message.id} 
                    message={message} 
                    index={index}
                  />
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center font-bold text-white">
                    V
                  </div>
                </div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">Mulai Percakapan</h2>
                <p className="text-gray-600">Belum ada pesan dalam percakapan ini. Mulai dengan mengetik pesan di bawah.</p>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Chat Input Area */}
      <div className="bg-transparent pb-4">
        <div className="max-w-5xl mx-auto bg-transparent">
          <PromptInput conversationId={conversationId} />
        </div>
      </div>
    </div>
  );
};