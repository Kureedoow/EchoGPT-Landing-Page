import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Check, 
  Sparkles, 
  Bot, 
  ExternalLink,
  Zap,
  Globe
} from 'lucide-react';
import { ChromeIcon } from './BrandIcons';

interface ExtensionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNotify: (msg: string) => void;
}

export const ExtensionModal: React.FC<ExtensionModalProps> = ({ isOpen, onClose, onNotify }) => {
  const [isInstalled, setIsInstalled] = useState<boolean>(() => {
    return localStorage.getItem('echogpt_ext_installed') === 'true';
  });

  const handleToggleInstall = () => {
    const next = !isInstalled;
    setIsInstalled(next);
    localStorage.setItem('echogpt_ext_installed', String(next));
    onNotify(next ? 'EchoGPT Chrome Extension installed successfully!' : 'EchoGPT Chrome Extension removed.');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-4xl bg-[#0D0F17] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          role="dialog"
          aria-modal="true"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 bg-[#12141F] border-b border-white/[0.08]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-accent-indigo/20 border border-accent-indigo/30 flex items-center justify-center text-accent-indigo">
                <ChromeIcon className="w-5 h-5 text-accent-cyan" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  EchoGPT for Google Chrome
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold">
                    v2.4 Extension
                  </span>
                </h3>
                <p className="text-xs text-slate-400">Summon frontier models alongside any webpage or pull request</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.06] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Interactive Simulation Body */}
          <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
            {/* Split Screen Simulator */}
            <div className="rounded-xl border border-white/10 bg-[#090A0F] overflow-hidden shadow-xl">
              {/* Fake Chrome Browser Address Bar */}
              <div className="px-4 py-2 bg-[#171926] border-b border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/70" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
                  </div>
                  <div className="ml-3 px-3 py-1 rounded bg-black/40 border border-white/10 text-[11px] flex items-center gap-1.5 text-slate-300">
                    <Globe className="w-3 h-3 text-slate-400" />
                    <span>github.com/facebook/react/pull/31420</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-accent-indigo font-medium flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Extension Active
                  </span>
                </div>
              </div>

              {/* Split Content */}
              <div className="grid grid-cols-1 md:grid-cols-12 min-h-[300px]">
                {/* Left: Web Content */}
                <div className="md:col-span-7 p-4 border-b md:border-b-0 md:border-r border-white/[0.06] bg-[#0E1018] text-xs text-slate-300 space-y-3">
                  <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                    <span className="px-2 py-0.5 rounded bg-white/[0.05]">Pull Request #31420</span>
                    <span>Opened 2 hours ago</span>
                  </div>
                  <h4 className="text-sm font-semibold text-white">
                    feat(fiber): Optimize work-loop micro-task scheduling
                  </h4>
                  <p className="text-slate-400 leading-relaxed">
                    This patch reduces thread suspension duration by batching discrete micro-tasks before dispatching to the host scheduler. Benchmark runs demonstrate an 8.4% improvement in large DOM reconciliations.
                  </p>
                  <div className="p-2.5 rounded bg-black/40 border border-white/[0.06] font-mono text-[11px] text-slate-300">
                    <span className="text-emerald-400">+ function scheduleBatchYield(priorityLevel) &#123;</span><br />
                    <span className="text-emerald-400">+   return queueMicrotask(flushPendingWork);</span><br />
                    <span>&#125;</span>
                  </div>
                </div>

                {/* Right: EchoGPT Side Panel */}
                <div className="md:col-span-5 p-4 bg-[#12141F] flex flex-col justify-between text-xs">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
                      <span className="font-semibold text-white flex items-center gap-1.5">
                        <Bot className="w-3.5 h-3.5 text-accent-indigo" />
                        EchoGPT SidePanel
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-accent-indigo/20 text-accent-indigo text-[10px] font-bold">
                        GPT-5
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-black/30 border border-white/[0.06] text-slate-200 text-[11px] leading-relaxed">
                      <strong className="text-white">Auto-Context:</strong> Detected React PR #31420.
                      <div className="mt-1 text-slate-300">
                        ⚡ <em>Summary:</em> Batching micro-tasks improves layout rendering throughput by ~8%. Memory impact is neutral.
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/[0.08] flex items-center gap-2">
                    <span className="text-[10px] text-slate-400">Shortcut:</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-black/50 border border-white/10 text-[10px] font-mono text-white">
                      ⌥ + E
                    </kbd>
                    <span className="text-[10px] text-slate-500">to toggle</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Extension Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <Zap className="w-4 h-4 text-accent-cyan mb-2" />
                <h5 className="text-xs font-semibold text-white">Zero Tab Switching</h5>
                <p className="text-[11px] text-slate-400 mt-1">Chat or compare models right beside your docs and code.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <Sparkles className="w-4 h-4 text-accent-indigo mb-2" />
                <h5 className="text-xs font-semibold text-white">Instant Page Context</h5>
                <p className="text-[11px] text-slate-400 mt-1">One-click summarize or explain selected text on any website.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <ExternalLink className="w-4 h-4 text-accent-purple mb-2" />
                <h5 className="text-xs font-semibold text-white">Sync with Web App</h5>
                <p className="text-[11px] text-slate-400 mt-1">All threads automatically sync to your main EchoGPT workspace.</p>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 sm:p-5 bg-[#12141F] border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Compatible with Chrome, Brave, Edge & Arc browsers</span>
            </span>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={handleToggleInstall}
                className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  isInstalled
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                    : 'bg-accent-indigo hover:bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                }`}
              >
                {isInstalled ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Extension Installed (Click to Uninstall)</span>
                  </>
                ) : (
                  <>
                    <ChromeIcon className="w-4 h-4" />
                    <span>Add to Browser (Simulate Install)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
