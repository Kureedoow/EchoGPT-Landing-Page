import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductPreview } from './components/ProductPreview';
import { Features } from './components/Features';
import { AIModels } from './components/AIModels';
import { WhyChoose } from './components/WhyChoose';
import { Pricing } from './components/Pricing';
import { FAQ } from './components/FAQ';
import { CTA } from './components/CTA';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { WorkspaceModal } from './components/WorkspaceModal';
import { ExtensionModal } from './components/ExtensionModal';
import { CheckoutModal } from './components/CheckoutModal';
import { CommandPalette } from './components/CommandPalette';
import type { ModelName } from './services/geminiApi';

export function App() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [extensionOpen, setExtensionOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState('Pro');
  const [workspaceInitialModel, setWorkspaceInitialModel] = useState<ModelName>('GPT-5');
  const [activePlan, setActivePlan] = useState<string>(() => {
    return localStorage.getItem('echogpt_active_plan') || 'Pro Plan';
  });

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((current) => (current === message ? null : current));
    }, 3500);
  };

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleOpenCheckout = (planName: string) => {
    setSelectedPlanForCheckout(planName);
    setCheckoutOpen(true);
  };

  const handleCheckoutSuccess = (planName: string, cycle: string) => {
    const newPlanText = `${planName} (${cycle})`;
    setActivePlan(newPlanText);
    localStorage.setItem('echogpt_active_plan', newPlanText);
    showToast(`Successfully subscribed to ${planName}! All frontier models unlocked.`);
  };

  const handleCommandAction = (action: string) => {
    setCommandPaletteOpen(false);
    if (action === 'open_workspace') {
      setWorkspaceOpen(true);
    } else if (action === 'open_extension') {
      setExtensionOpen(true);
    } else if (action === 'open_checkout') {
      setCheckoutOpen(true);
    }
  };

  const handleNavigateSection = (sectionId: string) => {
    const el = document.querySelector(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Open workspace with a specific model pre-selected (from AI Models section)
  const handleOpenWorkspaceWithModel = (modelName: ModelName) => {
    setWorkspaceInitialModel(modelName);
    setWorkspaceOpen(true);
  };

  return (
    <div className="relative min-h-screen bg-background text-text-primary flex flex-col overflow-x-hidden selection:bg-accent-indigo selection:text-white">
      {/* Global Background Glow Layers */}
      <div
        className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-radial-gradient opacity-60 -z-10"
        aria-hidden="true"
      />

      {/* 1. Navbar */}
      <Navbar
        onOpenWorkspace={() => setWorkspaceOpen(true)}
        onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        activePlan={activePlan}
      />

      {/* Main Content Sections */}
      <main id="main-content" className="flex-1">
        {/* 2. Hero Section */}
        <Hero
          onStartClick={() => setWorkspaceOpen(true)}
          onExtensionClick={() => setExtensionOpen(true)}
        />

        {/* 3. Product Preview / Screenshot */}
        <ProductPreview
          onInteraction={showToast}
          onOpenFullWorkspace={() => setWorkspaceOpen(true)}
        />

        {/* 4. Features Section */}
        <Features />

        {/* 5. AI Models Section — clicking a model opens workspace with that model */}
        <AIModels
          onModelSelect={(name) => {
            showToast(`Selected ${name} as default model`);
          }}
          onTryModel={(modelName) => {
            handleOpenWorkspaceWithModel(modelName as ModelName);
          }}
        />

        {/* 6. Why Choose EchoGPT Section */}
        <WhyChoose />

        {/* 7. Pricing Section */}
        <Pricing onSelectPlan={handleOpenCheckout} />

        {/* 8. FAQ Section */}
        <FAQ />

        {/* 9. Call-To-Action Section */}
        <CTA
          onStartClick={() => setWorkspaceOpen(true)}
          onExtensionClick={() => setExtensionOpen(true)}
        />
      </main>

      {/* 10. Footer */}
      <Footer
        onActionClick={(msg) => {
          if (msg.includes('Chrome')) {
            setExtensionOpen(true);
          } else {
            showToast(msg);
          }
        }}
      />

      {/* Modals & Real Web App Overlays */}
      <WorkspaceModal
        isOpen={workspaceOpen}
        onClose={() => setWorkspaceOpen(false)}
        onNotify={showToast}
        initialModel={workspaceInitialModel}
      />

      <ExtensionModal
        isOpen={extensionOpen}
        onClose={() => setExtensionOpen(false)}
        onNotify={showToast}
      />

      <CheckoutModal
        isOpen={checkoutOpen}
        initialPlan={selectedPlanForCheckout}
        onClose={() => setCheckoutOpen(false)}
        onSuccess={handleCheckoutSuccess}
      />

      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onSelectAction={handleCommandAction}
        onNavigateSection={handleNavigateSection}
      />

      {/* Toast Feedback Notification */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}

export default App;
