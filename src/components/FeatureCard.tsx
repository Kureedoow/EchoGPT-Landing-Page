import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { FeatureItem } from '../types';

interface FeatureCardProps {
  feature: FeatureItem;
  index: number;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ feature, index }) => {
  const shouldReduceMotion = useReducedMotion();
  const Icon = feature.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: shouldReduceMotion ? 0 : index * 0.08 }}
      whileHover={{ y: shouldReduceMotion ? 0 : -4 }}
      className="group relative p-6 sm:p-7 rounded-2xl bg-[#12141D] hover:bg-[#161925] border border-white/[0.07] hover:border-accent-indigo/40 transition-all duration-300 shadow-lg shadow-black/20 flex flex-col justify-between"
    >
      {/* Subtle corner hover illumination */}
      <div 
        className="pointer-events-none absolute -top-px -right-px w-24 h-24 bg-gradient-to-bl from-accent-indigo/15 via-transparent to-transparent rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
        aria-hidden="true" 
      />

      <div>
        <div className="flex items-center justify-between mb-5">
          <div className="w-11 h-11 rounded-xl bg-accent-indigo/10 group-hover:bg-accent-indigo/20 border border-accent-indigo/20 flex items-center justify-center text-accent-indigo group-hover:scale-105 transition-all duration-200">
            <Icon className="w-5 h-5" />
          </div>
          {feature.badge && (
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/10 text-slate-400">
              {feature.badge}
            </span>
          )}
        </div>

        <h3 className="text-lg font-semibold text-white tracking-tight group-hover:text-slate-100 transition-colors">
          {feature.title}
        </h3>
        
        <p className="mt-2.5 text-sm text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
          {feature.description}
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-white/[0.04] flex items-center gap-2 text-xs font-medium text-slate-500 group-hover:text-accent-indigo transition-colors">
        <span>Learn more</span>
        <span className="group-hover:translate-x-1 transition-transform">→</span>
      </div>
    </motion.div>
  );
};
