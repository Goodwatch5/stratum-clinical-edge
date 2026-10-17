"use client";

import React, { useState } from "react";
import {
  BookOpen,
  ExternalLink,
  ChevronRight,
  FileText,
  Search,
  Copy,
  Check,
  Shield,
  Layers,
  Sparkles,
  GitBranch
} from "lucide-react";

interface DocArticle {
  id: string;
  title: string;
  category: string;
  sourceUrl: string;
  summary: string;
  content: string;
}

const GITBOOK_ARTICLES: DocArticle[] = [
  {
    id: "solar-nexus",
    title: "The Solar Nexus - Seventeen Pockets",
    category: "Core Visualization",
    sourceUrl: "https://branded-by-odell.gitbook.io/seventeen-pockets-by-odell/solar-nexus.md",
    summary: "Connecting Humanity Solarly. 3D visualization dashboard displaying real-time GitLab project metrics through an interactive Earth globe with 17 connected pocket nodes.",
    content: `# The Solar Nexus - Seventeen Pockets
**Connecting Humanity Solarly**

A stunning 3D visualization dashboard that displays real-time GitLab project metrics through an interactive Earth globe with 17 connected pocket nodes.

### ✨ Features
#### 🌍 3D Visualization
* **Interactive Earth Globe** - Rotating 3D Earth with wireframe overlay using Three.js
* **17 Pocket Nodes** - Distributed connection points with real-time pulse animations
* **Dynamic Connections** - Animated network lines between active nodes
* **Starfield Background** - 3,000+ particle stars for immersive space environment

#### 📊 Live Metrics Dashboard
* **Connected Nodes** - Real-time node count based on project activity
* **Solar Energy Flow** - Dynamic energy metrics calculated from GitLab data
* **System Uptime** - 99.99% operational status monitoring
* **Pipeline Success Rate** - Automated CI/CD pipeline health tracking
* **Zero Error Badge** - Rotating badge displaying current error count

#### 🔗 GitLab Integration
* **Live Data Feed** - Automatic fetching from GitLab API
* **Project Statistics** - Stars, forks, and issue tracking
* **Recent Commits** - Latest commit messages and authors
* **Auto-Refresh** - Updates every 30 seconds

#### 🤖 AI Intelligence Layer
* **Predictive Analysis** - Simulated AI monitoring messages
* **Anomaly Detection** - System health status updates
* **Neural Network** - Connection pathway optimization`,
  },
  {
    id: "setup-guide",
    title: "Solar Nexus - Complete Setup Guide",
    category: "Installation & CI/CD",
    sourceUrl: "https://branded-by-odell.gitbook.io/seventeen-pockets-by-odell/setup_guide.md",
    summary: "Step-by-step instructions for Python 3.11+, GitLab API access tokens, automated GitLab Pages deployment, and scheduled refresh.",
    content: `# Solar Nexus - Complete Setup Guide
This guide walks through setting up the Solar Nexus 3D visualization from scratch.

### 📋 Prerequisites
* Python 3.11+
* Git
* Modern Web Browser (Chrome, Firefox, Safari, Edge)
* GitLab Account with API access
* Group: \`intelligence-dev-for-seventeen-pockets\`

### 🔧 Configuration
\`\`\`bash
GITLAB_URL=https://gitlab.com
GITLAB_TOKEN=glpat-your-token-here
GITLAB_GROUP_ID=intelligence-dev-for-seventeen-pockets
GITLAB_USERNAME=goodwatch5
OUTPUT_FILE=public/data.json
\`\`\`

### 🔄 Automated Deployment (GitLab Pages)
1. Enable GitLab Pages in Settings → General → Visibility
2. Add CI/CD variable \`GITLAB_TOKEN\` (Protected & Masked)
3. Pipeline runs automatically on push to \`main\` and on schedule \`0 */6 * * *\``,
  },
  {
    id: "brand-manifest",
    title: "Seventeen Pockets — Brand Manifest",
    category: "Brand & Philosophy",
    sourceUrl: "https://branded-by-odell.gitbook.io/seventeen-pockets-by-odell/seventeen-pockets/odell-anderson-project-universe/brand-manifest.md",
    summary: "Owner: Odell Anderson. Part of the ODell Ecosystem | Branded by ODell | Powered by ODell and Light Creations.",
    content: `# Seventeen Pockets — Brand Manifest
**Owner:** Odell Anderson  
**Part of the ODell Ecosystem | Branded by ODell | Powered by ODell and Light Creations**

### Core Concept
**Functional, modular pieces** — each product contains 'seventeen pockets' of utility and narrative.

Every Seventeen Pockets product is designed with intentionality, combining practical functionality with meaningful storytelling. The "seventeen pockets" metaphor represents the multiple layers of value, purpose, and craftsmanship embedded in each piece.

### Brand Pillars
1. **Utility-First Design** — Form follows function, with specialized utility chambers.
2. **Modular Architecture** — Interchangeable, decoupled intelligence layers.
3. **Sovereign Privacy** — Zero-leakage localized patient and compute autonomy.
4. **Artisanal Craftsmanship** — Editorial beauty harmonized with extreme mechanical rigor.`,
  },
  {
    id: "services-registry",
    title: "Services Registry (Evolved to 20 Pockets)",
    category: "Architecture & Spec",
    sourceUrl: "https://branded-by-odell.gitbook.io/seventeen-pockets-by-odell/seventeen-pockets/odell-anderson-project-universe/services_registry.md",
    summary: "Unified registry of all services across Core Infrastructure (Pockets 1-12) and Interpretability Layer (Pockets 13-20).",
    content: `# Seventeen Pockets - Services Registry (Evolved to 20 Pockets)
Unified registry of all services in the Seventeen Pockets ecosystem with Interpretability Layer.

### Core Infrastructure (1-12)
* 1: Nexus (Live) - Real-time visualization dashboard with 3D representation
* 2: Intelligence (Ready) - Weight-sparse AI analytics with interpretable circuits
* 3: Data (Live) - PostgreSQL database on Neon with automated backups
* 4: Sync (Ready) - Sub-second data synchronization across all nodes
* 5: API (Ready) - Auto-generated REST API with auth & rate limiting
* 6: Compute (Ready) - Serverless edge computing at 200+ global locations
* 7: Storage (Ready) - Distributed file storage with automatic CDN
* 8: Pipeline (Live) - CI/CD automation with GitHub & GitLab Actions
* 9: Monitor (Deploying Next) - 24/7 uptime monitoring with health checks
* 10: Alert (Ready) - Multi-channel notifications via Discord, Telegram, Email
* 11: Analytics (Ready) - MongoDB Atlas Stream Processing & GDPR compliance
* 12: Documentation (Live) - Comprehensive GitBook & technical truth matrix

### Interpretability Layer (13-20)
* 13: Circuits (Ready) - Circuit extraction engine for weight-sparse models
* 14: Bridges (Ready) - Encoder-decoder bridges connecting sparse and dense activations
* 15: Sparse-Inference (Ready) - 1000x sparsity (0.1% density) inference engine
* 16: Interpretability (Ready) - Circuit visualization & decision path tracing
* 17: Security (Ready) - OAuth 2.0 & JWT enterprise auth
* 18: Backup (Ready) - Automated daily backups & disaster recovery
* 19: Optimize (Ready) - Global CDN with intelligent caching & Brotli
* 20: Scale (Ready) - Load balancing & health-based auto-routing`,
  },
  {
    id: "alert-system",
    title: "Pocket 10: Multi-Channel Alert System",
    category: "Operational Modules",
    sourceUrl: "https://branded-by-odell.gitbook.io/seventeen-pockets-by-odell/seventeen-pockets/odell-anderson-project-universe/pockets/alert.md",
    summary: "Real-time multi-channel notification service across Discord, Telegram, and Email for critical infrastructure events.",
    content: `# Pocket 10: Alert System
**Status:** Phase 3 - Core Infrastructure  
**Type:** Multi-Channel Notification Service  
**Cost:** $0/month (Discord, Telegram, Email)  
**Dependencies:** Pocket 09 (Monitor) recommended  
**Deployment Time:** 5 minutes

### Architecture
* **Discord**: Rich embeds, real-time webhooks
* **Telegram**: Bot API, immediate mobile alerts
* **Email**: Built-in transactional incident reports`,
  },
  {
    id: "multimodal-bridge",
    title: "Multimodal Bridge Pocket (T5Gemma 2)",
    category: "Operational Modules",
    sourceUrl: "https://branded-by-odell.gitbook.io/seventeen-pockets-by-odell/seventeen-pockets/odell-anderson-project-universe/pockets/multimodal-bridge.md",
    summary: "Vision-to-text and text-to-text processing leveraging T5Gemma 2 (1B-1B variant) with SigLIP frozen vision encoder across 140+ languages.",
    content: `# Multimodal Bridge Pocket
**Status:** Phase 3 - Core Infrastructure  
**Type:** Encoder-Decoder Service  
**Model:** T5Gemma 2 (1B-1B variant)  
**Context Window:** 128K tokens  
**Languages:** 140+

### Architecture
* **Vision Encoder**: SigLIP (frozen) - 417M parameters, outputs 256 image tokens
* **Text Processing**: T5Gemma 2 encoder-decoder with long-form attention`,
  },
];

