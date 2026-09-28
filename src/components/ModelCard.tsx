import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Cpu, Zap, ShieldCheck } from 'lucide-react';
import type { AIModelItem } from '../types';

interface ModelCardProps {
  model: AIModelItem;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
}

export const ModelCard: React.FC<ModelCardProps> = ({ model, index, isSelected, onSelect }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: shouldReduceMotion ? 0 : index * 0.08 }}
      whileHover={{ y: shouldReduceMotion ? 0 : -4 }}
      onClick={onSelect}
      className={`group relative p-6 rounded-2xl bg-[#12141D] border cursor-pointer transition-all duration-300 flex flex-col justify-between ${
        isSelected
          ? 'border-accent-indigo shadow-lg shadow-indigo-500/15 ring-1 ring-accent-indigo/40'
          : 'border-white/[0.08] hover:border-white/20 shadow-md shadow-black/20'
      }`}
    >
      {/* Background Gradient Tint */}
      <div 
        className={`pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br ${model.color} opacity-40 group-hover:opacity-75 transition-opacity`}
        aria-hidden="true"
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-white group-hover:scale-105 transition-transform">
              <Cpu className="w-5 h-5 text-accent-indigo" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">{model.name}</h3>
              <p className="text-xs text-slate-400 font-medium">{model.provider}</p>
            </div>
          </div>
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-white/[0.06] text-slate-300 border border-white/10 flex items-center gap-1">
            <Zap className="w-3 h-3 text-accent-cyan" />
            {model.latency}
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed min-h-[40px]">
          {model.description}
        </p>

        {/* Capability Tags */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {model.capabilities.map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-medium px-2.5 py-1 rounded-md bg-white/[0.04] text-slate-300 border border-white/[0.06]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="relative z-10 mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-accent-indigo" />
          <span className="truncate max-w-[170px]">{model.bestFor}</span>
        </div>
        <span className="text-[11px] font-semibold text-accent-indigo group-hover:underline">
          {isSelected ? 'Active Model' : 'Select'}
        </span>
      </div>
    </motion.div>
  );
};
