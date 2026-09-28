import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { faqData } from '../data/faq';

export const FAQ: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  // Only one open at a time
  const [openId, setOpenId] = useState<string | null>('faq-1');

  const toggleFAQ = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="relative py-20 md:py-28 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs uppercase font-bold tracking-widest text-accent-indigo px-3 py-1 rounded-full bg-accent-indigo/10 border border-accent-indigo/20 inline-block mb-3.5">
          FAQ
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
          Frequently asked questions
        </h2>
        <p className="mt-4 text-base sm:text-lg text-slate-400">
          Everything you need to know about the product, extension, and model access.
        </p>
      </div>

      <div className="space-y-3.5">
        {faqData.map((item) => {
          const isOpen = openId === item.id;
          const buttonId = `faq-btn-${item.id}`;
          const panelId = `faq-panel-${item.id}`;

          return (
            <div
              key={item.id}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? 'bg-[#141724] border-accent-indigo/40 shadow-lg shadow-indigo-500/5'
                  : 'bg-[#11131C] border-white/[0.08] hover:border-white/15'
              }`}
            >
              <button
                id={buttonId}
                type="button"
                onClick={() => toggleFAQ(item.id)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="w-full flex items-center justify-between p-5 sm:p-6 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-indigo transition-colors"
              >
                <span className="text-base sm:text-lg font-semibold text-white tracking-tight pr-4">
                  {item.question}
                </span>
                <div
                  className={`w-7 h-7 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center text-slate-400 transition-transform duration-200 flex-shrink-0 ${
                    isOpen ? 'rotate-180 text-white bg-accent-indigo/20 border-accent-indigo/30' : ''
                  }`}
                >
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ 
                      height: 'auto', 
                      opacity: 1,
                      transition: {
                        height: shouldReduceMotion ? { duration: 0 } : { duration: 0.25, ease: 'easeOut' },
                        opacity: shouldReduceMotion ? { duration: 0 } : { duration: 0.2, delay: 0.05 }
                      }
                    }}
                    exit={{ 
                      height: 0, 
                      opacity: 0,
                      transition: {
                        height: shouldReduceMotion ? { duration: 0 } : { duration: 0.2, ease: 'easeIn' },
                        opacity: shouldReduceMotion ? { duration: 0 } : { duration: 0.1 }
                      }
                    }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-6 sm:px-6 sm:pb-6 text-sm sm:text-base text-slate-300 leading-relaxed border-t border-white/[0.04] pt-4">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
};
