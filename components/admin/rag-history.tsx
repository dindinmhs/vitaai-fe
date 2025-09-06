import { motion, AnimatePresence } from "framer-motion";
import { DropDown } from "components/common/dropdown";
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

interface RagHistoryProps {
  isExpanded: boolean;
  ragHistory: RagData[];
  hoveredRag: number | null;
  openDropdown: number | null;
  selectedId: string | null;
  onRagHover: (id: number | null) => void;
  onDropdownChange: (ragId: number | null) => void;
  onRagClick: (id: number) => void;
  onRename?: (id: number) => void;
  onDelete?: (id: number) => void;
}

export const RagHistory = ({
  isExpanded,
  ragHistory,
  hoveredRag,
  openDropdown,
  selectedId,
  onRagHover,
  onDropdownChange,
  onRagClick,
  onRename,
  onDelete
}: RagHistoryProps) => {
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
            <h3 className="text-sm font-medium text-gray-500 mb-3">Riwayat RAG</h3>
          </motion.div>
        )}
      </AnimatePresence>

      {isExpanded && (
        <div className="px-2 space-y-1 overflow-y-auto h-full pb-20">
          {ragHistory.map((rag, index) => (
            <motion.div
              key={`${rag.id}-${selectedId}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ backgroundColor: "rgba(243, 244, 246, 0.8)" }}
              className={`px-3 py-2 rounded-lg cursor-pointer transition-colors relative ${
                selectedId === rag.originalId 
                  ? "bg-emerald-50 border border-emerald-200" 
                  : "hover:bg-gray-100"
              }`}
              onClick={() => {
                console.log("Rag item clicked, id:", rag.id, "originalId:", rag.originalId, "selectedId:", selectedId);
                onRagClick(rag.id);
              }}
              onMouseEnter={() => onRagHover(rag.id)}
              onMouseLeave={() => onRagHover(null)}
            >
              {isExpanded && (
                <div className="flex justify-between">
                  {/* Title Section */}
                  <div className="flex-1 min-w-0 pr-2">
                    <p className={`text-sm font-medium truncate ${
                      selectedId === rag.originalId ? "text-emerald-700" : "text-gray-700 hover:text-gray-900"
                    }`}>
                      {rag.title}
                    </p>
                  </div>
                  
                  {/* Three dots menu */}
                  {(hoveredRag === rag.id || openDropdown === rag.id) && (
                    <div className="flex-shrink-0">
                      <DropDown
                        isOpen={openDropdown === rag.id}
                        onOpenChange={(isOpen: boolean) => onDropdownChange(isOpen ? rag.id : null)}
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
                              onDropdownChange(null);
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
                              onDropdownChange(null);
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
          ))}
        </div>
      )}
    </div>
  );
};
