export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  model?: 'GPT-5' | 'Claude' | 'Gemini' | 'DeepSeek';
  reasoningTime?: string;
}

export interface ChatThread {
  id: string;
  title: string;
  time: string;
  model: 'GPT-5' | 'Claude' | 'Gemini' | 'DeepSeek';
  messages: ChatMessage[];
}

export const initialMockThreads: ChatThread[] = [
  {
    id: 'thread-1',
    title: 'Fullstack Auth with Supabase',
    time: '2h ago',
    model: 'GPT-5',
    messages: [
      {
        id: 'm1',
        sender: 'user',
        content: 'How should I implement session validation and refresh tokens securely in a Next.js 15 App Router app using Supabase SSR?',
        timestamp: '10:14 AM'
      },
      {
        id: 'm2',
        sender: 'assistant',
        content: `To implement secure session validation in Next.js 15 App Router with \`@supabase/ssr\`, follow this architecture:

1. **Middleware (\`middleware.ts\`)**: Refresh session cookies on incoming server requests:
\`\`\`typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } })
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )
  await supabase.auth.getUser()
  return response
}
\`\`\`

2. **Server Components**: Call \`supabase.auth.getUser()\` directly. Avoid \`getSession()\` on the server because \`getUser()\` validates authentic JWT signatures against the Supabase Auth server.`,
        timestamp: '10:14 AM',
        model: 'GPT-5',
        reasoningTime: '0.8s'
      }
    ]
  },
  {
    id: 'thread-2',
    title: 'Market analysis Q3 review',
    time: 'Yesterday',
    model: 'Claude',
    messages: [
      {
        id: 'm3',
        sender: 'user',
        content: 'Synthesize the key trends in enterprise AI spending for Q3 2025. Highlight ROI hurdles and consolidation patterns.',
        timestamp: '3:45 PM'
      },
      {
        id: 'm4',
        sender: 'assistant',
        content: `### Executive Summary: Q3 2025 Enterprise AI Spending Trends

1. **Shift from Exploratory Pilots to Unit-Economic ROI**:
   Enterprises have largely moved past raw model experimentation. Budget allocations now heavily penalize standalone chat interfaces without system-of-record integration. Priority is given to domain-specific multi-agent orchestrations with predictable token costs.

2. **Model Router Adoption**:
   Organizations are actively standardizing on multi-model routing layers (e.g. EchoGPT architecture). High-frequency classification and summarization queries are routed to distilled models (Gemini / DeepSeek), while mission-critical multi-step reasoning is dynamically delegated to frontier reasoning models.

3. **Vendor Consolidation**:
   IT departments report high fatigue with point-solution SaaS wrappers. Single platforms offering unified governance, telemetry, and vendor neutrality are capturing the bulk of enterprise budget expansions.`,
        timestamp: '3:46 PM',
        model: 'Claude',
        reasoningTime: '1.1s'
      }
    ]
  },
  {
    id: 'thread-3',
    title: 'Vector embeddings benchmark',
    time: '2 days ago',
    model: 'DeepSeek',
    messages: [
      {
        id: 'm5',
        sender: 'user',
        content: 'What are the latency tradeoffs between HNSW and IVF-PQ indexing on 10M 1536-dimensional vectors?',
        timestamp: '11:20 AM'
      },
      {
        id: 'm6',
        sender: 'assistant',
        content: `**HNSW vs IVF-PQ Latency & Memory Profile (10M vectors @ 1536d)**:

- **HNSW (Hierarchical Navigable Small World)**:
  - *Query Latency*: **2 - 5 ms** (p99) at >95% recall.
  - *Memory Footprint*: ~65 GB RAM (demands full memory residency).
  - *Indexing Time*: High (\~4-6 hours on 32-core instance).
  - *Verdict*: Ideal when sub-10ms latency is mandatory and RAM budget is ample.

- **IVF-PQ (Inverted File with Product Quantization)**:
  - *Query Latency*: **12 - 25 ms** (p99) at ~88-92% recall.
  - *Memory Footprint*: Compressed down to ~8-12 GB (massive 5x memory reduction).
  - *Verdict*: Cost-optimal for large scale where ~15ms latency is acceptable.`,
        timestamp: '11:20 AM',
        model: 'DeepSeek',
        reasoningTime: '0.4s'
      }
    ]
  },
  {
    id: 'thread-4',
    title: 'Refactoring React components',
    time: '4 days ago',
    model: 'Gemini',
    messages: [
      {
        id: 'm7',
        sender: 'user',
        content: 'Give me a clean custom hook for debounced window resize with passive event listeners.',
        timestamp: '9:12 AM'
      },
      {
        id: 'm8',
        sender: 'assistant',
        content: `Here is a lightweight, SSR-safe custom hook:

\`\`\`typescript
import { useState, useEffect } from 'react';

export function useDebouncedWindowSize(delay: number = 150) {
  const [size, setSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1280,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  });

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setSize({ width: window.innerWidth, height: window.innerHeight });
      }, delay);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, [delay]);

  return size;
}
\`\`\``,
        timestamp: '9:12 AM',
        model: 'Gemini',
        reasoningTime: '0.3s'
      }
    ]
  }
];

