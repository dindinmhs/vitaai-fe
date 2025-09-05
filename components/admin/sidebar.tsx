import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { SidebarHeader } from "../chat/sidebar/header";
import { NewRagButton } from "./new-rag-button";
import { RagHistory } from "./rag-history";
import { ProfileSection } from "../chat/sidebar/profile-section";
import { AddRagModal } from "./add-rag-modal";
import { ProfileModal } from "../common/profile-modal";
import useAuthStore from "hooks/auth";

interface RagData {
  id: string;
  title: string;
  content: string;
  sourceUrl: string;
  createdAt: string;
  updatedAt: string;
  published: boolean;
}

interface AdminSidebarProps {
  data: RagData[];
  selectedId: string | null;
  onSelectItem: (id: string) => void;
  onAddRag: (sourceUrl: string) => void;
  onRename: (id: string) => void;
  onDelete: (id: string) => void;
}

const AdminSidebar = ({ data, selectedId, onSelectItem, onAddRag, onRename, onDelete }: AdminSidebarProps) => {
  const navigate = useNavigate();
  const { clearUser } = useAuthStore();
  const [isExpanded, setIsExpanded] = useState(true);
  const [hoveredChat, setHoveredChat] = useState<number | null>(null);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [openProfileDropdown, setOpenProfileDropdown] = useState(false);
  const [search, setSearch] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Debug: pastikan ada data minimum
  const defaultData = data.length > 0 ? data : [
    {
      id: "default-1",
      title: "Example RAG",
      content: "This is example content...",
      sourceUrl: "https://example.com",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      published: false
    }
  ];

  // User data - dalam implementasi nyata, ini akan datang dari context/props
  const [userData, setUserData] = useState({
    name: "Admin",
    email: "admin@vitaai.com",
    avatar: "AD"
  });

  // Transform RAG data untuk komponen ChatHistory (ubah string id ke number untuk kompatibilitas)
  const ragHistory = defaultData.map((item, index) => ({
    id: index + 1, // gunakan index sebagai id number
    originalId: item.id, // simpan id asli
    title: item.title,
    timestamp: new Date(item.createdAt).toLocaleDateString('id-ID'),
    preview: item.content,
    published: item.published
  }));

  // Filter RAG berdasarkan search
  const filteredRagHistory = ragHistory.filter(
    (item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.preview.toLowerCase().includes(search.toLowerCase())
  );

  const handleNewRag = () => {
    setShowAddModal(true);
  };

  const handleAddRagSubmit = (url: string) => {
    onAddRag(url);
  };

  const handleRename = (id: number) => {
    // Cari originalId berdasarkan id
    const ragItem = ragHistory.find(item => item.id === id);
    if (ragItem) {
      onRename(ragItem.originalId);
    }
  };

  const handleDelete = (id: number) => {
    // Cari originalId berdasarkan id
    const ragItem = ragHistory.find(item => item.id === id);
    if (ragItem) {
      onDelete(ragItem.originalId);
    }
  };

  const handleChatClick = (id: number) => {
    // Cari originalId berdasarkan id
    const ragItem = ragHistory.find(item => item.id === id);
    console.log("handleChatClick called with id:", id);
    console.log("Found ragItem:", ragItem);
    if (ragItem) {
      console.log("Calling onSelectItem with:", ragItem.originalId);
      onSelectItem(ragItem.originalId);
    }
  };

  const handleSettings = () => {
    setShowProfileModal(true);
  };

  const handleLogout = () => {
    // Clear user data dari store
    clearUser();
    // Redirect ke halaman login
    navigate('/', { replace: true });
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
      className="bg-white text-gray-800 h-screen flex flex-col border-r border-gray-200 shadow-sm min-w-[80px]"
      style={{ width: isExpanded ? 280 : 80 }}
    >
      <SidebarHeader 
        isExpanded={isExpanded} 
        onToggle={() => {
          console.log("Toggle clicked, current isExpanded:", isExpanded);
          setIsExpanded(!isExpanded);
        }} 
      />

      <NewRagButton 
        isExpanded={isExpanded} 
        onClick={handleNewRag} 
      />

      {isExpanded && (
        <div className="px-4 pb-2">
          <input
            type="text"
            placeholder="Cari RAG..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 mb-2 text-sm"
          />
        </div>
      )}

      <RagHistory
        isExpanded={isExpanded}
        ragHistory={filteredRagHistory}
        hoveredRag={hoveredChat}
        openDropdown={openDropdown}
        selectedId={selectedId}
        onRagHover={setHoveredChat}
        onDropdownChange={setOpenDropdown}
        onRagClick={handleChatClick}
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

      <AddRagModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddRagSubmit}
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

export default AdminSidebar;
