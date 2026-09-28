import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { whyChooseData } from '../data/whyChoose';

export const WhyChoose: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="why-choose" className="relative py-20 md:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs uppercase font-bold tracking-widest text-accent-purple px-3 py-1 rounded-full bg-accent-purple/10 border border-accent-purple/20 inline-block mb-3.5">
          Philosophy
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
          Why choose EchoGPT?
        </h2>
        <p className="mt-4 text-base sm:text-lg text-slate-400">
          Engineered for cognitive focus. Everything is built to minimize friction and let your thinking flow.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {whyChooseData.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: shouldReduceMotion ? 0 : idx * 0.08 }}
              className="p-6 rounded-2xl bg-[#12141D] border border-white/[0.07] hover:border-white/15 transition-all duration-200 flex flex-col justify-start"
            >
              <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-accent-indigo mb-5">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white tracking-tight mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
