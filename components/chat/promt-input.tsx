import { useState, useRef, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa6";

export const PromptInput = () => {
    const [value, setValue] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

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

    const handleSubmit = () => {
        if (value.trim()) {
            console.log("Sending message:", value);
            setValue("");
            // Reset height after clearing
            setTimeout(() => adjustHeight(), 0);
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
                placeholder="Ketik pesan Anda di sini..."
                className="w-full resize-none border-none outline-none p-2 text-sm leading-6 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
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
                    disabled={!value.trim()}
                    className="p-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-full transition-colors"
                >
                    <FaArrowUp color="white" className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};