import { PromptInput } from "./promt-input";
import { motion } from "framer-motion";

export const ChatNew = () => {
    return (
        <div className="flex-1 flex flex-col bg-gray-50">
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4 shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-800">Vita AI Chat</h1>
                        <p className="text-sm text-gray-500">Mulai percakapan baru</p>
                    </div>
                </div>
            </div>
            
            {/* Welcome Content */}
            <div className="flex-1 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center max-w-2xl mx-auto px-6"
                >
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center font-bold text-white text-xl">
                            V
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Selamat datang di Vita AI</h2>
                    <p className="text-gray-600 text-lg mb-8">
                        Tanyakan apa saja tentang kesehatan dan dapatkan informasi yang akurat dari AI kami.
                    </p>
                    
                    {/* Example Questions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        <div className="bg-white p-4 rounded-lg border border-gray-200 hover:border-emerald-300 transition-colors">
                            <h3 className="font-semibold text-gray-800 mb-2">💊 Tentang Obat</h3>
                            <p className="text-sm text-gray-600">"Apa efek samping paracetamol?"</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-gray-200 hover:border-emerald-300 transition-colors">
                            <h3 className="font-semibold text-gray-800 mb-2">🩺 Gejala Penyakit</h3>
                            <p className="text-sm text-gray-600">"Saya merasa pusing dan mual"</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-gray-200 hover:border-emerald-300 transition-colors">
                            <h3 className="font-semibold text-gray-800 mb-2">🏃‍♂️ Tips Kesehatan</h3>
                            <p className="text-sm text-gray-600">"Bagaimana cara menjaga kesehatan jantung?"</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-gray-200 hover:border-emerald-300 transition-colors">
                            <h3 className="font-semibold text-gray-800 mb-2">🍎 Nutrisi</h3>
                            <p className="text-sm text-gray-600">"Makanan apa yang baik untuk diabetes?"</p>
                        </div>
                    </div>
                </motion.div>
            </div>
            
            {/* Chat Input Area */}
            <div className="bg-white border-t border-gray-200 p-4 shadow-sm">
                <div className="max-w-5xl mx-auto">
                    <PromptInput isNewConversation={true} />
                </div>
            </div>
        </div>
    );
};