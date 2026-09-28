import { 
  Bot, 
  Sparkles, 
  History, 
  Zap, 
  Globe, 
  Accessibility 
} from 'lucide-react';
import type { FeatureItem } from '../types';

export const featuresData: FeatureItem[] = [
  {
    id: 'multi-model',
    title: 'Multi-model chat',
    description: 'Switch between AI models in one conversation.',
    icon: Bot,
    badge: 'Core Engine'
  },
  {
    id: 'smart-workflows',
    title: 'Smart workflows',
    description: 'Quick actions for research, code, writing, and analysis.',
    icon: Sparkles,
  },
  {
    id: 'conversation-history',
    title: 'Conversation history',
    description: 'Keep projects organized and pick up where you left off.',
    icon: History,
  },
  {
    id: 'fast-focused',
    title: 'Fast & focused',
    description: 'A clean interface designed for speed and clarity.',
    icon: Zap,
    badge: '< 20ms UI'
  },
  {
    id: 'browser-extension',
    title: 'Browser extension',
    description: 'Bring EchoGPT to the page you are already using.',
    icon: Globe,
  },
  {
    id: 'accessible-default',
    title: 'Accessible by default',
    description: 'Responsive, keyboard-friendly, high-contrast UI.',
    icon: Accessibility,
  }
];
