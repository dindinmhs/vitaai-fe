// filepath: c:\Users\Dindin\Documents\code\vitaai-fe\components\chat\sidebar.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "components/common/logo";
import { DropDown } from "components/common/dropdown";
import { BsThreeDots } from "react-icons/bs";
import { MdDelete, MdEdit, MdLogout, MdSettings } from "react-icons/md";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";

export const SideBar = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [hoveredChat, setHoveredChat] = useState<number | null>(null);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [openProfileDropdown, setOpenProfileDropdown] = useState(false);

  // Data dummy untuk riwayat obrolan
  const chatHistory = [
    { id: 1, title: "Cara membuat website", timestamp: "2 jam lalu", preview: "Bagaimana cara membuat website dengan React?" },
    { id: 2, title: "Tips belajar programming", timestamp: "1 hari lalu", preview: "Apa tips terbaik untuk belajar programming?" },
    { id: 3, title: "Perbedaan Frontend vs Backend", timestamp: "2 hari lalu", preview: "Jelaskan perbedaan frontend dan backend" },
    { id: 4, title: "Database untuk pemula", timestamp: "3 hari lalu", preview: "Rekomendasi database untuk pemula" },
    { id: 5, title: "API REST vs GraphQL", timestamp: "1 minggu lalu", preview: "Kapan menggunakan REST vs GraphQL?" },
    { id: 6, title: "API REST vs GraphQL", timestamp: "1 minggu lalu", preview: "Kapan menggunakan REST vs GraphQL?" },
    { id: 7, title: "API REST vs GraphQL", timestamp: "1 minggu lalu", preview: "Kapan menggunakan REST vs GraphQL?" },
  ];

  const user = {
    name: "John Doe",
    email: "john@example.com",
    avatar: "JD"
  };

  return (
    <motion.div
      initial={{ width: 280 }}
      animate={{ width: isExpanded ? 280 : 80 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="bg-white text-gray-800 h-screen flex flex-col border-r border-gray-200 shadow-sm"
    >
      {/* Header dengan tombol toggle */}
      <div className={`flex items-center p-3 border-b border-gray-200 ${isExpanded?"justify-between":"justify-center"}`}>
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex items-center"
            >
              <Logo variant="text"/>
            </motion.div>
          )}
        </AnimatePresence>
        
        <button
          onClick={() => setIsExpanded(!isExpanded)}
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

      {/* Tombol Obrolan Baru */}
      <div className="p-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
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

      {/* Riwayat Obrolan */}
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
            <motion.div
              key={chat.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1}}
              whileHover={{ backgroundColor: "rgba(243, 244, 246, 0.8)" }}
              className="px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors relative h-10"
              onMouseEnter={() => setHoveredChat(chat.id)}
              onMouseLeave={() => setHoveredChat(null)}
            >
              {isExpanded && (
                <div className="flex justify-between">
                  {/* Title Section */}
                  <div className="flex-1 min-w-0 pr-2">
                    <p className="text-sm font-medium truncate hover:text-gray-900 text-gray-700">
                      {chat.title}
                    </p>
                  </div>
                  
                  {/* Three dots menu - show on hover OR when dropdown is open */}
                  {(hoveredChat === chat.id || openDropdown === chat.id) && (
                    <div className="flex-shrink-0">
                      <DropDown
                        isOpen={openDropdown === chat.id}
                        onOpenChange={(isOpen) => {
                          setOpenDropdown(isOpen ? chat.id : null);
                        }}
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
                              setOpenDropdown(null);
                              // handleRename(chat.id);
                            }}
                            className="font-medium flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 transition-colors"
                          >
                            <MdEdit className="w-4 h-4" />
                            Rename
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenDropdown(null);
                              // handleDelete(chat.id);
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
      </div>

        {/* Profile Section */}
        <div className="border-t border-gray-200 p-4">
        <DropDown
            isOpen={openProfileDropdown}
            onOpenChange={setOpenProfileDropdown}
            trigger={
            <motion.div
                whileHover={{ backgroundColor: "rgba(243, 244, 246, 0.8)" }}
                className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors w-full"
            >
                <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center font-bold text-sm text-white">
                {user.avatar}
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
                    <p className="text-sm font-medium truncate text-gray-700">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
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
                        animate={{ rotate: openProfileDropdown ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        {openProfileDropdown ? (
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
                setOpenProfileDropdown(false);
                // handleSettings();
                }}
                className="font-medium flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-600 hover:bg-gray-100 transition-colors"
            >
                <MdSettings className="w-4 h-4" />
                Pengaturan
            </button>
            <button
                onClick={() => {
                setOpenProfileDropdown(false);
                // handleLogout();
                }}
                className="font-medium flex items-center gap-3 w-full px-4 py-3 text-sm text-red-400 hover:bg-red-50 transition-colors"
            >
                <MdLogout className="w-4 h-4" />
                Keluar
            </button>
            </div>
        </DropDown>
        </div>
    </motion.div>
  );
};