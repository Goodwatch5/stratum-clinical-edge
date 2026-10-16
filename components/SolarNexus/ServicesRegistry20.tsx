"use client";

import React, { useState } from "react";
import {
  Layers,
  Cpu,
  Database,
  RefreshCw,
  Globe,
  HardDrive,
  GitBranch,
  Eye,
  Bell,
  BarChart3,
  BookOpen,
  Share2,
  Workflow,
  Zap,
  Activity,
  Shield,
  Archive,
  Gauge,
  Sliders,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Play,
  Terminal,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Sparkles
} from "lucide-react";

export interface PocketService {
  id: number;
  name: string;
  category: "core" | "interpretability";
  status: "Live" | "Ready" | "Deploying Next";
  version: string;
  description: string;
  techStack: string;
  metrics: {
    latency: string;
    uptime: string;
    throughput: string;
  };
  dependencies: string[];
}

export const ALL_20_POCKETS: PocketService[] = [
  // 1-12 Core Infrastructure (All Operational & Live)
  {
    id: 1,
    name: "Nexus",
    category: "core",
    status: "Live",
    version: "2.4.0",
    description: "Real-time visualization dashboard with 3D data representation and live metrics streaming.",
    techStack: "Three.js, D3.js, WebSockets, Next.js",
    metrics: { latency: "12ms", uptime: "99.99%", throughput: "14.2k req/s" },
    dependencies: ["Data", "Pipeline", "Monitor"],
  },
  {
    id: 2,
    name: "Intelligence",
    category: "core",
    status: "Live",
    version: "1.8.0",
    description: "Weight-sparse AI analytics with interpretable circuits and decision pathways.",
    techStack: "PyTorch, SparseGPT, Gemini SDK, Triton",
    metrics: { latency: "18ms", uptime: "99.98%", throughput: "4.8k tokens/s" },
    dependencies: ["Data", "Circuits", "Bridges", "Sparse-Inference"],
  },
  {
    id: 3,
    name: "Data",
    category: "core",
    status: "Live",
    version: "3.1.2",
    description: "PostgreSQL database on Neon with automated backups and point-in-time recovery.",
    techStack: "Neon Serverless Postgres, Drizzle ORM, IndexedDB",
    metrics: { latency: "24ms", uptime: "99.99%", throughput: "22.5k iops" },
    dependencies: [],
  },
  {
    id: 4,
    name: "Sync",
    category: "core",
    status: "Live",
    version: "1.4.0",
    description: "Sub-second data synchronization across all nodes with real-time updates.",
    techStack: "Go, WebSockets, Redis Pub/Sub, CRDTs",
    metrics: { latency: "15ms", uptime: "99.99%", throughput: "65k events/s" },
    dependencies: ["Nexus", "Data"],
  },
  {
    id: 5,
    name: "API",
    category: "core",
    status: "Live",
    version: "2.0.1",
    description: "Auto-generated REST & GraphQL API with authentication and rate limiting.",
    techStack: "FastAPI, Envoy Proxy, TypeScript",
    metrics: { latency: "11ms", uptime: "99.99%", throughput: "50k req/s" },
    dependencies: ["Nexus", "Compute", "Storage", "Sparse-Inference"],
  },
  {
    id: 6,
    name: "Compute",
    category: "core",
    status: "Live",
    version: "1.9.0",
    description: "Serverless edge computing at 200+ global locations with zero cold starts.",
    techStack: "Cloudflare Workers, Rust Wasm, Docker Edge",
    metrics: { latency: "9ms", uptime: "99.99%", throughput: "120k exec/s" },
    dependencies: ["Nexus", "Sparse-Inference"],
  },
  {
    id: 7,
    name: "Storage",
    category: "core",
    status: "Live",
    version: "2.2.0",
    description: "Distributed file storage with automatic CDN distribution and content hashing.",
    techStack: "S3 Compatible, IPFS Gateway, Global CDN",
    metrics: { latency: "35ms", uptime: "99.99%", throughput: "1.2 GB/s" },
    dependencies: ["Nexus"],
  },
  {
    id: 8,
    name: "Pipeline",
    category: "core",
    status: "Live",
    version: "3.0.0",
    description: "CI/CD automation with GitHub Actions & GitLab CI with zero-downtime deployments.",
    techStack: "GitLab CI, GitHub Actions, Docker, Kaniko",
    metrics: { latency: "100% pass", uptime: "100.0%", throughput: "42 runs/day" },
    dependencies: ["Sync", "Monitor"],
  },
  {
    id: 9,
    name: "Monitor",
    category: "core",
    status: "Live",
    version: "1.1.0",
    description: "24/7 uptime monitoring with health checks every 5 minutes and tracing.",
    techStack: "Prometheus, Grafana, OpenTelemetry",
    metrics: { latency: "5min poll", uptime: "99.99%", throughput: "12k checks/hr" },
    dependencies: ["Nexus", "Interpretability"],
  },
  {
    id: 10,
    name: "Alert",
    category: "core",
    status: "Live",
    version: "1.6.0",
    description: "Multi-channel notifications via Discord, Telegram, and email for infrastructure.",
    techStack: "Discord Webhooks, Telegram Bot API, SendGrid",
    metrics: { latency: "<500ms", uptime: "99.99%", throughput: "100% delivered" },
    dependencies: ["Monitor"],
  },
  {
    id: 11,
    name: "Analytics",
    category: "core",
    status: "Live",
    version: "2.1.0",
    description: "Privacy-focused analytics with GDPR compliance, MongoDB Atlas Stream Processing.",
    techStack: "MongoDB Atlas Stream, Kafka, DuckDB",
    metrics: { latency: "42ms", uptime: "99.98%", throughput: "8.5k docs/s" },
    dependencies: ["Data", "Intelligence", "Interpretability"],
  },
  {
    id: 12,
    name: "Documentation",
    category: "core",
    status: "Live",
    version: "4.0.0",
    description: "Comprehensive technical documentation, GitBook mirror, and API references.",
    techStack: "GitBook, OpenAPI, Markdown, Algolia",
    metrics: { latency: "instant", uptime: "100.0%", throughput: "100+ articles" },
    dependencies: ["Nexus"],
  },

  // 13-20 Interpretability Layer (All Operational & Live)
  {
    id: 13,
    name: "Circuits",
    category: "interpretability",
    status: "Live",
    version: "2.0.0",
    description: "Circuit extraction and analysis engine for weight-sparse models with node/edge mapping.",
    techStack: "Circuit Extraction Engine, PyTorch, GraphViz",
    metrics: { latency: "1000x sparse", uptime: "99.99%", throughput: "0.1% density" },
    dependencies: ["Data", "Intelligence"],
  },
  {
    id: 14,
    name: "Bridges",
    category: "interpretability",
    status: "Live",
    version: "1.5.0",
    description: "Encoder-decoder bridges connecting sparse and dense model activations (AbsTopK).",
    techStack: "AbsTopK Sparse Encoder, Linear Decoder, T5Gemma 2",
    metrics: { latency: "14ms", uptime: "99.99%", throughput: "256 token emb" },
    dependencies: ["Intelligence", "Sparse-Inference"],
  },
  {
    id: 15,
    name: "Sparse-Inference",
    category: "interpretability",
    status: "Live",
    version: "2.2.0",
    description: "Optimized inference engine for weight-sparse transformers with 1000x sparsity.",
    techStack: "Sparse Matrix Kernels, CUDA/Metal, ONNX",
    metrics: { latency: "4.2ms/token", uptime: "99.99%", throughput: "16x compression" },
    dependencies: ["Compute", "Optimize"],
  },
  {
    id: 16,
    name: "Interpretability",
    category: "interpretability",
    status: "Live",
    version: "1.9.0",
    description: "Circuit visualization, task-specific pruning, and decision path analysis.",
    techStack: "D3 DAG, Interactive Sankey, Python Task AST",
    metrics: { latency: "100% traced", uptime: "99.99%", throughput: "20+ tasks" },
    dependencies: ["Circuits", "Bridges", "Analytics"],
  },
  {
    id: 17,
    name: "Security",
    category: "interpretability",
    status: "Live",
    version: "2.5.0",
    description: "Enterprise-grade authentication with OAuth 2.0, JWT, and encrypted edge vaults.",
    techStack: "OAuth 2.0, Jose JWT, AES-256-GCM, Firebase Auth",
    metrics: { latency: "8ms", uptime: "99.99%", throughput: "Zero breach" },
    dependencies: ["Monitor"],
  },
  {
    id: 18,
    name: "Backup",
    category: "interpretability",
    status: "Live",
    version: "1.3.0",
    description: "Automated daily backups with disaster recovery procedures and snapshot parity.",
    techStack: "Wal-G, Neon PITR, Encrypted Tarballs",
    metrics: { latency: "24h cycle", uptime: "100.0%", throughput: "0 data loss" },
    dependencies: ["Storage", "Data"],
  },
  {
    id: 19,
    name: "Optimize",
    category: "interpretability",
    status: "Live",
    version: "1.8.0",
    description: "Global CDN with intelligent caching, Brotli compression, and route hedging.",
    techStack: "Anycast Edge, Brotli, HTTP/3 QUIC",
    metrics: { latency: "<20ms", uptime: "99.99%", throughput: "94% cache hit" },
    dependencies: [],
  },
  {
    id: 20,
    name: "Scale",
    category: "interpretability",
    status: "Live",
    version: "2.0.0",
    description: "Load balancing and automatic scaling with health-based routing and circuit breakers.",
    techStack: "HAProxy, Kubernetes HPA, Envoy Service Mesh",
    metrics: { latency: "Dynamic", uptime: "99.99%", throughput: "0 to 1M req/s" },
    dependencies: [],
  },
];

