import { Logo } from "components/common/logo";
import { motion, AnimatePresence } from "framer-motion";

interface SidebarHeaderProps {
  isExpanded: boolean;
  onToggle: () => void;
}

export const SidebarHeader = ({ isExpanded, onToggle }: SidebarHeaderProps) => {
  return (
    <div className={`flex items-center p-3 border-b border-gray-200 ${isExpanded ? "justify-between" : "justify-center"}`}>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="flex items-center"
          >
            <Logo variant="text" />
          </motion.div>
        )}
      </AnimatePresence>
      
      <button
        onClick={onToggle}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <motion.svg
          animate={{ rotate: isExpanded ? 0 : 180 }}
          transition={{ duration: 0.3 }}
          className="w-5 h-5 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
        </motion.svg>
      </button>
    </div>
  );
};