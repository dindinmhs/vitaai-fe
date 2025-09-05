import { ChatConversation } from "components/chat/conversation";
import useAuthStore from "hooks/auth";
import { ChatLayout } from "layouts/chat";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";

const ChatWithConversation = () => {
    const { userRole, accessToken } = useAuthStore();
    const navigate = useNavigate();
    const { conversationId } = useParams<{ conversationId: string }>();

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

    // Jika tidak ada conversationId, redirect ke chat baru
    if (!conversationId) {
        navigate("/chat", { replace: true });
        return null;
    }

    return (
        <ChatLayout>
            <ChatConversation conversationId={conversationId} />
        </ChatLayout>
    );
};

export default ChatWithConversation;