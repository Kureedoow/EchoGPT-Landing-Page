import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  X,
  ArrowUp,
  Check,
  Plus,
  MessageSquare,
  Paperclip,
  Copy,
  PanelLeftClose,
  PanelLeft,
  Maximize2,
  Minimize2,
  Key,
  Settings,
  AlertTriangle,
  ExternalLink,
  Eye,
  EyeOff,
  ChevronDown,
} from 'lucide-react';
import {
  callGeminiApi,
  getApiKey,
  setApiKey,
  hasApiKey,
  buildGeminiHistory,
  getErrorMessage,
  type ModelName,
  type GeminiMessage,
} from '../services/geminiApi';
import { initialMockThreads, type ChatMessage } from '../data/mockConversations';

interface WorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNotify: (msg: string) => void;
  initialModel?: ModelName;
}

// Render markdown-ish content (bold, code blocks, bullet lists)
function renderContent(text: string) {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let codeBlock: string[] = [];
  let inCode = false;
  let codeLang = '';

  lines.forEach((line, i) => {
    if (line.startsWith('```')) {
      if (!inCode) {
        inCode = true;
        codeLang = line.slice(3).trim();
        codeBlock = [];
      } else {
        inCode = false;
        elements.push(
          <div key={`code-${i}`} className="my-2 rounded-lg overflow-hidden border border-white/10">
            {codeLang && (
              <div className="px-3 py-1 bg-black/50 text-[10px] text-slate-400 font-mono border-b border-white/[0.06]">
                {codeLang}
              </div>
            )}
            <pre className="p-3 bg-black/40 overflow-x-auto text-[11px] leading-relaxed text-slate-200 font-mono whitespace-pre">
              {codeBlock.join('\n')}
            </pre>
          </div>
        );
        codeBlock = [];
        codeLang = '';
      }
      return;
    }

    if (inCode) {
      codeBlock.push(line);
      return;
    }

    // Inline: process bold (**text**) and inline code (`text`)
    const processInline = (str: string) => {
      const parts = str.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
      return parts.map((p, pi) => {
        if (p.startsWith('**') && p.endsWith('**')) {
          return <strong key={pi} className="font-semibold text-white">{p.slice(2, -2)}</strong>;
        }
        if (p.startsWith('`') && p.endsWith('`')) {
          return <code key={pi} className="px-1 py-0.5 rounded bg-white/10 text-accent-cyan font-mono text-[11px]">{p.slice(1, -1)}</code>;
        }
        return p;
      });
    };

    if (line.startsWith('### ')) {
      elements.push(<h3 key={i} className="text-sm font-bold text-white mt-3 mb-1">{processInline(line.slice(4))}</h3>);
    } else if (line.startsWith('## ')) {
      elements.push(<h2 key={i} className="text-base font-bold text-white mt-4 mb-1.5">{processInline(line.slice(3))}</h2>);
    } else if (line.startsWith('# ')) {
      elements.push(<h1 key={i} className="text-lg font-bold text-white mt-4 mb-2">{processInline(line.slice(2))}</h1>);
    } else if (line.match(/^[-*] /)) {
      elements.push(
        <li key={i} className="ml-4 list-disc text-slate-200 leading-relaxed text-xs sm:text-sm">
          {processInline(line.slice(2))}
        </li>
      );
    } else if (line.match(/^\d+\. /)) {
      elements.push(
        <li key={i} className="ml-4 list-decimal text-slate-200 leading-relaxed text-xs sm:text-sm">
          {processInline(line.replace(/^\d+\. /, ''))}
        </li>
      );
    } else if (line === '') {
      elements.push(<div key={i} className="h-2" />);
    } else {
      elements.push(
        <p key={i} className="text-slate-200 leading-relaxed text-xs sm:text-sm">
          {processInline(line)}
        </p>
      );
    }
  });

  return <div className="space-y-0.5">{elements}</div>;
}

