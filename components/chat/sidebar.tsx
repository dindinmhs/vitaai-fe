import { useState } from "react";
import { motion } from "framer-motion";
import { SidebarHeader } from "./sidebar/header";
import { NewChatButton } from "./sidebar/new-chat-button";
import { ChatHistory } from "./sidebar/chat-history";
import { ProfileSection } from "./sidebar/profile-section";
import useAuthStore from "hooks/auth";
import { useNavigate } from "react-router";

export const SideBar = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [hoveredChat, setHoveredChat] = useState<number | null>(null);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [openProfileDropdown, setOpenProfileDropdown] = useState(false);

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

  const user = {
    name: "John Doe",
    email: "john@example.com",
    avatar: "JD"
  };

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
    console.log("Open settings");
  };

  const handleLogout = () => {
    clearUser()
    navigate("/", {replace:true})
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

      <ChatHistory
        isExpanded={isExpanded}
        chatHistory={chatHistory}
        hoveredChat={hoveredChat}
        openDropdown={openDropdown}
        onChatHover={setHoveredChat}
        onDropdownChange={setOpenDropdown}
        onRename={handleRename}
        onDelete={handleDelete}
      />

      <ProfileSection
        isExpanded={isExpanded}
        user={user}
        isDropdownOpen={openProfileDropdown}
        onDropdownChange={setOpenProfileDropdown}
        onSettings={handleSettings}
        onLogout={handleLogout}
      />
    </motion.div>
  );
};