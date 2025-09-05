import { useEffect } from "react";
import { useNavigate } from "react-router";
import { ChatNew } from "components/chat/main-chat-new";
import { SideBar } from "components/chat/sidebar";
import useAuthStore from "../../hooks/auth";

const Chat = () => {
    const { userRole, accessToken } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        // Jika user adalah admin, redirect ke admin dashboard
        if (accessToken && userRole === "ADMIN") {
            navigate("/admin", { replace: true });
        }
    }, [accessToken, userRole, navigate]);

    // Jika admin, jangan render chat
    if (userRole === "ADMIN") {
        return null;
    }

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <SideBar />
            <ChatNew/>
        </div>
    );
};

export default Chat;