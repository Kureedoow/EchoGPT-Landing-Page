import type { PricingPlan } from '../types';

export const pricingData: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    description: 'Flexible AI access for getting started.',
    ctaText: 'Get started',
    features: [
      'Access to standard AI models',
      'Unified conversation history',
      'Basic quick action workflows',
      'Desktop & mobile web access',
      'Standard response speeds'
    ],
    popular: false
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$12',
    period: '/ month',
    description: 'More AI access and capabilities for regular users.',
    ctaText: 'Start Pro',
    features: [
      'Unlimited multi-model switching',
      'Priority access to frontier models (GPT-5, Claude, Gemini, DeepSeek)',
      'Full Chrome extension integration',
      'Custom reusable prompt workflows',
      'Instant response & zero throttling',
      'Early access to new model releases'
    ],
    popular: true,
    badge: 'Most Popular'
  },
  {
    id: 'team',
    name: 'Team',
    price: 'Team',
    description: 'AI workflows for collaborative teams.',
    ctaText: 'Get started',
    features: [
      'Everything in Pro for all members',
      'Shared team workspace & templates',
      'Centralized billing & member management',
      'Enterprise-grade privacy & data safeguards',
      'Dedicated support & onboarding'
    ],
    popular: false,
    badge: 'For Organizations'
  }
];
