import React, { useState, useRef, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { 
  Sparkles, 
  Plus, 
  MessageSquare, 
  Settings, 
  Moon, 
  Sun,
  Paperclip, 
  ArrowUp, 
  ChevronDown, 
  Search, 
  Code2, 
  PenTool, 
  BarChart3, 
  Folder, 
  ChevronRight,
  Check,
  PanelLeftClose,
  PanelLeft,
  Copy,
  RotateCcw,
  X,
  FileCode
} from 'lucide-react';
import { 
  initialMockThreads, 
  type ChatMessage 
} from '../data/mockConversations';
import {
  callGeminiApi,
  buildGeminiHistory,
  hasApiKey,
  getErrorMessage,
  type ModelName,
  type GeminiMessage,
} from '../services/geminiApi';

interface ProductPreviewProps {
  onInteraction?: (msg: string) => void;
  onOpenFullWorkspace?: () => void;
}

export const ProductPreview: React.FC<ProductPreviewProps> = ({ 
  onInteraction,
  onOpenFullWorkspace 
}) => {
  const shouldReduceMotion = useReducedMotion();
  const [selectedModel, setSelectedModel] = useState<ModelName>('GPT-5');
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [promptInput, setPromptInput] = useState('');
  const [activeQuickAction, setActiveQuickAction] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Real Chat State
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [attachedFile, setAttachedFile] = useState<{ name: string; size: string } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [conversationHistory, setConversationHistory] = useState<GeminiMessage[]>([]);
  const [_apiError, setApiError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const quickActions = [
    { id: 'research', label: 'Research', icon: Search, example: 'Synthesize recent papers on speculative decoding in LLMs' },
    { id: 'code', label: 'Code', icon: Code2, example: 'Write a TypeScript generic memoization hook with LRU cache eviction' },
    { id: 'write', label: 'Write', icon: PenTool, example: 'Draft a clear product launch release note for version 2.4' },
    { id: 'analyze', label: 'Analyze', icon: BarChart3, example: 'Compare reasoning tradeoffs between GPT-5 and Claude 3.7' },
  ];

  const modelOptions = [
    { name: 'GPT-5' as const, provider: 'OpenAI', tag: 'Reasoning' },
    { name: 'Claude' as const, provider: 'Anthropic', tag: 'Creative' },
    { name: 'Gemini' as const, provider: 'Google', tag: 'Fast' },
    { name: 'DeepSeek' as const, provider: 'DeepSeek', tag: 'Code' },
  ];

  const handleQuickAction = (action: typeof quickActions[0]) => {
    setActiveQuickAction(action.id);
    setPromptInput(action.example);
    onInteraction?.(`Loaded template: ${action.label}`);
  };

  const handleLoadThread = (threadId: string) => {
    const thread = initialMockThreads.find((t) => t.id === threadId);
    if (thread) {
      setActiveThreadId(thread.id);
      setSelectedModel(thread.model);
      setMessages([...thread.messages]);
      setConversationHistory(
        buildGeminiHistory(thread.messages.map((m) => ({ sender: m.sender, content: m.content })))
      );
      setActiveQuickAction(null);
      setAttachedFile(null);
      setApiError(null);
      onInteraction?.(`Loaded conversation: "${thread.title}"`);
    }
  };

  const handleStartNewChat = () => {
    setActiveThreadId(null);
    setMessages([]);
    setPromptInput('');
    setActiveQuickAction(null);
    setAttachedFile(null);
    setConversationHistory([]);
    setApiError(null);
    onInteraction?.('Started new clean conversation');
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    onInteraction?.('Copied message to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAttachMockFile = () => {
    if (attachedFile) {
      setAttachedFile(null);
      onInteraction?.('Removed attached file');
    } else {
      setAttachedFile({ name: 'auth-service.ts', size: '3.4 KB' });
      onInteraction?.('Attached sample code context: auth-service.ts');
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPrompt = promptInput.trim();
    if (!cleanPrompt && !attachedFile) return;
    if (isTyping) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      content: attachedFile ? `[Attached File: ${attachedFile.name}]\n\n${cleanPrompt}` : cleanPrompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setPromptInput('');
    setAttachedFile(null);
    setIsTyping(true);
    setApiError(null);

    const promptForAI = cleanPrompt || `Analyze this file: ${attachedFile?.name}`;
    const currentModel = selectedModel;
    const historyForApi = conversationHistory;

    // Try real Gemini API first
    if (hasApiKey()) {
      const result = await callGeminiApi(promptForAI, currentModel, historyForApi);
      setIsTyping(false);

      if (result.error) {
        const errInfo = getErrorMessage(result.error);
        setApiError(`${errInfo.title}: ${errInfo.detail}`);
        onInteraction?.(`Error: ${errInfo.title}`);
        return;
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        content: result.content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        model: currentModel,
        reasoningTime: result.reasoningTime
      };

      setMessages((prev) => [...prev, aiMsg]);
      setConversationHistory((prev) => [
        ...prev,
        { role: 'user', parts: [{ text: promptForAI }] },
        { role: 'model', parts: [{ text: result.content }] },
      ]);
      onInteraction?.(`Response from ${currentModel} in ${result.reasoningTime}`);
    } else {
      // No API key: show a helpful message prompting the user to open the full workspace
      setTimeout(() => {
        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          content: `To get real AI responses from ${currentModel}, open the full workspace and add your Gemini API key in the settings (🔑 icon). It's free at aistudio.google.com — no credit card needed!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          model: currentModel,
          reasoningTime: '0.1s'
        };
        setMessages((prev) => [...prev, aiMsg]);
        setIsTyping(false);
        onInteraction?.('Open the full workspace to add your Gemini API key');
      }, 400);
    }
  };

  return (
    <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-24 md:pb-32" aria-label="EchoGPT Product Preview">
      {/* Decorative Glow under the preview card */}
      <div 
        className="pointer-events-none absolute -inset-x-10 top-24 bottom-10 bg-gradient-to-b from-accent-indigo/10 via-accent-purple/5 to-transparent blur-3xl -z-10" 
        aria-hidden="true" 
      />

      <motion.div
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1.0] }}
        className="rounded-2xl border border-white/10 bg-[#0E1017] shadow-2xl shadow-black/80 overflow-hidden ring-1 ring-white/5"
      >
        {/* Workspace Mock Window Top Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#13151F] border-b border-white/[0.08] select-none">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>
            <div className="hidden sm:flex items-center gap-2 ml-4 px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-[11px] text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>app.echogpt.ai/workspace</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            {onOpenFullWorkspace && (
              <button
                onClick={onOpenFullWorkspace}
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-accent-indigo/20 hover:bg-accent-indigo/30 border border-accent-indigo/40 text-accent-indigo font-medium transition-colors"
              >
                <span>Open Fullscreen Workspace</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            )}
            <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/[0.04] border border-white/5">
              <span className="w-2 h-2 rounded-full bg-accent-indigo" />
              <span>Model: <strong className="text-white font-medium">{selectedModel}</strong></span>
            </span>
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded hover:bg-white/[0.06] text-slate-400 hover:text-white transition-colors"
              title="Toggle sidebar"
            >
              {sidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeft className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Workspace Body */}
        <div className="flex h-[560px] sm:h-[620px] md:h-[660px] overflow-hidden text-slate-200">
          
          {/* Mock Sidebar */}
          <aside 
            className={`${
              sidebarOpen ? 'w-64' : 'w-0'
            } transition-all duration-300 ease-in-out flex-shrink-0 bg-[#11131B] border-r border-white/[0.07] flex flex-col justify-between overflow-hidden hidden sm:flex`}
          >
            <div className="p-3.5 space-y-4 overflow-y-auto">
              {/* Brand & Plan Badge */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-accent-indigo flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="font-semibold text-sm text-white">EchoGPT</span>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-accent-indigo/20 text-accent-indigo border border-accent-indigo/30">
                  PRO LIVE
                </span>
              </div>

              {/* New Conversation Button */}
              <button 
                onClick={handleStartNewChat}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-accent-indigo/15 hover:bg-accent-indigo/25 border border-accent-indigo/30 text-white text-xs font-medium transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Plus className="w-4 h-4 text-accent-indigo" />
                  New conversation
                </span>
                <kbd className="text-[10px] text-slate-400 bg-black/30 px-1.5 py-0.5 rounded border border-white/10">⌘K</kbd>
              </button>

              {/* Categories */}
              <div className="space-y-1">
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-2 py-1">
                  Workspace
                </div>
                <div className="flex items-center justify-between px-2.5 py-1.5 rounded-md hover:bg-white/[0.04] text-xs text-slate-300 cursor-pointer">
                  <span className="flex items-center gap-2">
                    <Folder className="w-3.5 h-3.5 text-accent-indigo" />
                    Engineering & Dev
                  </span>
                  <span className="text-[10px] text-slate-500">2 threads</span>
                </div>
                <div className="flex items-center justify-between px-2.5 py-1.5 rounded-md hover:bg-white/[0.04] text-xs text-slate-300 cursor-pointer">
                  <span className="flex items-center gap-2">
                    <Folder className="w-3.5 h-3.5 text-accent-purple" />
                    Research & Notes
                  </span>
                  <span className="text-[10px] text-slate-500">2 threads</span>
                </div>
              </div>

              {/* Recent Conversations */}
              <div className="space-y-1">
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-2 py-1">
                  Recent Threads (Click to Load)
                </div>
                {initialMockThreads.map((chat) => {
                  const isActive = activeThreadId === chat.id;
                  return (
                    <div
                      key={chat.id}
                      onClick={() => handleLoadThread(chat.id)}
                      className={`group flex items-center justify-between px-2.5 py-2 rounded-lg text-xs cursor-pointer transition-colors ${
                        isActive
                          ? 'bg-accent-indigo/20 text-white border border-accent-indigo/30'
                          : 'hover:bg-white/[0.05] text-slate-300 hover:text-white'
                      }`}
                    >
                      <span className="flex items-center gap-2 truncate pr-2">
                        <MessageSquare className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-accent-indigo' : 'text-slate-400 group-hover:text-accent-indigo'}`} />
                        <span className="truncate">{chat.title}</span>
                      </span>
                      <span className="text-[10px] text-slate-500 flex-shrink-0">{chat.time}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sidebar Bottom: Settings & Dark mode */}
            <div className="p-3 border-t border-white/[0.06] bg-[#0D0E15] space-y-1">
              <div 
                onClick={() => {
                  setIsDarkMode(!isDarkMode);
                  onInteraction?.(`Switched to ${!isDarkMode ? 'dark' : 'light'} workspace appearance`);
                }}
                className="flex items-center justify-between px-2.5 py-1.5 rounded-md hover:bg-white/[0.04] text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  {isDarkMode ? <Moon className="w-3.5 h-3.5 text-accent-cyan" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
                  Appearance
                </span>
                <span className="text-[10px] text-slate-400 px-1.5 py-0.5 rounded bg-white/[0.05]">
                  {isDarkMode ? 'Dark' : 'Light'}
                </span>
              </div>
              <div 
                onClick={() => onInteraction?.('Settings: API keys, Model latency & Shortcuts configured')}
                className="flex items-center justify-between px-2.5 py-1.5 rounded-md hover:bg-white/[0.04] text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Settings className="w-3.5 h-3.5 text-slate-400" />
                  Settings
                </span>
                <span className="text-[10px] text-slate-500">v2.4 Live</span>
              </div>
            </div>
          </aside>

          {/* Main Chat Area */}
          <main className="flex-1 flex flex-col justify-between bg-[#0B0C12] p-3 sm:p-5 md:p-6 relative overflow-hidden">
            
            {/* Scrollable Conversation Content */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-4 mb-2">
              {messages.length === 0 ? (
                /* Empty State: Centered Greeting & Quick Actions */
                <div className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto w-full h-full my-auto py-6">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent-indigo via-accent-purple to-accent-cyan p-0.5 shadow-lg shadow-indigo-500/20 mb-4">
                    <div className="w-full h-full bg-[#0B0C12] rounded-[14px] flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-accent-indigo" />
                    </div>
                  </div>

                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-white mb-2">
                    How can EchoGPT help you today?
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mb-8 max-w-md">
                    Connected to <span className="text-white font-semibold">{selectedModel}</span>. You can select a quick workflow or type below.
                  </p>

                  {/* Quick Actions Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full">
                    {quickActions.map((action) => {
                      const Icon = action.icon;
                      const isActive = activeQuickAction === action.id;
                      return (
                        <button
                          key={action.id}
                          onClick={() => handleQuickAction(action)}
                          className={`flex flex-col items-start p-3 sm:p-3.5 rounded-xl border text-left transition-all duration-150 ${
                            isActive
                              ? 'bg-accent-indigo/15 border-accent-indigo text-white shadow-sm shadow-indigo-500/10'
                              : 'bg-[#141620] hover:bg-[#1A1D2B] border-white/[0.06] hover:border-white/10 text-slate-300'
                          }`}
                        >
                          <div className={`p-1.5 rounded-lg mb-2 ${isActive ? 'bg-accent-indigo text-white' : 'bg-white/[0.06] text-accent-indigo'}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="text-xs font-semibold text-white">{action.label}</span>
                          <span className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">Quick template</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* Active Thread Messages */
                <div className="space-y-4 max-w-3xl mx-auto w-full pt-2">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                    >
                      {/* Message Author Header */}
                      <div className="flex items-center gap-2 mb-1 px-1 text-[11px] text-slate-400">
                        {msg.sender === 'user' ? (
                          <span>You</span>
                        ) : (
                          <div className="flex items-center gap-1.5 font-medium text-white">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent-indigo" />
                            <span>EchoGPT</span>
                            {msg.model && (
                              <span className="px-1.5 py-0.2 rounded bg-white/[0.06] text-accent-indigo text-[10px] border border-white/5">
                                {msg.model}
                              </span>
                            )}
                            {msg.reasoningTime && (
                              <span className="text-[10px] text-slate-500">• {msg.reasoningTime}</span>
                            )}
                          </div>
                        )}
                        <span>{msg.timestamp}</span>
                      </div>

                      {/* Message Content Bubble */}
                      <div
                        className={`p-4 rounded-2xl text-xs sm:text-sm max-w-[92%] leading-relaxed ${
                          msg.sender === 'user'
                            ? 'bg-accent-indigo text-white rounded-tr-none shadow-md shadow-indigo-600/20 whitespace-pre-wrap'
                            : 'bg-[#151825] text-slate-200 border border-white/10 rounded-tl-none shadow-md shadow-black/20 w-full'
                        }`}
                      >
                        <div className="whitespace-pre-wrap font-sans">
                          {msg.content}
                        </div>

                        {/* Copy / Actions for Assistant message */}
                        {msg.sender === 'assistant' && (
                          <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-400">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => handleCopyMessage(msg.id, msg.content)}
                                className="flex items-center gap-1 hover:text-white transition-colors"
                              >
                                {copiedId === msg.id ? (
                                  <>
                                    <Check className="w-3 h-3 text-emerald-400" />
                                    <span className="text-emerald-400">Copied!</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3" />
                                    <span>Copy</span>
                                  </>
                                )}
                              </button>
                              <button
                                onClick={() => {
                                  onInteraction?.(`Regenerating output with ${selectedModel}...`);
                                  handleSend({ preventDefault: () => {} } as any);
                                }}
                                className="flex items-center gap-1 hover:text-white transition-colors"
                              >
                                <RotateCcw className="w-3 h-3" />
                                <span>Regenerate</span>
                              </button>
                            </div>
                            <span className="text-[10px] text-slate-500">EchoGPT Multi-Model Engine</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Typing Simulator */}
                  {isTyping && (
                    <div className="flex items-start gap-2 text-xs text-slate-400 pt-1">
                      <div className="w-6 h-6 rounded-lg bg-accent-indigo/20 flex items-center justify-center text-accent-indigo">
                        <Sparkles className="w-3 h-3 animate-spin" />
                      </div>
                      <div className="bg-[#151825] px-4 py-2.5 rounded-2xl border border-white/10 flex items-center gap-2">
                        <span className="text-slate-300 font-medium">{selectedModel}</span> is synthesizing answer...
                        <span className="flex gap-1 ml-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent-indigo animate-bounce" />
                          <span className="w-1.5 h-1.5 rounded-full bg-accent-indigo animate-bounce [animation-delay:0.15s]" />
                          <span className="w-1.5 h-1.5 rounded-full bg-accent-indigo animate-bounce [animation-delay:0.3s]" />
                        </span>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Prompt Composer */}
            <div className="w-full max-w-3xl mx-auto pt-2">
              {/* Attached file chip */}
              {attachedFile && (
                <div className="mb-2 inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-accent-indigo/15 border border-accent-indigo/30 text-xs text-slate-200">
                  <FileCode className="w-3.5 h-3.5 text-accent-indigo" />
                  <span className="font-medium text-white">{attachedFile.name}</span>
                  <span className="text-[10px] text-slate-400">({attachedFile.size})</span>
                  <button
                    onClick={() => setAttachedFile(null)}
                    className="p-0.5 hover:text-white rounded"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}

              <form 
                onSubmit={handleSend}
                className="relative rounded-2xl bg-[#141722] border border-white/10 focus-within:border-accent-indigo/60 focus-within:ring-1 focus-within:ring-accent-indigo/50 shadow-xl shadow-black/40 transition-all p-3"
              >
                <textarea
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend(e);
                    }
                  }}
                  rows={2}
                  placeholder={`Message ${selectedModel}… (press Enter to send)`}
                  className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none resize-none px-1"
                />

                <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
                  {/* Left Controls: Attach & AI Model Selector */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleAttachMockFile}
                      className={`p-1.5 rounded-lg transition-colors ${
                        attachedFile
                          ? 'bg-accent-indigo text-white'
                          : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
                      }`}
                      title={attachedFile ? 'Remove attachment' : 'Attach code/file context'}
                      aria-label="Attach file"
                    >
                      <Paperclip className="w-4 h-4" />
                    </button>

                    {/* Model Selector Dropdown */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.05] hover:bg-white/[0.08] border border-white/10 text-xs font-medium text-slate-200 transition-colors"
                        aria-expanded={modelDropdownOpen}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-accent-indigo" />
                        <span>{selectedModel}</span>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
                      </button>

                      {modelDropdownOpen && (
                        <div className="absolute bottom-full left-0 mb-2 w-48 rounded-xl bg-[#181B26] border border-white/15 shadow-2xl py-1 z-30">
                          <div className="px-3 py-1.5 text-[10px] uppercase font-semibold text-slate-400 border-b border-white/[0.06]">
                            Switch Active Model
                          </div>
                          {modelOptions.map((model) => (
                            <button
                              key={model.name}
                              type="button"
                              onClick={() => {
                                setSelectedModel(model.name);
                                setModelDropdownOpen(false);
                                onInteraction?.(`Switched active model to ${model.name}`);
                              }}
                              className="w-full flex items-center justify-between px-3 py-2 text-xs text-left hover:bg-white/[0.06] text-slate-200 hover:text-white transition-colors"
                            >
                              <div className="flex flex-col">
                                <span className="font-medium">{model.name}</span>
                                <span className="text-[10px] text-slate-400">{model.provider}</span>
                              </div>
                              {selectedModel === model.name ? (
                                <Check className="w-3.5 h-3.5 text-accent-indigo" />
                              ) : (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.05] text-slate-400">
                                  {model.tag}
                                </span>
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Control: Send Button */}
                  <div className="flex items-center gap-2">
                    <span className="hidden sm:inline-block text-[11px] text-slate-500">
                      Press <kbd className="px-1 py-0.5 rounded bg-white/[0.05] border border-white/10 text-[10px]">Enter ↵</kbd>
                    </span>
                    <button
                      type="submit"
                      disabled={!promptInput.trim() && !attachedFile}
                      className={`p-2 rounded-xl text-white transition-all ${
                        promptInput.trim() || attachedFile
                          ? 'bg-accent-indigo hover:bg-indigo-600 shadow-md shadow-indigo-500/30 active:scale-95'
                          : 'bg-white/[0.08] text-slate-500 cursor-not-allowed'
                      }`}
                      aria-label="Send prompt"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </main>
        </div>
      </motion.div>
    </section>
  );
};
