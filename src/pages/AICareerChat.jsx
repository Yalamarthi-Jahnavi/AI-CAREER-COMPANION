import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Bot,
  User,
  Send,
  Sparkles,
  RefreshCw,
  Download,
  Trash2,
  CheckCircle2,
  Calendar,
  Code2,
  Mail,
  AlertTriangle,
  History,
  HelpCircle,
  FolderKanban,
  FileScan,
  GitCompare,
  ArrowRightLeft,
  BookOpen,
  Map,
  Copy,
  Check,
  Zap,
  ShieldCheck,
  Layers,
  ChevronDown,
} from 'lucide-react'
import { useCareerAssistantStore } from '../store/useCareerAssistantStore'
import { useUserStore } from '../store/useUserStore'
import toast from 'react-hot-toast'

// Quick suggestion chips matching the user prompt requirements
const QUICK_PROMPTS = [
  {
    icon: Calendar,
    label: 'My deadline is tomorrow. Help me prioritize.',
    category: 'Deadlines',
    color: 'text-rose-700 bg-rose-50 border-rose-200 hover:border-rose-300 hover:bg-rose-100/70',
  },
  {
    icon: Zap,
    label: 'I have only one hour today. What technology should I practice?',
    category: 'Practice',
    color: 'text-amber-800 bg-amber-50 border-amber-200 hover:border-amber-300 hover:bg-amber-100/70',
  },
  {
    icon: Code2,
    label: 'My React test score is 62. What should I improve?',
    category: 'Assessment',
    color: 'text-sky-800 bg-sky-50 border-sky-200 hover:border-sky-300 hover:bg-sky-100/70',
  },
  {
    icon: HelpCircle,
    label: 'My teammate asked me this technical question. Give me a quick professional answer.',
    category: 'Communication',
    color: 'text-emerald-800 bg-emerald-50 border-emerald-200 hover:border-emerald-300 hover:bg-emerald-100/70',
  },
  {
    icon: Mail,
    label: 'Analyze this offer letter.',
    category: 'Offer Letters',
    color: 'text-indigo-800 bg-indigo-50 border-indigo-200 hover:border-indigo-300 hover:bg-indigo-100/70',
  },
  {
    icon: ShieldCheck,
    label: 'What questions should I ask HR?',
    category: 'HR & Negotiation',
    color: 'text-purple-800 bg-purple-50 border-purple-200 hover:border-purple-300 hover:bg-purple-100/70',
  },
  {
    icon: AlertTriangle,
    label: 'I am overwhelmed by work pressure. How do I manage it?',
    category: 'Workplace',
    color: 'text-orange-800 bg-orange-50 border-orange-200 hover:border-orange-300 hover:bg-orange-100/70',
  },
  {
    icon: ArrowRightLeft,
    label: 'How do I know if I am ready to switch jobs?',
    category: 'Career Planning',
    color: 'text-blue-800 bg-blue-50 border-blue-200 hover:border-blue-300 hover:bg-blue-100/70',
  },
]

// Icon mapper for dynamic action buttons inside responses
const ICON_MAP = {
  Calendar,
  Code2,
  Mail,
  AlertTriangle,
  History,
  HelpCircle,
  FolderKanban,
  FileScan,
  GitCompare,
  ArrowRightLeft,
  BookOpen,
  Map,
}

