import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Sparkles, 
  Bot, 
  CreditCard, 
  HelpCircle, 
  Layers, 
  ArrowRight
} from 'lucide-react';
import { ChromeIcon } from './BrandIcons';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction: (action: string) => void;
  onNavigateSection: (sectionId: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectAction,
  onNavigateSection
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const commands = [
    {
      id: 'workspace',
      title: 'Open Studio Workspace',
      subtitle: 'Launch interactive multi-model AI chat',
      icon: Sparkles,
      action: () => onSelectAction('open_workspace')
    },
    {
      id: 'features',
      title: 'Go to Features',
      subtitle: 'Multi-model chat, workflows, history',
      icon: Layers,
      action: () => {
        onNavigateSection('#features');
        onClose();
      }
    },
    {
      id: 'models',
      title: 'Compare AI Models',
      subtitle: 'GPT-5, Claude, Gemini, DeepSeek comparison',
      icon: Bot,
      action: () => {
        onNavigateSection('#models');
        onClose();
      }
    },
    {
      id: 'extension',
      title: 'Install Chrome Extension',
      subtitle: 'Bring EchoGPT to any webpage or side-panel',
      icon: ChromeIcon,
      action: () => onSelectAction('open_extension')
    },
    {
      id: 'pricing',
      title: 'View Pricing & Plans',
      subtitle: 'Free, Pro ($12/mo), Team',
      icon: CreditCard,
      action: () => {
        onNavigateSection('#pricing');
        onClose();
      }
    },
    {
      id: 'faq',
      title: 'Frequently Asked Questions',
      subtitle: 'Models, extension, and privacy information',
      icon: HelpCircle,
      action: () => {
        onNavigateSection('#faq');
        onClose();
      }
    }
  ];

  const filteredCommands = commands.filter(
    (c) =>
      c.title.toLowerCase().includes(query.toLowerCase()) ||
      c.subtitle.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="w-full max-w-xl bg-[#11131E] border border-white/10 rounded-2xl shadow-2xl overflow-hidden text-slate-200"
          role="dialog"
          aria-modal="true"
        >
          {/* Input field */}
          <div className="flex items-center px-4 py-3 border-b border-white/[0.08] gap-3">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type a command or search sections... (Esc to close)"
              className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
            />
            <kbd className="px-2 py-0.5 rounded bg-white/[0.06] border border-white/10 text-[10px] text-slate-400">
              ESC
            </kbd>
          </div>

          {/* Commands list */}
          <div className="p-2 max-h-80 overflow-y-auto space-y-1">
            {filteredCommands.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                No matching actions found for "{query}"
              </div>
            ) : (
              filteredCommands.map((cmd) => {
                const Icon = cmd.icon;
                return (
                  <button
                    key={cmd.id}
                    onClick={cmd.action}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.06] text-left transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/10 flex items-center justify-center text-accent-indigo group-hover:bg-accent-indigo group-hover:text-white transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white group-hover:text-white">
                          {cmd.title}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {cmd.subtitle}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </button>
                );
              })
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
