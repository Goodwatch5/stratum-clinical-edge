"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  X,
  Sparkles,
  Users,
  HeartPulse,
  Dna,
  Cpu,
  Layers,
  Database,
  ShieldCheck,
  RefreshCw,
  Film,
  Radio,
  ExternalLink,
  ChevronRight,
  Terminal,
  Activity,
  FileText,
  Sliders,
  Zap,
  Compass,
  Stethoscope,
} from "lucide-react";

export interface CommandItem {
  id: string;
  title: string;
  subtitle: string;
  category: "User Journeys" | "Pockets (1-20)" | "Clinical & Healthcare" | "AI & Agents" | "Operations & Actions";
  badge?: string;
  badgeColor?: string;
  icon: any;
  action: () => void;
  keywords?: string[];
}

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: string) => void;
  onForceSync?: () => void;
  onToggleAirGap?: () => void;
  onOpenSecurityModal?: () => void;
  onOpenEvolutionModal?: () => void;
  onOpenCinemaVideo?: () => void;
  onOpenReleaseModal?: () => void;
}

export default function CommandPaletteModal({
  isOpen,
  onClose,
  onNavigateTab,
  onForceSync,
  onToggleAirGap,
  onOpenSecurityModal,
  onOpenEvolutionModal,
  onOpenCinemaVideo,
  onOpenReleaseModal,
}: CommandPaletteModalProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open handled by parent or state
        }
      } else if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const items: CommandItem[] = [
    // 1. USER JOURNEYS
    {
      id: "journey-ai",
      title: "Use AI & Autonomous Reasoning",
      subtitle: "Research, automated triage, clinical reasoning, DeepAgent multi-agent orchestration",
      category: "User Journeys",
      badge: "JOURNEY",
      badgeColor: "bg-purple-100 text-purple-800",
      icon: Sparkles,
      action: () => {
        onNavigateTab("command-center");
        onClose();
      },
      keywords: ["ai", "deepagent", "groq", "reasoning", "agents", "oracle"],
    },
    {
      id: "journey-teams",
      title: "Manage Teams & Operations",
      subtitle: "Projects, 30-day sprint milestones, task coordination, leadership telemetry",
      category: "User Journeys",
      badge: "JOURNEY",
      badgeColor: "bg-blue-100 text-blue-800",
      icon: Users,
      action: () => {
        onNavigateTab("provisions");
        onClose();
      },
      keywords: ["teams", "nextmyteam", "sprint", "provisions", "management", "collaboration"],
    },
    {
      id: "journey-health",
      title: "Explore Healthcare & Clinical Edge",
      subtitle: "Sovereign clinical command, bedside Doppler ultrasound, voice clinical scribe, zero-trust dossier",
      category: "User Journeys",
      badge: "JOURNEY",
      badgeColor: "bg-emerald-100 text-emerald-800",
      icon: HeartPulse,
      action: () => {
        onNavigateTab("command-center");
        onClose();
      },
      keywords: ["health", "clinical", "triage", "ultrasound", "patient", "dossier", "scribe"],
    },
    {
      id: "journey-research",
      title: "Research & RNA Discovery Platform",
      subtitle: "Biomarker discovery, mRNA therapy exploration, molecular simulation benchmarks",
      category: "User Journeys",
      badge: "JOURNEY",
      badgeColor: "bg-amber-100 text-amber-800",
      icon: Dna,
      action: () => {
        onNavigateTab("topology");
        onClose();
      },
      keywords: ["research", "rna", "biomarker", "discovery", "therapy", "genomics"],
    },
    {
      id: "journey-dev",
      title: "Developer & Infrastructure Mesh",
      subtitle: "Universal 20-pocket status matrix, GitLab CI/CD builds, D3 network graph, developer sandbox",
      category: "User Journeys",
      badge: "JOURNEY",
      badgeColor: "bg-neutral-200 text-neutral-800",
      icon: Cpu,
      action: () => {
        onNavigateTab("pocket-matrix");
        onClose();
      },
      keywords: ["developer", "devops", "gitlab", "builds", "ci", "cd", "sandbox", "pockets"],
    },

    // 2. CORE POCKETS & SOLAR NEXUS
    {
      id: "pocket-matrix",
      title: "Pocket Status Matrix (01-20)",
      subtitle: "Live health, SLA latency, throughput, and dependencies across all 20 pockets",
      category: "Pockets (1-20)",
      badge: "CORE MATRIX",
      icon: Layers,
      action: () => {
        onNavigateTab("pocket-matrix");
        onClose();
      },
      keywords: ["matrix", "pockets", "sla", "latency", "health", "all"],
    },
    {
      id: "pocket-01",
      title: "Pocket 01: Clinical Intelligence Core & Pocket API",
      subtitle: "Primary clinical command, emergency triage, FHIR R4 interoperability",
      category: "Pockets (1-20)",
      badge: "P01",
      icon: HeartPulse,
      action: () => {
        onNavigateTab("command-center");
        onClose();
      },
      keywords: ["pocket 1", "api", "clinical", "fhir"],
    },
    {
      id: "pocket-04",
      title: "Pocket 04: Sub-Second Sync Engine",
      subtitle: "Ultra-low latency 0.08ms state replication across local edge mesh",
      category: "Pockets (1-20)",
      badge: "P04",
      icon: Zap,
      action: () => {
        onNavigateTab("pocket-matrix");
        onClose();
      },
      keywords: ["sync", "0.08ms", "speed", "latency", "mesh"],
    },
    {
      id: "clinical-trials-suite",
      title: "Clinical Trials & Protocol Intelligence Suite",
      subtitle: "Grounded ClinicalTrials.gov search, inclusion/exclusion eligibility analysis, and research AI",
      category: "Clinical & Healthcare",
      badge: "REGISTRY",
      badgeColor: "bg-emerald-100 text-emerald-800",
      icon: Stethoscope,
      action: () => {
        onNavigateTab("clinical-trials");
        onClose();
      },
      keywords: ["trials", "nct", "protocol", "eligibility", "oncology", "research", "clinicaltrials.gov"],
    },
    {
      id: "pocket-07",
      title: "Pocket 07: Voice Clinical Scribe",
      subtitle: "Ambient acoustic AI microphone processing with instant SOAP synthesis",
      category: "Clinical & Healthcare",
      badge: "P07",
      icon: Radio,
      action: () => {
        onNavigateTab("voice-scribe");
        onClose();
      },
      keywords: ["voice", "scribe", "soap", "audio", "speech", "microphone"],
    },
    {
      id: "pocket-08",
      title: "Pocket 08: Strategic Spatial Radar & ABCD Dispatch",
      subtitle: "Geospatial coordinate perimeter, clinic vans, and emergency drone dispatch",
      category: "Pockets (1-20)",
      badge: "P08",
      icon: Compass,
      action: () => {
        onNavigateTab("dispatch");
        onClose();
      },
      keywords: ["radar", "spatial", "map", "dispatch", "drone", "mobile"],
    },
    {
      id: "pocket-11",
      title: "Pocket 11: Entertainment & Creator Studio",
      subtitle: "Multimedia stage, livestream broadcast, keynote archives, gamification engine",
      category: "Pockets (1-20)",
      badge: "P11",
      icon: Film,
      action: () => {
        onNavigateTab("entertainment");
        onClose();
      },
      keywords: ["entertainment", "video", "creator", "media", "stream", "broadcast"],
    },
    {
      id: "pocket-15",
      title: "Pocket 15: Solar Nexus 3D Planetary Globe",
      subtitle: "Interactive Three.js WebGL globe showing 20 orbital edge nodes in real time",
      category: "Pockets (1-20)",
      badge: "P15",
      icon: Activity,
      action: () => {
        onNavigateTab("solar-nexus");
        onClose();
      },
      keywords: ["globe", "3d", "solar nexus", "orbit", "nodes", "threejs"],
    },
    {
      id: "pocket-16",
      title: "Pocket 16: Isolated Data Vault (IDV)",
      subtitle: "Zero-Trust air-gapped cryptographic enclave with AES-GCM and SHA-256 integrity",
      category: "Clinical & Healthcare",
      badge: "P16",
      icon: ShieldCheck,
      action: () => {
        onNavigateTab("idv");
        onClose();
      },
      keywords: ["idv", "vault", "encryption", "security", "zero-trust", "air-gap"],
    },
    {
      id: "pocket-18",
      title: "Pocket 18: Backup & Disaster Recovery",
      subtitle: "Solar Nexus resilience layer with automated multi-region cold-storage snapshotting",
      category: "Pockets (1-20)",
      badge: "P18",
      icon: Database,
      action: () => {
        onNavigateTab("solar-nexus");
        onClose();
      },
      keywords: ["backup", "disaster", "recovery", "resilience"],
    },
    {
      id: "pocket-19",
      title: "Pocket 19: Edge Optimization & Routing",
      subtitle: "Intelligent packet routing, cost reduction, and edge cache distribution",
      category: "Pockets (1-20)",
      badge: "P19",
      icon: Sliders,
      action: () => {
        onNavigateTab("solar-nexus");
        onClose();
      },
      keywords: ["optimization", "routing", "edge", "performance"],
    },
    {
      id: "pocket-20",
      title: "Pocket 20: Auto Scaling & Global Mesh",
      subtitle: "Autonomous container elasticity across global edge clusters",
      category: "Pockets (1-20)",
      badge: "P20",
      icon: Cpu,
      action: () => {
        onNavigateTab("solar-nexus");
        onClose();
      },
      keywords: ["scaling", "resilience", "global", "mesh", "elastic"],
    },

    // 3. OPERATIONAL ACTIONS
    {
      id: "action-sync",
      title: "Force Full Dual-Storage Resync",
      subtitle: "Flush pending mutation queue and mirror IndexedDB to Firestore Cloud",
      category: "Operations & Actions",
      badge: "ACTION",
      badgeColor: "bg-emerald-100 text-emerald-800",
      icon: RefreshCw,
      action: () => {
        if (onForceSync) onForceSync();
        onClose();
      },
      keywords: ["sync", "resync", "flush", "indexeddb", "firestore"],
    },
    {
      id: "action-security",
      title: "Open Security Readiness Checklist",
      subtitle: "Review vault encryption, backup status, and recovery test validation",
      category: "Operations & Actions",
      badge: "SECURITY",
      badgeColor: "bg-amber-100 text-amber-800",
      icon: ShieldCheck,
      action: () => {
        if (onOpenSecurityModal) onOpenSecurityModal();
        onClose();
      },
      keywords: ["security", "checklist", "readiness", "audit", "vault", "encryption"],
    },
    {
      id: "action-evolution",
      title: "View 17-to-20 Architecture Evolution Guide",
      subtitle: "Examine how the Seventeen Pockets Foundation expanded into the Solar Nexus 20 Mesh",
      category: "Operations & Actions",
      badge: "ARCHITECTURE",
      badgeColor: "bg-purple-100 text-purple-800",
      icon: Layers,
      action: () => {
        if (onOpenEvolutionModal) onOpenEvolutionModal();
        onClose();
      },
      keywords: ["evolution", "architecture", "17", "20", "guide", "solar nexus"],
    },
    {
      id: "action-cinema",
      title: "Launch 4K Cinema Theater Video Player",
      subtitle: "Watch Stratum Clinical Edge hardware and keynote video streams",
      category: "Operations & Actions",
      badge: "VIDEO",
      badgeColor: "bg-red-100 text-red-800",
      icon: Film,
      action: () => {
        if (onOpenCinemaVideo) onOpenCinemaVideo();
        onClose();
      },
      keywords: ["video", "cinema", "theater", "hardware", "keynote", "stream", "reel"],
    },
    {
      id: "action-release-deploy",
      title: "Release & Standalone Deployment Manual",
      subtitle: "Deploy externally to Vercel, Docker, Google Cloud Run, VPS, or self-hosted server",
      category: "Operations & Actions",
      badge: "RELEASE",
      badgeColor: "bg-amber-100 text-amber-900",
      icon: ExternalLink,
      action: () => {
        if (onOpenReleaseModal) onOpenReleaseModal();
        onClose();
      },
      keywords: ["release", "deploy", "export", "github", "vercel", "docker", "vps", "cloud run", "standalone"],
    },
  ];

  const filteredItems = items.filter((item) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    const matchTitle = item.title.toLowerCase().includes(q);
    const matchSub = item.subtitle.toLowerCase().includes(q);
    const matchCategory = item.category.toLowerCase().includes(q);
    const matchKeywords = item.keywords?.some((k) => k.toLowerCase().includes(q));
    return matchTitle || matchSub || matchCategory || matchKeywords;
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filteredItems.length || 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + (filteredItems.length || 1)) % (filteredItems.length || 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].action();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-start justify-center pt-16 sm:pt-24 p-3 animate-fade-in">
      <div
        className="bg-[#FAF7F2] border-2 border-[#1a1a1a] shadow-2xl max-w-2xl w-full rounded-xs overflow-hidden flex flex-col max-h-[80vh] text-[#1a1a1a]"
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="p-3.5 bg-white border-b border-[#1a1a1a]/15 flex items-center space-x-3">
          <Search className="w-5 h-5 text-[#c5a27d] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search journeys, pockets, modules, or actions... (e.g., 'sync', 'ai', 'clinical', 'video')"
            className="w-full bg-transparent font-sans text-sm text-[#1a1a1a] placeholder:text-neutral-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              className="p-1 hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 rounded-xs"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="hidden sm:inline-block px-1.5 py-0.5 bg-neutral-100 border border-neutral-300 text-[10px] font-mono text-neutral-600 rounded-xs">
            ESC
          </span>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-neutral-500 font-mono text-xs space-y-1">
              <div>No matching ecosystem commands found for &ldquo;{query}&rdquo;</div>
              <div className="text-[10px] text-neutral-400">
                Try searching for &ldquo;AI&rdquo;, &ldquo;Teams&rdquo;, &ldquo;Clinical&rdquo;, &ldquo;Pockets&rdquo;, or &ldquo;Sync&rdquo;.
              </div>
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const Icon = item.icon;
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`p-2.5 rounded-xs cursor-pointer flex items-center justify-between border transition-all ${
                    isSelected
                      ? "bg-[#1a1a1a] text-white border-[#c5a27d] shadow-sm"
                      : "bg-white border-neutral-200/80 hover:bg-[#FAF7F2] text-[#1a1a1a]"
                  }`}
                >
                  <div className="flex items-center space-x-3 truncate">
                    <div
                      className={`p-2 rounded-xs border shrink-0 ${
                        isSelected
                          ? "bg-neutral-800 border-[#c5a27d] text-[#c5a27d]"
                          : "bg-neutral-50 border-neutral-200 text-[#1a1a1a]"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <div className="flex items-center space-x-2">
                        <span className="font-serif font-bold text-xs truncate">{item.title}</span>
                        {item.badge && (
                          <span
                            className={`text-[9px] font-mono px-1.5 py-0.2 rounded-xs font-bold shrink-0 ${
                              isSelected
                                ? "bg-[#c5a27d] text-[#1a1a1a]"
                                : item.badgeColor || "bg-neutral-100 text-neutral-700"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <div
                        className={`text-[11px] truncate font-sans ${
                          isSelected ? "text-neutral-300" : "text-neutral-500"
                        }`}
                      >
                        {item.subtitle}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0 text-xs font-mono ml-3">
                    <span
                      className={`text-[9px] uppercase hidden md:inline ${
                        isSelected ? "text-[#c5a27d]" : "text-neutral-400"
                      }`}
                    >
                      {item.category}
                    </span>
                    <ChevronRight
                      className={`w-3.5 h-3.5 ${isSelected ? "text-[#c5a27d]" : "text-neutral-400"}`}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts info */}
        <div className="p-2.5 bg-[#FAF7F2] border-t border-[#1a1a1a]/15 text-[10px] font-mono text-neutral-500 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-3">
            <span>↑↓ to navigate</span>
            <span>↵ to select</span>
            <span>ESC to close</span>
          </div>
          <div className="text-neutral-600">
            Seventeen Pockets • Solar Nexus 20 Mesh
          </div>
        </div>
      </div>
    </div>
  );
}