export default function GitBookDocsViewer() {
  const [selectedArticle, setSelectedArticle] = useState<DocArticle>(GITBOOK_ARTICLES[0]);
  const [copied, setCopied] = useState<boolean>(false);
  const [searchFilter, setSearchFilter] = useState<string>("");

  const filteredArticles = GITBOOK_ARTICLES.filter(
    (a) =>
      a.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      a.summary.toLowerCase().includes(searchFilter.toLowerCase()) ||
      a.category.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(selectedArticle.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-white border border-[#1a1a1a]/15 p-4 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-[#1a1a1a] flex items-center justify-center text-[#c5a27d] border border-[#c5a27d]">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-sm text-[#1a1a1a]">
              Seventeen Pockets GitBook Knowledge Matrix
            </h3>
            <p className="text-[10px] font-mono text-neutral-500">
              Direct reader for: <code>https://branded-by-odell.gitbook.io/seventeen-pockets-by-odell</code>
            </p>
          </div>
        </div>

        <a
          href="https://branded-by-odell.gitbook.io/seventeen-pockets-by-odell"
          target="_blank"
          rel="noreferrer"
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#c5a27d] hover:bg-[#d4b38e] text-[#1a1a1a] font-mono text-xs font-bold uppercase transition-colors"
        >
          <span>Open Live GitBook Website</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* 2-Column Documentation Reader */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Sidebar Index */}
        <div className="bg-white border border-[#1a1a1a]/15 p-3 space-y-3 shadow-xs">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2" />
            <input
              type="text"
              placeholder="Search documentation..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-8 pr-2 py-1 text-xs font-mono border border-neutral-300 focus:outline-none focus:border-[#c5a27d]"
            />
          </div>

          <div className="space-y-1 max-h-[500px] overflow-y-auto pr-1">
            {filteredArticles.map((art) => {
              const isSelected = selectedArticle.id === art.id;
              return (
                <button
                  key={art.id}
                  onClick={() => setSelectedArticle(art)}
                  className={`w-full text-left p-2.5 border transition-all ${
                    isSelected
                      ? "bg-[#1a1a1a] text-white border-[#c5a27d]"
                      : "bg-[#FAF7F2] hover:bg-neutral-100 border-neutral-200 text-[#1a1a1a]"
                  }`}
                >
                  <span
                    className={`text-[8px] font-mono uppercase block mb-0.5 ${
                      isSelected ? "text-[#c5a27d]" : "text-neutral-500"
                    }`}
                  >
                    {art.category}
                  </span>
                  <div className="font-serif font-bold text-xs leading-snug">{art.title}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Article Reader Display */}
        <div className="md:col-span-2 bg-white border border-[#1a1a1a]/15 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
            <div>
              <span className="text-[9px] font-mono uppercase text-[#c5a27d] bg-[#c5a27d]/10 px-2 py-0.5 border border-[#c5a27d]/30 font-bold">
                {selectedArticle.category}
              </span>
              <h2 className="font-serif font-bold text-lg text-[#1a1a1a] mt-1.5">
                {selectedArticle.title}
              </h2>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopyMarkdown}
                className="flex items-center space-x-1 px-2.5 py-1 text-xs font-mono border border-neutral-300 hover:bg-neutral-50 text-neutral-700"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied" : "Copy Markdown"}</span>
              </button>

              <a
                href={selectedArticle.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="p-1 text-neutral-500 hover:text-[#1a1a1a]"
                title="Open Source MD"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="prose prose-sm max-w-none text-neutral-800 font-sans leading-relaxed">
            <div className="bg-[#FAF7F2] p-3 border-l-2 border-[#c5a27d] text-xs font-mono text-neutral-600 mb-4">
              {selectedArticle.summary}
            </div>

            <div className="whitespace-pre-wrap font-mono text-xs bg-neutral-50 p-4 border border-neutral-200 overflow-x-auto leading-relaxed">
              {selectedArticle.content}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
