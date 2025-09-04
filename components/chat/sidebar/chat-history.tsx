import { motion, AnimatePresence } from "framer-motion";
import { ChatItem } from "./chat-item";

interface ChatHistoryProps {
  isExpanded: boolean;
  chatHistory: Array<{
    id: number;
    title: string;
    timestamp: string;
    preview: string;
  }>;
  hoveredChat: number | null;
  openDropdown: number | null;
  onChatHover: (id: number | null) => void;
  onDropdownChange: (chatId: number | null) => void;
  onRename?: (id: number) => void;
  onDelete?: (id: number) => void;
}

export const ChatHistory = ({
  isExpanded,
  chatHistory,
  hoveredChat,
  openDropdown,
  onChatHover,
  onDropdownChange,
  onRename,
  onDelete
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
        {chatHistory.map((chat, index) => (
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