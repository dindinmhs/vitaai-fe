import { useState } from "react";
import { motion } from "framer-motion";
import { SidebarHeader } from "./sidebar/header";
import { NewChatButton } from "./sidebar/new-chat-button";
import { ChatHistory } from "./sidebar/chat-history";
import { ProfileSection } from "./sidebar/profile-section";
import { ProfileModal } from "../common/profile-modal";
import useAuthStore from "hooks/auth";
import { useNavigate } from "react-router";

export const SideBar = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [hoveredChat, setHoveredChat] = useState<number | null>(null);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [openProfileDropdown, setOpenProfileDropdown] = useState(false);
  const [search, setSearch] = useState("");
  const [showProfileModal, setShowProfileModal] = useState(false);

  const {clearUser} = useAuthStore()
  const navigate = useNavigate()

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

  // Filter chat berdasarkan search
  const filteredChatHistory = chatHistory.filter(
    (chat) =>
      chat.title.toLowerCase().includes(search.toLowerCase()) ||
      chat.preview.toLowerCase().includes(search.toLowerCase())
  );

  // User data - dalam implementasi nyata, ini akan datang dari context/props
  const [userData, setUserData] = useState({
    name: "John Doe",
    email: "john@example.com",
    avatar: "JD"
  });

  const handleNewChat = () => {
    console.log("Create new chat");
  };

  const handleRename = (id: number) => {
    console.log("Rename chat:", id);
  };

  const handleDelete = (id: number) => {
    console.log("Delete chat:", id);
  };

  const handleSettings = () => {
    setShowProfileModal(true);
  };

  const handleLogout = () => {
    clearUser()
    navigate("/", {replace:true})
  };

  const handleUpdateProfile = (updatedUser: typeof userData) => {
    setUserData(updatedUser);
    // Dalam implementasi nyata, simpan ke context/server
    console.log("Profile updated:", updatedUser);
  };

  return (
    <motion.div
      initial={{ width: 280 }}
      animate={{ width: isExpanded ? 280 : 80 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="bg-white text-gray-800 h-screen flex flex-col border-r border-gray-200 shadow-sm"
    >
      <SidebarHeader 
        isExpanded={isExpanded} 
        onToggle={() => setIsExpanded(!isExpanded)} 
      />

      <NewChatButton 
        isExpanded={isExpanded} 
        onClick={handleNewChat} 
      />

      {/* Search chat */}
      {isExpanded && (
        <div className="px-4 pb-2">
          <input
            type="text"
            placeholder="Cari chat..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 mb-2 text-sm"
          />
        </div>
      )}

      <ChatHistory
        isExpanded={isExpanded}
        chatHistory={filteredChatHistory}
        hoveredChat={hoveredChat}
        openDropdown={openDropdown}
        onChatHover={setHoveredChat}
        onDropdownChange={setOpenDropdown}
        onRename={handleRename}
        onDelete={handleDelete}
      />

      <ProfileSection
        isExpanded={isExpanded}
        user={userData}
        isDropdownOpen={openProfileDropdown}
        onDropdownChange={setOpenProfileDropdown}
        onSettings={handleSettings}
        onLogout={handleLogout}
      />

      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        user={userData}
        onUpdateProfile={handleUpdateProfile}
      />
    </motion.div>
  );
};