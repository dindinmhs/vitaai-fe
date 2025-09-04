import { ChatNew } from "components/chat/main-chat-new";
import { SideBar } from "components/chat/sidebar";

const Chat = () => {
    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <SideBar />
            <ChatNew/>
        </div>
    );
};

export default Chat;