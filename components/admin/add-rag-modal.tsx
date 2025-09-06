import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AddRagModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (url: string) => void;
}

export const AddRagModal = ({ isOpen, onClose, onSubmit }: AddRagModalProps) => {
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onSubmit(url.trim());
      setUrl("");
      onClose();
    }
  };

  const handleClose = () => {
    setUrl("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="bg-white rounded-lg p-6 w-96 max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Masukkan URL sumber:
            </h3>
            
            <form onSubmit={handleSubmit}>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent mb-4"
                autoFocus
                required
              />
              
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors"
                >
                  OK
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
