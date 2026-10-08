import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Send,
  Bot,
  User,
  Sparkles,
  Bug,
  Cpu,
  Terminal,
  Paperclip,
  Trash2,
} from 'lucide-react'
import { Button } from '../ui/Button'
import { useProjectAssistantStore } from '../../store/useProjectAssistantStore'

export function TechChat() {
  const {
    chatMessages,
    isChatOpen,
    isThinking,
    closeChat,
    toggleChat,
    sendChatMessage,
  } = useProjectAssistantStore()

  const [input, setInput] = useState('')
  const [selectedImage, setSelectedImage] = useState(null)
  const fileInputRef = useRef(null)
  const chatBottomRef = useRef(null)

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSend = (e) => {
    e?.preventDefault()
    if (!input.trim() && !selectedImage) return

    sendChatMessage(input, selectedImage)
    setInput('')
    setSelectedImage(null)

    setTimeout(() => {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const quickPrompts = [
    { label: '🐛 Debug Code Error', icon: Bug, text: 'Help me debug this runtime error I encountered during development...' },
    { label: '🏗️ Architecture Help', icon: Cpu, text: 'How should I structure the database models and service layers for scalability?' },
    { label: '🧪 Testing Advice', icon: Terminal, text: 'What test cases should I write for my API authentication routes?' },
  ]

  return (
    <div className="font-sans">
      {/* Floating Launcher Button if Closed */}
      {!isChatOpen && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={toggleChat}
          className="fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-xl hover:shadow-2xl transition-all flex items-center gap-2.5 font-bold text-sm"
        >
          <Bot className="w-5 h-5" />
          <span>Ask Technical AI</span>
        </motion.button>
      )}

      {/* Floating Panel if Open */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-4 right-4 z-50 w-full max-w-lg h-[620px] bg-white border border-slate-200/90 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-800"
          >
            {/* Panel Header */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                    Technical AI Assistant
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Debugging, Architecture & Screenshot Analysis
                  </p>
                </div>
              </div>
              <button
                onClick={closeChat}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs bg-slate-50/40">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'assistant' && (
                    <div className="w-7 h-7 rounded-lg bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 shrink-0 mt-1">
                      <Sparkles className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl p-4 space-y-2 leading-relaxed text-xs ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-xs'
                    }`}
                  >
                    {/* Render image if user uploaded screenshot */}
                    {msg.image && (
                      <div className="mb-2 rounded-xl overflow-hidden border border-slate-200">
                        <img src={msg.image} alt="Uploaded screenshot" className="w-full max-h-48 object-cover" />
                        <span className="block text-[10px] text-slate-500 p-1.5 bg-slate-100 font-medium">
                          📸 Uploaded Screenshot
                        </span>
                      </div>
                    )}

                    <div className="whitespace-pre-wrap font-sans">{msg.text}</div>
                    <span className={`block text-[10px] text-right ${msg.sender === 'user' ? 'text-blue-100' : 'text-slate-400'}`}>
                      {msg.timestamp}
                    </span>
                  </div>

                  {msg.sender === 'user' && (
                    <div className="w-7 h-7 rounded-lg bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 shrink-0 mt-1">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}

              {isThinking && (
                <div className="flex gap-2.5 justify-start">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 shrink-0">
                    <Sparkles className="w-4 h-4 animate-spin" />
                  </div>
                  <div className="bg-white border border-slate-200 text-slate-600 p-3 rounded-2xl text-xs flex items-center gap-2 shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" />
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.4s]" />
                    <span className="font-medium">Analyzing technical context & code...</span>
                  </div>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Quick Prompt Suggestions */}
            {chatMessages.length < 3 && (
              <div className="px-3 py-2 border-t border-slate-200/80 bg-white flex gap-2 overflow-x-auto scrollbar-none">
                {quickPrompts.map((qp, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setInput(qp.text)
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] font-semibold text-slate-700 whitespace-nowrap hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 transition-all shadow-xs"
                  >
                    <qp.icon className="w-3 h-3 text-blue-600" />
                    {qp.label}
                  </button>
                ))}
              </div>
            )}

            {/* Input Box */}
            <div className="p-3 bg-white border-t border-slate-200 space-y-2">
              {/* Selected Image Preview */}
              {selectedImage && (
                <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200">
                  <img src={selectedImage} alt="Preview" className="w-10 h-10 object-cover rounded-lg" />
                  <span className="text-xs text-slate-700 font-medium flex-1 truncate">Screenshot ready for analysis</span>
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="p-1 rounded-lg text-slate-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}

              <form onSubmit={handleSend} className="flex items-center gap-2">
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  title="Upload Screenshot"
                  className={`p-2.5 rounded-xl border transition-all ${
                    selectedImage
                      ? 'bg-blue-50 border-blue-500 text-blue-600'
                      : 'bg-slate-50 border-slate-300 text-slate-600 hover:text-slate-900 hover:border-slate-400'
                  }`}
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask code, error explanation, or upload screenshot..."
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all flex-1 shadow-xs"
                />

                <Button
                  type="submit"
                  size="sm"
                  disabled={!input.trim() && !selectedImage}
                  icon={<Send className="w-4 h-4" />}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold shrink-0"
                />
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
