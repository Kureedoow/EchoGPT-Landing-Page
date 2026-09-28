import React from 'react';
import { pricingData } from '../data/pricing';
import { PricingCard } from './PricingCard';
import { Shield } from 'lucide-react';

interface PricingProps {
  onSelectPlan: (planName: string) => void;
}

export const Pricing: React.FC<PricingProps> = ({ onSelectPlan }) => {
  return (
    <section id="pricing" className="relative py-20 md:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
      {/* Background Glow */}
      <div 
        className="pointer-events-none absolute top-1/3 right-1/4 w-80 h-80 bg-accent-purple/10 rounded-full blur-[130px] -z-10" 
        aria-hidden="true" 
      />

      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs uppercase font-bold tracking-widest text-accent-indigo px-3 py-1 rounded-full bg-accent-indigo/10 border border-accent-indigo/20 inline-block mb-3.5">
          Pricing
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
          Simple plans for every workflow.
        </h2>
        <p className="mt-4 text-base sm:text-lg text-slate-400">
          Start for free to explore multi-model chat, or upgrade for unrestricted high-speed frontier access.
        </p>
      </div>

      {/* 3 cards horizontally on desktop, 1 on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        {pricingData.map((plan, idx) => (
          <PricingCard
            key={plan.id}
            plan={plan}
            index={idx}
            onSelectPlan={onSelectPlan}
          />
        ))}
      </div>

      <div className="mt-12 text-center flex items-center justify-center gap-2 text-xs text-slate-500">
        <Shield className="w-4 h-4 text-slate-400" />
        <span>No credit card required for Free plan. Cancel Pro anytime with one click.</span>
      </div>
    </section>
  );
};
