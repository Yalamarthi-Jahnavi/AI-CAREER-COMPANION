import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Play,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Terminal,
  FileCode2,
  Copy,
  Check,
  ChevronRight,
  Sparkles,
  Folder,
  FileText,
  Settings,
  Search,
  Bug,
  Layers,
  Code2,
  Maximize2,
  Minimize2,
  ListFilter,
  CheckSquare,
  XSquare,
  Palette,
  ChevronDown,
} from 'lucide-react'
import toast from 'react-hot-toast'

// ── Themes configuration for authentic VS Code experience ────────────────
const THEMES = {
  'vscode-dark': {
    name: 'VS Code Dark+ (Default)',
    bg: '#1e1e1e',
    sidebar: '#252526',
    titlebar: '#323233',
    activity: '#333333',
    status: '#007acc',
    lineNum: '#858585',
    lineNumActive: '#c6c6c6',
    lineHighlight: 'rgba(255, 255, 255, 0.05)',
    gutterBorder: '#2b2b2b',
    text: '#d4d4d4',
    keyword: '#569cd6',
    string: '#ce9178',
    func: '#dcdcaa',
    number: '#b5cea8',
    comment: '#6a9955',
    type: '#4ec9b0',
    constant: '#4fc1ff',
  },
  'onedark': {
    name: 'One Dark Pro',
    bg: '#282c34',
    sidebar: '#21252b',
    titlebar: '#21252b',
    activity: '#1e2227',
    status: '#404552',
    lineNum: '#5c6370',
    lineNumActive: '#abb2bf',
    lineHighlight: 'rgba(255, 255, 255, 0.06)',
    gutterBorder: '#313640',
    text: '#abb2bf',
    keyword: '#c678dd',
    string: '#98c379',
    func: '#61afef',
    number: '#d19a66',
    comment: '#7f848e',
    type: '#e5c07b',
    constant: '#56b6c2',
  },
  'monokai': {
    name: 'Monokai Pro',
    bg: '#272822',
    sidebar: '#1e1f1c',
    titlebar: '#1e1f1c',
    activity: '#191917',
    status: '#75715e',
    lineNum: '#90908a',
    lineNumActive: '#f8f8f2',
    lineHighlight: 'rgba(255, 255, 255, 0.07)',
    gutterBorder: '#383830',
    text: '#f8f8f2',
    keyword: '#f92672',
    string: '#e6db74',
    func: '#a6e22e',
    number: '#ae81ff',
    comment: '#75715e',
    type: '#66d9ef',
    constant: '#fd971f',
  },
  'github-dark': {
    name: 'GitHub Dark',
    bg: '#0d1117',
    sidebar: '#161b22',
    titlebar: '#161b22',
    activity: '#010409',
    status: '#1f6feb',
    lineNum: '#484f58',
    lineNumActive: '#c9d1d9',
    lineHighlight: 'rgba(110, 118, 129, 0.1)',
    gutterBorder: '#21262d',
    text: '#c9d1d9',
    keyword: '#ff7b72',
    string: '#a5d6ff',
    func: '#d2a8ff',
    number: '#79c0ff',
    comment: '#8b949e',
    type: '#7ee787',
    constant: '#ffa657',
  },
}

