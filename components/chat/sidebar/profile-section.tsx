import { motion, AnimatePresence } from "framer-motion";
import { MdLogout, MdSettings } from "react-icons/md";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { DropDown } from "components/common/dropdown";

interface ProfileSectionProps {
  isExpanded: boolean;
  user: {
    name: string;
    email: string;
    avatar: string;
    imgUrl?: string;
  };
  isDropdownOpen: boolean;
  onDropdownChange: (isOpen: boolean) => void;
  onSettings?: () => void;
  onLogout?: () => void;
  loading?: boolean;
}

export const ProfileSection = ({
  isExpanded,
  user,
  isDropdownOpen,
  onDropdownChange,
  onSettings,
  onLogout,
  loading = false
}: ProfileSectionProps) => {
  return (
    <div className="border-t border-gray-200 p-4">
      <DropDown
        isOpen={isDropdownOpen}
        onOpenChange={onDropdownChange}
        trigger={
          <motion.div
            whileHover={{ backgroundColor: "rgba(243, 244, 246, 0.8)" }}
            className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors w-full"
          >
            {/* Avatar with image support */}
            <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center font-bold text-sm text-white overflow-hidden">
              {user.imgUrl ? (
                <img 
                  src={user.imgUrl} 
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                user.avatar
              )}
            </div>
            
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1 min-w-0"
                >
                  <p className={`text-sm font-medium truncate text-gray-700 ${loading ? 'animate-pulse' : ''}`}>
                    {user.name}
                  </p>
                  <p className={`text-xs text-gray-500 truncate ${loading ? 'animate-pulse' : ''}`}>
                    {user.email}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
            
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-1 hover:bg-gray-200 rounded transition-colors"
                >
                  <motion.div
                    animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isDropdownOpen ? (
                      <IoChevronUp className="w-4 h-4 text-gray-500" />
                    ) : (
                      <IoChevronDown className="w-4 h-4 text-gray-500" />
                    )}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        }
        otherStyles="w-48 -translate-y-36 mb-2"
      >
        <div>
          <button
            onClick={() => {
              onDropdownChange(false);
              onSettings?.();
            }}
            className="font-medium flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <MdSettings className="w-4 h-4" />
            Pengaturan
          </button>
          <button
            onClick={() => {
              onDropdownChange(false);
              onLogout?.();
            }}
            className="font-medium flex items-center gap-3 w-full px-4 py-3 text-sm text-red-400 hover:bg-red-50 transition-colors"
          >
            <MdLogout className="w-4 h-4" />
            Keluar
          </button>
        </div>
      </DropDown>
    </div>
  );
};