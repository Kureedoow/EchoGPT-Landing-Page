import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { ChromeIcon } from './BrandIcons';

interface HeroProps {
  onStartClick: () => void;
  onExtensionClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartClick, onExtensionClick }) => {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.12,
        delayChildren: shouldReduceMotion ? 0 : 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] as const },
    },
  };

  return (
    <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 overflow-hidden" aria-labelledby="hero-heading">
      {/* Ambient background glow */}
      <div 
        className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] md:w-[850px] md:h-[450px] bg-accent-indigo/15 rounded-full blur-[120px] opacity-70 -z-10" 
        aria-hidden="true" 
      />
      <div 
        className="pointer-events-none absolute top-1/3 left-1/3 w-[300px] h-[250px] bg-accent-purple/10 rounded-full blur-[100px] opacity-50 -z-10" 
        aria-hidden="true" 
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center"
        >
          {/* Subtle Tag badge */}
          <motion.div variants={itemVariants} className="mb-6">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium bg-white/[0.04] border border-white/10 text-slate-300 shadow-sm backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-accent-indigo animate-pulse" />
              <span>Next-Gen Multi-Model Intelligence</span>
              <span className="text-slate-500">•</span>
              <span className="text-accent-indigo font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> v2.4 Live
              </span>
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            id="hero-heading"
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-extrabold tracking-tight text-white leading-[1.1] max-w-4xl"
          >
            One workspace.{' '}
            <span className="bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              Multiple AI models.
            </span>{' '}
            <span className="bg-gradient-to-r from-accent-purple via-accent-indigo to-accent-cyan bg-clip-text text-transparent">
              Better answers.
            </span>
          </motion.h1>

          {/* Supporting Text */}
          <motion.p
            variants={itemVariants}
            className="mt-6 text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl leading-relaxed font-normal"
          >
            Chat with leading AI models from one fast, focused workspace built for research, coding, writing, and everyday work.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 w-full sm:w-auto"
          >
            <button
              onClick={onStartClick}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-base font-semibold text-white bg-accent-indigo hover:bg-indigo-600 rounded-xl shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent-indigo focus-visible:ring-offset-[#090A0F]"
            >
              <span>Start using EchoGPT</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onExtensionClick}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-base font-medium text-slate-200 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
            >
              <ChromeIcon className="w-4 h-4 text-accent-cyan" />
              <span>Get the Chrome Extension</span>
            </button>
          </motion.div>

          {/* Social Proof / Trust Subtext */}
          <motion.div variants={itemVariants} className="mt-8 flex items-center gap-6 text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              No credit card required
            </span>
            <span className="text-slate-600">•</span>
            <span>Switch models anytime</span>
            <span className="text-slate-600">•</span>
            <span>Zero latency switching</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
