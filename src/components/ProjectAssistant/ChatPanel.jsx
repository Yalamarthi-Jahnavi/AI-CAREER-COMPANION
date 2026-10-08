import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { clsx } from 'clsx'
import {
  X, Send, Bot, User, Trash2, Sparkles,
  Bug, HelpCircle, Building2, Lightbulb,
  TestTube2, Rocket, Camera, Copy, Check,
  Loader2, Maximize2, Minimize2,
} from 'lucide-react'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { useProjectAssistantStore } from '../../store/useProjectAssistantStore'
import { generateChatResponse } from '../../api/projectAssistantApi'

const QUICK_ACTIONS = [
  { id: 'debug', label: 'Debug Code', icon: Bug, prompt: 'How do I systematically debug an issue in my project?' },
  { id: 'error', label: 'Explain Error', icon: HelpCircle, prompt: 'Explain this error: TypeError: Cannot read properties of undefined' },
  { id: 'arch', label: 'Architecture Suggestions', icon: Building2, prompt: "What's the recommended architecture and folder structure for my project?" },
  { id: 'impl', label: 'Implementation Guidance', icon: Lightbulb, prompt: 'How do I implement secure authentication and state management?' },
  { id: 'test', label: 'Testing Suggestions', icon: TestTube2, prompt: 'What testing strategy, tools, and coverage targets should I use?' },
  { id: 'deploy', label: 'Deployment Help', icon: Rocket, prompt: 'How do I set up a production CI/CD pipeline and host my app?' },
]