export function generateMockAIResponse(
  prompt: string, 
  model: 'GPT-5' | 'Claude' | 'Gemini' | 'DeepSeek'
): { content: string; reasoningTime: string } {
  const lower = prompt.toLowerCase();

  if (lower.includes('cache') || lower.includes('memoiz') || lower.includes('lru')) {
    return {
      reasoningTime: model === 'DeepSeek' ? '0.3s' : model === 'Gemini' ? '0.2s' : '0.9s',
      content: `Here is a production-grade TypeScript LRU Cache implementation generated by **${model}**:

\`\`\`typescript
export class LRUCache<K, V> {
  private capacity: number;
  private cache: Map<K, V> = new Map();

  constructor(capacity: number) {
    this.capacity = capacity;
  }

  get(key: K): V | undefined {
    if (!this.cache.has(key)) return undefined;
    // Refresh access order (delete and re-insert)
    const value = this.cache.get(key)!;
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  set(key: K, value: V): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      // Map keys are ordered by insertion; first key is LRU
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey !== undefined) this.cache.delete(oldestKey);
    }
    this.cache.set(key, value);
  }
}
\`\`\`
*Complexity: O(1) average time for both \`get\` and \`set\` operations using Map insertion ordering.*`
    };
  }

  if (lower.includes('research') || lower.includes('paper') || lower.includes('decod')) {
    return {
      reasoningTime: model === 'Claude' ? '0.8s' : '0.6s',
      content: `**Research Brief on Speculative Decoding in LLMs** (analyzed via **${model}**):

1. **Mechanics**: A small, fast draft model (e.g. 1B-3B parameters) generates $K$ candidate tokens cheaply. The large target model verifies all $K$ tokens in a single forward pass in parallel.
2. **Speedups**: Typical wall-clock speedups range from **2.0x to 2.8x** depending on the task's token predictability without sacrificing target model output distribution.
3. **Hardware Considerations**: Most advantageous on compute-bound GPUs (e.g. H100) where memory bandwidth is the primary bottleneck during autoregressive token-by-token generation.`
    };
  }

  if (lower.includes('launch') || lower.includes('release') || lower.includes('write')) {
    return {
      reasoningTime: '0.7s',
      content: `**EchoGPT v2.4 Release Announcement** (drafted with **${model}**):

We are thrilled to announce **EchoGPT v2.4** — the unified AI command center built for high-tempo teams.

**What's New**:
- **Multi-Model Orchestration**: Switch dynamically between GPT-5, Claude 3.7, Gemini 2.0, and DeepSeek within the same ongoing thread.
- **Deep Code Sandbox**: Instant syntax validation and architectural diagrams.
- **Sub-20ms UI**: Built from scratch for distraction-free focus.

Ready to simplify your AI workflows? Start free on web or get the Chrome extension today.`
    };
  }

  // Generic intelligent response
  return {
    reasoningTime: model === 'Gemini' ? '0.3s' : '0.8s',
    content: `**Analysis by ${model}**:

Regarding your prompt: *"Save and synthesize ${prompt}"*

1. **Core Recommendation**: Align the architecture around structured data contracts and asynchronous execution.
2. **Evaluation Metric**: Measure token efficiency and end-to-end user latency.
3. **Next Steps**: You can directly compare this output with other connected models (Claude, DeepSeek, or Gemini) using the model switcher above.`
  };
}
