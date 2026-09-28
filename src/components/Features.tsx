import React from 'react';
import { featuresData } from '../data/features';
import { FeatureCard } from './FeatureCard';

export const Features: React.FC = () => {
  return (
    <section id="features" className="relative py-20 md:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
      {/* Background ambient lighting */}
      <div 
        className="pointer-events-none absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-accent-indigo/10 rounded-full blur-[140px] -z-10" 
        aria-hidden="true" 
      />

      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs uppercase font-bold tracking-widest text-accent-indigo px-3 py-1 rounded-full bg-accent-indigo/10 border border-accent-indigo/20 inline-block mb-3.5">
          Features
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
          Everything you need to work with AI, without the tab switching.
        </h2>
        <p className="mt-4 text-base sm:text-lg text-slate-400">
          Built from the ground up for professionals who demand multiple models, speed, and continuous context.
        </p>
      </div>

      {/* Grid: 3 columns on desktop, 2 on tablet, 1 on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
        {featuresData.map((feature, idx) => (
          <FeatureCard key={feature.id} feature={feature} index={idx} />
        ))}
      </div>
    </section>
  );
};