export function AICareerChat() {
  const {
    messages,
    isLoading,
    useContext,
    toggleContext,
    sendMessage,
    clearChat,
    exportChat,
  } = useCareerAssistantStore()

  const { user } = useUserStore()

  const [inputPrompt, setInputPrompt] = useState('')
  const [copiedId, setCopiedId] = useState(null)
  const [isContextDrawerOpen, setIsContextDrawerOpen] = useState(false)
  const chatBottomRef = useRef(null)
  const textareaRef = useRef(null)

  // Scroll to bottom on new messages
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const handleSend = async (e) => {
    if (e) e.preventDefault()
    if (!inputPrompt.trim() || isLoading) return
    const text = inputPrompt
    setInputPrompt('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
    await sendMessage(text)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleQuickPromptClick = (promptText) => {
    setInputPrompt(promptText)
    sendMessage(promptText)
  }

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    toast.success('Response copied to clipboard')
    setTimeout(() => setCopiedId(null), 2000)
  }

  // Format simple markdown output into structured HTML
  const renderFormattedMarkdown = (text) => {
    const lines = text.split('\n')
    return lines.map((line, idx) => {
      // H3
      if (line.startsWith('### ')) {
        return (
          <h3 key={idx} className="text-base font-bold text-slate-900 mt-3 mb-1.5 flex items-center gap-2">
            {line.replace('### ', '')}
          </h3>
        )
      }
      // H4
      if (line.startsWith('#### ')) {
        return (
          <h4 key={idx} className="text-xs font-bold text-indigo-700 uppercase tracking-wider mt-2.5 mb-1">
            {line.replace('#### ', '')}
          </h4>
        )
      }
      // Blockquote
      if (line.startsWith('> ')) {
        return (
          <div key={idx} className="border-l-2 border-indigo-400 bg-indigo-50/60 px-3.5 py-2 my-2 rounded-r text-sm text-slate-700 italic">
            {line.replace('> ', '')}
          </div>
        )
      }
      // Divider
      if (line.trim() === '---') {
        return <hr key={idx} className="border-slate-200 my-3" />
      }
      // Bullet list item
      if (line.startsWith('* ') || line.startsWith('- ')) {
        const bulletText = line.substring(2)
        return (
          <li key={idx} className="text-sm text-slate-700 ml-4 list-disc my-1 leading-relaxed">
            <span dangerouslySetInnerHTML={{ __html: formatBoldAndCode(bulletText) }} />
          </li>
        )
      }
      // Numbered list item
      if (/^\d+\.\s/.test(line)) {
        return (
          <p key={idx} className="text-sm text-slate-700 ml-2 my-1 leading-relaxed">
            <span dangerouslySetInnerHTML={{ __html: formatBoldAndCode(line) }} />
          </p>
        )
      }
      // Empty line
      if (!line.trim()) {
        return <div key={idx} className="h-1.5" />
      }
      // Default paragraph
      return (
        <p key={idx} className="text-sm text-slate-700 my-1 leading-relaxed">
          <span dangerouslySetInnerHTML={{ __html: formatBoldAndCode(line) }} />
        </p>
      )
    })
  }

  const formatBoldAndCode = (str) => {
    let res = str
    // Bold **text**
    res = res.replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-900 font-semibold">$1</strong>')
    // Inline code `code`
    res = res.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-slate-100 text-indigo-700 border border-slate-200 font-mono text-xs">$1</code>')
    // Link [text](url)
    res = res.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-blue-600 underline hover:text-blue-800 transition-colors font-medium">$1</a>')
    return res
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4.5rem)] bg-slate-50 text-slate-800 overflow-hidden">
      {/* ── Top Header ────────────────────────────────────────────── */}
      <header className="flex-shrink-0 border-b border-slate-200 bg-white/95 backdrop-blur-md px-6 py-4 flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900 tracking-tight">AI Career Assistant</h1>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                Unified Companion
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Personalized guidance for deadlines, learning, code questions, interviews & offers
            </p>
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-3">
          {/* User Context Toggle Button */}
          <button
            onClick={toggleContext}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              useContext
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100/70'
                : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
            }`}
            title="When active, the assistant references your practice scores, active projects, and deadlines."
          >
            <ShieldCheck className={`w-4 h-4 ${useContext ? 'text-emerald-600' : 'text-slate-500'}`} />
            <span>{useContext ? 'Context Synced' : 'Context Off'}</span>
            <span className={`w-2 h-2 rounded-full ${useContext ? 'bg-emerald-500' : 'bg-slate-400'}`} />
          </button>

          {/* Context Details Toggle */}
          {useContext && (
            <button
              onClick={() => setIsContextDrawerOpen(!isContextDrawerOpen)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-100 border border-slate-200 hover:bg-slate-200 text-xs text-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <Layers className="w-3.5 h-3.5 text-indigo-600" />
              <span>Workspace Data</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isContextDrawerOpen ? 'rotate-180' : ''}`} />
            </button>
          )}

          {/* Export Chat */}
          <button
            onClick={exportChat}
            className="p-2 rounded-lg bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
            title="Export conversation transcript"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Clear Chat */}
          <button
            onClick={clearChat}
            className="p-2 rounded-lg bg-slate-100 border border-slate-200 hover:bg-rose-50 hover:border-rose-200 text-slate-500 hover:text-rose-600 transition-colors"
            title="Reset conversation"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ── Context Drawer (Collapsible) ──────────────────────────── */}
      {useContext && isContextDrawerOpen && (
        <div className="bg-slate-100/90 border-b border-slate-200 px-6 py-3 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-3 animate-in slide-in-from-top duration-200">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5 text-slate-500">
              <span className="font-semibold text-slate-800">{user?.name || 'Alex Johnson'}</span>
              <span>({user?.role || 'Senior Software Engineer'})</span>
            </div>
            <span className="text-slate-300">•</span>
            <div className="flex items-center gap-1">
              <span className="text-slate-500">Target Goal:</span>
              <span className="text-indigo-700 font-medium">{user?.careerGoal || 'Staff Engineer'}</span>
            </div>
            <span className="text-slate-300">•</span>
            <div className="flex items-center gap-1">
              <span className="text-slate-500">Current Stack:</span>
              <span className="text-blue-700 font-medium">{user?.currentStack?.join(', ') || 'React, TypeScript, Node.js'}</span>
            </div>
          </div>
          <span className="text-[11px] text-emerald-700 font-mono font-medium">🔒 Private Client Context Active</span>
        </div>
      )}

      {/* ── Chat Messages Stream ──────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-6 scrollbar-thin scrollbar-thumb-white/10">
        {/* Quick Suggestion Chips Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            <span>Instant Question Accelerators</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {QUICK_PROMPTS.map((chip, idx) => {
              const Icon = chip.icon
              return (
                <button
                  key={idx}
                  onClick={() => handleQuickPromptClick(chip.label)}
                  className={`text-left p-3 rounded-xl border transition-all flex flex-col justify-between group ${chip.color}`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold tracking-wider uppercase opacity-80">{chip.category}</span>
                    <Icon className="w-3.5 h-3.5 opacity-70 group-hover:scale-110 transition-transform" />
                  </div>
                  <p className="text-xs font-medium text-slate-200 line-clamp-2">{chip.label}</p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Message Feed */}
        {messages.map((msg) => {
          const isUser = msg.sender === 'user'

          return (
            <div
              key={msg.id}
              className={`flex gap-3.5 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {/* Bot Avatar */}
              {!isUser && (
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center flex-shrink-0 mt-1 shadow-md shadow-brand-500/10">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}

              {/* Message Bubble Container */}
              <div className={`max-w-[85%] md:max-w-[78%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                {/* Meta Header */}
                <div className="flex items-center gap-2 mb-1 px-1 text-[11px] text-slate-400">
                  <span className="font-semibold text-slate-300">{isUser ? 'You' : 'AI Career Assistant'}</span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                  {msg.category && (
                    <span className="px-1.5 py-0.2 rounded bg-white/5 text-[10px] text-brand-300 border border-white/5">
                      {msg.category}
                    </span>
                  )}
                  {msg.contextUsed && (
                    <span className="flex items-center gap-1 text-[10px] text-emerald-400">
                      <ShieldCheck className="w-3 h-3" /> Context Active
                    </span>
                  )}
                </div>

                {/* Message Box */}
                <div
                  className={`rounded-2xl px-5 py-4 text-sm shadow-lg ${
                    isUser
                      ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white rounded-tr-none'
                      : 'bg-[#131B2B] border border-white/10 text-slate-200 rounded-tl-none'
                  }`}
                >
                  {isUser ? (
                    <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                  ) : (
                    <div className="space-y-1.5">{renderFormattedMarkdown(msg.text)}</div>
                  )}

                  {/* Action Shortcuts Buttons (Inside Assistant Response) */}
                  {!isUser && msg.actionLinks && msg.actionLinks.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap gap-2">
                      {msg.actionLinks.map((action, actionIdx) => {
                        const ActionIcon = ICON_MAP[action.icon] || Sparkles
                        return (
                          <Link
                            key={actionIdx}
                            to={action.path}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-500/10 hover:bg-brand-500/20 border border-brand-500/30 text-brand-300 hover:text-white text-xs font-medium transition-all"
                          >
                            <ActionIcon className="w-3.5 h-3.5 text-brand-400" />
                            <span>{action.label}</span>
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>

                {/* Copy / Message Actions */}
                {!isUser && (
                  <div className="flex items-center gap-2 mt-1.5 px-1">
                    <button
                      onClick={() => handleCopy(msg.text, msg.id)}
                      className="text-[11px] text-slate-500 hover:text-slate-300 flex items-center gap-1 transition-colors"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Response</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* User Avatar */}
              {isUser && (
                <div className="w-8 h-8 rounded-lg bg-slate-700 border border-white/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <User className="w-4 h-4 text-slate-300" />
                </div>
              )}
            </div>
          )
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex gap-3.5 items-start">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center flex-shrink-0 mt-1">
              <Bot className="w-4 h-4 text-white animate-spin" />
            </div>
            <div className="bg-[#131B2B] border border-white/10 rounded-2xl rounded-tl-none px-5 py-4 text-slate-400 flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-brand-400 animate-bounce [animation-delay:-0.3s]" />
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:-0.15s]" />
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" />
              </div>
              <span className="text-xs text-slate-400 font-medium">Synthesizing personalized career advice...</span>
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* ── Bottom Input Bar ──────────────────────────────────────── */}
      <div className="flex-shrink-0 border-t border-white/10 bg-[#111726] p-4 md:px-8">
        <form onSubmit={handleSend} className="relative flex items-end gap-3 max-w-5xl mx-auto">
          <div className="relative flex-1 bg-[#182238] border border-white/15 focus-within:border-brand-400 rounded-2xl transition-all shadow-inner">
            <textarea
              ref={textareaRef}
              rows={1}
              value={inputPrompt}
              onChange={(e) => {
                setInputPrompt(e.target.value)
                e.target.style.height = 'auto'
                e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`
              }}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about deadlines, work pressure, practice, offer letters, or tech questions..."
              className="w-full px-4 py-3.5 bg-transparent text-sm text-slate-100 placeholder-slate-400 focus:outline-none resize-none max-h-40 scrollbar-thin"
            />

            <div className="flex items-center justify-between px-4 pb-2.5 text-[11px] text-slate-500">
              <span className="hidden sm:inline">Press <kbd className="px-1 py-0.5 bg-white/10 rounded text-[10px] text-slate-300">Enter ↵</kbd> to send, <kbd className="px-1 py-0.5 bg-white/10 rounded text-[10px] text-slate-300">Shift + Enter</kbd> for newline</span>
              <span className="ml-auto text-slate-400">
                {useContext ? '⚡ Context Active' : '⚪ Context Off'}
              </span>
            </div>
          </div>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputPrompt.trim() || isLoading}
            className={`p-3.5 rounded-2xl flex items-center justify-center font-medium shadow-lg transition-all ${
              inputPrompt.trim() && !isLoading
                ? 'bg-gradient-to-r from-brand-500 to-indigo-600 hover:from-brand-600 hover:to-indigo-700 text-white shadow-brand-500/25 scale-100'
                : 'bg-white/5 border border-white/10 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  )
}
export default AICareerChat
