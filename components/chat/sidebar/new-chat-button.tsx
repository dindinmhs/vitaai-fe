import { motion, AnimatePresence } from "framer-motion";

interface NewChatButtonProps {
  isExpanded: boolean;
  onClick?: () => void;
}

export const NewChatButton = ({ isExpanded, onClick }: NewChatButtonProps) => {
  return (
    <div className="p-4">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg p-3 flex items-center gap-3 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        <AnimatePresence>
          {isExpanded && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="font-medium"
            >
              Obrolan Baru
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};