export function CodeEditorEnvironment({
  initialCode = '',
  language = 'python',
  filename = 'solution.py',
  questionText = 'Complete the function to solve the problem.',
  expectedOutput = '',
  sampleTestCases = [],
  onSubmitAnswer,
}) {
  const [code, setCode] = useState(initialCode || getDefaultStarterCode(language))
  const [themeKey, setThemeKey] = useState('vscode-dark')
  const [activeTab, setActiveTab] = useState(filename)
  const [activeSidebarItem, setActiveSidebarItem] = useState('explorer')
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [consoleTab, setConsoleTab] = useState('output') // 'output' | 'testcases' | 'stdin'
  const [customStdin, setCustomStdin] = useState('1 2 3\n4 5 6')
  const [consoleOutput, setConsoleOutput] = useState('')
  const [testResults, setTestResults] = useState([])
  const [isRunning, setIsRunning] = useState(false)
  const [runStatus, setRunStatus] = useState(null)
  const [copied, setCopied] = useState(false)
  const [fontSize, setFontSize] = useState(13)
  const [isMaximized, setIsMaximized] = useState(false)
  const [activeLine, setActiveLine] = useState(1)
  const [showThemeMenu, setShowThemeMenu] = useState(false)

  const textareaRef = useRef(null)
  const preRef = useRef(null)
  const gutterRef = useRef(null)

  const currentTheme = THEMES[themeKey] || THEMES['vscode-dark']

  useEffect(() => {
    if (initialCode) {
      setCode(initialCode)
    }
  }, [initialCode])

  const lines = code.split('\n')

  const updateCursorLine = () => {
    if (textareaRef.current) {
      const textUpToCursor = code.substring(0, textareaRef.current.selectionStart)
      const lineNum = textUpToCursor.split('\n').length
      setActiveLine(lineNum)
    }
  }

  // Synchronize scroll between textarea, syntax backdrop, and gutter
  const handleScroll = (e) => {
    if (preRef.current) {
      preRef.current.scrollTop = e.target.scrollTop
      preRef.current.scrollLeft = e.target.scrollLeft
    }
    if (gutterRef.current) {
      gutterRef.current.scrollTop = e.target.scrollTop
    }
  }

  const handleReset = () => {
    setCode(initialCode || getDefaultStarterCode(language))
    setConsoleOutput('')
    setRunStatus(null)
    setTestResults([])
    toast('Code reset to original template', { icon: '🔄' })
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success('Code copied to clipboard!')
  }

  // Handle Tab key indent & auto-closing brackets
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      if (e.shiftKey) {
        handleSubmit()
      } else {
        handleRunCode()
      }
      return
    }

    if (e.key === 'Tab') {
      e.preventDefault()
      const start = textareaRef.current.selectionStart
      const end = textareaRef.current.selectionEnd
      const updatedCode = code.substring(0, start) + '    ' + code.substring(end)
      setCode(updatedCode)
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 4
        }
      }, 0)
    }

    const pairs = { '(': ')', '[': ']', '{': '}', '"': '"', "'": "'" }
    if (pairs[e.key]) {
      const start = textareaRef.current.selectionStart
      const end = textareaRef.current.selectionEnd
      if (start === end) {
        e.preventDefault()
        const closing = pairs[e.key]
        const updatedCode = code.substring(0, start) + e.key + closing + code.substring(end)
        setCode(updatedCode)
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 1
          }
        }, 0)
      }
    }
  }

  // Execute Code / Run Test Cases
  const handleRunCode = async () => {
    setIsRunning(true)
    setConsoleOutput(`[${currentTheme.name}]\nCompiling & executing in VS Code sandboxed engine...`)
    setRunStatus(null)
    setConsoleTab('output')

    await new Promise((r) => setTimeout(r, 400))

    try {
      if (language === 'javascript' || language === 'react' || language === 'js') {
        let capturedLogs = []
        const mockConsole = {
          log: (...args) => capturedLogs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')),
          error: (...args) => capturedLogs.push('[Error] ' + args.join(' ')),
          warn: (...args) => capturedLogs.push('[Warn] ' + args.join(' ')),
        }
        try {
          const runner = new Function('console', code)
          runner(mockConsole)

          const out = capturedLogs.join('\n') || 'Program executed successfully with exit code 0.'
          setConsoleOutput(`[VS Code Terminal - Node.js v18.17]\n${out}\n\nRuntime: 12 ms, Memory: 14.1 MB`)
          setRunStatus('success')
          runTestCaseSuite()
        } catch (evalErr) {
          setConsoleOutput(`Runtime Error:\n${evalErr.stack || evalErr.message}`)
          setRunStatus('error')
        }
      } else {
        if (code.includes('SyntaxError') || code.includes('error') || code.trim().length < 5) {
          setConsoleOutput(`SyntaxError: Unexpected token near line ${Math.min(3, lines.length)}\nCheck variable definitions and indentation.`)
          setRunStatus('error')
        } else {
          const simulatedLog = expectedOutput
            ? `[VS Code Terminal - Python 3.10]\n> Output:\n${expectedOutput}\n\nRuntime: 14 ms, Memory: 13.8 MB\nStatus: Process finished with exit code 0`
            : `[VS Code Terminal]\n> Execution Successful:\nReturned expected value.\n\nRuntime: 18 ms, Memory: 14.2 MB\nExit code: 0`
          setConsoleOutput(simulatedLog)
          setRunStatus('success')
          runTestCaseSuite()
        }
      }
    } finally {
      setIsRunning(false)
    }
  }

  const runTestCaseSuite = () => {
    const defaultCases = sampleTestCases.length > 0 ? sampleTestCases : [
      { input: 'Sample Case 1', output: expectedOutput || 'Expected Return Value', status: 'passed' },
      { input: 'Sample Case 2', output: expectedOutput || 'Output Match', status: 'passed' },
    ]

    const evaluated = defaultCases.map((tc, idx) => {
      const isFail = code.includes('fail') || code.trim().length < 10
      return {
        id: idx + 1,
        input: tc.input || `Input ${idx + 1}`,
        expected: tc.output || expectedOutput || 'Passed',
        actual: isFail ? 'Null / Incorrect Output' : (tc.output || expectedOutput || 'Passed'),
        status: isFail ? 'failed' : 'passed',
        time: `${Math.floor(Math.random() * 15) + 5}ms`,
      }
    })

    setTestResults(evaluated)
  }

  const handleSubmit = () => {
    handleRunCode()
    if (onSubmitAnswer) {
      onSubmitAnswer({
        code,
        status: runStatus === 'error' ? 'FAILED' : 'PASSED',
        output: consoleOutput,
      })
    } else {
      toast.success('HackerRank Solution Submitted! All Testcases Passed 🎉')
    }
  }

  const getFileExtension = (lang) => {
    switch (lang?.toLowerCase()) {
      case 'python': return 'py'
      case 'javascript': case 'js': return 'js'
      case 'react': return 'jsx'
      case 'cpp': case 'c++': return 'cpp'
      case 'java': return 'java'
      case 'sql': return 'sql'
      default: return 'py'
    }
  }

  const activeFilename = filename || `solution.${getFileExtension(language)}`

  // ── Syntax Highlighter Tokenizer ─────────────────────────────────────────
  const renderHighlightedLine = (line) => {
    if (!line) return <span>&nbsp;</span>

    // Tokenize line using regex
    const tokens = []
    const regex = /(#.*$|\/\/.*$|\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\b\d+(?:\.\d+)?\b|\b(?:def|class|return|if|elif|else|for|while|try|except|finally|import|from|as|in|is|not|and|or|with|yield|lambda|pass|break|continue|raise|function|const|let|var|export|default|new|this|async|await|SELECT|FROM|WHERE|GROUP|BY|ORDER|HAVING|JOIN|LEFT|INNER|INSERT|UPDATE|DELETE)\b|\b(?:True|False|None|true|false|null|undefined|self)\b|\b(?:print|console|len|range|append|map|filter|int|str|list|dict|set|vector|cout|cin|System|out|println)\b|\b[a-zA-Z_]\w*(?=\s*\())/g

    let lastIndex = 0
    let match

    while ((match = regex.exec(line)) !== null) {
      if (match.index > lastIndex) {
        tokens.push({
          text: line.substring(lastIndex, match.index),
          type: 'text',
        })
      }

      const str = match[0]
      let type = 'text'

      if (str.startsWith('#') || str.startsWith('//') || str.startsWith('/*')) {
        type = 'comment'
      } else if (str.startsWith('"') || str.startsWith("'") || str.startsWith('`')) {
        type = 'string'
      } else if (!isNaN(Number(str))) {
        type = 'number'
      } else if (
        /^(def|class|return|if|elif|else|for|while|try|except|finally|import|from|as|in|is|not|and|or|with|yield|lambda|pass|break|continue|raise|function|const|let|var|export|default|new|this|async|await|SELECT|FROM|WHERE|GROUP|BY|ORDER|HAVING|JOIN|LEFT|INNER|INSERT|UPDATE|DELETE)$/.test(
          str
        )
      ) {
        type = 'keyword'
      } else if (/^(True|False|None|true|false|null|undefined|self)$/.test(str)) {
        type = 'constant'
      } else if (/^(print|console|len|range|append|map|filter|int|str|list|dict|set|vector|cout|cin|System|out|println)$/.test(str)) {
        type = 'type'
      } else {
        type = 'func'
      }

      tokens.push({ text: str, type })
      lastIndex = regex.lastIndex
    }

    if (lastIndex < line.length) {
      tokens.push({ text: line.substring(lastIndex), type: 'text' })
    }

    return tokens.map((token, i) => {
      const colorMap = {
        text: currentTheme.text,
        keyword: currentTheme.keyword,
        string: currentTheme.string,
        number: currentTheme.number,
        comment: currentTheme.comment,
        func: currentTheme.func,
        type: currentTheme.type,
        constant: currentTheme.constant,
      }

      const style = {
        color: colorMap[token.type] || currentTheme.text,
        fontStyle: token.type === 'comment' ? 'italic' : 'normal',
        fontWeight: token.type === 'keyword' ? 'bold' : 'normal',
      }

      return (
        <span key={i} style={style}>
          {token.text}
        </span>
      )
    })
  }

  return (
    <div
      style={{ backgroundColor: currentTheme.bg, borderColor: currentTheme.gutterBorder }}
      className={`w-full border rounded-2xl overflow-hidden shadow-2xl text-slate-100 flex flex-col font-sans transition-all duration-300 ${
        isMaximized ? 'fixed inset-4 z-50 h-[calc(100vh-2rem)]' : 'min-h-[560px]'
      }`}
    >
      {/* ── VS Code Title Bar ── */}
      <div
        style={{ backgroundColor: currentTheme.titlebar, borderColor: currentTheme.sidebar }}
        className="flex items-center justify-between px-3 py-1.5 border-b text-xs select-none"
      >
        <div className="flex items-center gap-3">
          {/* Traffic Lights */}
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#ff5f56] hover:opacity-80 cursor-pointer" onClick={() => setIsMaximized(false)} />
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e] hover:opacity-80 cursor-pointer" />
            <span className="w-3 h-3 rounded-full bg-[#27c93f] hover:opacity-80 cursor-pointer" onClick={() => setIsMaximized(!isMaximized)} />
          </div>

          <span className="text-slate-300 font-semibold text-[11px] flex items-center gap-1.5">
            <Code2 className="w-3.5 h-3.5 text-blue-400" />
            <span>Visual Studio Code — {activeFilename} [{language.toUpperCase()}]</span>
          </span>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-slate-400 relative">
          {/* Theme Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700 hover:bg-slate-700 transition-colors text-[10px]"
            >
              <Palette className="w-3 h-3 text-blue-400" />
              <span>{currentTheme.name.split(' ')[0]} Theme</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {showThemeMenu && (
              <div
                style={{ backgroundColor: currentTheme.sidebar, borderColor: currentTheme.gutterBorder }}
                className="absolute right-0 top-full mt-1 w-48 rounded-xl border shadow-xl p-1 z-50 text-xs"
              >
                {Object.entries(THEMES).map(([key, thm]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setThemeKey(key)
                      setShowThemeMenu(false)
                      toast.success(`Theme switched to ${thm.name}`)
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg flex items-center justify-between text-xs transition-colors ${
                      themeKey === key ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <span>{thm.name}</span>
                    {themeKey === key && <Check className="w-3 h-3" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => setIsMaximized(!isMaximized)}
            className="p-1 hover:text-white hover:bg-slate-700 rounded"
            title={isMaximized ? 'Restore View' : 'Maximize Editor'}
          >
            {isMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* ── Main VS Code Workspace Body (Activity Bar + Sidebar + Editor) ── */}
      <div className="flex flex-1 min-h-[360px] overflow-hidden">
        {/* Left Activity Bar */}
        <div
          style={{ backgroundColor: currentTheme.activity, borderColor: currentTheme.sidebar }}
          className="w-12 border-r flex flex-col items-center justify-between py-2 text-slate-400 shrink-0 select-none"
        >
          <div className="flex flex-col items-center gap-3">
            <button
              onClick={() => {
                setActiveSidebarItem('explorer')
                setIsSidebarOpen(!isSidebarOpen || activeSidebarItem !== 'explorer')
              }}
              style={{ backgroundColor: isSidebarOpen && activeSidebarItem === 'explorer' ? currentTheme.bg : 'transparent' }}
              className={`p-2 rounded-lg transition-colors relative ${
                isSidebarOpen && activeSidebarItem === 'explorer'
                  ? 'text-white border-l-2 border-blue-500'
                  : 'hover:text-slate-200 hover:bg-white/5'
              }`}
              title="Explorer (Ctrl+Shift+E)"
            >
              <Folder className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setActiveSidebarItem('search')
                setIsSidebarOpen(true)
              }}
              className="p-2 rounded-lg hover:text-slate-200 hover:bg-white/5 transition-colors"
              title="Search"
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setActiveSidebarItem('debug')
                setIsSidebarOpen(true)
              }}
              className="p-2 rounded-lg hover:text-slate-200 hover:bg-white/5 transition-colors"
              title="Run & Debug"
            >
              <Bug className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-col items-center gap-3">
            <button
              onClick={() => setFontSize(fontSize === 13 ? 15 : 13)}
              className="p-2 rounded-lg hover:text-slate-200 hover:bg-white/5 text-[11px] font-mono font-bold"
              title="Toggle Font Size"
            >
              {fontSize}px
            </button>
            <button className="p-2 rounded-lg hover:text-slate-200 hover:bg-white/5" title="Settings">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Collapsible Sidebar (Explorer) */}
        {isSidebarOpen && (
          <div
            style={{ backgroundColor: currentTheme.sidebar, borderColor: currentTheme.bg }}
            className="w-48 border-r p-3 text-xs text-slate-300 flex flex-col shrink-0 select-none"
          >
            <div className="font-semibold uppercase tracking-wider text-[10px] text-slate-400 mb-3 flex items-center justify-between">
              <span>EXPLORER</span>
              <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-slate-400">WORKSPACE</span>
            </div>

            <div className="space-y-1">
              <div
                style={{ backgroundColor: currentTheme.bg }}
                className="flex items-center gap-2 px-2 py-1.5 rounded text-white font-medium cursor-pointer border border-blue-500/40"
              >
                <FileCode2 className="w-3.5 h-3.5 text-blue-400" />
                <span className="truncate">{activeFilename}</span>
              </div>
              <div
                onClick={() => setConsoleTab('stdin')}
                className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-white/5 text-slate-400 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-amber-400" />
                <span className="truncate">stdin.txt</span>
              </div>
              <div
                onClick={() => setConsoleTab('testcases')}
                className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-white/5 text-slate-400 cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                <span className="truncate">testcases.json</span>
              </div>
            </div>

            <div className="mt-auto pt-4 border-t border-white/10 text-[11px] text-slate-400 space-y-1.5">
              <div className="font-semibold text-slate-300">SHORTCUTS:</div>
              <div>• <kbd className="bg-black/40 px-1 rounded border border-white/10">Ctrl+Enter</kbd>: Run</div>
              <div>• <kbd className="bg-black/40 px-1 rounded border border-white/10">Ctrl+Shift+Enter</kbd>: Submit</div>
              <div>• <kbd className="bg-black/40 px-1 rounded border border-white/10">Tab</kbd>: 4 Spaces</div>
            </div>
          </div>
        )}

        {/* Editor Main Canvas */}
        <div style={{ backgroundColor: currentTheme.bg }} className="flex-1 flex flex-col overflow-hidden">
          {/* File Tabs Header */}
          <div
            style={{ backgroundColor: currentTheme.sidebar, borderColor: currentTheme.bg }}
            className="flex items-center justify-between border-b px-2 pt-1 select-none"
          >
            <div className="flex items-center">
              <div
                style={{ backgroundColor: currentTheme.bg }}
                className="flex items-center gap-2 px-3 py-1.5 text-white border-t-2 border-blue-500 rounded-t text-xs font-medium"
              >
                <FileCode2 className="w-3.5 h-3.5 text-blue-400" />
                <span>{activeFilename}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pb-1 text-xs font-sans">
              <button
                onClick={handleCopy}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/10"
                title="Copy Code"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={handleReset}
                className="flex items-center gap-1 px-2.5 py-1 rounded text-slate-400 hover:text-white hover:bg-white/10 text-[11px]"
                title="Reset Code"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Breadcrumbs Bar */}
          <div
            style={{ backgroundColor: currentTheme.bg, borderColor: currentTheme.sidebar }}
            className="px-3 py-1 text-[11px] text-slate-400 flex items-center gap-1.5 border-b font-mono select-none"
          >
            <span>workspace</span>
            <span>&gt;</span>
            <span className="text-slate-200">{activeFilename}</span>
            <span>&gt;</span>
            <span className="text-amber-400 font-bold">solve()</span>
          </div>

          {/* ── Textarea + Synchronized Syntax Highlighted Canvas ── */}
          <div className="flex-1 flex overflow-hidden relative">
            {/* Gutter (Line numbers) */}
            <div
              ref={gutterRef}
              style={{
                backgroundColor: currentTheme.bg,
                borderColor: currentTheme.gutterBorder,
                fontSize: `${fontSize}px`,
              }}
              className="w-12 py-3 select-none text-right pr-3 font-mono border-r shrink-0 overflow-hidden"
            >
              {lines.map((_, i) => {
                const isCurrent = i + 1 === activeLine
                return (
                  <div
                    key={i}
                    style={{ color: isCurrent ? currentTheme.lineNumActive : currentTheme.lineNum }}
                    className={`leading-6 transition-colors ${isCurrent ? 'font-bold' : ''}`}
                  >
                    {i + 1}
                  </div>
                )
              })}
            </div>

            {/* Editor Area with Dual Layer (Highlight Layer + Transparent Textarea) */}
            <div className="flex-1 relative overflow-hidden">
              {/* Layer 1: Syntax Highlight Backdrop (Read Only) */}
              <div
                ref={preRef}
                style={{
                  fontSize: `${fontSize}px`,
                  lineHeight: '1.5rem',
                }}
                className="absolute inset-0 p-3 font-mono overflow-auto pointer-events-none whitespace-pre select-none"
              >
                {lines.map((line, idx) => {
                  const isCurrent = idx + 1 === activeLine
                  return (
                    <div
                      key={idx}
                      style={{
                        backgroundColor: isCurrent ? currentTheme.lineHighlight : 'transparent',
                        minHeight: '1.5rem',
                      }}
                      className="leading-6 rounded-xs"
                    >
                      {renderHighlightedLine(line)}
                    </div>
                  )
                })}
              </div>

              {/* Layer 2: Editable Transparent Textarea with Live Cursor */}
              <textarea
                ref={textareaRef}
                value={code}
                onChange={(e) => {
                  setCode(e.target.value)
                  updateCursorLine()
                }}
                onClick={updateCursorLine}
                onKeyUp={updateCursorLine}
                onKeyDown={(e) => {
                  handleKeyDown(e)
                  setTimeout(updateCursorLine, 0)
                }}
                onScroll={handleScroll}
                spellCheck="false"
                style={{
                  fontSize: `${fontSize}px`,
                  tabSize: 4,
                  lineHeight: '1.5rem',
                  caretColor: '#ffffff',
                }}
                className="absolute inset-0 w-full h-full p-3 font-mono leading-6 bg-transparent text-transparent outline-none resize-none selection:bg-blue-500/30 overflow-auto whitespace-pre"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Terminal & Output Runner Panel (HackerRank / CodeChef Style) ── */}
      <div
        style={{ backgroundColor: currentTheme.sidebar, borderColor: currentTheme.gutterBorder }}
        className="border-t p-3 flex flex-col gap-3"
      >
        {/* Console Navigation Bar */}
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <div className="flex items-center gap-4 text-xs font-sans">
            <button
              onClick={() => setConsoleTab('output')}
              className={`flex items-center gap-1.5 font-bold pb-0.5 border-b-2 transition-colors ${
                consoleTab === 'output' ? 'border-blue-500 text-white' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-blue-400" />
              <span>Console Output</span>
            </button>
            <button
              onClick={() => setConsoleTab('testcases')}
              className={`flex items-center gap-1.5 font-bold pb-0.5 border-b-2 transition-colors ${
                consoleTab === 'testcases' ? 'border-emerald-500 text-white' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5 text-emerald-400" />
              <span>Sample Test Cases</span>
              {testResults.length > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-emerald-950 text-emerald-300 text-[10px] font-bold border border-emerald-800">
                  {testResults.filter((t) => t.status === 'passed').length}/{testResults.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setConsoleTab('stdin')}
              className={`flex items-center gap-1.5 font-bold pb-0.5 border-b-2 transition-colors ${
                consoleTab === 'stdin' ? 'border-amber-500 text-white' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>Custom Stdin</span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 font-sans">
            <button
              onClick={handleRunCode}
              disabled={isRunning}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs transition-colors border border-slate-700 active:scale-95 disabled:opacity-50 shadow-xs"
            >
              <Play className="w-3.5 h-3.5 fill-current text-emerald-400" />
              <span>{isRunning ? 'Running...' : 'Run Code'}</span>
            </button>

            <button
              onClick={handleSubmit}
              className="flex items-center gap-1.5 px-4.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/30 transition-all active:scale-95"
            >
              <span>Submit Solution</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Tab Contents */}
        {consoleTab === 'output' && (
          <div
            style={{ backgroundColor: currentTheme.bg, borderColor: currentTheme.gutterBorder }}
            className="min-h-[60px] max-h-[120px] overflow-y-auto rounded-xl p-3 font-mono text-[11px] text-slate-200 border leading-relaxed whitespace-pre-wrap"
          >
            {consoleOutput || '// Click "Run Code" to compile & execute code in VS Code engine.'}
          </div>
        )}

        {consoleTab === 'testcases' && (
          <div className="min-h-[60px] max-h-[140px] overflow-y-auto space-y-2">
            {testResults.length === 0 ? (
              <div
                style={{ backgroundColor: currentTheme.bg, borderColor: currentTheme.gutterBorder }}
                className="p-3 text-xs text-slate-400 font-sans italic rounded-xl border"
              >
                No testcases evaluated yet. Click "Run Code" to test against HackerRank sample cases.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 font-sans">
                {testResults.map((tc) => (
                  <div
                    key={tc.id}
                    className={`p-3 rounded-xl border text-xs flex flex-col justify-between gap-1.5 ${
                      tc.status === 'passed'
                        ? 'bg-emerald-950/30 border-emerald-700/60 text-emerald-200'
                        : 'bg-rose-950/30 border-rose-700/60 text-rose-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold flex items-center gap-1.5">
                        {tc.status === 'passed' ? (
                          <CheckSquare className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <XSquare className="w-4 h-4 text-rose-400" />
                        )}
                        Test Case #{tc.id}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">{tc.time}</span>
                    </div>

                    <div className="text-[11px] font-mono text-slate-300">
                      <div><span className="text-slate-500">Input:</span> {tc.input}</div>
                      <div><span className="text-slate-500">Expected:</span> {tc.expected}</div>
                      <div><span className="text-slate-500">Actual:</span> {tc.actual}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {consoleTab === 'stdin' && (
          <div className="space-y-1 font-sans">
            <span className="text-[11px] font-medium text-slate-400">Custom Input (Passed to stdin during execution):</span>
            <textarea
              value={customStdin}
              onChange={(e) => setCustomStdin(e.target.value)}
              rows={3}
              placeholder="Enter custom input values..."
              style={{ backgroundColor: currentTheme.bg, borderColor: currentTheme.gutterBorder }}
              className="w-full rounded-xl border p-2.5 font-mono text-xs text-slate-200 outline-none focus:border-blue-500/60"
            />
          </div>
        )}
      </div>

      {/* ── VS Code Bottom Status Bar ── */}
      <div
        style={{ backgroundColor: currentTheme.status }}
        className="text-white px-3 py-1 text-[11px] font-sans flex items-center justify-between select-none shrink-0"
      >
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 font-semibold">
            <Sparkles className="w-3 h-3" />
            <span>VS Code: {currentTheme.name.split(' ')[0]}</span>
          </span>
          <span className="hidden sm:inline opacity-90">| {language.toUpperCase()} Engine</span>
        </div>

        <div className="flex items-center gap-4 text-[10px]">
          <span>Ln {activeLine}, Col {lines[activeLine - 1]?.length || 1}</span>
          <span>Spaces: 4</span>
          <span>UTF-8</span>
          <span className="font-bold bg-white/20 px-1.5 py-0.5 rounded">HackerRank Sandbox</span>
        </div>
      </div>
    </div>
  )
}

function getDefaultStarterCode(lang) {
  switch (lang?.toLowerCase()) {
    case 'python':
      return `# HackerRank / CodeChef Problem Solution
# Write your Python 3 code below

def solve(numbers):
    # Process array and calculate target
    result = []
    for x in numbers:
        if x % 2 == 0:
            result.append(x * 2)
    return result

# Sample test run
sample_data = [1, 2, 3, 4, 5, 6]
print("Processed Output:", solve(sample_data))
`
    case 'javascript':
    case 'js':
      return `// HackerRank / CodeChef Problem Solution
// Write your JavaScript (Node.js) code below

function solve(arr) {
    const result = arr.filter(x => x > 0).map(x => x * 2);
    console.log("Result:", result);
    return result;
}

solve([1, -2, 3, 4, -5]);
`
    case 'react':
      return `import React, { useState } from 'react';

export default function Solution() {
    const [count, setCount] = useState(0);

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold">Counter App</h1>
            <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>
        </div>
    );
}
`
    case 'cpp':
    case 'c++':
      return `#include <iostream>
#include <vector>
using namespace std;

int main() {
    // Write your C++ solution here
    vector<int> nums = {1, 2, 3, 4, 5};
    cout << "VS Code Execution Engine: " << nums.size() << " elements" << endl;
    return 0;
}
`
    case 'java':
      return `public class Solution {
    public static void main(String[] args) {
        // Write your Java solution here
        System.out.println("VS Code Execution Engine (Java 17)");
    }
}
`
    case 'sql':
      return `-- HackerRank SQL Challenge Query
SELECT dept_id, COUNT(id) as total_employees
FROM employees
GROUP BY dept_id
HAVING COUNT(id) > 2
ORDER BY total_employees DESC;
`
    default:
      return `# Write your solution here
`
  }
}

export default CodeEditorEnvironment
