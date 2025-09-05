import { motion, AnimatePresence } from "framer-motion";
import { ChatItem } from "./chat-item";

interface ChatHistoryProps {
  isExpanded: boolean;
  chatHistory: Array<{
    id: string;
    title: string;
    timestamp: string;
    preview: string;
  }>;
  hoveredChat: string | null;
  openDropdown: string | null;
  onChatHover: (id: string | null) => void;
  onDropdownChange: (chatId: string | null) => void;
  onRename?: (id: string) => void;
  onDelete?: (id: string) => void;
  loading?: boolean;
}

export const ChatHistory = ({
  isExpanded,
  chatHistory,
  hoveredChat,
  openDropdown,
  onChatHover,
  onDropdownChange,
  onRename,
  onDelete,
  loading = false
}: ChatHistoryProps) => {
  return (
    <div className="flex-1 overflow-hidden">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="px-4 pb-2"
          >
            <h3 className="text-sm font-medium text-gray-500 mb-3">Riwayat Obrolan</h3>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="px-2 space-y-1 overflow-y-auto h-full pb-20">
        {loading && isExpanded && (
          <div className="px-3 py-4 text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-500 mx-auto"></div>
            <p className="text-sm text-gray-500 mt-2">Memuat riwayat chat...</p>
          </div>
        )}
        
        {!loading && chatHistory.length === 0 && isExpanded && (
          <div className="px-3 py-4 text-center">
            <p className="text-sm text-gray-500">Belum ada riwayat chat</p>
          </div>
        )}

        {!loading && chatHistory.map((chat, index) => (
          <ChatItem
            key={chat.id}
            chat={chat}
            index={index}
            isExpanded={isExpanded}
            isHovered={hoveredChat === chat.id}
            isDropdownOpen={openDropdown === chat.id}
            onMouseEnter={() => onChatHover(chat.id)}
            onMouseLeave={() => onChatHover(null)}
            onDropdownChange={(isOpen) => onDropdownChange(isOpen ? chat.id : null)}
            onRename={onRename}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};