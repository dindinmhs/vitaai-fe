import { DropDown } from "components/common/dropdown";
import { motion } from "framer-motion";
import { BsThreeDots } from "react-icons/bs";
import { MdDelete, MdEdit } from "react-icons/md";

interface ChatItemProps {
  chat: {
    id: number;
    title: string;
    timestamp: string;
    preview: string;
  };
  index: number;
  isExpanded: boolean;
  isHovered: boolean;
  isDropdownOpen: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onDropdownChange: (isOpen: boolean) => void;
  onRename?: (id: number) => void;
  onDelete?: (id: number) => void;
}

export const ChatItem = ({
  chat,
  index,
  isExpanded,
  isHovered,
  isDropdownOpen,
  onMouseEnter,
  onMouseLeave,
  onDropdownChange,
  onRename,
  onDelete
}: ChatItemProps) => {
  return (
    <motion.div
      key={chat.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      whileHover={{ backgroundColor: "rgba(243, 244, 246, 0.8)" }}
      className="px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors relative h-10"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {isExpanded && (
        <div className="flex justify-between">
          {/* Title Section */}
          <div className="flex-1 min-w-0 pr-2">
            <p className="text-sm font-medium truncate hover:text-gray-900 text-gray-700">
              {chat.title}
            </p>
          </div>
          
          {/* Three dots menu */}
          {(isHovered || isDropdownOpen) && (
            <div className="flex-shrink-0">
              <DropDown
                isOpen={isDropdownOpen}
                onOpenChange={onDropdownChange}
                trigger={
                  <div className="p-1 hover:bg-gray-200 rounded-full transition-colors">
                    <BsThreeDots className="w-4 h-4 text-gray-500" />
                  </div>
                }
                otherStyles="w-36 -translate-x-28"
              >
                <div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDropdownChange(false);
                      onRename?.(chat.id);
                    }}
                    className="font-medium flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    <MdEdit className="w-4 h-4" />
                    Rename
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDropdownChange(false);
                      onDelete?.(chat.id);
                    }}
                    className="font-medium flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-red-50 transition-colors"
                  >
                    <MdDelete className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </DropDown>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};