export function ChatPanel() {
  const {
    chatOpen,
    setChatOpen,
    messages,
    addMessage,
    clearMessages,
    chatLoading,
    setChatLoading,
    inputs,
    setActiveTab,
  } = useProjectAssistantStore()

  const [input, setInput] = useState('')
  const [copiedIndex, setCopiedIndex] = useState(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (chatOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 150)
    }
  }, [chatOpen])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, chatLoading])

  // Welcome message if thread is empty
  useEffect(() => {
    if (messages.length === 0 && chatOpen) {
      addMessage({
        id: 'welcome',
        role: 'assistant',
        text: `👋 **Hi! I'm your Project AI Assistant.**\n\nI can help you build **${inputs.projectName || 'your project'}** successfully:\n\n• **Code debugging** & syntax checks\n• **Error explanations** with actionable fixes\n• **Architecture & folder design** recommendations\n• **Step-by-step implementation** guidance\n• **Testing strategies** & unit test examples\n• **Deployment & CI/CD** launch assistance\n• **Screenshot analysis** for visual or console errors\n\nChoose a quick topic below or type any technical question!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      })
    }
  }, [chatOpen, messages.length, inputs.projectName, addMessage])

  const handleSend = async (messageText = input) => {
    const trimmed = messageText.trim()
    if (!trimmed || chatLoading) return

    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    addMessage(userMsg)
    setInput('')
    setChatLoading(true)

    try {
      const response = await generateChatResponse(trimmed, inputs)
      const assistantMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: response.text,
        category: response.category,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      addMessage(assistantMsg)
    } catch (err) {
      addMessage({
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: 'Sorry, I encountered an issue processing your request. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      })
    } finally {
      setChatLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const handleOpenScreenshotTab = () => {
    setActiveTab('screenshot')
    setChatOpen(false)
  }

  // Render markdown-like text safely
  const renderMessageContent = (text) => {
    const lines = text.split('\n')
    let inCodeBlock = false
    let codeBuffer = []
    const elements = []

    lines.forEach((line, idx) => {
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          elements.push(
            <pre key={`code-${idx}`} className="bg-dark-bg/80 p-3 rounded-lg text-xs font-mono text-emerald-400 overflow-x-auto my-2 border border-dark-border">
              <code>{codeBuffer.join('\n')}</code>
            </pre>
          )
          codeBuffer = []
          inCodeBlock = false
        } else {
          inCodeBlock = true
        }
        return
      }

      if (inCodeBlock) {
        codeBuffer.push(line)
        return
      }

      if (line.startsWith('• ') || line.startsWith('- ')) {
        elements.push(
          <li key={idx} className="ml-4 list-disc text-sm text-dark-text-secondary leading-relaxed">
            {renderFormattedInline(line.replace(/^[-•]\s*/, ''))}
          </li>
        )
      } else if (/^\d+\.\s/.test(line)) {
        elements.push(
          <li key={idx} className="ml-4 list-decimal text-sm text-dark-text-secondary leading-relaxed">
            {renderFormattedInline(line.replace(/^\d+\.\s*/, ''))}
          </li>
        )
      } else if (line.trim() === '') {
        elements.push(<div key={idx} className="h-2" />)
      } else {
        elements.push(
          <p key={idx} className="text-sm text-dark-text-secondary leading-relaxed">
            {renderFormattedInline(line)}
          </p>
        )
      }
    })

    return elements
  }

  const renderFormattedInline = (str) => {
    const parts = str.split(/(\*\*.*?\*\*|`.*?`)/g)
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-semibold text-dark-text-primary">{part.slice(2, -2)}</strong>
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={i} className="px-1.5 py-0.5 rounded bg-dark-bg/80 text-brand-400 font-mono text-xs border border-dark-border">{part.slice(1, -1)}</code>
      }
      return part
    })
  }

  return (
    <AnimatePresence>
      {chatOpen && (
        <>
          {/* Mobile backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setChatOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />

          {/* Slide-out Drawer */}
          <motion.div
            initial={{ x: '100%', opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 26, stiffness: 280 }}
            className={clsx(
              'fixed top-0 right-0 bottom-0 z-50 flex flex-col',
              'bg-dark-card border-l border-dark-border shadow-2xl shadow-black/50',
              isExpanded ? 'w-full lg:w-[680px]' : 'w-full sm:w-[460px]'
            )}
          >
            {/* Header */}
            <div className="p-4 border-b border-dark-border flex items-center justify-between bg-dark-card/90 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-accent-600 flex items-center justify-center text-white shadow-lg shadow-brand-500/20">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-dark-text-primary">Project AI Assistant</h3>
                    <Badge variant="success" className="text-[10px] px-1.5 py-0.5">Online</Badge>
                  </div>
                  <p className="text-xs text-dark-text-muted truncate max-w-[200px]">
                    {inputs.projectName || 'Technical Q&A & Support'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="hidden sm:inline-flex p-1.5 rounded-lg text-dark-text-muted hover:text-dark-text-primary hover:bg-dark-bg/60 transition-colors"
                  title={isExpanded ? 'Collapse' : 'Expand width'}
                >
                  {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={clearMessages}
                  className="p-1.5 rounded-lg text-dark-text-muted hover:text-error-400 hover:bg-dark-bg/60 transition-colors"
                  title="Clear conversation"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setChatOpen(false)}
                  className="p-1.5 rounded-lg text-dark-text-muted hover:text-dark-text-primary hover:bg-dark-bg/60 transition-colors"
                  title="Close chat"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick action bar */}
            <div className="px-4 py-2.5 bg-dark-bg/40 border-b border-dark-border/60 overflow-x-auto scrollbar-none flex items-center gap-2">
              <span className="text-[11px] font-medium text-dark-text-muted whitespace-nowrap flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-brand-400" /> Prompts:
              </span>
              {QUICK_ACTIONS.map((action) => {
                const Icon = action.icon
                return (
                  <button
                    key={action.id}
                    type="button"
                    onClick={() => handleSend(action.prompt)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-dark-card border border-dark-border text-dark-text-secondary hover:text-brand-300 hover:border-brand-500/50 hover:bg-brand-500/10 transition-all whitespace-nowrap shadow-sm"
                  >
                    <Icon className="w-3 h-3 text-brand-400" />
                    <span>{action.label}</span>
                  </button>
                )
              })}
              <button
                type="button"
                onClick={handleOpenScreenshotTab}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-accent-500/10 border border-accent-500/30 text-accent-300 hover:bg-accent-500/20 transition-all whitespace-nowrap"
              >
                <Camera className="w-3 h-3 text-accent-400" />
                <span>Upload Screenshot</span>
              </button>
            </div>

            {/* Messages body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, index) => {
                const isUser = msg.role === 'user'
                return (
                  <motion.div
                    key={msg.id || index}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={clsx('flex gap-2.5', isUser ? 'justify-end' : 'justify-start')}
                  >
                    {!isUser && (
                      <div className="w-7 h-7 rounded-lg bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400 flex-shrink-0 mt-1">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}

                    <div
                      className={clsx(
                        'max-w-[85%] rounded-2xl p-3.5 shadow-sm text-sm relative group',
                        isUser
                          ? 'bg-brand-600 text-white rounded-br-xs'
                          : 'bg-dark-bg/90 border border-dark-border text-dark-text-primary rounded-bl-xs'
                      )}
                    >
                      {/* Message content */}
                      <div className="space-y-1">
                        {isUser ? (
                          <p className="whitespace-pre-wrap">{msg.text}</p>
                        ) : (
                          renderMessageContent(msg.text)
                        )}
                      </div>

                      {/* Footer: timestamp + copy button */}
                      <div
                        className={clsx(
                          'flex items-center justify-between gap-2 mt-2 pt-1 border-t text-[10px]',
                          isUser ? 'border-white/10 text-white/70' : 'border-dark-border/40 text-dark-text-muted'
                        )}
                      >
                        <span>{msg.timestamp || 'Just now'}</span>
                        {!isUser && (
                          <button
                            type="button"
                            onClick={() => handleCopy(msg.text, index)}
                            className="inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity hover:text-dark-text-primary"
                            title="Copy response"
                          >
                            {copiedIndex === index ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    {isUser && (
                      <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-white flex-shrink-0 mt-1">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </motion.div>
                )
              })}

              {chatLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2.5 items-center text-dark-text-muted text-xs"
                >
                  <div className="w-7 h-7 rounded-lg bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400">
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </div>
                  <div className="bg-dark-bg/80 border border-dark-border rounded-xl px-3 py-2 flex items-center gap-2">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span>AI Assistant is analyzing...</span>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Footer */}
            <div className="p-4 border-t border-dark-border bg-dark-card/90">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSend()
                }}
                className="flex items-end gap-2"
              >
                <div className="flex-1 relative">
                  <textarea
                    ref={inputRef}
                    rows={2}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask a technical question, paste an error, or ask for guidance..."
                    className={clsx(
                      'w-full resize-none rounded-xl px-3.5 py-2.5 text-xs sm:text-sm',
                      'bg-dark-bg border border-dark-border text-dark-text-primary placeholder:text-dark-text-muted',
                      'focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all'
                    )}
                  />
                  <div className="absolute right-2 bottom-2 text-[10px] text-dark-text-muted">
                    Press Enter ↵
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={!input.trim() || chatLoading}
                  className="h-10 px-4 rounded-xl flex-shrink-0"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
