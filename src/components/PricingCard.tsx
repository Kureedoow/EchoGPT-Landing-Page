import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';
import type { PricingPlan } from '../types';

interface PricingCardProps {
  plan: PricingPlan;
  index: number;
  onSelectPlan: (planName: string) => void;
}

export const PricingCard: React.FC<PricingCardProps> = ({ plan, index, onSelectPlan }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: shouldReduceMotion ? 0 : index * 0.1 }}
      whileHover={{ y: shouldReduceMotion ? 0 : -5 }}
      className={`relative rounded-2xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
        plan.popular
          ? 'bg-[#151826] border-2 border-accent-indigo shadow-2xl shadow-indigo-500/10 ring-1 ring-accent-indigo/50'
          : 'bg-[#11131C] border border-white/[0.08] hover:border-white/20 shadow-lg shadow-black/30'
      }`}
    >
      {/* Popular Badge */}
      {plan.popular && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-accent-purple to-accent-indigo text-white shadow-md shadow-indigo-500/20 uppercase tracking-wider">
            <Sparkles className="w-3 h-3" />
            {plan.badge || 'Most Popular'}
          </span>
        </div>
      )}

      {/* Header Info */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold text-white tracking-tight">{plan.name}</h3>
          {!plan.popular && plan.badge && (
            <span className="text-[11px] font-medium text-slate-400 px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/10">
              {plan.badge}
            </span>
          )}
        </div>

        <p className="text-xs sm:text-sm text-slate-400 mb-6 min-h-[36px]">
          {plan.description}
        </p>

        {/* Pricing display */}
        <div className="flex items-baseline gap-1 mb-6 pb-6 border-b border-white/[0.08]">
          <span className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            {plan.price}
          </span>
          {plan.period && (
            <span className="text-sm font-medium text-slate-400">{plan.period}</span>
          )}
        </div>

        {/* Features list */}
        <ul className="space-y-3 mb-8 text-xs sm:text-sm text-slate-300" aria-label={`${plan.name} features`}>
          {plan.features.map((feature, fIdx) => (
            <li key={fIdx} className="flex items-start gap-3">
              <div className={`mt-0.5 rounded-full p-0.5 flex-shrink-0 ${
                plan.popular ? 'bg-accent-indigo text-white' : 'bg-white/10 text-slate-300'
              }`}>
                <Check className="w-3.5 h-3.5" />
              </div>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA Button */}
      <button
        onClick={() => onSelectPlan(plan.name)}
        className={`w-full py-3.5 px-4 rounded-xl text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
          plan.popular
            ? 'bg-accent-indigo hover:bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/40 active:scale-98'
            : 'bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/10 hover:border-white/20 active:scale-98'
        }`}
      >
        {plan.ctaText}
      </button>
    </motion.div>
  );
};
