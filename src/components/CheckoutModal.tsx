import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  CreditCard, 
  ArrowRight
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  initialPlan?: string;
  onClose: () => void;
  onSuccess: (planName: string, cycle: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ 
  isOpen, 
  initialPlan = 'Pro', 
  onClose, 
  onSuccess 
}) => {
  const [selectedPlan, setSelectedPlan] = useState<string>(initialPlan);
  const [isAnnual, setIsAnnual] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const currentPrice = selectedPlan === 'Pro' 
    ? (isAnnual ? '$9.60 / mo' : '$12 / mo') 
    : selectedPlan === 'Team' 
      ? (isAnnual ? '$25.60 / mo' : '$32 / mo')
      : '$0';

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess(selectedPlan, isAnnual ? 'annual' : 'monthly');
      onClose();
    }, 800);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-xl bg-[#0D0F17] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-200"
          role="dialog"
          aria-modal="true"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 bg-[#12141F] border-b border-white/[0.08]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-accent-indigo flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-white">EchoGPT Workspace Upgrade</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.06] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleCheckout} className="p-6 space-y-5">
            {/* Billing Toggle (Monthly / Annual) */}
            <div className="flex items-center justify-center gap-3 p-1 rounded-xl bg-black/40 border border-white/10 text-xs max-w-xs mx-auto">
              <button
                type="button"
                onClick={() => setIsAnnual(false)}
                className={`flex-1 py-1.5 rounded-lg font-medium transition-all ${
                  !isAnnual ? 'bg-white/10 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setIsAnnual(true)}
                className={`flex-1 py-1.5 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 ${
                  isAnnual ? 'bg-accent-indigo text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Annual</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                  SAVE 20%
                </span>
              </button>
            </div>

            {/* Plan Selector Radios */}
            <div className="grid grid-cols-3 gap-2.5">
              {(['Free', 'Pro', 'Team'] as const).map((plan) => (
                <button
                  key={plan}
                  type="button"
                  onClick={() => setSelectedPlan(plan)}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    selectedPlan === plan
                      ? 'bg-accent-indigo/20 border-accent-indigo text-white ring-1 ring-accent-indigo'
                      : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  <div className="text-xs font-semibold">{plan}</div>
                  <div className="text-sm font-bold text-white mt-1">
                    {plan === 'Free' ? '$0' : plan === 'Pro' ? (isAnnual ? '$9.60' : '$12') : (isAnnual ? '$25.60' : '$32')}
                  </div>
                  <div className="text-[10px] text-slate-400">per month</div>
                </button>
              ))}
            </div>

            {/* Selected Plan Summary */}
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-white">{selectedPlan} Plan ({isAnnual ? 'Annual' : 'Monthly'})</span>
                <span className="font-extrabold text-white text-base">{currentPrice}</span>
              </div>
              <ul className="text-xs text-slate-300 space-y-1.5">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-accent-indigo flex-shrink-0" />
                  <span>Unlimited model switching between GPT-5, Claude, Gemini & DeepSeek</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-accent-indigo flex-shrink-0" />
                  <span>Full Chrome Extension sidepanel integration</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-accent-indigo flex-shrink-0" />
                  <span>Zero throttling & priority computing bandwidth</span>
                </li>
              </ul>
            </div>

            {/* Mock Payment Details */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-300 block">
                Payment Method (Test Mode Simulated)
              </label>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-black/40 border border-white/10 text-xs">
                <CreditCard className="w-4 h-4 text-slate-400" />
                <span className="font-mono text-slate-300 flex-1">•••• •••• •••• 4242</span>
                <span className="text-emerald-400 text-[10px] font-semibold bg-emerald-500/20 px-2 py-0.5 rounded">
                  Mock Card Ready
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3.5 px-4 rounded-xl bg-accent-indigo hover:bg-indigo-600 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Activating {selectedPlan} Workspace...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm & Activate {selectedPlan}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 text-center">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
              <span>Instant activation • 14-day money-back guarantee • Cancel anytime</span>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