export const WorkspaceModal: React.FC<WorkspaceModalProps> = ({
  isOpen,
  onClose,
  onNotify,
  initialModel = 'GPT-5',
}) => {
  const [selectedModel, setSelectedModel] = useState<ModelName>(initialModel);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [promptInput, setPromptInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(getApiKey());
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKeySaved, setApiKeySaved] = useState(hasApiKey());
  const [errorBanner, setErrorBanner] = useState<{ title: string; detail: string; action?: string } | null>(null);
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<GeminiMessage[]>([]);
  const [threadTitle, setThreadTitle] = useState<string>('New Conversation');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Update initial model when prop changes
  useEffect(() => {
    setSelectedModel(initialModel);
  }, [initialModel]);

  // Show settings prompt if no API key
  useEffect(() => {
    if (isOpen && !hasApiKey()) {
      setShowSettings(true);
    }
  }, [isOpen]);

  const handleSaveApiKey = () => {
    if (apiKeyInput.trim()) {
      setApiKey(apiKeyInput.trim());
      setApiKeySaved(true);
      setShowSettings(false);
      setErrorBanner(null);
      onNotify('Gemini API key saved — real AI responses are now enabled!');
    }
  };

  const handleModelSwitch = (model: ModelName) => {
    setSelectedModel(model);
    setModelDropdownOpen(false);
    onNotify(`Switched active workspace model to ${model}`);
  };

  const handleStartNewThread = () => {
    setMessages([]);
    setConversationHistory([]);
    setPromptInput('');
    setErrorBanner(null);
    setThreadTitle('New Conversation');
    onNotify('Started new session');
  };

  const handleLoadThread = (thread: typeof initialMockThreads[0]) => {
    setMessages([...thread.messages]);
    setSelectedModel(thread.model);
    setConversationHistory(
      buildGeminiHistory(thread.messages.map((m) => ({ sender: m.sender, content: m.content })))
    );
    setThreadTitle(thread.title);
    setErrorBanner(null);
    onNotify(`Switched to thread: ${thread.title}`);
  };

  const handleSend = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!promptInput.trim() || isTyping) return;

      const userText = promptInput.trim();

      const userMsg: ChatMessage = {
        id: `u-${Date.now()}`,
        sender: 'user',
        content: userText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, userMsg]);
      setPromptInput('');
      setIsTyping(true);
      setErrorBanner(null);

      // Generate thread title from first message
      if (messages.length === 0) {
        setThreadTitle(userText.slice(0, 45) + (userText.length > 45 ? '…' : ''));
      }

      const historyForApi = conversationHistory;

      const result = await callGeminiApi(userText, selectedModel, historyForApi);
      setIsTyping(false);

      if (result.error) {
        const errInfo = getErrorMessage(result.error);
        setErrorBanner(errInfo);

        if (errInfo.action === 'open_settings') {
          setShowSettings(true);
        }
        onNotify(`Error: ${errInfo.title}`);
        return;
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        content: result.content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        model: selectedModel,
        reasoningTime: result.reasoningTime,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setConversationHistory((prev) => [
        ...prev,
        { role: 'user', parts: [{ text: userText }] },
        { role: 'model', parts: [{ text: result.content }] },
      ]);

      onNotify(`Response from ${selectedModel} in ${result.reasoningTime}`);
    },
    [promptInput, isTyping, selectedModel, messages.length, conversationHistory, onNotify]
  );

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    onNotify('Copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!isOpen) return null;

  const models: ModelName[] = ['GPT-5', 'Claude', 'Gemini', 'DeepSeek'];
  const modelColors: Record<ModelName, string> = {
    'GPT-5': 'text-emerald-400',
    'Claude': 'text-amber-400',
    'Gemini': 'text-blue-400',
    'DeepSeek': 'text-purple-400',
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.2 }}
          className={`w-full bg-[#0D0E15] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-200 ${
            isFullscreen ? 'h-full max-h-screen rounded-none' : 'max-w-6xl h-[90vh]'
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="EchoGPT Studio Workspace"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#131520] border-b border-white/[0.08] flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-accent-indigo flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="font-semibold text-sm text-white flex items-center gap-2">
                  EchoGPT Studio
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold border ${
                    apiKeySaved
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                  }`}>
                    {apiKeySaved ? 'LIVE AI' : 'SETUP NEEDED'}
                  </span>
                </span>
              </div>
            </div>

            {/* Model Selector Dropdown */}
            <div className="hidden sm:block relative">
              <button
                onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs font-medium text-slate-200 hover:border-white/20 transition-all"
              >
                <span className={`w-2 h-2 rounded-full bg-current ${modelColors[selectedModel]}`} />
                <span className={modelColors[selectedModel]}>{selectedModel}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <AnimatePresence>
                {modelDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="absolute top-full left-0 mt-1.5 w-44 rounded-xl bg-[#181B26] border border-white/15 shadow-2xl py-1 z-40"
                  >
                    <div className="px-3 py-1.5 text-[10px] uppercase font-semibold text-slate-400 border-b border-white/[0.06]">
                      Switch Model
                    </div>
                    {models.map((model) => (
                      <button
                        key={model}
                        onClick={() => handleModelSwitch(model)}
                        className="w-full flex items-center justify-between px-3 py-2 text-xs text-left hover:bg-white/[0.06] text-slate-200 hover:text-white transition-colors"
                      >
                        <span className={`font-medium ${modelColors[model]}`}>{model}</span>
                        {selectedModel === model && <Check className="w-3 h-3 text-accent-indigo" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-1.5 rounded-lg transition-colors ${
                  showSettings ? 'bg-accent-indigo text-white' : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
                }`}
                title="API Settings"
              >
                <Key className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.06] transition-colors hidden sm:flex"
                title="Toggle Fullscreen"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.06] transition-colors"
                title="Close Studio"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Settings Panel */}
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden flex-shrink-0"
              >
                <div className="px-5 py-4 bg-[#0F1119] border-b border-white/[0.06]">
                  <div className="flex items-center gap-2 mb-3">
                    <Settings className="w-4 h-4 text-accent-indigo" />
                    <span className="text-sm font-semibold text-white">Gemini API Configuration</span>
                    <span className="text-[10px] text-slate-400 ml-auto">
                      Get a free key at{' '}
                      <a
                        href="https://aistudio.google.com/app/apikey"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent-indigo hover:underline inline-flex items-center gap-0.5"
                      >
                        aistudio.google.com
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex-1 relative">
                      <input
                        type={showApiKey ? 'text' : 'password'}
                        value={apiKeyInput}
                        onChange={(e) => setApiKeyInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSaveApiKey()}
                        placeholder="AIza... (paste your Google Gemini API key)"
                        className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-accent-indigo/60 focus:ring-1 focus:ring-accent-indigo/40 pr-9"
                        id="gemini-api-key-input"
                      />
                      <button
                        type="button"
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                      >
                        {showApiKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <button
                      onClick={handleSaveApiKey}
                      disabled={!apiKeyInput.trim()}
                      className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex-shrink-0 ${
                        apiKeyInput.trim()
                          ? 'bg-accent-indigo hover:bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                          : 'bg-white/[0.06] text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      Save Key
                    </button>
                    {apiKeySaved && (
                      <button
                        onClick={() => setShowSettings(false)}
                        className="px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors flex-shrink-0"
                      >
                        Done
                      </button>
                    )}
                  </div>

                  {apiKeySaved && (
                    <div className="mt-2 flex items-center gap-1.5 text-[11px] text-emerald-400">
                      <Check className="w-3 h-3" />
                      <span>API key is saved. All 4 model personas are active.</span>
                    </div>
                  )}

                  <p className="mt-2 text-[11px] text-slate-500">
                    Your key is stored only in your browser's localStorage — never sent to any server other than Google's Gemini API.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Banner */}
          <AnimatePresence>
            {errorBanner && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden flex-shrink-0"
              >
                <div className="flex items-center justify-between px-4 py-2.5 bg-rose-500/10 border-b border-rose-500/20 text-xs">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                    <span className="font-semibold text-rose-300">{errorBanner.title}:</span>
                    <span className="text-rose-200">{errorBanner.detail}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                    {errorBanner.action === 'open_settings' && (
                      <button
                        onClick={() => setShowSettings(true)}
                        className="px-2.5 py-1 rounded-lg bg-rose-500/20 border border-rose-500/30 text-rose-300 hover:text-white hover:bg-rose-500/30 font-medium transition-colors"
                      >
                        Fix Settings
                      </button>
                    )}
                    <button onClick={() => setErrorBanner(null)} className="text-rose-400 hover:text-rose-200 p-0.5">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Workspace Body */}
          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <aside
              className={`${
                sidebarOpen ? 'w-60 sm:w-64' : 'w-0'
              } bg-[#10121A] border-r border-white/[0.06] flex-shrink-0 flex flex-col justify-between transition-all duration-200 overflow-hidden`}
            >
              <div className="p-3 space-y-3 overflow-y-auto">
                <button
                  onClick={handleStartNewThread}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-accent-indigo/20 hover:bg-accent-indigo/30 border border-accent-indigo/40 text-white text-xs font-semibold transition-colors"
                >
                  <Plus className="w-4 h-4 text-accent-indigo" />
                  <span>New Conversation</span>
                </button>

                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-2 pt-2">
                  Example Threads
                </div>
                {initialMockThreads.map((thread) => (
                  <button
                    key={thread.id}
                    onClick={() => handleLoadThread(thread)}
                    className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left text-xs hover:bg-white/[0.05] text-slate-300 hover:text-white transition-colors"
                  >
                    <span className="flex items-center gap-2 truncate pr-2">
                      <MessageSquare className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span className="truncate">{thread.title}</span>
                    </span>
                    <span className={`text-[10px] flex-shrink-0 font-medium ${modelColors[thread.model]}`}>
                      {thread.model}
                    </span>
                  </button>
                ))}
              </div>

              <div className="p-3 border-t border-white/[0.06] text-xs text-slate-400 flex items-center justify-between">
                <span>Multi-Model Router</span>
                <span className={`font-medium ${apiKeySaved ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {apiKeySaved ? 'Online' : 'Setup Needed'}
                </span>
              </div>
            </aside>

            {/* Chat conversation area */}
            <main className="flex-1 flex flex-col justify-between bg-[#0B0C12] overflow-hidden">
              {/* Chat header */}
              <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-white/[0.04] text-xs text-slate-400 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-1 rounded hover:bg-white/[0.05] text-slate-400 hover:text-white"
                  >
                    {sidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeft className="w-4 h-4" />}
                  </button>
                  <span className="truncate max-w-[200px] text-slate-300 font-medium">{threadTitle}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full bg-current ${modelColors[selectedModel]}`} />
                  <span className={`font-semibold ${modelColors[selectedModel]}`}>{selectedModel}</span>
                </div>
              </div>

              {/* Message scroll container */}
              <div className="flex-1 overflow-y-auto py-4 px-4 sm:px-6 space-y-5">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center text-slate-400 py-12">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-indigo via-accent-purple to-accent-cyan p-0.5 shadow-lg shadow-indigo-500/20 mb-5`}>
                      <div className="w-full h-full bg-[#0B0C12] rounded-[14px] flex items-center justify-center">
                        <Sparkles className="w-7 h-7 text-accent-indigo" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      Ask {selectedModel} anything
                    </h3>
                    <p className="text-sm text-slate-400 max-w-sm mb-6">
                      {apiKeySaved
                        ? `You're connected to ${selectedModel} via the Gemini API. Type any question below.`
                        : 'Add your Gemini API key in Settings (🔑) above to get real AI responses.'}
                    </p>
                    {!apiKeySaved && (
                      <button
                        onClick={() => setShowSettings(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent-indigo hover:bg-indigo-600 text-white text-sm font-semibold shadow-lg shadow-indigo-500/20 transition-all"
                      >
                        <Key className="w-4 h-4" />
                        <span>Add API Key</span>
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="max-w-3xl mx-auto w-full space-y-5">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                      >
                        <div className="flex items-center gap-2 mb-1 px-1 text-[11px] text-slate-400">
                          {msg.sender === 'assistant' ? (
                            <div className="flex items-center gap-1.5 font-medium">
                              <span className={`w-1.5 h-1.5 rounded-full bg-current ${modelColors[msg.model as ModelName || selectedModel]}`} />
                              <span className={modelColors[msg.model as ModelName || selectedModel]}>{msg.model || 'EchoGPT'}</span>
                            </div>
                          ) : (
                            <span>You</span>
                          )}
                          <span>•</span>
                          <span>{msg.timestamp}</span>
                          {msg.reasoningTime && (
                            <span className="text-slate-500">• {msg.reasoningTime}</span>
                          )}
                        </div>
                        <div
                          className={`rounded-2xl text-xs sm:text-sm max-w-[90%] leading-relaxed ${
                            msg.sender === 'user'
                              ? 'bg-accent-indigo text-white rounded-tr-none shadow-md shadow-indigo-600/20 px-4 py-3 whitespace-pre-wrap'
                              : 'bg-[#151825] text-slate-200 border border-white/10 rounded-tl-none shadow-md shadow-black/20 w-full px-4 py-3.5'
                          }`}
                        >
                          {msg.sender === 'assistant'
                            ? renderContent(msg.content)
                            : msg.content}

                          {msg.sender === 'assistant' && (
                            <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-400">
                              <button
                                onClick={() => handleCopy(msg.id, msg.content)}
                                className="flex items-center gap-1 hover:text-white transition-colors"
                              >
                                {copiedId === msg.id ? (
                                  <>
                                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                                    <span className="text-emerald-400">Copied</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3.5 h-3.5" />
                                    <span>Copy</span>
                                  </>
                                )}
                              </button>
                              <span className="text-slate-500">via Gemini API • {msg.model}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                    {isTyping && (
                      <div className="flex items-start gap-2 text-xs text-slate-400 pt-1">
                        <div className="w-6 h-6 rounded-lg bg-accent-indigo/20 flex items-center justify-center text-accent-indigo flex-shrink-0">
                          <Sparkles className="w-3 h-3 animate-spin" />
                        </div>
                        <div className="bg-[#151825] px-4 py-2.5 rounded-2xl border border-white/10 flex items-center gap-2 rounded-tl-none">
                          <span className={`font-medium ${modelColors[selectedModel]}`}>{selectedModel}</span>
                          <span className="text-slate-400">is thinking...</span>
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
              <div className="px-4 sm:px-6 py-3 border-t border-white/[0.04] flex-shrink-0">
                <form
                  onSubmit={handleSend}
                  className="relative rounded-2xl bg-[#141722] border border-white/10 focus-within:border-accent-indigo/50 focus-within:ring-1 focus-within:ring-accent-indigo/30 shadow-lg transition-all p-3"
                >
                  <textarea
                    ref={textareaRef}
                    value={promptInput}
                    onChange={(e) => setPromptInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend(e);
                      }
                    }}
                    rows={2}
                    placeholder={
                      apiKeySaved
                        ? `Ask ${selectedModel} anything… (Enter to send, Shift+Enter for new line)`
                        : 'Add your Gemini API key in Settings (🔑) above first…'
                    }
                    disabled={!apiKeySaved || isTyping}
                    className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none resize-none px-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Paperclip className="w-4 h-4 hover:text-white cursor-pointer" />
                      <span className="hidden sm:inline">
                        Model:{' '}
                        <strong className={modelColors[selectedModel]}>{selectedModel}</strong>
                      </span>
                    </div>
                    <button
                      type="submit"
                      disabled={!promptInput.trim() || !apiKeySaved || isTyping}
                      className={`p-2 rounded-xl text-white transition-all ${
                        promptInput.trim() && apiKeySaved && !isTyping
                          ? 'bg-accent-indigo hover:bg-indigo-600 shadow-md shadow-indigo-500/30 active:scale-95'
                          : 'bg-white/[0.08] text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                  </div>
                </form>
                <p className="text-[10px] text-slate-600 text-center mt-1.5">
                  Powered by Google Gemini API • Model personas: GPT-5, Claude, Gemini, DeepSeek
                </p>
              </div>
            </main>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
