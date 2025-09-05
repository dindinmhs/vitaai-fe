import { SideBar } from "components/chat/sidebar";

interface ChatLayoutProps {
  children: React.ReactNode;
}

export const ChatLayout = ({ children }: ChatLayoutProps) => {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <SideBar />
      
      {/* Main Chat Content */}
      {children}
    </div>
  );
};