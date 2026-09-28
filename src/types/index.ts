import type { LucideIcon } from 'lucide-react';

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  badge?: string;
}

export interface AIModelItem {
  id: string;
  name: string;
  provider: string;
  description: string;
  capabilities: string[];
  contextWindow: string;
  latency: 'Ultra Fast' | 'Fast' | 'Balanced';
  bestFor: string;
  color: string;
  accentBorder: string;
}

export interface WhyChooseItem {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface PricingFeature {
  text: string;
  included: boolean;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  ctaText: string;
  popular?: boolean;
  badge?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}
