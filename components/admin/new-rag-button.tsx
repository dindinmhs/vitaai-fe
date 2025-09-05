import { motion, AnimatePresence } from "framer-motion";

interface NewRagButtonProps {
  isExpanded: boolean;
  onClick?: () => void;
}

export const NewRagButton = ({ isExpanded, onClick }: NewRagButtonProps) => {
  return (
    <div className={`${isExpanded ? 'p-4' : 'px-2 py-4 flex justify-center'}`}>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={`${isExpanded ? 'w-full' : 'w-12 h-12'} bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg ${isExpanded ? 'p-3' : 'p-2'} flex items-center ${isExpanded ? 'gap-3' : 'justify-center'} transition-colors`}
      >
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        <AnimatePresence>
          {isExpanded && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="font-medium whitespace-nowrap"
            >
              Tambah RAG Baru
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};
