import { SideBar } from "components/chat/sidebar";


const Chat = () => {
    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <SideBar />
            
            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
                {/* Chat Header */}
                <div className="bg-white border-b border-gray-200 p-4">
                    <h1 className="text-xl font-semibold text-gray-800">Vita AI Chat</h1>
                </div>
                
                {/* Chat Messages Area */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="max-w-4xl mx-auto">
                        {/* Welcome Message */}
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center font-bold text-white">
                                    V
                                </div>
                            </div>
                            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Selamat datang di Vita AI</h2>
                            <p className="text-gray-600">Mulai percakapan dengan mengetik pesan di bawah</p>
                        </div>
                    </div>
                </div>
                
                {/* Chat Input Area */}
                <div className="bg-white border-t border-gray-200 p-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex gap-3">
                            <div className="flex-1 relative">
                                <textarea
                                    placeholder="Ketik pesan Anda di sini..."
                                    className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    rows={1}
                                />
                            </div>
                            <button className="bg-emerald-500 hover:bg-emerald-600 text-white p-3 rounded-lg transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chat;