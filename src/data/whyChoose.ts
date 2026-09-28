import { Layers, ArrowLeftRight, Workflow, LayoutGrid } from 'lucide-react';
import type { WhyChooseItem } from '../types';

export const whyChooseData: WhyChooseItem[] = [
  {
    id: 'one-workspace',
    title: 'One workspace',
    description: 'Keep your AI workflows together in a unified, clutter-free environment.',
    icon: Layers,
  },
  {
    id: 'less-context-switching',
    title: 'Less context switching',
    description: 'Move between models without constantly changing applications and browser tabs.',
    icon: ArrowLeftRight,
  },
  {
    id: 'reusable-workflows',
    title: 'Reusable workflows',
    description: 'Use focused workflows for common tasks like code review, copy drafting, and summarization.',
    icon: Workflow,
  },
  {
    id: 'simple-modern-ux',
    title: 'Simple, modern UX',
    description: 'A clean interface designed around everyday work with thoughtful shortcuts and responsiveness.',
    icon: LayoutGrid,
  }
];
