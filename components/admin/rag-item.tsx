import { DropDown } from "components/common/dropdown";
import { motion } from "framer-motion";
import { BsThreeDots } from "react-icons/bs";
import { MdDelete, MdEdit } from "react-icons/md";

interface RagData {
  id: number;
  originalId: string;
  title: string;
  timestamp: string;
  preview: string;
  published: boolean;
}

interface RagItemProps {
  rag: RagData;
  index: number;
  isExpanded: boolean;
  isHovered: boolean;
  isDropdownOpen: boolean;
  isSelected: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onDropdownChange: (isOpen: boolean) => void;
  onRename?: (id: number) => void;
  onDelete?: (id: number) => void;
}

const RagItem = ({
  rag,
  index,
  isExpanded,
  isHovered,
  isDropdownOpen,
  isSelected,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onDropdownChange,
  onRename,
  onDelete
}: RagItemProps) => {
  return (
    <motion.div
      key={rag.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      whileHover={{ backgroundColor: "rgba(243, 244, 246, 0.8)" }}
      className={`px-3 py-2 rounded-lg cursor-pointer transition-colors relative ${
        isSelected 
          ? "bg-emerald-50 border border-emerald-200" 
          : "hover:bg-gray-100"
      }`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {isExpanded && (
        <div className="flex justify-between">
          {/* Title Section */}
          <div className="flex-1 min-w-0 pr-2">
            <p className={`text-sm font-medium truncate ${
              isSelected ? "text-emerald-700" : "text-gray-700 hover:text-gray-900"
            }`}>
              {rag.title}
            </p>
            <p className="text-xs text-gray-400 truncate">{rag.timestamp}</p>
            <p className="text-xs text-gray-500 truncate">{rag.preview}</p>
            {rag.published && (
              <span className="text-xs text-green-600 font-bold">Published</span>
            )}
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
                      onRename?.(rag.id);
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
                      onDelete?.(rag.id);
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

export default RagItem;
