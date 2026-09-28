import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-[#181B26] border border-accent-indigo/40 shadow-2xl shadow-indigo-500/10 text-white max-w-sm"
          role="status"
          aria-live="polite"
        >
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-accent-indigo/20 flex items-center justify-center text-accent-indigo">
            <Sparkles className="w-4 h-4" />
          </div>
          <p className="text-sm font-medium text-slate-200 flex-1">{message}</p>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1 rounded-md"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
