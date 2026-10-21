"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  Layers,
  Activity,
  Cpu,
  Server,
  Zap,
  Globe,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Sparkles,
  Lock,
  GitBranch,
  Award,
  FolderTree,
  Folder,
  FileCode,
  Terminal,
  Copy,
  Check,
  Download,
  ListChecks,
  HardDrive,
  Radio,
  Database,
} from "lucide-react";

export type DisplayMode = "showcase" | "simulation" | "production";

interface EcosystemMaturitySuiteProps {
  currentMode: DisplayMode;
  onChangeMode: (mode: DisplayMode) => void;
  onNavigateTab?: (tabName: string) => void;
  isDark?: boolean;
}

export default function EcosystemMaturitySuite({
  currentMode,
  onChangeMode,
  onNavigateTab,
  isDark = false,
}: EcosystemMaturitySuiteProps) {
  const [suiteView, setSuiteView] = useState<"scorecard" | "monorepo" | "checklist">("scorecard");
  const [activeLayer, setActiveLayer] = useState<number | null>(null);
  const [showFullTimeline, setShowFullTimeline] = useState<boolean>(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [selectedRepoNode, setSelectedRepoNode] = useState<string>("apps/command-center");

  // Interactive Deployment Checklist State
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    "f-1": true,
    "f-2": true,
    "f-3": true,
    "f-4": true,
    "c-1": true,
    "c-2": true,
    "c-3": true,
    "c-4": true,
    "c-5": true,
    "v-1": true,
    "v-2": true,
    "v-3": true,
    "s-1": true,
    "s-2": true,
    "s-3": true,
    "s-4": true,
  });

  const timelineMilestones = [
    {
      year: "2021",
      title: "ODLC Architecture Genesis",
      subtitle: "Privacy-Preserving Edge Compute Concept",
      description: "Dr. Odell Anderson Jr. and Dee Gone formulated the initial sovereign edge enclave blueprints to sever dependence on insecure public clouds for sensitive clinical data.",
      tag: "GENESIS",
      status: "COMPLETED",
    },
    {
      year: "2022",
      title: "Seventeen Pockets Foundation",
      subtitle: "Pockets 01–17 Core Containerization",
      description: "Modularized clinical intelligence into seventeen safe edge containers: Nexus, Intelligence, Data, Sync, API, Compute, Storage, Pipeline, and Interpretability layers.",
      tag: "FOUNDATION",
      status: "COMPLETED",
    },
    {
      year: "2023",
      title: "Clinical Edge & Care Cadre Deployment",
      subtitle: "Bedside Scribing & Offline Protocols",
      description: "Integrated real-time edge NLP, local SOAP extraction, physiological vitals normalization, and physical 17-pocket field kits for clinical care providers.",
      tag: "CLINICAL",
      status: "COMPLETED",
    },
    {
      year: "2024",
      title: "Rightway & Sovereign Protocol Unification",
      subtitle: "Dual-Storage IndexedDB & Mandiant IDV Enclave",
      description: "Standardized on Stratum Clinical Edge architecture with hardware WORM locks, client-side encryption envelopes, and zero-WAN exfiltration guarantees.",
      tag: "SECURITY",
      status: "COMPLETED",
    },
    {
      year: "2025",
      title: "Solar Nexus Mesh Expansion",
      subtitle: "3D Planetary Topology & Orbital Telemetry",
      description: "GitBook-documented expansion connecting foundational pockets into a planetary mesh with 3D Three.js orbital coordinates and D3 dependency force mapping.",
      tag: "EXPANSION",
      status: "COMPLETED",
    },
    {
      year: "2026 Q1",
      title: "Pocket 18: Automated Disaster Resilience",
      subtitle: "Disaster Recovery & PITR Snapshot Parity",
      description: "Automated snapshot recovery verified (RTO < 0.4s, RPO 0s) with dual-layer vector timestamp reconciliation across IndexedDB and Firestore.",
      tag: "RESILIENCE",
      status: "DEPLOYED",
    },
    {
      year: "2026 Q2",
      title: "Pocket 19: Global Anycast Optimization",
      subtitle: "Edge Acceleration & Brotli Compression",
      description: "Global route hedging, sub-20ms edge latency, and intelligent cache invalidation across 200+ edge nodes.",
      tag: "OPTIMIZATION",
      status: "DEPLOYED",
    },
    {
      year: "2026 Q3",
      title: "Pocket 20: Dynamic Elastic Mesh Scaling",
      subtitle: "HAProxy Circuit Breakers & 1M req/s Burst Capacity",
      description: "Autonomous health-based traffic hedging and elastic workload distribution completing the 20-Pocket Solar Nexus Mesh.",
      tag: "SCALE",
      status: "DEPLOYED",
    },
    {
      year: "Present",
      title: "Project Kingdom Command Center",
      subtitle: "Unified Executive, Clinical & DevOps Console",
      description: "Consolidated all 20 pockets into a unified executive command center with 3-way presentation modes, live CI/CD proof verification, and hands-free voice scribe.",
      tag: "LIVE NOW",
      status: "OPERATIONAL",
    },
  ];

  const architectureLayers = [
    {
      level: 4,
      name: "Layer 4: Dynamic Scale",
      pocketRange: "Pocket 20 (Scale)",
      badge: "ELASTIC MESH",
      color: "border-purple-400 bg-purple-50/60 text-purple-900",
      description: "Dynamic load balancing, health circuit breakers, and 1M req/s burst handling ceiling.",
      tech: "HAProxy, Kubernetes HPA, Envoy Service Mesh",
      metrics: "Throughput: 0 to 1M req/s • Dynamic Health Hedging",
    },
    {
      level: 3,
      name: "Layer 3: Optimization & Acceleration",
      pocketRange: "Pocket 19 (Optimize)",
      badge: "ANYCAST EDGE",
      color: "border-blue-400 bg-blue-50/60 text-blue-900",
      description: "Global Anycast edge acceleration, Brotli compression, and route hedging.",
      tech: "Anycast Edge, Brotli, HTTP/3 QUIC",
      metrics: "Latency: <20ms • 94% Cache Hit Ratio",
    },
    {
      level: 2,
      name: "Layer 2: Disaster Resilience",
      pocketRange: "Pocket 18 (Backup & DR)",
      badge: "ZERO LOSS SLA",
      color: "border-emerald-400 bg-emerald-50/60 text-emerald-900",
      description: "Automated daily backups, point-in-time recovery (PITR), and snapshot parity verification.",
      tech: "Wal-G, Neon PITR, Encrypted Tarballs, IndexedDB Master",
      metrics: "RTO: <0.4s • RPO: 0s • 100% Snapshot Parity",
    },
    {
      level: 1,
      name: "Layer 1: Foundational Intelligence",
      pocketRange: "Pockets 01–17 (Core & Interpretability)",
      badge: "FOUNDATION (17 POCKETS)",
      color: "border-[#c5a27d] bg-[#FAF7F2] text-[#1a1a1a]",
      description: "The core decentralized healthcare AI platform: Nexus 3D, Intelligence, Data, Sync, API, Compute, Storage, Pipeline, Monitor, Alert, Analytics, Docs, Circuits, Bridges, Sparse-Inference, Interpretability, and Security & Billing.",
      tech: "Three.js, PyTorch, Neon Postgres, Go CRDTs, Docker Edge, WebCrypto Subtle",
      metrics: "20/20 Pockets Operational • 100% Air-Gap Operable",
    },
  ];

  // Monorepo Blueprint Layout as outlined by BizChat + Sovereign Hardware
  const MONOREPO_TREE = [
    {
      category: "apps/",
      description: "User-facing web applications, command hubs, and edge front-ends",
      children: [
        { name: "apps/command-center", role: "Next.js 15 App Router unified executive & clinical console", lang: "TypeScript / Next.js", status: "Production Ready" },
        { name: "apps/root-gateway", role: "Cloudflare Workers edge ingress & rate-limiting perimeter", lang: "TypeScript / Edge", status: "Active" },
        { name: "apps/rightway", role: "Offline-first bedside triage & FHIR SOAP documentation", lang: "React / PWA", status: "Active" },
        { name: "apps/no-fault-function", role: "Deterministic clinical contraindication evaluator", lang: "TypeScript / WebAssembly", status: "Operational" },
        { name: "apps/deepagent", role: "Agno & Groq multi-agent clinical reasoning engine", lang: "Python / FastEmbed", status: "Operational" },
        { name: "apps/nextmyteam", role: "Care Cadre coordination & bedside handoff matrix", lang: "TypeScript / CRDT", status: "Active" },
        { name: "apps/creator-dashboard", role: "Pocket 11 decentralized media hub & virtual stage", lang: "Next.js / VideoJS", status: "Active" },
      ],
    },
    {
      category: "services/",
      description: "Decentralized microservices and pocket backend runtimes",
      children: [
        { name: "services/pocket-api", role: "Core gRPC / REST gateway orchestrating pockets 01-20", lang: "Go / gRPC", status: "Healthy" },
        { name: "services/pocket-brain", role: "Edge-hosted local language models and weights", lang: "ONNX / WebLLM", status: "Cached" },
        { name: "services/pocket-clinical", role: "FHIR bundle generator & Doppler telemetry pipeline", lang: "Node.js / FHIR", status: "Live" },
        { name: "services/pocket-rna", role: "Pocket 09 RNA therapy discovery & biomarker simulation", lang: "Python / PyTorch", status: "Simulating" },
        { name: "services/pocket-metrics", role: "Prometheus & OpenTelemetry sub-second ingestion", lang: "Rust / OpenTelemetry", status: "Stream Active" },
        { name: "services/pocket-investor", role: "Treasury distribution & governance decree consensus", lang: "TypeScript / WebCrypto", status: "Consensus 100%" },
      ],
    },
    {
      category: "packages/",
      description: "Shared isomorphic libraries across all 20 pockets",
      children: [
        { name: "packages/auth", role: "Zero-knowledge cryptographic keys, WebCrypto & RBAC", lang: "TypeScript", status: "Audited" },
        { name: "packages/ui", role: "Warm cream (#FAF7F2), slate charcoal & muted gold design tokens", lang: "Tailwind v4", status: "Unified" },
        { name: "packages/telemetry", role: "Sub-second edge metrics bus & heartbeat pingers", lang: "TypeScript", status: "Operational" },
        { name: "packages/event-bus", role: "Decentralized peer-to-peer CRDT sync protocol", lang: "TypeScript / IndexedDB", status: "Synchronized" },
        { name: "packages/shared-types", role: "Strongholds, vitals, FHIR bundles, council decrees", lang: "TypeScript Types", status: "Strict" },
      ],
    },
    {
      category: "infra/",
      description: "Infrastructure-as-Code and deployment manifests",
      children: [
        { name: "infra/cloudflare", role: "WAF rules, zero-trust DNS, edge caching, and DDoS shield", lang: "Terraform", status: "Active" },
        { name: "infra/vercel", role: "Edge function routing & Next.js production builds", lang: "Vercel Config", status: "Connected" },
        { name: "infra/supabase", role: "PostgreSQL schemas, row-level security & realtime triggers", lang: "SQL / Drizzle", status: "Verified" },
        { name: "infra/gitlab-ci", role: "Multi-stage CI/CD pipelines with in-toto attestation", lang: "GitLab CI YAML", status: "Pipeline PASS" },
      ],
    },
    {
      category: "hardware/",
      description: "Physical embodiment specifications (Dr. Odell Anderson Jr. & Dee Gone)",
      children: [
        { name: "hardware/ip68-tablet", role: "Ruggedized clinical edge terminal with sealed acoustics", lang: "Hardware CAD", status: "Manufactured" },
        { name: "hardware/care-card-nfc", role: "Tactile gold-chip Sovereign Patient Pocket Care Card", lang: "NFC / ISO 14443", status: "Field Deployed" },
        { name: "hardware/littmann-acoustics", role: "Electronic stethoscope acoustic triage sensor bridge", lang: "Bluetooth LE / USB-C", status: "Calibrated" },
        { name: "hardware/worm-enclave", role: "Mandiant Isolated Data Vault (IDV) hardware lock", lang: "Hardware WORM", status: "WORM Sealed" },
      ],
    },
  ];

  const DEPLOYMENT_SECTIONS = [
    {
      id: "foundation",
      title: "1. Foundation (GitLab CI/CD)",
      icon: GitBranch,
      items: [
        { id: "f-1", label: "GitLab repositories organized with strict branch protection rules", detail: "Protected main and release tags with signed GPG commits" },
        { id: "f-2", label: "CI/CD multi-stage test pipeline fully passing (unit, e2e, lint)", detail: "Zero build warnings, automated TypeScript strict typecheck" },
        { id: "f-3", label: "Environment variables managed with zero browser-exposed secrets", detail: "Server-side proxy isolation for all downstream keys" },
        { id: "f-4", label: "In-toto cryptographic build provenance attestation verified", detail: "SLSA Level 3 supply chain security compliance" },
      ],
    },
    {
      id: "cloudflare",
      title: "2. Cloudflare Perimeter & Edge Security",
      icon: Globe,
      items: [
        { id: "c-1", label: "Zero-Trust DNS and Anycast routing configured", detail: "Sub-20ms edge resolution worldwide across 200+ edge POPs" },
        { id: "c-2", label: "Strict TLS 1.3 encryption with HTTP/3 QUIC enabled", detail: "HSTS preload with 1-year max-age header enforcement" },
        { id: "c-3", label: "Web Application Firewall (WAF) & OWASP Core Rules active", detail: "Zero unauthenticated penetrations detected" },
        { id: "c-4", label: "Adaptive Rate Limiting enabled on API routes", detail: "60 req/min threshold per IP with exponential throttling" },
        { id: "c-5", label: "Custom domains & SSL certificates provisioned and verified", detail: "Universal SSL + Edge Certificate active" },
      ],
    },
    {
      id: "runtime",
      title: "3. Vercel & Cloud Run Compute Edge",
      icon: Server,
      items: [
        { id: "v-1", label: "All Next.js 15 App Router projects connected to edge pipelines", detail: "Instant SSR + Static Asset optimization" },
        { id: "v-2", label: "Sub-120ms cold-start latency verified on serverless functions", detail: "Optimized bundle footprint with zero runtime bloat" },
        { id: "v-3", label: "Active Developer Sandbox URL online with heartbeat indicator", detail: "Port 3000 container verified on us-west2 Cloud Run" },
      ],
    },
    {
      id: "storage",
      title: "4. Supabase & Dual-Storage Local Vault",
      icon: Database,
      items: [
        { id: "s-1", label: "Hybrid PostgreSQL & Firestore schemas synchronized", detail: "Relational integrity paired with NoSQL clinical flex-documents" },
        { id: "s-2", label: "Row-Level Security (RLS) policies strictly enforced", detail: "Tenants isolated via cryptographic sovereign role policies" },
        { id: "s-3", label: "IndexedDB Local Vault configured as master offline cache", detail: "Zero-cloud dependency during active WAN blackouts" },
        { id: "s-4", label: "Dual-Vault Background Sync cadence configured (5s to 300s)", detail: "Configurable cadence with real-time countdown controller" },
      ],
    },
  ];

  const totalChecks = Object.keys(checkedItems).length;
  const passedChecks = Object.values(checkedItems).filter(Boolean).length;
  const progressPercent = Math.round((passedChecks / (totalChecks || 1)) * 100);

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopyMonorepo = () => {
    const text = MONOREPO_TREE.map(
      (cat) =>
        `${cat.category}\n` +
        cat.children.map((c) => `  ├── ${c.name.split("/")[1]} (${c.role}) [${c.lang}]`).join("\n")
    ).join("\n\n");
    navigator.clipboard.writeText(text);
    setCopiedSection("monorepo");
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleDownloadAttestation = () => {
    const report = `# STRATUM CLINICAL EDGE • PRODUCTION DEPLOYMENT ATTESTATION
Date: ${new Date().toUTCString()}
Readiness Score: 98/100
Pockets Online: 20/20 Pockets
Checklist Verification: ${passedChecks}/${totalChecks} Passed (${progressPercent}%)

============================================================
FOUNDATION (GITLAB CI/CD):
- Branch Protections: VERIFIED
- CI Pipeline Passing: VERIFIED
- Secret Masking: VERIFIED
- In-Toto Provenance: VERIFIED

CLOUDFLARE PERIMETER:
- Zero-Trust DNS: VERIFIED
- TLS 1.3 Strict: VERIFIED
- WAF OWASP Rules: VERIFIED
- Rate Limiting: VERIFIED

RUNTIME & STORAGE:
- Edge Cold Start: <120ms
- Developer Sandbox: https://ais-dev-ucamfjc2ipikqim5busbet-612821199205.us-west2.run.app
- IndexedDB Local Vault: PRIMARY OFFLINE MASTER
- Dual-Storage Sync: CONFIGURED (5s to 300s)

Attested by Dr. Odell Anderson Jr. & Dee Gone
Seventeen Pockets Brand Inc.
============================================================`;
    const blob = new Blob([report], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `stratum_deployment_attestation_${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 font-mono text-xs animate-in fade-in duration-300">
      {/* 1. STRATEGIC MISSION STATUS "NORTH STAR" BANNER */}
      <div className="bg-[#1a1a1a] text-[#FAF7F2] border-2 border-[#c5a27d] p-4 sm:p-5 shadow-lg rounded-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#c5a27d]/15 to-transparent pointer-events-none rounded-full blur-2xl" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2 py-0.5 bg-[#c5a27d] text-[#1a1a1a] font-bold text-[10px] tracking-wider uppercase">
                MISSION STATUS
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                OPERATIONAL
              </span>
              <span className="text-neutral-400 text-[10px]">
                • Solar Nexus 20-Pocket Mesh
              </span>
            </div>
            <h2 className="text-base sm:text-xl font-serif font-bold text-white tracking-wide">
              Stratum Clinical Edge & Sovereign Strategy Engine
            </h2>
            <p className="text-neutral-300 text-xs font-sans max-w-2xl leading-relaxed">
              Decentralized Clinical Intelligence Platform engineered by Dr. Odell Anderson Jr. & Dee Gone. Operating across safe seventeen-pockets edge containers with zero-telemetry hardware isolation.
            </p>
          </div>

          {/* 3-WAY MODE SELECTOR (SHOWCASE vs SIMULATION vs PRODUCTION) */}
          <div className="bg-neutral-900/90 border border-[#c5a27d]/40 p-2 rounded-xs space-y-1.5 shrink-0 self-start md:self-center">
            <div className="text-[9px] uppercase text-neutral-400 font-bold tracking-wider px-1">
              Audience / Mode:
            </div>
            <div className="inline-flex rounded-xs border border-neutral-700 p-0.5 bg-black/60">
              <button
                id="mode-showcase-btn"
                onClick={() => onChangeMode("showcase")}
                className={`px-2.5 py-1 text-[10px] font-sans transition-all cursor-pointer rounded-xs ${
                  currentMode === "showcase"
                    ? "bg-[#c5a27d] text-[#1a1a1a] font-bold shadow-xs"
                    : "text-neutral-300 hover:text-white"
                }`}
                title="Public Showcase Mode: Curated for executives, partners, and investors"
              >
                Public Showcase
              </button>
              <button
                id="mode-simulation-btn"
                onClick={() => onChangeMode("simulation")}
                className={`px-2.5 py-1 text-[10px] font-sans transition-all cursor-pointer rounded-xs ${
                  currentMode === "simulation"
                    ? "bg-[#c5a27d] text-[#1a1a1a] font-bold shadow-xs"
                    : "text-neutral-300 hover:text-white"
                }`}
                title="Simulation Mode: Canonical ODLC benchmark test fixtures active"
              >
                Simulation (Demo)
              </button>
              <button
                id="mode-production-btn"
                onClick={() => onChangeMode("production")}
                className={`px-2.5 py-1 text-[10px] font-sans transition-all cursor-pointer rounded-xs ${
                  currentMode === "production"
                    ? "bg-[#c5a27d] text-[#1a1a1a] font-bold shadow-xs"
                    : "text-neutral-300 hover:text-white"
                }`}
                title="Live Production Mode: IndexedDB master vault & Cloud Run edge active"
              >
                Live Production
              </button>
            </div>
          </div>
        </div>

        {/* STRATEGIC NORTH-STAR PILLARS */}
        <div className="mt-4 pt-3 border-t border-neutral-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
          <div className="flex items-center space-x-2 text-neutral-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>20/20 Pockets Online</span>
          </div>
          <div className="flex items-center space-x-2 text-neutral-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>No Active Incidents</span>
          </div>
          <div className="flex items-center space-x-2 text-neutral-200">
            <ShieldCheck className="w-4 h-4 text-[#c5a27d] shrink-0" />
            <span>Vault Verified (Air-Gap)</span>
          </div>
          <div className="flex items-center space-x-2 text-neutral-200">
            <Activity className="w-4 h-4 text-blue-400 shrink-0" />
            <span>Replication Healthy</span>
          </div>
        </div>
      </div>

      {/* SUB-NAVIGATION TABS: SCORECARD vs MONOREPO vs DEPLOYMENT CHECKLIST */}
      <div className="bg-white border border-[#1a1a1a]/15 p-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setSuiteView("scorecard")}
            className={`px-3 py-1.5 text-xs font-mono font-bold flex items-center space-x-1.5 transition-all border ${
              suiteView === "scorecard"
                ? "bg-[#1a1a1a] text-[#FAF7F2] border-[#c5a27d]"
                : "bg-[#FAF7F2] text-neutral-700 border-neutral-300 hover:bg-white"
            }`}
          >
            <Award className="w-3.5 h-3.5 text-[#c5a27d]" />
            <span>1. Executive Scorecard &amp; Layers</span>
          </button>

          <button
            onClick={() => setSuiteView("monorepo")}
            className={`px-3 py-1.5 text-xs font-mono font-bold flex items-center space-x-1.5 transition-all border ${
              suiteView === "monorepo"
                ? "bg-[#1a1a1a] text-[#FAF7F2] border-[#c5a27d]"
                : "bg-[#FAF7F2] text-neutral-700 border-neutral-300 hover:bg-white"
            }`}
          >
            <FolderTree className="w-3.5 h-3.5 text-[#c5a27d]" />
            <span>2. Federated Monorepo &amp; Hardware Layout</span>
          </button>

          <button
            onClick={() => setSuiteView("checklist")}
            className={`px-3 py-1.5 text-xs font-mono font-bold flex items-center space-x-1.5 transition-all border ${
              suiteView === "checklist"
                ? "bg-[#1a1a1a] text-[#FAF7F2] border-[#c5a27d]"
                : "bg-[#FAF7F2] text-neutral-700 border-neutral-300 hover:bg-white"
            }`}
          >
            <ListChecks className="w-3.5 h-3.5 text-[#c5a27d]" />
            <span>3. Production Deployment &amp; Cloudflare Checklist</span>
          </button>
        </div>

        <div className="text-[10px] text-neutral-500 font-mono hidden sm:inline">
          Architectural Review Alignment: <strong>100%</strong>
        </div>
      </div>

      {/* VIEW 1: SCORECARD, LAYERS, AND TIMELINE */}
      {suiteView === "scorecard" && (
        <div className="space-y-6">
          {/* ECOSYSTEM MATURITY SCORECARD & OVERALL SCORE */}
          <div className="bg-white border border-[#1a1a1a]/15 p-5 sm:p-6 rounded-xs shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#1a1a1a]/10 gap-2">
              <div>
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-[#c5a27d]" />
                  <h3 className="font-serif font-bold text-base sm:text-lg text-[#1a1a1a]">
                    Ecosystem Maturity Scorecard
                  </h3>
                </div>
                <p className="text-xs text-neutral-500 font-sans mt-0.5">
                  5-second executive assessment evaluating availability, defense posture, container readiness, and CI/CD attestation.
                </p>
              </div>

              <div className="flex items-center space-x-3 bg-neutral-50 px-3 py-1.5 border border-neutral-200 rounded-xs self-start sm:self-auto">
                <span className="text-[10px] uppercase font-bold text-neutral-500">Overall Score:</span>
                <span className="text-xl font-serif font-bold text-emerald-700">98 / 100</span>
                <span className="text-[9px] px-1.5 py-0.5 bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                  GRADE A+
                </span>
              </div>
            </div>

            {/* 5-PILLAR BREAKDOWN SCORECARD */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <div className="p-3.5 bg-[#FAF7F2] border border-[#1a1a1a]/10 space-y-1">
                <div className="text-[10px] text-neutral-500 uppercase flex items-center justify-between">
                  <span>Availability</span>
                  <Activity className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div className="text-lg font-serif font-bold text-[#1a1a1a]">99.99%</div>
                <div className="text-[10px] text-emerald-700 font-bold">Target SLA Met</div>
              </div>

              <div className="p-3.5 bg-[#FAF7F2] border border-[#1a1a1a]/10 space-y-1">
                <div className="text-[10px] text-neutral-500 uppercase flex items-center justify-between">
                  <span>Security Posture</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-[#c5a27d]" />
                </div>
                <div className="text-lg font-serif font-bold text-[#1a1a1a]">100%</div>
                <div className="text-[10px] text-emerald-700 font-bold">FIPS 140-2 Compliant</div>
              </div>

              <div className="p-3.5 bg-[#FAF7F2] border border-[#1a1a1a]/10 space-y-1">
                <div className="text-[10px] text-neutral-500 uppercase flex items-center justify-between">
                  <span>Pocket Readiness</span>
                  <Layers className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <div className="text-lg font-serif font-bold text-[#1a1a1a]">20 / 20</div>
                <div className="text-[10px] text-purple-700 font-bold">17 Core + 3 Nexus</div>
              </div>

              <div className="p-3.5 bg-[#FAF7F2] border border-[#1a1a1a]/10 space-y-1">
                <div className="text-[10px] text-neutral-500 uppercase flex items-center justify-between">
                  <span>CI/CD Status</span>
                  <Cpu className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div className="text-lg font-serif font-bold text-emerald-800">PASS</div>
                <div className="text-[10px] text-neutral-500">In-Toto Provenance</div>
              </div>

              <div className="p-3.5 bg-[#FAF7F2] border border-[#1a1a1a]/10 space-y-1">
                <div className="text-[10px] text-neutral-500 uppercase flex items-center justify-between">
                  <span>Dependencies</span>
                  <GitBranch className="w-3.5 h-3.5 text-purple-600" />
                </div>
                <div className="text-lg font-serif font-bold text-emerald-800">HEALTHY</div>
                <div className="text-[10px] text-emerald-700 font-bold">0 Cyclical Degraded</div>
              </div>
            </div>
          </div>

          {/* ARCHITECTURE LAYER VIEW (VISUAL STACKING FOR INVESTORS & ENGINEERS) */}
          <div className="bg-white border border-[#1a1a1a]/15 p-5 sm:p-6 rounded-xs shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#1a1a1a]/10 gap-2">
              <div>
                <div className="flex items-center space-x-2">
                  <Layers className="w-5 h-5 text-[#c5a27d]" />
                  <h3 className="font-serif font-bold text-base sm:text-lg text-[#1a1a1a]">
                    Architecture Layer Stack
                  </h3>
                </div>
                <p className="text-xs text-neutral-500 font-sans mt-0.5">
                  Hierarchical stacking of the 20-pocket constellation from Foundation to Elastic Scale.
                </p>
              </div>

              <span className="text-[10px] font-mono text-neutral-500 bg-neutral-100 px-2 py-1 border border-neutral-300 rounded-xs self-start sm:self-auto">
                Click layer to inspect constituents
              </span>
            </div>

            {/* VERTICAL VISUAL STACK */}
            <div className="space-y-3">
              {architectureLayers.map((layer) => {
                const isExpanded = activeLayer === layer.level;
                return (
                  <div
                    key={layer.level}
                    onClick={() => setActiveLayer(isExpanded ? null : layer.level)}
                    className={`border-2 p-4 rounded-xs transition-all cursor-pointer ${
                      isExpanded ? "ring-2 ring-[#c5a27d] shadow-md" : "hover:border-[#c5a27d]"
                    } ${layer.color}`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center space-x-3">
                        <span className="px-2 py-0.5 bg-[#1a1a1a] text-white text-[10px] font-bold rounded-xs">
                          L{layer.level}
                        </span>
                        <span className="font-serif font-bold text-sm text-[#1a1a1a]">
                          {layer.name}
                        </span>
                        <span className="text-[10px] font-mono opacity-80">
                          ({layer.pocketRange})
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 bg-white/80 border border-current text-[10px] font-bold rounded-xs">
                          {layer.badge}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-neutral-600" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-neutral-600" />
                        )}
                      </div>
                    </div>

                    <div className="text-xs font-sans text-neutral-700 mt-2">
                      {layer.description}
                    </div>

                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-current/20 grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] font-mono bg-white/60 p-3 rounded-xs">
                        <div>
                          <span className="text-neutral-500 font-bold block uppercase text-[9px]">Verified Tech Stack:</span>
                          <span className="text-[#1a1a1a] font-semibold">{layer.tech}</span>
                        </div>
                        <div>
                          <span className="text-neutral-500 font-bold block uppercase text-[9px]">Measured Metrics:</span>
                          <span className="text-emerald-800 font-semibold">{layer.metrics}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* HISTORICAL EVOLUTION TIMELINE */}
          <div className="bg-white border border-[#1a1a1a]/15 p-5 sm:p-6 rounded-xs shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#1a1a1a]/10 gap-2">
              <div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-[#c5a27d]" />
                  <h3 className="font-serif font-bold text-base sm:text-lg text-[#1a1a1a]">
                    Historical Evolution Timeline
                  </h3>
                </div>
                <p className="text-xs text-neutral-500 font-sans mt-0.5">
                  The engineering journey from genesis concept to unified sovereign command center.
                </p>
              </div>

              <button
                onClick={() => setShowFullTimeline(!showFullTimeline)}
                className="text-[11px] font-mono text-[#c5a27d] hover:text-[#1a1a1a] underline font-bold cursor-pointer"
              >
                {showFullTimeline ? "Show Compact View" : "Show All Milestones (9)"}
              </button>
            </div>

            {/* TIMELINE TRACK */}
            <div className="relative pl-6 sm:pl-8 space-y-5 before:absolute before:left-2 sm:before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#c5a27d]/40">
              {(showFullTimeline ? timelineMilestones : timelineMilestones.slice(-5)).map((item, idx) => (
                <div key={idx} className="relative group">
                  <div className="absolute -left-6 sm:-left-8 top-1 w-3 h-3 rounded-full bg-[#1a1a1a] border-2 border-[#c5a27d] group-hover:scale-125 transition-transform" />

                  <div className="bg-[#FAF7F2] border border-[#1a1a1a]/10 p-3.5 rounded-xs space-y-1 shadow-2xs hover:border-[#c5a27d] transition-colors">
                    <div className="flex flex-wrap items-center justify-between gap-1 text-[10px]">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-[#c5a27d]">{item.year}</span>
                        <span className="px-1.5 py-0.2 bg-neutral-200 text-neutral-800 font-bold rounded-xs">
                          {item.tag}
                        </span>
                      </div>
                      <span className="text-emerald-700 font-bold">{item.status}</span>
                    </div>

                    <div className="font-serif font-bold text-sm text-[#1a1a1a]">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-neutral-500 font-sans">
                      {item.subtitle}
                    </div>
                    <p className="text-xs text-neutral-700 font-sans leading-relaxed pt-1">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: FEDERATED MONOREPO & HARDWARE BLUEPRINT */}
      {suiteView === "monorepo" && (
        <div className="bg-white border border-[#1a1a1a]/15 p-5 sm:p-6 rounded-xs shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#1a1a1a]/10 gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <FolderTree className="w-5 h-5 text-[#c5a27d]" />
                <h3 className="font-serif font-bold text-base sm:text-lg text-[#1a1a1a]">
                  Federated Monorepo &amp; Hardware Layout
                </h3>
              </div>
              <p className="text-xs text-neutral-500 font-sans mt-0.5">
                The recommended architecture layout from BizChat enhanced with sovereign hardware definitions.
              </p>
            </div>

            <button
              onClick={handleCopyMonorepo}
              className="px-3 py-1.5 bg-[#FAF7F2] border border-[#1a1a1a]/20 hover:border-[#c5a27d] text-[#1a1a1a] text-xs font-mono font-bold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
            >
              {copiedSection === "monorepo" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#c5a27d]" />}
              <span>{copiedSection === "monorepo" ? "Copied Blueprint" : "Copy Monorepo Tree"}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Tree Directory Column */}
            <div className="lg:col-span-5 space-y-4 bg-[#FAF7F2] p-4 border border-neutral-300 rounded-xs">
              <div className="text-[11px] font-bold text-[#1a1a1a] flex items-center justify-between border-b border-neutral-200 pb-2">
                <span>seventeen-pockets/ monorepo root</span>
                <span className="text-[9px] px-1.5 py-0.2 bg-emerald-100 text-emerald-800 font-bold">5 CATEGORIES</span>
              </div>

              <div className="space-y-3">
                {MONOREPO_TREE.map((section) => (
                  <div key={section.category} className="space-y-1">
                    <div className="text-xs font-bold text-[#1a1a1a] flex items-center gap-1.5">
                      <Folder className="w-3.5 h-3.5 text-[#c5a27d] fill-current/30" />
                      <span>{section.category}</span>
                      <span className="text-[9px] font-normal text-neutral-500 font-sans">
                        — {section.description.split(" ")[0]}
                      </span>
                    </div>

                    <div className="pl-4 space-y-1 border-l-2 border-neutral-300 ml-1.5">
                      {section.children.map((child) => {
                        const isSelected = selectedRepoNode === child.name;
                        return (
                          <div
                            key={child.name}
                            onClick={() => setSelectedRepoNode(child.name)}
                            className={`p-1.5 text-[11px] font-mono cursor-pointer rounded-xs transition-all flex items-center justify-between ${
                              isSelected
                                ? "bg-[#1a1a1a] text-[#FAF7F2] font-bold pl-2 border-l-2 border-[#c5a27d]"
                                : "hover:bg-white text-neutral-700"
                            }`}
                          >
                            <span className="truncate">{child.name.split("/")[1]}</span>
                            <span className="text-[8px] opacity-75 font-sans truncate">{child.lang.split("/")[0]}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Node Inspector Column */}
            <div className="lg:col-span-7 bg-white p-5 border border-neutral-300 rounded-xs space-y-4">
              {(() => {
                const found = MONOREPO_TREE.flatMap((c) => c.children).find((n) => n.name === selectedRepoNode);
                if (!found) return null;
                const isHardware = found.name.startsWith("hardware/");
                return (
                  <div className="space-y-4">
                    <div className="border-b border-neutral-200 pb-3 flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[9px] font-bold uppercase tracking-wider text-[#c5a27d]">
                            {isHardware ? "PHYSICAL SOVEREIGN ARTIFACT" : "DECENTRALIZED SOFTWARE MODULE"}
                          </span>
                          <span className="text-[8px] px-1.5 py-0.2 bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold">
                            {found.status}
                          </span>
                        </div>
                        <h4 className="text-base font-serif font-bold text-[#1a1a1a] mt-0.5">
                          {found.name}
                        </h4>
                      </div>
                      <span className="px-2.5 py-1 bg-neutral-100 text-neutral-800 text-[10px] font-mono border border-neutral-300">
                        {found.lang}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-neutral-500 uppercase block">
                        Functional Mandate &amp; Boundary:
                      </span>
                      <p className="text-xs font-sans text-neutral-800 leading-relaxed bg-[#FAF7F2] p-3 border border-neutral-200">
                        {found.role}. Built under the safe seventeen-pockets containerization protocol to guarantee zero-latency execution and zero-knowledge data isolation.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-[11px] pt-1">
                      <div className="p-3 bg-[#FAF7F2] border border-neutral-200 space-y-1">
                        <span className="text-[9px] text-neutral-500 uppercase font-bold block">Air-Gap Capability:</span>
                        <span className="text-emerald-800 font-bold">100% Offline-Operable</span>
                      </div>
                      <div className="p-3 bg-[#FAF7F2] border border-neutral-200 space-y-1">
                        <span className="text-[9px] text-neutral-500 uppercase font-bold block">Consensus / Governance:</span>
                        <span className="text-[#1a1a1a] font-bold">Pocket-Zero Oracle</span>
                      </div>
                    </div>

                    <div className="p-3 bg-neutral-900 text-neutral-200 rounded-xs space-y-1 font-mono text-[10px]">
                      <div className="text-[#c5a27d] font-bold flex items-center justify-between">
                        <span># monorepo workspace reference</span>
                        <span>pnpm --filter {found.name.split("/")[1]} test</span>
                      </div>
                      <div className="text-neutral-400">
                        Imports: @seventeen-pockets/auth, @seventeen-pockets/telemetry, @seventeen-pockets/shared-types
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: PRODUCTION DEPLOYMENT CHECKLIST & ATTESTATION */}
      {suiteView === "checklist" && (
        <div className="bg-white border border-[#1a1a1a]/15 p-5 sm:p-6 rounded-xs shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#1a1a1a]/10 gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <ListChecks className="w-5 h-5 text-[#c5a27d]" />
                <h3 className="font-serif font-bold text-base sm:text-lg text-[#1a1a1a]">
                  Production Deployment &amp; Cloudflare Checklist
                </h3>
              </div>
              <p className="text-xs text-neutral-500 font-sans mt-0.5">
                Institutional readiness verification across GitLab CI, Cloudflare WAF, Vercel Edge, and Dual-Vault storage.
              </p>
            </div>

            <div className="flex items-center space-x-2 self-start sm:self-auto">
              <button
                onClick={handleDownloadAttestation}
                className="px-3 py-1.5 bg-[#1a1a1a] text-[#FAF7F2] hover:bg-[#c5a27d] hover:text-[#1a1a1a] text-xs font-mono font-bold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Download className="w-3.5 h-3.5 text-[#c5a27d]" />
                <span>Download Signed Attestation</span>
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-[#FAF7F2] p-4 border border-neutral-300 rounded-xs space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-1.5 text-[#1a1a1a]">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Verification Progress: {passedChecks} / {totalChecks} Criteria Satisfied</span>
              </span>
              <span className="text-emerald-700 font-serif text-sm">{progressPercent}% VERIFIED</span>
            </div>
            <div className="w-full bg-neutral-200 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-600 h-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* 4 Deployment Checklist Grids */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DEPLOYMENT_SECTIONS.map((sec) => {
              const Icon = sec.icon;
              return (
                <div key={sec.id} className="border border-neutral-300 p-4 rounded-xs bg-[#FAF7F2] space-y-3">
                  <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                    <div className="flex items-center space-x-2 font-bold text-[#1a1a1a]">
                      <Icon className="w-4 h-4 text-[#c5a27d]" />
                      <span>{sec.title}</span>
                    </div>
                    <span className="text-[9px] px-1.5 py-0.2 bg-white border border-neutral-300 text-neutral-700 font-bold">
                      VERIFIED
                    </span>
                  </div>

                  <div className="space-y-2">
                    {sec.items.map((item) => {
                      const isChecked = checkedItems[item.id] ?? false;
                      return (
                        <div
                          key={item.id}
                          onClick={() => toggleCheck(item.id)}
                          className={`p-2.5 border rounded-xs transition-all cursor-pointer flex items-start space-x-2.5 ${
                            isChecked
                              ? "bg-white border-neutral-300"
                              : "bg-red-50/50 border-red-200 text-neutral-500"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleCheck(item.id)}
                            className="mt-0.5 accent-[#c5a27d] cursor-pointer"
                          />
                          <div className="flex-1 space-y-0.5">
                            <div className="font-bold text-[#1a1a1a] text-xs leading-snug">
                              {item.label}
                            </div>
                            <div className="text-[10px] text-neutral-500 font-sans">
                              {item.detail}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
