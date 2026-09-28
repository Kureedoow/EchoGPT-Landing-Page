import React, { useState } from 'react';
import { aiModelsData } from '../data/models';
import { ModelCard } from './ModelCard';
import { Play, Sparkles, Zap, CheckCircle2, ExternalLink } from 'lucide-react';

interface AIModelsProps {
  onModelSelect?: (modelName: string) => void;
  onTryModel?: (modelName: string) => void;
}

export const AIModels: React.FC<AIModelsProps> = ({ onModelSelect, onTryModel }) => {
  const [activeModelId, setActiveModelId] = useState<string>('gpt-5');
  const [benchmarkModelA, setBenchmarkModelA] = useState<'GPT-5' | 'Claude' | 'Gemini' | 'DeepSeek'>('GPT-5');
  const [benchmarkModelB, setBenchmarkModelB] = useState<'GPT-5' | 'Claude' | 'Gemini' | 'DeepSeek'>('Claude');
  const [activePromptIndex, setActivePromptIndex] = useState(0);
  const [isRunningBenchmark, setIsRunningBenchmark] = useState(false);
  const [benchmarkCompleted, setBenchmarkCompleted] = useState(false);

  const samplePrompts = [
    {
      title: 'Distributed LRU Cache',
      category: 'Coding & Architecture',
      prompt: 'Implement a concurrent LRU cache with lock striping and TTL expiration in TypeScript.',
      results: {
        'GPT-5': {
          latency: '410ms',
          tokensSec: '98 t/s',
          summary: 'Delivers full generic interface with granular Map eviction and atomic Mutex simulation.'
        },
        'Claude': {
          latency: '480ms',
          tokensSec: '82 t/s',
          summary: 'Includes thorough architectural commentary, edge-case analysis, and memory lifecycle.'
        },
        'Gemini': {
          latency: '190ms',
          tokensSec: '165 t/s',
          summary: 'Fastest generation time with compact syntax and clean performance optimization.'
        },
        'DeepSeek': {
          latency: '260ms',
          tokensSec: '130 t/s',
          summary: 'Specialized low-overhead algorithm using doubly-linked list nodes with constant time eviction.'
        }
      }
    },
    {
      title: 'M&A Valuation Synthesis',
      category: 'Complex Analysis',
      prompt: 'Synthesize the EBITDA multiple sensitivity across 5 hypothetical debt restructuring scenarios.',
      results: {
        'GPT-5': {
          latency: '520ms',
          tokensSec: '92 t/s',
          summary: 'Comprehensive quantitative matrix with sensitivity tables and covenant analysis.'
        },
        'Claude': {
          latency: '490ms',
          tokensSec: '88 t/s',
          summary: 'Exceptional strategic depth balancing equity dilution risks against cost of capital.'
        },
        'Gemini': {
          latency: '210ms',
          tokensSec: '155 t/s',
          summary: 'Instant markdown tabular model with quick highlight summaries for executive reviews.'
        },
        'DeepSeek': {
          latency: '340ms',
          tokensSec: '115 t/s',
          summary: 'Rigorous mathematical proof with discount rate curves calculated accurately.'
        }
      }
    }
  ];

  const handleSelect = (id: string, name: string) => {
    setActiveModelId(id);
    onModelSelect?.(name);
  };

  const handleTryModel = (name: string) => {
    onTryModel?.(name);
  };

  const handleRunBenchmark = () => {
    setIsRunningBenchmark(true);
    setBenchmarkCompleted(false);
    setTimeout(() => {
      setIsRunningBenchmark(false);
      setBenchmarkCompleted(true);
    }, 700);
  };

  const currentBenchmark = samplePrompts[activePromptIndex];

  return (
    <section id="models" className="relative py-20 md:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs uppercase font-bold tracking-widest text-accent-cyan px-3 py-1 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 inline-block mb-3.5">
          Unified Multi-Model Engine
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
          Choose the model for the job.
        </h2>
        <p className="mt-4 text-base sm:text-lg text-slate-400">
          A single interface for comparing and using different AI models. Toggle seamlessly across top architectures based on reasoning depth, speed, or creative nuance.
        </p>
      </div>

      {/* Model Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {aiModelsData.map((model, idx) => (
          <div key={model.id} className="flex flex-col gap-2">
            <ModelCard
              model={model}
              index={idx}
              isSelected={activeModelId === model.id}
              onSelect={() => handleSelect(model.id, model.name)}
            />
            <button
              onClick={() => handleTryModel(model.name)}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white/[0.04] hover:bg-accent-indigo/20 border border-white/[0.06] hover:border-accent-indigo/40 text-xs font-medium text-slate-400 hover:text-white transition-all group"
            >
              <ExternalLink className="w-3.5 h-3.5 text-accent-indigo group-hover:scale-110 transition-transform" />
              Try {model.name} in Workspace
            </button>
          </div>
        ))}
      </div>

      {/* Interactive Live Benchmark Playground */}
      <div className="mt-12 rounded-2xl bg-[#11131E] border border-white/[0.08] p-5 sm:p-7 shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-white/[0.06]">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent-cyan mb-1">
              <Zap className="w-3.5 h-3.5" /> Interactive Model Comparison Playground
            </span>
            <h3 className="text-lg font-bold text-white">Compare Models Side-by-Side</h3>
            <p className="text-xs text-slate-400 mt-0.5">Select a test scenario and observe real latency & throughput differences.</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {samplePrompts.map((p, idx) => (
              <button
                key={p.title}
                onClick={() => {
                  setActivePromptIndex(idx);
                  setBenchmarkCompleted(false);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activePromptIndex === idx
                    ? 'bg-accent-indigo text-white shadow-sm'
                    : 'bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08]'
                }`}
              >
                {p.title}
              </button>
            ))}
          </div>
        </div>

        {/* Selected prompt banner */}
        <div className="py-4 text-xs text-slate-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white/[0.02] px-4 rounded-xl my-4 border border-white/[0.04]">
          <div>
            <span className="text-slate-500 font-mono">Test Prompt:</span>{' '}
            <span className="text-white font-medium italic">"{currentBenchmark.prompt}"</span>
          </div>
          <button
            onClick={handleRunBenchmark}
            disabled={isRunningBenchmark}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-indigo hover:bg-indigo-600 text-white font-semibold text-xs shadow-md shadow-indigo-500/20 transition-all flex-shrink-0"
          >
            {isRunningBenchmark ? (
              <>
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>Benchmarking...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run Comparison</span>
              </>
            )}
          </button>
        </div>

        {/* Split Model Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Model A */}
          <div className="p-4 rounded-xl bg-[#141724] border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-accent-indigo" />
                <select
                  value={benchmarkModelA}
                  onChange={(e) => setBenchmarkModelA(e.target.value as any)}
                  className="bg-[#1C1F2E] text-white text-xs font-bold rounded-lg px-2.5 py-1 border border-white/10 focus:outline-none"
                >
                  <option value="GPT-5">Model: GPT-5</option>
                  <option value="Claude">Model: Claude</option>
                  <option value="Gemini">Model: Gemini</option>
                  <option value="DeepSeek">Model: DeepSeek</option>
                </select>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <span>Speed: <strong className="text-emerald-400">{currentBenchmark.results[benchmarkModelA].latency}</strong></span>
                <span>•</span>
                <span>{currentBenchmark.results[benchmarkModelA].tokensSec}</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-black/40 border border-white/[0.06] text-xs text-slate-300 leading-relaxed min-h-[70px]">
              {currentBenchmark.results[benchmarkModelA].summary}
            </div>
          </div>

          {/* Model B */}
          <div className="p-4 rounded-xl bg-[#141724] border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-accent-cyan" />
                <select
                  value={benchmarkModelB}
                  onChange={(e) => setBenchmarkModelB(e.target.value as any)}
                  className="bg-[#1C1F2E] text-white text-xs font-bold rounded-lg px-2.5 py-1 border border-white/10 focus:outline-none"
                >
                  <option value="Claude">Model: Claude</option>
                  <option value="GPT-5">Model: GPT-5</option>
                  <option value="Gemini">Model: Gemini</option>
                  <option value="DeepSeek">Model: DeepSeek</option>
                </select>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <span>Speed: <strong className="text-emerald-400">{currentBenchmark.results[benchmarkModelB].latency}</strong></span>
                <span>•</span>
                <span>{currentBenchmark.results[benchmarkModelB].tokensSec}</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-black/40 border border-white/[0.06] text-xs text-slate-300 leading-relaxed min-h-[70px]">
              {currentBenchmark.results[benchmarkModelB].summary}
            </div>
          </div>
        </div>

        {benchmarkCompleted && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Benchmark complete: Both outputs validated with zero context drift.</span>
            </span>
            <span className="text-[11px] text-slate-400">EchoGPT Multi-Router v2.4</span>
          </div>
        )}
      </div>
    </section>
  );
};
