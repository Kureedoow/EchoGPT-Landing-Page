import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { ChromeIcon } from './BrandIcons';

interface CTAProps {
  onStartClick: () => void;
  onExtensionClick: () => void;
}

export const CTA: React.FC<CTAProps> = ({ onStartClick, onExtensionClick }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative py-20 md:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-labelledby="cta-heading">
      <motion.div
        initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="relative rounded-3xl overflow-hidden p-8 sm:p-12 md:p-16 text-center border border-accent-indigo/30 bg-gradient-to-b from-[#16182B] via-[#101220] to-[#0D0F1A] shadow-2xl shadow-indigo-950/40"
      >
        {/* Glow Highlights */}
        <div 
          className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-accent-indigo/25 rounded-full blur-[100px] -z-10" 
          aria-hidden="true" 
        />
        <div 
          className="pointer-events-none absolute -bottom-24 right-1/4 w-[350px] h-[200px] bg-accent-purple/20 rounded-full blur-[90px] -z-10" 
          aria-hidden="true" 
        />

        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-accent-indigo/20 text-accent-indigo border border-accent-indigo/30 mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Unified Multi-Model Productivity</span>
          </div>

          <h2
            id="cta-heading"
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight"
          >
            Ready to make AI work feel simpler?
          </h2>

          <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-xl mx-auto leading-relaxed">
            Start with EchoGPT on the web or install the browser extension.
          </p>

          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onStartClick}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-base font-semibold text-white bg-accent-indigo hover:bg-indigo-600 rounded-xl shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-indigo"
            >
              <span>Start using EchoGPT</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onExtensionClick}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-medium text-slate-200 bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 hover:border-white/20 rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
            >
              <ChromeIcon className="w-4 h-4 text-accent-cyan" />
              <span>Install extension</span>
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
