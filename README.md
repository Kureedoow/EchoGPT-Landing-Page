# EchoGPT — One Workspace. Multiple AI Models. Better Answers.

![EchoGPT Banner](https://img.shields.io/badge/EchoGPT-Multi--Model%20AI%20Workspace-6366f1?style=for-the-badge&logo=sparkles&logoColor=white)
![React](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178c6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8.3-646cff?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-06b6d4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Gemini API](https://img.shields.io/badge/Google%20Gemini-API%20Powered-4285f4?style=for-the-badge&logo=google&logoColor=white)

> A premium AI landing page and **fully functional multi-model chat workspace** — powered by the Google Gemini API. Switch between GPT-5, Claude, Gemini, and DeepSeek personas in one unified interface.

---

## 📸 Preview

| Landing Page | AI Workspace | Model Selector |
|---|---|---|
| Dark hero with animated gradient | Real chat powered by Gemini API | Per-model persona switching |

---

## ✨ Features

### 🌐 Landing Page
- **Hero Section** — Animated headline with dual CTA buttons (Try Workspace + Chrome Extension)
- **Product Preview** — Interactive live chat demo embedded on the landing page
- **Features Section** — Animated feature cards with icons
- **AI Models Section** — Model cards with benchmark playground + "Try in Workspace" buttons
- **Why Choose EchoGPT** — Differentiator highlights
- **Pricing Section** — Free, Pro, and Team tiers with toggle
- **FAQ Section** — Collapsible accordion
- **CTA Section** — Final conversion block
- **Footer** — Navigation links with social icons
- **Navbar** — Sticky with scroll-aware glass blur effect + Command Palette trigger
- **Toast Notifications** — Real-time feedback for every action

### 🤖 AI Workspace (Fully Functional)
- **Real AI Responses** via Google Gemini 3.8 Flash API
- **4 Model Personas** — Each model has a unique system prompt:
  - **GPT-5** (OpenAI) — Precise, structured, code-focused
  - **Claude** (Anthropic) — Analytical, elegant, long-form writing
  - **Gemini** (Google) — Fast, creative, concise
  - **DeepSeek** (DeepSeek AI) — Mathematical, algorithmic, rigorous
- **Conversation History** — Full multi-turn memory sent with every message
- **Markdown Rendering** — Headers, bold, inline code, code blocks with language labels, bullet lists
- **Copy to Clipboard** — One-click copy on any AI response
- **Thread Management** — New conversation, example threads from sidebar
- **Fullscreen Mode** — Expand workspace to full screen
- **Error Handling** — Friendly banners for invalid key, rate limits, network errors

### 🔑 API Key Management
- Collapsible settings panel inside the workspace (🔑 icon)
- Key stored only in browser `localStorage` — never sent to any third-party server
- Show/hide toggle for the API key input
- Real-time status badge: **SETUP NEEDED** → **LIVE AI**

### ⌨️ Command Palette
- Triggered by `Ctrl+K` / `Cmd+K` or the Search button
- Navigate sections, open workspace, go to pricing

### 🧩 Chrome Extension Modal
- Simulated Chrome extension side-panel demo
- Install/uninstall toggle stored in `localStorage`

### 💳 Checkout Modal
- Plan selector (Free / Pro / Team)
- Monthly / Annual billing toggle (20% savings badge)
- Mock card payment simulation
- Activates plan on success with toast confirmation

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| **Framework** | React 19 + TypeScript 6 |
| **Build Tool** | Vite 8.3 |
| **Styling** | Tailwind CSS 3.4 |
| **Animations** | Framer Motion 13 |
| **Icons** | Lucide React |
| **AI API** | Google Gemini 3.8 Flash |
| **State** | React hooks + localStorage |
| **Linting** | OxLint |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- A free Google Gemini API key (see below)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/echogpt-landing.git
cd echogpt-landing

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The app will be available at **http://localhost:5173/**

### Getting Your Free Gemini API Key

1. Go to **[aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)**
2. Sign in with your Google account
3. Click **"Create API Key"** → **"Create API key in new project"**
4. Copy the key (starts with `AIza...`)
5. In the app: Click **"Try EchoGPT"** → Click the 🔑 icon → Paste your key → Click **"Save Key"**

> **Free Tier**: 1,500 requests/day, 15 requests/minute — completely free, no credit card needed.

---

## 📁 Project Structure

```
echogpt-landing/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── AIModels.tsx         # Model showcase + benchmark playground
│   │   ├── BrandIcons.tsx       # SVG brand icon components
│   │   ├── CheckoutModal.tsx    # Pricing checkout flow
│   │   ├── CommandPalette.tsx   # Ctrl+K command palette
│   │   ├── CTA.tsx              # Call-to-action section
│   │   ├── ExtensionModal.tsx   # Chrome extension demo modal
│   │   ├── FAQ.tsx              # Collapsible FAQ accordion
│   │   ├── FeatureCard.tsx      # Reusable feature card
│   │   ├── Features.tsx         # Features grid section
│   │   ├── Footer.tsx           # Site footer
│   │   ├── Hero.tsx             # Hero / above-the-fold section
│   │   ├── ModelCard.tsx        # Individual AI model card
│   │   ├── Navbar.tsx           # Sticky navigation bar
│   │   ├── Pricing.tsx          # Pricing section
│   │   ├── PricingCard.tsx      # Individual pricing tier card
│   │   ├── ProductPreview.tsx   # Interactive chat demo on landing page
│   │   ├── Toast.tsx            # Toast notification system
│   │   ├── WhyChoose.tsx        # Why choose section
│   │   └── WorkspaceModal.tsx   # Full AI chat workspace modal ⭐
│   ├── data/
│   │   ├── faq.ts               # FAQ content
│   │   ├── features.ts          # Features list content
│   │   ├── mockConversations.ts # Example thread data + types
│   │   ├── models.ts            # AI model metadata
│   │   ├── pricing.ts           # Pricing plan data
│   │   └── whyChoose.ts         # Why choose content
│   ├── services/
│   │   └── geminiApi.ts         # Google Gemini API client ⭐
│   ├── types/
│   │   └── index.ts             # Shared TypeScript types
│   ├── App.tsx                  # Root component + modal orchestration
│   ├── App.css                  # Global component styles
│   ├── index.css                # Tailwind + design system tokens
│   └── main.tsx                 # React entry point
├── index.html                   # HTML shell with SEO meta tags
├── tailwind.config.js           # Tailwind theme + custom tokens
├── vite.config.ts               # Vite configuration
├── tsconfig.json                # TypeScript config
└── package.json
```

---

## 🔧 Available Scripts

```bash
npm run dev        # Start development server with HMR
npm run build      # Build for production (TypeScript check + Vite bundle)
npm run preview    # Preview the production build locally
npm run lint       # Run OxLint for code quality checks
```

---

## 🎨 Design System

The project uses a custom Tailwind design system with semantic tokens:

| Token | Value | Usage |
|---|---|---|
| `bg-background` | `#090A0F` | Page background |
| `accent-indigo` | `#6366f1` | Primary CTA, active states |
| `accent-purple` | `#8b5cf6` | Gradients, accents |
| `accent-cyan` | `#22d3ee` | Highlights, badges |
| `text-text-primary` | `#f1f5f9` | Body text |
| `glass-nav` | Backdrop blur glass | Sticky navbar |

---

## 🔐 Security & Privacy

- **API key security**: Your Gemini API key is stored only in your **browser's `localStorage`**. It is sent exclusively to `generativelanguage.googleapis.com` (Google's official API) directly from your browser. No proxy server is involved.
- **No backend**: This is a fully client-side application. There is no server, no database, and no user data collection.
- **CORS**: All Gemini API calls are made directly from the browser using fetch — no CORS proxy needed.

---

## 🌐 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deploy
vercel --prod
```

### Netlify

```bash
# Build
npm run build

# Deploy the dist/ folder to Netlify
# Or connect your GitHub repo to Netlify for auto-deploys
```

### GitHub Pages

```bash
npm run build
# Deploy the dist/ folder using GitHub Actions or gh-pages package
```

> **Note**: Since this is a fully static SPA with no backend, it can be hosted on any static hosting provider.

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'feat: add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgements

- [Google Gemini API](https://ai.google.dev/) — for powering real AI responses
- [Framer Motion](https://www.framer.com/motion/) — for smooth animations
- [Lucide Icons](https://lucide.dev/) — for the clean icon set
- [Tailwind CSS](https://tailwindcss.com/) — for the utility-first styling
- [Vite](https://vitejs.dev/) — for the blazing-fast build tool

---

<p align="center">
  Built with ❤️ using React + TypeScript + Google Gemini API
</p>