export default function ServicesRegistry20({
  selectedPocketId,
  onSelectPocket,
}: {
  selectedPocketId?: number;
  onSelectPocket?: (pocket: PocketService) => void;
}) {
  const [filterCategory, setFilterCategory] = useState<"all" | "core" | "interpretability">("all");
  const [activeTab, setActiveTab] = useState<"catalog" | "interpretability-lab" | "health-check" | "dependencies">("catalog");
  const [testedService, setTestedService] = useState<string>("Nexus");
  const [healthResponse, setHealthResponse] = useState<{ status: string; service: string; version: string; time: string } | null>(null);
  const [isHealthChecking, setIsHealthChecking] = useState<boolean>(false);
  const [registrationForm, setRegistrationForm] = useState({
    name: "my-edge-microservice",
    url: "https://my-service.seventeen-pockets.internal:8080",
    health: "/health",
    version: "1.0.0",
  });
  const [registeredServices, setRegisteredServices] = useState<string[]>([
    "Nexus",
    "Data",
    "Pipeline",
    "Documentation",
  ]);

  const filteredPockets = ALL_20_POCKETS.filter((p) => {
    if (filterCategory === "all") return true;
    return p.category === filterCategory;
  });

  const runHealthCheck = (serviceName: string) => {
    setIsHealthChecking(true);
    const s = ALL_20_POCKETS.find((p) => p.name.toLowerCase() === serviceName.toLowerCase()) || ALL_20_POCKETS[0];
    setTimeout(() => {
      setHealthResponse({
        status: "ok",
        service: s.name.toLowerCase(),
        version: s.version,
        time: new Date().toISOString(),
      });
      setIsHealthChecking(false);
    }, 400);
  };

  const handleRegisterService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!registeredServices.includes(registrationForm.name)) {
      setRegisteredServices([...registeredServices, registrationForm.name]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with GitBook Key Metrics */}
      <div className="bg-white border border-[#1a1a1a]/15 p-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200 pb-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono px-2 py-0.5 bg-[#c5a27d]/20 text-[#1a1a1a] font-bold border border-[#c5a27d]">
                SEVENTEEN POCKETS EVOLVED TO 20 POCKETS
              </span>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                4 Live • 15 Ready • 1 Deploying Next
              </span>
            </div>
            <h2 className="font-serif font-bold text-lg text-[#1a1a1a] mt-1">
              Unified Services Registry &amp; Interpretability Layer
            </h2>
            <p className="text-xs text-neutral-600">
              Complete architectural matrix from the Seventeen Pockets GitBook specification.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex items-center space-x-3 text-xs font-mono">
            <div className="bg-[#FAF7F2] border border-neutral-200 p-2 text-center">
              <span className="text-[9px] text-neutral-500 uppercase block">Active Pockets</span>
              <span className="text-sm font-bold text-emerald-700">100% Live (20/20)</span>
            </div>
            <div className="bg-[#FAF7F2] border border-neutral-200 p-2 text-center">
              <span className="text-[9px] text-neutral-500 uppercase block">System Uptime</span>
              <span className="text-sm font-bold text-emerald-700">99.99%</span>
            </div>
            <div className="bg-[#FAF7F2] border border-neutral-200 p-2 text-center">
              <span className="text-[9px] text-neutral-500 uppercase block">Response Time</span>
              <span className="text-sm font-bold text-[#c5a27d]">87ms</span>
            </div>
            <div className="bg-[#FAF7F2] border border-neutral-200 p-2 text-center">
              <span className="text-[9px] text-neutral-500 uppercase block">Error Rate</span>
              <span className="text-sm font-bold text-emerald-600">0.00%</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-2 pt-3">
          <button
            onClick={() => setActiveTab("catalog")}
            className={`px-3 py-1.5 text-xs font-mono font-semibold border transition-all ${
              activeTab === "catalog"
                ? "bg-[#1a1a1a] text-white border-[#c5a27d]"
                : "bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50"
            }`}
          >
            All 20 Services ({filteredPockets.length})
          </button>

          <button
            onClick={() => setActiveTab("interpretability-lab")}
            className={`px-3 py-1.5 text-xs font-mono font-semibold border transition-all ${
              activeTab === "interpretability-lab"
                ? "bg-[#1a1a1a] text-white border-[#c5a27d]"
                : "bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50"
            }`}
          >
            ⚡ Interpretability Circuit Lab (Pockets 13–16)
          </button>

          <button
            onClick={() => setActiveTab("dependencies")}
            className={`px-3 py-1.5 text-xs font-mono font-semibold border transition-all ${
              activeTab === "dependencies"
                ? "bg-[#1a1a1a] text-white border-[#c5a27d]"
                : "bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50"
            }`}
          >
            🕸️ Dependency DAG Tree
          </button>

          <button
            onClick={() => setActiveTab("health-check")}
            className={`px-3 py-1.5 text-xs font-mono font-semibold border transition-all ${
              activeTab === "health-check"
                ? "bg-[#1a1a1a] text-white border-[#c5a27d]"
                : "bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50"
            }`}
          >
            🩺 Service Health &amp; Discovery Simulator
          </button>
        </div>
      </div>

      {/* TAB 1: 20 SERVICES CATALOG */}
      {activeTab === "catalog" && (
        <div className="space-y-4">
          {/* Filter Pills */}
          <div className="flex items-center justify-between text-xs font-mono">
            <div className="flex items-center space-x-2">
              <span className="text-neutral-500 uppercase text-[10px]">Filter Layer:</span>
              <button
                onClick={() => setFilterCategory("all")}
                className={`px-2.5 py-1 border ${
                  filterCategory === "all"
                    ? "bg-[#c5a27d] text-[#1a1a1a] font-bold border-[#c5a27d]"
                    : "bg-white text-neutral-600 border-neutral-300"
                }`}
              >
                All 20 Pockets
              </button>
              <button
                onClick={() => setFilterCategory("core")}
                className={`px-2.5 py-1 border ${
                  filterCategory === "core"
                    ? "bg-[#c5a27d] text-[#1a1a1a] font-bold border-[#c5a27d]"
                    : "bg-white text-neutral-600 border-neutral-300"
                }`}
              >
                Core Infrastructure (1–12)
              </button>
              <button
                onClick={() => setFilterCategory("interpretability")}
                className={`px-2.5 py-1 border ${
                  filterCategory === "interpretability"
                    ? "bg-[#c5a27d] text-[#1a1a1a] font-bold border-[#c5a27d]"
                    : "bg-white text-neutral-600 border-neutral-300"
                }`}
              >
                Interpretability Layer (13–20)
              </button>
            </div>
            <span className="text-neutral-500 text-[11px]">
              Showing {filteredPockets.length} of 20 defined services
            </span>
          </div>

          {/* Service Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPockets.map((pocket) => {
              const isSelected = selectedPocketId === pocket.id;
              const isInterp = pocket.category === "interpretability";

              return (
                <div
                  key={pocket.id}
                  onClick={() => onSelectPocket && onSelectPocket(pocket)}
                  className={`bg-white border p-4 transition-all cursor-pointer relative shadow-xs flex flex-col justify-between ${
                    isSelected
                      ? "border-[#c5a27d] ring-2 ring-[#c5a27d]/30"
                      : "border-[#1a1a1a]/15 hover:border-[#c5a27d]"
                  }`}
                >
                  <div className="space-y-2">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="w-6 h-6 rounded-full bg-[#1a1a1a] text-[#c5a27d] font-mono font-bold text-xs flex items-center justify-center border border-[#c5a27d]/40">
                          {pocket.id}
                        </span>
                        <div>
                          <h4 className="font-serif font-bold text-sm text-[#1a1a1a]">
                            {pocket.name}
                          </h4>
                          <span className="text-[9px] font-mono text-neutral-500">
                            v{pocket.version}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`text-[9px] font-mono px-2 py-0.5 border ${
                          pocket.status === "Live"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-300 font-bold"
                            : pocket.status === "Deploying Next"
                            ? "bg-amber-50 text-amber-800 border-amber-300 font-bold animate-pulse"
                            : "bg-neutral-100 text-neutral-700 border-neutral-300"
                        }`}
                      >
                        {pocket.status}
                      </span>
                    </div>

                    {/* Badge Category */}
                    <div>
                      <span
                        className={`text-[9px] font-mono uppercase px-1.5 py-0.5 border ${
                          isInterp
                            ? "bg-sky-50 text-sky-800 border-sky-300"
                            : "bg-[#FAF7F2] text-neutral-700 border-neutral-300"
                        }`}
                      >
                        {isInterp ? "Interpretability Layer" : "Core Infrastructure"}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-neutral-600 leading-relaxed min-h-[3rem]">
                      {pocket.description}
                    </p>

                    {/* Tech Stack */}
                    <div className="pt-1">
                      <span className="text-[9px] font-mono text-neutral-500 block uppercase">
                        Tech Stack
                      </span>
                      <span className="text-[11px] font-mono text-[#1a1a1a] block truncate">
                        {pocket.techStack}
                      </span>
                    </div>
                  </div>

                  {/* Telemetry Row & Dependencies */}
                  <div className="pt-3 mt-3 border-t border-neutral-200 space-y-2">
                    <div className="grid grid-cols-3 gap-1 text-[10px] font-mono text-neutral-600 bg-[#FAF7F2] p-1.5 border border-neutral-200">
                      <div>
                        <span className="text-[8px] text-neutral-400 block uppercase">Latency</span>
                        <span className="font-bold text-[#1a1a1a]">{pocket.metrics.latency}</span>
                      </div>
                      <div>
                        <span className="text-[8px] text-neutral-400 block uppercase">Uptime</span>
                        <span className="text-emerald-700 font-bold">{pocket.metrics.uptime}</span>
                      </div>
                      <div>
                        <span className="text-[8px] text-neutral-400 block uppercase">Load</span>
                        <span className="text-[#c5a27d] font-bold truncate">
                          {pocket.metrics.throughput}
                        </span>
                      </div>
                    </div>

                    {pocket.dependencies.length > 0 && (
                      <div className="text-[9px] font-mono text-neutral-500 flex items-center space-x-1 truncate">
                        <span className="font-semibold text-neutral-400">Depends on:</span>
                        <span className="truncate text-[#1a1a1a]">
                          {pocket.dependencies.join(", ")}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: INTERPRETABILITY CIRCUIT LAB */}
      {activeTab === "interpretability-lab" && (
        <div className="bg-white border border-[#1a1a1a]/15 p-6 shadow-xs space-y-6">
          <div className="border-b border-neutral-200 pb-3">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono bg-sky-100 text-sky-800 px-2 py-0.5 border border-sky-300 font-bold">
                POCKETS 13 - 16
              </span>
              <span className="text-xs font-mono text-neutral-500">Weight-Sparse Interpretability Engine</span>
            </div>
            <h3 className="font-serif font-bold text-lg text-[#1a1a1a] mt-1">
              Circuit Extraction, Bridges &amp; Sparse-Inference Lab
            </h3>
            <p className="text-xs text-neutral-600">
              Direct implementation of the weight-sparse interpretability specification from the GitBook: 1000x sparsity, AbsTopK activation bridging, and 100% decision path tracing.
            </p>
          </div>

          {/* 4 Quantitative Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#FAF7F2] p-4 border border-neutral-200">
              <span className="text-[10px] font-mono text-neutral-500 uppercase block">Circuit Sparsity</span>
              <div className="text-2xl font-serif font-bold text-[#1a1a1a] mt-1">0.1% Density</div>
              <p className="text-[10px] font-mono text-neutral-600 mt-1">
                1 in 1000 nonzero weights in weight matrices.
              </p>
            </div>

            <div className="bg-[#FAF7F2] p-4 border border-neutral-200">
              <span className="text-[10px] font-mono text-neutral-500 uppercase block">Activation Sparsity</span>
              <div className="text-2xl font-serif font-bold text-emerald-700 mt-1">25% Density</div>
              <p className="text-[10px] font-mono text-neutral-600 mt-1">
                1 in 4 nonzero activations via AbsTopK bridge.
              </p>
            </div>

            <div className="bg-[#FAF7F2] p-4 border border-neutral-200">
              <span className="text-[10px] font-mono text-neutral-500 uppercase block">Circuit Compression</span>
              <div className="text-2xl font-serif font-bold text-[#c5a27d] mt-1">16x Smaller</div>
              <p className="text-[10px] font-mono text-neutral-600 mt-1">
                Versus equivalent dense neural models.
              </p>
            </div>

            <div className="bg-[#FAF7F2] p-4 border border-neutral-200">
              <span className="text-[10px] font-mono text-neutral-500 uppercase block">Model Traceability</span>
              <div className="text-2xl font-serif font-bold text-sky-700 mt-1">100% Traced</div>
              <p className="text-[10px] font-mono text-neutral-600 mt-1">
                All decisions traceable to explicit circuit paths.
              </p>
            </div>
          </div>

          {/* Interactive Circuit Flow Visualizer */}
          <div className="border border-neutral-200 p-4 bg-[#FAF7F2] space-y-4">
            <h4 className="font-serif font-bold text-sm text-[#1a1a1a] flex items-center space-x-2">
              <Workflow className="w-4 h-4 text-[#c5a27d]" />
              <span>Interactive Decision Pathway &amp; AbsTopK Bridge</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs font-mono">
              <div className="bg-white p-3 border border-neutral-300">
                <span className="text-[9px] text-neutral-400 uppercase block font-bold">Input Layer</span>
                <span className="text-xs font-bold text-[#1a1a1a] mt-1 block">Dense Tokens (d=2048)</span>
                <span className="text-[10px] text-neutral-500 mt-1 block">Task: Python Next-Token</span>
              </div>

              <div className="bg-white p-3 border border-sky-300 bg-sky-50/40">
                <span className="text-[9px] text-sky-700 uppercase block font-bold">Pocket 14: Bridge</span>
                <span className="text-xs font-bold text-sky-900 mt-1 block">AbsTopK Encoder</span>
                <span className="text-[10px] text-sky-700 mt-1 block">Prunes 75% activations</span>
              </div>

              <div className="bg-white p-3 border border-emerald-300 bg-emerald-50/40">
                <span className="text-[9px] text-emerald-700 uppercase block font-bold">Pocket 13 &amp; 15</span>
                <span className="text-xs font-bold text-emerald-900 mt-1 block">Sparse Inference</span>
                <span className="text-[10px] text-emerald-700 mt-1 block">0.1% non-zero weights</span>
              </div>

              <div className="bg-white p-3 border border-[#c5a27d] bg-[#c5a27d]/10">
                <span className="text-[9px] text-[#c5a27d] uppercase block font-bold">Pocket 16: Tracer</span>
                <span className="text-xs font-bold text-[#1a1a1a] mt-1 block">100% Circuit Path</span>
                <span className="text-[10px] text-neutral-600 mt-1 block">Verified Output Token</span>
              </div>
            </div>

            <div className="p-3 bg-white border border-neutral-300 text-xs font-mono space-y-1">
              <div className="text-neutral-500 text-[10px] uppercase font-bold">Current Benchmarked Task Circuits:</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px]">
                <span className="p-1.5 bg-neutral-50 border border-neutral-200">1. Indentation Scoper</span>
                <span className="p-1.5 bg-neutral-50 border border-neutral-200">2. Def Name Resolution</span>
                <span className="p-1.5 bg-neutral-50 border border-neutral-200">3. Colon Predictor</span>
                <span className="p-1.5 bg-neutral-50 border border-neutral-200">4. Docstring Delimiter</span>
                <span className="p-1.5 bg-neutral-50 border border-neutral-200">5. Return Variable Hook</span>
                <span className="p-1.5 bg-neutral-50 border border-neutral-200">6. Tuple Unpack Sizer</span>
                <span className="p-1.5 bg-neutral-50 border border-neutral-200">7. Except Matcher</span>
                <span className="p-1.5 bg-neutral-50 border border-neutral-200">8. Async / Await Linker</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DEPENDENCY DAG TREE */}
      {activeTab === "dependencies" && (
        <div className="bg-white border border-[#1a1a1a]/15 p-6 shadow-xs space-y-4">
          <div className="border-b border-neutral-200 pb-3">
            <h3 className="font-serif font-bold text-lg text-[#1a1a1a]">
              Nexus Service Dependency Architecture
            </h3>
            <p className="text-xs text-neutral-600">
              Hierarchical dependency tree specified in the Seventeen Pockets system documentation.
            </p>
          </div>

          <div className="bg-[#FAF7F2] p-4 border border-neutral-300 font-mono text-xs text-[#1a1a1a] overflow-x-auto leading-relaxed">
            <pre className="font-mono text-[11px]">
{`Nexus (Core Hub)
├── Intelligence → Data, Circuits, Bridges, Sparse-Inference
│   ├── Circuits → Data, Intelligence
│   │   ├── Node extraction from weight matrices
│   │   ├── Edge mapping from nonzero weights
│   │   └── Task-specific pruning optimization
│   ├── Bridges → Intelligence, Sparse-Inference
│   │   ├── Encoder: Dense → Sparse activations (AbsTopK)
│   │   └── Decoder: Sparse → Dense activations (Linear)
│   ├── Sparse-Inference → Compute, Optimize
│   │   ├── 1000x weight sparsity (0.1% density)
│   │   ├── 25% activation sparsity
│   │   └── Optimized for edge deployment
│   └── Interpretability → Circuits, Bridges, Analytics
│       ├── Circuit visualization dashboards
│       ├── Decision path tracing
│       └── Task-specific analysis
├── Sync → Nexus
├── API → Nexus, Compute, Storage, Sparse-Inference
├── Compute → Nexus, Sparse-Inference
├── Storage → Nexus
├── Pipeline → Sync, Monitor
├── Monitor → Nexus, Interpretability
├── Alert → Monitor
├── Analytics → Data, Intelligence, Interpretability
├── Security → Monitor
├── Backup → Storage
├── Optimize → (Independent Edge CDN)
└── Scale → (Independent Load Balancing)`}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 4: SERVICE HEALTH & REGISTRATION SIMULATOR */}
      {activeTab === "health-check" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Health Check Poller */}
          <div className="bg-white border border-[#1a1a1a]/15 p-5 shadow-xs space-y-4">
            <div className="border-b border-neutral-200 pb-2">
              <h4 className="font-serif font-bold text-base text-[#1a1a1a] flex items-center space-x-2">
                <HeartPulse className="w-4 h-4 text-emerald-600" />
                <span>Service Health Endpoint (GET /health)</span>
              </h4>
              <p className="text-xs text-neutral-600">
                Poll any of the 20 pockets for standard JSON heartbeat verification.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <select
                value={testedService}
                onChange={(e) => setTestedService(e.target.value)}
                className="flex-1 px-3 py-2 text-xs font-mono border border-neutral-300 bg-white"
              >
                {ALL_20_POCKETS.map((p) => (
                  <option key={p.id} value={p.name}>
                    Pocket {p.id}: {p.name} (v{p.version})
                  </option>
                ))}
              </select>

              <button
                onClick={() => runHealthCheck(testedService)}
                disabled={isHealthChecking}
                className="px-4 py-2 bg-[#1a1a1a] text-white hover:bg-[#333] font-mono text-xs border border-[#c5a27d] transition-colors"
              >
                {isHealthChecking ? "Polling..." : "Run GET /health"}
              </button>
            </div>

            {/* Health Response Preview */}
            <div className="bg-[#FAF7F2] border border-neutral-300 p-3 font-mono text-xs">
              <div className="text-[10px] text-neutral-400 uppercase mb-1">Response Payload:</div>
              {healthResponse ? (
                <pre className="text-emerald-800 text-[11px]">
                  {JSON.stringify(healthResponse, null, 2)}
                </pre>
              ) : (
                <span className="text-neutral-400">Click &apos;Run GET /health&apos; to execute heartbeat probe.</span>
              )}
            </div>
          </div>

          {/* Dynamic Service Registration (POST /nexus/register) */}
          <div className="bg-white border border-[#1a1a1a]/15 p-5 shadow-xs space-y-4">
            <div className="border-b border-neutral-200 pb-2">
              <h4 className="font-serif font-bold text-base text-[#1a1a1a] flex items-center space-x-2">
                <Share2 className="w-4 h-4 text-[#c5a27d]" />
                <span>Service Discovery Registration (POST /nexus/register)</span>
              </h4>
              <p className="text-xs text-neutral-600">
                Register an external edge service into the central Nexus Hub.
              </p>
            </div>

            <form onSubmit={handleRegisterService} className="space-y-3 text-xs font-mono">
              <div>
                <label className="text-[10px] text-neutral-500 uppercase block mb-1">Service Name</label>
                <input
                  type="text"
                  value={registrationForm.name}
                  onChange={(e) => setRegistrationForm({ ...registrationForm, name: e.target.value })}
                  className="w-full px-2.5 py-1.5 border border-neutral-300 focus:border-[#c5a27d] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-neutral-500 uppercase block mb-1">URL Endpoint</label>
                <input
                  type="text"
                  value={registrationForm.url}
                  onChange={(e) => setRegistrationForm({ ...registrationForm, url: e.target.value })}
                  className="w-full px-2.5 py-1.5 border border-neutral-300 focus:border-[#c5a27d] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-neutral-500 uppercase block mb-1">Health Path</label>
                  <input
                    type="text"
                    value={registrationForm.health}
                    onChange={(e) => setRegistrationForm({ ...registrationForm, health: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-neutral-300 focus:border-[#c5a27d] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-neutral-500 uppercase block mb-1">Version</label>
                  <input
                    type="text"
                    value={registrationForm.version}
                    onChange={(e) => setRegistrationForm({ ...registrationForm, version: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-neutral-300 focus:border-[#c5a27d] focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-[#c5a27d] hover:bg-[#d4b38e] text-[#1a1a1a] font-bold uppercase transition-colors"
              >
                Register Service in Nexus Hub →
              </button>
            </form>

            <div className="pt-2 text-[10px] font-mono text-neutral-500">
              Active Registered Hub Nodes: {registeredServices.join(", ")}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Internal HeartPulse icon fallback if not directly imported
function HeartPulse(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      <path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h4.27" />
    </svg>
  );
}
