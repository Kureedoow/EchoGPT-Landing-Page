import React from 'react';
import { Sparkles, Disc as Discord } from 'lucide-react';
import { GithubIcon, TwitterIcon } from './BrandIcons';

interface FooterProps {
  onActionClick: (msg: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onActionClick }) => {
  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetElement = document.querySelector(href);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="relative bg-[#07080C] border-t border-white/[0.07] pt-16 pb-12 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8 pb-12 border-b border-white/[0.06]">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <a href="#" className="flex items-center gap-2.5 inline-flex focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-indigo rounded-lg">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-purple to-accent-indigo flex items-center justify-center shadow-md shadow-indigo-500/20">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Echo<span className="text-accent-indigo">GPT</span>
              </span>
            </a>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              AI, organized around your work. Switch between top models seamlessly and keep your workflow focused in one unified space.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => onActionClick('Opening GitHub repository...')}
                className="w-8 h-8 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                aria-label="EchoGPT on GitHub"
              >
                <GithubIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => onActionClick('Opening Twitter/X page...')}
                className="w-8 h-8 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                aria-label="EchoGPT on Twitter"
              >
                <TwitterIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => onActionClick('Opening Discord community...')}
                className="w-8 h-8 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                aria-label="EchoGPT Discord community"
              >
                <Discord className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Product</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href="#features"
                  onClick={(e) => handleScrollTo(e, '#features')}
                  className="hover:text-white transition-colors"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#models"
                  onClick={(e) => handleScrollTo(e, '#models')}
                  className="hover:text-white transition-colors"
                >
                  AI Models
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  onClick={(e) => handleScrollTo(e, '#pricing')}
                  className="hover:text-white transition-colors"
                >
                  Pricing
                </a>
              </li>
              <li>
                <button
                  onClick={() => onActionClick('Redirecting to Chrome Web Store...')}
                  className="hover:text-white transition-colors text-left"
                >
                  Extension
                </button>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Company</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onActionClick('EchoGPT is designed for multi-model workflows.')}
                  className="hover:text-white transition-colors text-left"
                >
                  About
                </button>
              </li>
              <li>
                <button
                  onClick={() => onActionClick('Contact: support@echogpt.ai')}
                  className="hover:text-white transition-colors text-left"
                >
                  Contact
                </button>
              </li>
              <li>
                <button
                  onClick={() => onActionClick('Privacy Policy: All conversations remain private and client-side encrypted.')}
                  className="hover:text-white transition-colors text-left"
                >
                  Privacy
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 EchoGPT. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Built with React, TypeScript & Tailwind CSS</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
