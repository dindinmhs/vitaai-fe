import { useState } from "react";
import { motion } from "framer-motion";
import { SidebarHeader } from "./sidebar/header";
import { NewChatButton } from "./sidebar/new-chat-button";
import { ChatHistory } from "./sidebar/chat-history";
import { ProfileSection } from "./sidebar/profile-section";
import { ProfileModal } from "../common/profile-modal";
import { useNavigate, useParams } from "react-router";
import useAuthStore from "hooks/auth";
import { useAutoFetchUserProfile } from "hooks/user";
import { useAutoFetchConversations, useConversations } from "hooks/conversation";
import { formatConversationForUI } from "utils/conversation";
import useUserProfileStore from "hooks/user"; 

export const SideBar = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [hoveredChat, setHoveredChat] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openProfileDropdown, setOpenProfileDropdown] = useState(false);
  const [search, setSearch] = useState("");
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { conversationId } = useParams();

  const { clearUser } = useAuthStore();
  const navigate = useNavigate();
  
  // Auto-fetch user profile
  const { user: userProfile, loading: profileLoading } = useAutoFetchUserProfile();

  // Listen to profile store changes for real-time updates
  const profileStoreUser = useUserProfileStore(state => state.user);

  // Use store user if available, fallback to hook user
  const currentUser = profileStoreUser || userProfile;
  
  // Auto-fetch conversations
  const { conversations, loading: conversationsLoading } = useAutoFetchConversations();
  const { createConversation, renameConversation, deleteConversation } = useConversations();

  // Format conversations untuk UI
  const formattedConversations = formatConversationForUI(conversations);

  // Filter chat berdasarkan search
  const filteredChatHistory = formattedConversations.filter(
    (chat) =>
      chat.title.toLowerCase().includes(search.toLowerCase()) ||
      chat.preview.toLowerCase().includes(search.toLowerCase())
  );

  // Transform user data untuk komponen - FIX: Gunakan currentUser dan add null checks
  const userData = currentUser ? {
    name: currentUser.name || "User",
    email: currentUser.email || "email@example.com",
    avatar: currentUser.name ? currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase() : "U",
    imgUrl: currentUser.imgUrl
  } : {
    name: "Loading...",
    email: "Loading...",
    avatar: "L",
    imgUrl: undefined
  };

  const handleNewChat = async () => {
    try {
      navigate(`/chat`);
    } catch (error) {
      console.error("Failed to create new chat:", error);
    }
  };

  const handleRename = async (id: string) => {
    try {
      const newTitle = prompt('Enter new title:');
      if (newTitle && newTitle.trim()) {
        await renameConversation(id, newTitle.trim());
        console.log("Renamed chat:", id);
      }
    } catch (error) {
      console.error("Failed to rename chat:", error);
      alert('Failed to rename conversation');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const confirmDelete = confirm('Are you sure you want to delete this conversation?');
      if (!confirmDelete) return;

      setDeletingId(id);
      setOpenDropdown(null); // Close dropdown
      
      await deleteConversation(id);
      
      console.log("Deleted chat:", id);
      
      // If we're currently viewing the deleted conversation, navigate to new chat
      if (conversationId === id) {
        navigate('/chat', { replace: true });
      }
      
    } catch (error) {
      console.error("Failed to delete chat:", error);
      alert('Failed to delete conversation');
    } finally {
      setDeletingId(null);
    }
  };

  const handleSettings = () => {
    navigate("/profile");
  };

  const handleLogout = () => {
    clearUser();
    navigate("/", { replace: true });
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
            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 mb-2 text-sm"
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
        loading={conversationsLoading}
      />

      <ProfileSection
        isExpanded={isExpanded}
        user={userData}
        isDropdownOpen={openProfileDropdown}
        onDropdownChange={setOpenProfileDropdown}
        onSettings={handleSettings}
        onLogout={handleLogout}
        loading={profileLoading}
      />
    </motion.div>
  );
};