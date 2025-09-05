import { useChat } from "hooks/chat";
import { useState, useRef, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa6";

interface PromptInputProps {
  conversationId?: string;
  isNewConversation?: boolean;
}

export const PromptInput = ({ conversationId, isNewConversation = false }: PromptInputProps) => {
    const [value, setValue] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const { sendMessage, isSubmitting } = useChat();

    const adjustHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            
            const scrollHeight = textarea.scrollHeight;
            
            const minHeight = 24; 
            const maxHeight = 192; 
            
            const newHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight);
            textarea.style.height = newHeight + 'px';
        }
    };

    useEffect(() => {
        adjustHeight();
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setValue(e.target.value);
    };

    const handleSubmit = async () => {
        if (value.trim() && !isSubmitting) {
            const messageContent = value.trim();
            setValue("");
            setTimeout(() => adjustHeight(), 0);

            try {
                await sendMessage(messageContent, conversationId, isNewConversation);
            } catch (error) {
                console.error('Failed to send message:', error);
                // Restore message on error
                setValue(messageContent);
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div className="flex flex-col bg-white border-2 border-gray-200 rounded-2xl p-2 focus-within:border-emerald-300 transition-colors">
            <textarea
                ref={textareaRef}
                value={value}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder={conversationId ? "Ketik balasan Anda..." : "Ketik pesan Anda di sini..."}
                disabled={isSubmitting}
                className="w-full resize-none border-none outline-none p-2 text-sm leading-6 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent disabled:opacity-50"
                style={{
                    minHeight: '24px',
                    maxHeight: '192px',
                    height: '24px'
                }}
                rows={1}
            />
            <div className="flex justify-end mt-1">
                <button 
                    onClick={handleSubmit}
                    disabled={!value.trim() || isSubmitting}
                    className="p-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-full transition-colors"
                >
                    {isSubmitting ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                        <FaArrowUp color="white" className="w-4 h-4" />
                    )}
                </button>
            </div>
        </div>
    );
};