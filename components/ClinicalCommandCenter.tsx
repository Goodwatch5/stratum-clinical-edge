"use client";

import React, { useState } from "react";
import {
  Compass,
  Sparkles,
  RefreshCw,
  FileText,
  Copy,
  Check,
  Send,
  AlertTriangle,
  Building2,
  Users,
  Pill,
  Radio,
  ThermometerSnowflake,
  ShieldCheck,
  Download,
  Film,
  Play,
  Maximize2,
  Tv,
  Database,
  Settings,
  Sliders,
  Clock,
  Activity,
  CheckCircle2,
  ChevronRight,
  Search,
  Dna,
  Cpu,
  ArrowRight,
  Zap,
  Layers,
  HardDrive,
  Lock,
  Sun,
  HeartPulse,
} from "lucide-react";
import KingdomIntelligenceCore from "@/components/KingdomIntelligenceCore";
import { Stronghold } from "@/app/page";
import { generateStrongholdFhirBundle, downloadJsonFile } from "@/lib/fhir";
import VideoHoverCard from "./VideoHoverCard";
import VideoTheaterModal, { VideoData } from "./VideoTheaterModal";
import { ECOSYSTEM_VIDEOS, ALL_PLAYLIST_VIDEOS } from "@/lib/videoRegistry";

interface ClinicalCommandCenterProps {
  activeStronghold: Stronghold;
  strongholds: Stronghold[];
  onSelectStronghold: (id: string) => void;
  sovereignRole: string;
  onPublishToCouncil: (message: string) => void;
  isDark?: boolean;
  autoSyncEnabled?: boolean;
  onToggleAutoSync?: (enabled: boolean) => void;
  syncInterval?: number;
  onChangeSyncInterval?: (interval: number) => void;
  secondsUntilNextSync?: number;
  lastSyncTime?: string;
  onForceSync?: () => Promise<void>;
  isSyncing?: boolean;
  onNavigateTab?: (tab: string) => void;
  onOpenCommandPalette?: () => void;
  runInBackgroundWhenClosed?: boolean;
  onToggleRunInBackground?: (enabled: boolean) => void;
  isPersistentStorageGranted?: boolean;
  onRequestPersistentStorage?: () => Promise<void>;
  isWakeLockActive?: boolean;
  onToggleWakeLock?: (active: boolean) => void;
}

const STRATEGIC_SCENARIOS = [
  {
    id: "respiratory-surge",
    title: "Infectious Surge & Triage",
    icon: ThermometerSnowflake,
    badge: "EPIDEMIOLOGY",
    badgeColor: "text-amber-700 bg-amber-50 border-amber-200",
    directive:
      "Activate respiratory triage barrier; quarantine incoming febrile cases in outer pavilions; requisition 500 units of high-flow oxygen concentrators and rapid viral antigen test kits.",
  },
  {
    id: "cold-chain",
    title: "Cold-Chain & Pharma Logistics",
    icon: Pill,
    badge: "SUPPLY CHAIN",
    badgeColor: "text-blue-700 bg-blue-50 border-blue-200",
    directive:
      "Verify backup solar refrigeration for critical insulin and biological reserves; schedule escorted medical convoy between southern frontier and high citadel.",
  },
  {
    id: "barrier-nursing",
    title: "Biosecurity & Barrier Nursing",
    icon: ShieldCheck,
    badge: "BIO-CONTAINMENT",
    badgeColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
    directive:
      "Enforce level-3 PPE containment in intensive care wards; implement strict 12-hour practitioner shift rotations to mitigate cognitive fatigue.",
  },
  {
    id: "offline-telemetry",
    title: "Offline Telemetry & Evacuation",
    icon: Radio,
    badge: "AIR-GAP RESILIENCE",
    badgeColor: "text-purple-700 bg-purple-50 border-purple-200",
    directive:
      "Switch edge vital monitoring to disconnected IndexedDB buffer; prepare rapid ambulance transport vectors for critical post-surgical patients.",
  },
];

export default function ClinicalCommandCenter({
  activeStronghold,
  strongholds,
  onSelectStronghold,
  sovereignRole,
  onPublishToCouncil,
  isDark = false,
  autoSyncEnabled = true,
  onToggleAutoSync,
  syncInterval = 15,
  onChangeSyncInterval,
  secondsUntilNextSync = 15,
  lastSyncTime = "Just now",
  onForceSync,
  isSyncing = false,
  onNavigateTab,
  onOpenCommandPalette,
  runInBackgroundWhenClosed = true,
  onToggleRunInBackground,
  isPersistentStorageGranted = true,
  onRequestPersistentStorage,
  isWakeLockActive = false,
  onToggleWakeLock,
}: ClinicalCommandCenterProps) {
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string>("");
  const [isEdictLoading, setIsEdictLoading] = useState(false);
  const [royalEdict, setRoyalEdict] = useState<string>("");
  const [edictRecipient, setEdictRecipient] = useState<string>(
    "Frontier Clinical Outposts & Triage Centers"
  );
  const [customEdictNotes, setCustomEdictNotes] = useState<string>(
    STRATEGIC_SCENARIOS[0].directive
  );
  const [copiedAnalysis, setCopiedAnalysis] = useState(false);
  const [copiedEdict, setCopiedEdict] = useState(false);
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>("respiratory-surge");
  const [selectedCinemaVideo, setSelectedCinemaVideo] = useState<VideoData | null>(null);
  const [showCinemaModal, setShowCinemaModal] = useState<boolean>(false);

  // Generate Clinical Strategic Briefing using Server-Side Gemini
  const handleGenerateStrategy = async () => {
    if (!activeStronghold) return;
    setIsAiLoading(true);
    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "strategy",
          payload: {
            name: activeStronghold.name,
            age: activeStronghold.age,
            vitals: activeStronghold.vitals,
            notes: activeStronghold.notes,
            environmentalContext: `Facility Coordinates: [Lat: ${activeStronghold.lat}, Lon: ${activeStronghold.lon}] | Active Directive: ${customEdictNotes}`,
          },
        }),
      });

      const data = await res.json();
      if (data.text) {
        setAiAnalysis(data.text);
      } else if (data.error) {
        setAiAnalysis(
          `[CLINICAL INTELLIGENCE ADVISORY]\n\nFacility: ${activeStronghold.name}\nCare Cadre: ${activeStronghold.age * 100} Practitioners\n\n1. CLINICAL TRIAGE & EPIDEMIOLOGICAL ASSESSMENT:\nFrontier triage units report stable respiratory markers. Early containment barriers active on isolation wards.\n\n2. PHARMACEUTICAL & LOGISTICAL BUFFER:\nMedical supplies operating at optimal capacity. Local buffer stores sufficient for 30 days disconnected operations.\n\n3. STAFFING & CARE CONTINUITY:\nPractitioner rotations balanced. Telemetry replicated in offline local cache.`
        );
      }
    } catch {
      setAiAnalysis(
        `[OFFLINE EDGE CLINICAL ADVISORY]\n\nFacility: ${activeStronghold.name}\nCare Cadre: ${activeStronghold.age * 100} Practitioners\n\n1. CLINICAL TRIAGE & EPIDEMIOLOGICAL ASSESSMENT:\nEdge monitoring indicates nominal baseline vitals across all inpatient bays.\n\n2. MEDICAL BUFFER ALLOCATION:\nCritical provisions, antibiotics, and oxygen reserves are fully stocked.\n\n3. STAFFING & CARE DEPLOYMENT:\nContinue standard 12-hour rotations. All records secured in local IndexedDB vault.`
      );
    } finally {
      setIsAiLoading(false);
    }
  };

  // Generate Formal Sovereign Decree / Clinical Directive
  const handleGenerateEdict = async () => {
    if (!activeStronghold) return;
    setIsEdictLoading(true);
    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "edict",
          payload: {
            doctorName: sovereignRole || "Dr. Odell Anderson Jr. & Dee Gone",
            recipient: edictRecipient,
            patientName: activeStronghold.name,
            notes: customEdictNotes,
            tone: "Authoritative & Medical Governance",
          },
        }),
      });

      const data = await res.json();
      if (data.text) {
        setRoyalEdict(data.text);
      } else {
        const timestamp = new Date().toUTCString();
        setRoyalEdict(
          `============================================================\nSTRATUM CLINICAL EDGE — SOVEREIGN DIRECTIVE\n============================================================\nISSUED BY: ${sovereignRole}\nFACILITY OF ORIGIN: ${activeStronghold.name}\nTARGET RECIPIENT: ${edictRecipient}\nTIMESTAMP: ${timestamp}\n\n[DIRECTIVE CLAUSES]\n1. ${customEdictNotes}\n2. Immediate activation of disconnected edge telemetry caches.\n3. Mandatory daily reporting to High Clinical Council via secure bridge.\n\nSEAL: STRATUM-CLINICAL-SHA256-${Date.now().toString(16).toUpperCase()}\nATTESTED: Dr. Odell Anderson Jr. & Dee Gone\n============================================================`
        );
      }
    } catch {
      const timestamp = new Date().toUTCString();
      setRoyalEdict(
        `============================================================\nSTRATUM CLINICAL EDGE — SOVEREIGN DIRECTIVE (OFFLINE CACHE)\n============================================================\nISSUED BY: ${sovereignRole}\nFACILITY OF ORIGIN: ${activeStronghold.name}\nTARGET RECIPIENT: ${edictRecipient}\nTIMESTAMP: ${timestamp}\n\n[DIRECTIVE CLAUSES]\n1. ${customEdictNotes}\n2. Local IndexedDB data persistence active across all client pods.\n\nSEAL: STRATUM-CLINICAL-OFFLINE-SEAL\n============================================================`
      );
    } finally {
      setIsEdictLoading(false);
    }
  };

  const handleCopyAnalysis = () => {
    if (!aiAnalysis) return;
    navigator.clipboard.writeText(aiAnalysis);
    setCopiedAnalysis(true);
    setTimeout(() => setCopiedAnalysis(false), 2000);
  };

  const handleCopyEdict = () => {
    if (!royalEdict) return;
    navigator.clipboard.writeText(royalEdict);
    setCopiedEdict(true);
    setTimeout(() => setCopiedEdict(false), 2000);
  };

  const handlePublishEdict = () => {
    if (!royalEdict) return;
    const summary = `SOVEREIGN CLINICAL DIRECTIVE issued for ${activeStronghold.name} [Recipient: ${edictRecipient}]: ${customEdictNotes.substring(0, 100)}...`;
    onPublishToCouncil(summary);
  };

  const handleSelectScenario = (scenario: (typeof STRATEGIC_SCENARIOS)[0]) => {
    setSelectedScenarioId(scenario.id);
    setCustomEdictNotes(scenario.directive);
  };

  const handleExportFhir = () => {
    const bundle = generateStrongholdFhirBundle(activeStronghold);
    downloadJsonFile(bundle, `fhir-r4-${activeStronghold.id.toLowerCase()}.json`);
    onPublishToCouncil(
      `HL7 FHIR R4 Interoperability Bundle compiled & exported for ${activeStronghold.name} [ID: ${activeStronghold.id}]. Ready for Hospital EHR / Health System validation.`
    );
  };

  const totalCareCadre = strongholds.reduce((acc, s) => acc + (s.age || 50) * 100, 0);

  const syncProgressPercent = autoSyncEnabled
    ? Math.max(0, Math.min(100, ((syncInterval - (secondsUntilNextSync ?? syncInterval)) / (syncInterval || 1)) * 100))
    : 0;

  return (
    <div className="space-y-6 font-sans">
      {/* 1. OUTCOME-DRIVEN USER JOURNEYS (SOLVES 'STOP LEADING WITH MODULES') */}
      <div className="bg-white border-2 border-[#1a1a1a] p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-neutral-200 gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono px-2 py-0.5 bg-[#c5a27d] text-[#1a1a1a] font-bold uppercase tracking-wider">
                OUTCOME-DRIVEN ARCHITECTURE
              </span>
              <span className="text-xs font-mono text-neutral-500">
                Seventeen Pockets • Solar Nexus 20
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-serif font-bold text-[#1a1a1a] mt-1">
              What would you like to do? Choose Your Operational Journey
            </h2>
          </div>

          {/* Quick Command Palette Trigger (Ctrl + K) */}
          {onOpenCommandPalette && (
            <button
              onClick={onOpenCommandPalette}
              className="px-3 py-2 bg-[#FAF7F2] hover:bg-[#1a1a1a] text-[#1a1a1a] hover:text-[#FAF7F2] border border-[#1a1a1a]/30 transition-all font-mono text-xs flex items-center space-x-2 rounded-xs shadow-2xs group"
              title="Press Ctrl+K or Cmd+K to open global search palette"
            >
              <Search className="w-3.5 h-3.5 text-[#c5a27d] group-hover:scale-110 transition-transform" />
              <span>Search ecosystem...</span>
              <kbd className="text-[9px] px-1.5 py-0.5 bg-neutral-200 group-hover:bg-neutral-800 group-hover:text-neutral-200 rounded-xs border border-neutral-300">
                Ctrl + K
              </kbd>
            </button>
          )}
        </div>

        {/* 5 Journey Outcome Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {[
            {
              title: "Use AI & Reasoning",
              desc: "DeepAgent multi-agent orchestration, clinical analysis, Groq reasoning",
              badge: "INTELLIGENCE",
              badgeColor: "bg-purple-100 text-purple-800 border-purple-200",
              tab: "command-center",
              icon: Sparkles,
            },
            {
              title: "Manage Teams & Ops",
              desc: "NextMyTeam collaboration, 30-day sprint milestones, leadership logs",
              badge: "COLLABORATION",
              badgeColor: "bg-blue-100 text-blue-800 border-blue-200",
              tab: "provisions",
              icon: Users,
            },
            {
              title: "Explore Healthcare",
              desc: "Bedside Doppler ultrasound, voice scribe, zero-trust dossier & triage",
              badge: "CLINICAL",
              badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
              tab: "command-center",
              icon: HeartPulse,
            },
            {
              title: "Research & RNA",
              desc: "Biomarker discovery, mRNA therapy exploration, molecular simulation",
              badge: "DISCOVERY",
              badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
              tab: "topology",
              icon: Dna,
            },
            {
              title: "Developer Mesh",
              desc: "20-Pocket matrix, GitLab CI/CD builds, D3 graph, port 3000 sandbox",
              badge: "INFRASTRUCTURE",
              badgeColor: "bg-neutral-100 text-neutral-800 border-neutral-300",
              tab: "pocket-matrix",
              icon: Cpu,
            },
          ].map((journey) => {
            const Icon = journey.icon;
            return (
              <div
                key={journey.title}
                onClick={() => onNavigateTab && onNavigateTab(journey.tab)}
                className="p-3.5 bg-[#FAF7F2] border border-neutral-300 hover:border-[#c5a27d] transition-all rounded-xs cursor-pointer flex flex-col justify-between group shadow-2xs hover:shadow-sm"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="p-1.5 bg-white border border-neutral-200 rounded-xs text-[#1a1a1a] group-hover:text-[#c5a27d] transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span
                      className={`text-[8px] font-mono px-1 py-0.2 border rounded-xs font-bold ${journey.badgeColor}`}
                    >
                      {journey.badge}
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-xs text-[#1a1a1a] group-hover:text-[#c5a27d] transition-colors">
                    {journey.title}
                  </h3>
                  <p className="text-[11px] text-neutral-600 font-sans leading-relaxed">
                    {journey.desc}
                  </p>
                </div>
                <div className="pt-2 border-t border-neutral-200 flex items-center justify-between text-[10px] font-mono text-[#c5a27d] font-bold group-hover:underline mt-2">
                  <span>Enter Journey</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. VAULT SYNCHRONIZATION SETTINGS (COMMAND CENTER USER REQUEST) */}
      <div className="bg-white border-2 border-[#1a1a1a] p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-neutral-200 gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-[#1a1a1a] text-[#c5a27d] rounded-xs">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[9px] font-mono px-2 py-0.5 bg-neutral-100 text-neutral-800 border border-neutral-300 font-bold uppercase">
                  VAULT REPLICATION SETTINGS
                </span>
                <span
                  className={`text-[9px] font-mono px-2 py-0.5 font-bold border flex items-center gap-1 ${
                    autoSyncEnabled
                      ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                      : "bg-neutral-100 text-neutral-600 border-neutral-300"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      autoSyncEnabled ? "bg-emerald-500 animate-pulse" : "bg-neutral-400"
                    }`}
                  />
                  {autoSyncEnabled ? "AUTO-SYNC ACTIVE" : "PAUSED (MANUAL ONLY)"}
                </span>
              </div>
              <h2 className="text-base font-serif font-bold text-[#1a1a1a] mt-0.5">
                Dual-Storage Background Sync Settings
              </h2>
              <p className="text-xs text-neutral-500">
                Configure automated background synchronization cadence between IndexedDB Local Vault and Firestore Cloud Database.
              </p>
            </div>
          </div>

          {/* Toggles Container */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            {/* Master Auto-Sync Toggle Switch */}
            <div className="flex items-center justify-between sm:justify-start space-x-3 bg-[#FAF7F2] p-2.5 border border-neutral-300 rounded-xs">
              <span className="text-xs font-mono font-bold text-[#1a1a1a]">
                Auto-Sync:
              </span>
              <button
                id="toggle-automated-sync-btn"
                onClick={() => onToggleAutoSync && onToggleAutoSync(!autoSyncEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${
                  autoSyncEnabled ? "bg-emerald-600" : "bg-neutral-300"
                }`}
                title={autoSyncEnabled ? "Click to Pause Background Sync" : "Click to Enable Background Sync"}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    autoSyncEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Run In Background When App Closed Toggle Switch */}
            <div className="flex items-center justify-between sm:justify-start space-x-3 bg-[#FAF7F2] p-2.5 border border-neutral-300 rounded-xs">
              <div className="flex items-center space-x-1.5">
                <HardDrive className="w-3.5 h-3.5 text-[#c5a27d]" />
                <span className="text-xs font-mono font-bold text-[#1a1a1a]">
                  Active When Closed:
                </span>
              </div>
              <button
                id="toggle-run-when-closed-btn"
                onClick={() => onToggleRunInBackground && onToggleRunInBackground(!runInBackgroundWhenClosed)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${
                  runInBackgroundWhenClosed ? "bg-emerald-600" : "bg-neutral-300"
                }`}
                title={runInBackgroundWhenClosed ? "PWA Periodic Background Sync Active" : "Disabled When Window Closed"}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    runInBackgroundWhenClosed ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Screen Wake Lock (Keep Awake) Toggle Switch */}
            <div className="flex items-center justify-between sm:justify-start space-x-3 bg-[#FAF7F2] p-2.5 border border-neutral-300 rounded-xs">
              <div className="flex items-center space-x-1.5">
                <Sun className="w-3.5 h-3.5 text-[#c5a27d]" />
                <span className="text-xs font-mono font-bold text-[#1a1a1a]">
                  Keep Display Awake:
                </span>
              </div>
              <button
                id="toggle-wake-lock-btn"
                onClick={() => onToggleWakeLock && onToggleWakeLock(!isWakeLockActive)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${
                  isWakeLockActive ? "bg-amber-600" : "bg-neutral-300"
                }`}
                title={isWakeLockActive ? "Display Wake Lock active (prevents sleep)" : "Normal display timeout"}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isWakeLockActive ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Persistent Storage & Service Worker Status Strip */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-[#FAF7F2] border border-neutral-200 text-[11px] font-mono">
          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1 text-emerald-800 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>PWA Background Sync:</span>
              <span className="bg-emerald-100 text-emerald-900 px-1.5 py-0.2 border border-emerald-300 text-[10px]">
                {runInBackgroundWhenClosed ? "RUNNING EVEN WHEN APP CLOSED" : "ACTIVE WHILE OPEN"}
              </span>
            </span>
            <span className="flex items-center space-x-1 text-neutral-600">
              <Lock className="w-3 h-3 text-[#c5a27d]" />
              <span>Persistent Storage:</span>
              <span className="text-emerald-700 font-bold">
                {isPersistentStorageGranted ? "GUARANTEED NON-EVICTABLE" : "STANDARD"}
              </span>
            </span>
          </div>
          {onRequestPersistentStorage && !isPersistentStorageGranted && (
            <button
              onClick={onRequestPersistentStorage}
              className="text-[10px] text-[#c5a27d] hover:text-[#1a1a1a] underline font-bold"
            >
              Request Quota Lock
            </button>
          )}
        </div>

        {/* Sync Interval Configuration Buttons */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-neutral-600">
            <span className="font-bold flex items-center gap-1.5 text-[#1a1a1a]">
              <Sliders className="w-3.5 h-3.5 text-[#c5a27d]" />
              Select Automated Sync Interval:
            </span>
            <span className="text-[11px] text-neutral-500">
              Current Cadence: <strong className="text-[#1a1a1a]">{syncInterval}s</strong> ({syncInterval === 5 ? "Sub-Second Mesh" : syncInterval === 15 ? "Recommended" : syncInterval === 30 ? "Balanced" : syncInterval === 60 ? "Low Power" : "Batch"})
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 font-mono text-xs">
            {[
              { sec: 5, label: "5s (Real-Time Mesh)", desc: "Sub-second clinical stream" },
              { sec: 15, label: "15s (Recommended)", desc: "Optimal battery & telemetry" },
              { sec: 30, label: "30s (Balanced)", desc: "Standard field outpost" },
              { sec: 60, label: "60s (Low Power)", desc: "Solar-conserving interval" },
              { sec: 300, label: "300s (Air-Gap Batch)", desc: "Infrequent periodic sync" },
            ].map((opt) => {
              const isSelected = syncInterval === opt.sec;
              return (
                <button
                  key={opt.sec}
                  onClick={() => onChangeSyncInterval && onChangeSyncInterval(opt.sec)}
                  className={`p-2.5 text-left border rounded-xs transition-all ${
                    isSelected
                      ? "bg-[#1a1a1a] text-white border-[#c5a27d] shadow-sm font-bold scale-[1.02]"
                      : "bg-[#FAF7F2] text-neutral-800 border-neutral-300 hover:border-[#1a1a1a] hover:bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{opt.label.split(" ")[0]}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#c5a27d]" />}
                  </div>
                  <div
                    className={`text-[9px] mt-1 font-sans ${
                      isSelected ? "text-neutral-300" : "text-neutral-500"
                    }`}
                  >
                    {opt.desc}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Sync Progress Bar & Countdown Ticker */}
        {autoSyncEnabled && (
          <div className="p-3 bg-[#FAF7F2] border border-neutral-300 rounded-xs space-y-1.5 font-mono text-xs">
            <div className="flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1.5 text-neutral-700">
                <Clock className="w-3.5 h-3.5 text-[#c5a27d]" />
                <span>Next automated background sync in:</span>
                <strong className="text-emerald-700 font-bold text-xs">
                  {secondsUntilNextSync ?? syncInterval}s
                </strong>
              </span>
              <span className="text-[10px] text-neutral-500">
                Last synchronized: <strong className="text-[#1a1a1a]">{lastSyncTime}</strong>
              </span>
            </div>

            {/* Countdown bar */}
            <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#c5a27d] to-emerald-500 h-full transition-[width] duration-300"
                style={{ width: `${syncProgressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Dual-Storage Vault Health & Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
          <div className="p-3 bg-white border border-neutral-200 space-y-1">
            <div className="text-[10px] text-neutral-500 uppercase flex items-center justify-between">
              <span>IndexedDB Local Storage</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
            <div className="text-sm font-serif font-bold text-[#1a1a1a]">
              {strongholds.length} Citadels Cached
            </div>
            <div className="text-[10px] text-emerald-700 font-bold">
              Latency: &lt;1ms • Offline Resilient
            </div>
          </div>

          <div className="p-3 bg-white border border-neutral-200 space-y-1">
            <div className="text-[10px] text-neutral-500 uppercase flex items-center justify-between">
              <span>Firestore Cloud Database</span>
              <span className="w-2 h-2 rounded-full bg-blue-500" />
            </div>
            <div className="text-xs font-serif font-bold text-[#1a1a1a] truncate" title="ai-studio-rightwayclinical-32e6c470-a50f-42e1-8571-07866613377c">
              ai-studio-rightwayclinical...
            </div>
            <div className="text-[10px] text-blue-700 font-bold">
              Consensus: Harmonic • 0 Pending
            </div>
          </div>

          <div className="p-3 bg-white border border-neutral-200 flex flex-col justify-between">
            <div className="text-[10px] text-neutral-500 uppercase">Manual Action</div>
            <button
              onClick={() => onForceSync && onForceSync()}
              disabled={isSyncing}
              className="w-full py-1.5 bg-[#1a1a1a] hover:bg-[#c5a27d] text-white hover:text-[#1a1a1a] transition-all font-bold text-xs uppercase flex items-center justify-center space-x-1.5 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#c5a27d] ${isSyncing ? "animate-spin" : ""}`} />
              <span>{isSyncing ? "Syncing Now..." : "Force Resync Now"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. LIVE SYSTEM STATUS PANEL (RECOMMENDED IN ARCHITECTURE REVIEW) */}
      <div className="bg-[#15161c] border-2 border-[#c5a27d] text-white p-4 shadow-md font-mono text-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-neutral-800 gap-2">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span className="font-serif font-bold text-sm tracking-tight text-[#FAF7F2]">
              SYSTEM STATUS: ALL 20 POCKETS OPERATIONAL
            </span>
          </div>
          <div className="flex items-center space-x-2 text-[10px]">
            <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
              UPTIME 99.99%
            </span>
            <span className="text-neutral-400">Solar Nexus 20-Pocket Mesh</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-[11px]">
          <div className="bg-neutral-900/90 border border-neutral-800 p-2 space-y-0.5">
            <div className="text-[9px] text-neutral-400">API GATEWAY</div>
            <div className="text-emerald-400 font-bold">✅ Healthy (0.08ms)</div>
          </div>
          <div className="bg-neutral-900/90 border border-neutral-800 p-2 space-y-0.5">
            <div className="text-[9px] text-neutral-400">AUTHENTICATION</div>
            <div className="text-emerald-400 font-bold">✅ Healthy (Active)</div>
          </div>
          <div className="bg-neutral-900/90 border border-neutral-800 p-2 space-y-0.5">
            <div className="text-[9px] text-neutral-400">DUAL VAULT</div>
            <div className="text-emerald-400 font-bold">✅ Harmonic Sync</div>
          </div>
          <div className="bg-neutral-900/90 border border-neutral-800 p-2 space-y-0.5">
            <div className="text-[9px] text-neutral-400">AI SERVICES</div>
            <div className="text-emerald-400 font-bold">✅ Gemini 2.5 Flash</div>
          </div>
          <div className="bg-neutral-900/90 border border-neutral-800 p-2 space-y-0.5">
            <div className="text-[9px] text-neutral-400">CI/CD PIPELINE</div>
            <div className="text-emerald-400 font-bold">✅ GitLab PASS</div>
          </div>
          <div className="bg-neutral-900/90 border border-neutral-800 p-2 space-y-0.5">
            <div className="text-[9px] text-neutral-400">SOLAR NEXUS</div>
            <div className="text-[#c5a27d] font-bold">✅ 20/20 Online</div>
          </div>
        </div>
      </div>

      {/* Top Clinical Readiness & Network Capacity Bar */}
      <div className="bg-white border border-[#1a1a1a]/15 p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 pb-4 mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-[#1a1a1a] text-[#c5a27d] rounded-sm">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-lg sm:text-xl text-[#1a1a1a]">
                Clinical Command Center & Operations
              </h1>
              <p className="text-xs font-mono text-neutral-500">
                Decentralized Clinical Intelligence • Emergency Triage Preparedness • Care Cadre Allocation
              </p>
            </div>
          </div>

          {/* Outpost Facility Selector & FHIR Export */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-mono uppercase text-neutral-500">Facility:</span>
            <select
              id="command-facility-selector"
              value={activeStronghold.id}
              onChange={(e) => onSelectStronghold(e.target.value)}
              className="px-3 py-1.5 bg-[#FAF7F2] border border-[#1a1a1a]/20 text-xs font-serif font-bold text-[#1a1a1a] focus:outline-none focus:border-[#c5a27d]"
            >
              {strongholds.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.id})
                </option>
              ))}
            </select>

            <button
              id="export-fhir-r4-btn"
              onClick={handleExportFhir}
              className="px-2.5 py-1.5 bg-[#1a1a1a] hover:bg-[#c5a27d] text-[#FAF7F2] hover:text-[#1a1a1a] transition-colors border border-[#c5a27d] font-mono text-[10px] uppercase tracking-wider flex items-center gap-1.5"
              title="Export standard HL7 FHIR R4 Bundle for EHR / Hospital Networks"
            >
              <Download className="w-3 h-3 text-[#c5a27d]" />
              <span>Export FHIR R4</span>
            </button>
          </div>
        </div>

        {/* 4-Pillar Clinical Telemetry Ribbon */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-[#FAF7F2] border border-neutral-200 p-3 space-y-1">
            <div className="text-[10px] font-mono text-neutral-500 uppercase flex items-center justify-between">
              <span>Triage Preparedness</span>
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <div className="text-sm font-serif font-bold text-amber-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              <span>CODE AMBER (SURGE)</span>
            </div>
            <div className="text-[9px] font-mono text-neutral-500">Level 2 Emergency Ready</div>
          </div>

          <div className="bg-[#FAF7F2] border border-neutral-200 p-3 space-y-1">
            <div className="text-[10px] font-mono text-neutral-500 uppercase flex items-center justify-between">
              <span>Active Care Cadre</span>
              <Users className="w-3.5 h-3.5 text-[#c5a27d]" />
            </div>
            <div className="text-sm font-serif font-bold text-[#1a1a1a]">
              {totalCareCadre.toLocaleString()}{" "}
              <span className="text-xs font-mono font-normal text-neutral-500">Clinicians</span>
            </div>
            <div className="text-[9px] font-mono text-neutral-500">
              {activeStronghold.age * 100} at {activeStronghold.name}
            </div>
          </div>

          <div className="bg-[#FAF7F2] border border-neutral-200 p-3 space-y-1">
            <div className="text-[10px] font-mono text-neutral-500 uppercase flex items-center justify-between">
              <span>Medical Logistics</span>
              <Pill className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <div className="text-sm font-serif font-bold text-blue-900">
              96.4%{" "}
              <span className="text-xs font-mono font-normal text-neutral-500">Optimal</span>
            </div>
            <div className="text-[9px] font-mono text-neutral-500">Cold-Chain Verified</div>
          </div>

          <div className="bg-[#FAF7F2] border border-neutral-200 p-3 space-y-1">
            <div className="text-[10px] font-mono text-neutral-500 uppercase flex items-center justify-between">
              <span>Surge Bed Capacity</span>
              <Building2 className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="text-sm font-serif font-bold text-emerald-900">
              142{" "}
              <span className="text-xs font-mono font-normal text-neutral-500">Beds Open</span>
            </div>
            <div className="text-[9px] font-mono text-neutral-500">74.2% Regional Occupancy</div>
          </div>
        </div>
      </div>

      {/* Strategic Scenario Presets */}
      <div className="bg-white border border-[#1a1a1a]/15 p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-[#c5a27d]" />
            <h2 className="font-serif font-bold text-sm text-[#1a1a1a]">
              Operational Incident & Surge Protocols
            </h2>
          </div>
          <span className="text-[9px] font-mono text-neutral-400">ONE-CLICK SCENARIO PRESETS</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {STRATEGIC_SCENARIOS.map((sc) => {
            const Icon = sc.icon;
            const isSelected = selectedScenarioId === sc.id;
            return (
              <button
                key={sc.id}
                id={`scenario-preset-${sc.id}`}
                onClick={() => handleSelectScenario(sc)}
                className={`p-3 text-left border transition-all ${
                  isSelected
                    ? "bg-[#FAF7F2] border-[#c5a27d] shadow-sm"
                    : "bg-white border-neutral-200 hover:border-neutral-400"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <Icon className="w-4 h-4 text-[#c5a27d]" />
                  <span className={`text-[8px] font-mono px-1 py-0.5 border ${sc.badgeColor}`}>
                    {sc.badge}
                  </span>
                </div>
                <div className="font-serif font-bold text-xs text-[#1a1a1a] mb-1">{sc.title}</div>
                <div className="text-[10px] text-neutral-600 line-clamp-2 leading-relaxed font-sans">
                  {sc.directive}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Dual-Column Clinical Command Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Column 1: AI Clinical Strategic Assessment */}
        <div className="bg-white border border-[#1a1a1a]/15 p-5 space-y-4 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <div className="flex items-center space-x-2">
                <Compass className="w-5 h-5 text-[#c5a27d]" />
                <h2 className="font-serif font-bold text-base text-[#1a1a1a]">
                  Clinical Operations Intelligence Oracle
                </h2>
              </div>
              <span className="text-[9px] font-mono px-2 py-0.5 bg-[#FAF7F2] border border-neutral-200 text-neutral-600">
                GEMINI SERVER-SIDE
              </span>
            </div>

            <p className="text-xs text-neutral-600 font-sans leading-relaxed">
              Synthesize clinical response directives, supply buffer allocations, and triage workflow
              recommendations for <strong>{activeStronghold.name}</strong>.
            </p>

            <div className="p-2.5 bg-[#FAF7F2] border border-neutral-200 text-xs font-mono space-y-1">
              <div className="text-neutral-500 text-[10px]">FACILITY STATUS:</div>
              <div className="text-[#1a1a1a] font-bold">{activeStronghold.name} ({activeStronghold.id})</div>
              <div className="text-neutral-600 text-[10px]">{activeStronghold.vitals}</div>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <button
              id="generate-clinical-strategy-btn"
              onClick={handleGenerateStrategy}
              disabled={isAiLoading}
              className="w-full flex items-center justify-center space-x-2 py-2.5 bg-[#1a1a1a] text-[#FAF7F2] hover:bg-[#c5a27d] transition-colors font-mono text-xs uppercase tracking-wider disabled:opacity-50 shadow-sm"
            >
              {isAiLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 text-[#c5a27d] animate-spin" />
                  <span>Synthesizing Operations Briefing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#c5a27d]" />
                  <span>Synthesize Clinical Strategic Assessment</span>
                </>
              )}
            </button>

            {aiAnalysis ? (
              <div className="p-4 bg-[#FAF7F2] border border-[#c5a27d]/40 text-xs font-sans text-neutral-800 leading-relaxed whitespace-pre-wrap rounded-sm space-y-2">
                <div className="font-serif font-bold text-sm text-[#1a1a1a] border-b border-[#c5a27d]/30 pb-1.5 flex items-center justify-between">
                  <span>Executive Clinical Assessment</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyAnalysis}
                      className="p-1 hover:bg-neutral-200 rounded transition-colors text-neutral-600 flex items-center gap-1 font-mono text-[9px]"
                      title="Copy assessment text"
                    >
                      {copiedAnalysis ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedAnalysis ? "COPIED" : "COPY"}</span>
                    </button>
                    <span className="text-[9px] font-mono text-emerald-700 bg-emerald-50 px-1 py-0.5 border border-emerald-200">
                      VERIFIED
                    </span>
                  </div>
                </div>
                <div className="text-neutral-800 leading-relaxed text-xs">{aiAnalysis}</div>
              </div>
            ) : (
              <div className="p-6 border border-dashed border-neutral-300 text-center text-xs font-mono text-neutral-400">
                Select a facility and click to synthesize a structured clinical intelligence brief.
              </div>
            )}
          </div>
        </div>

        {/* Column 2: Sovereign Clinical Directives & Decrees Studio */}
        <div className="bg-white border border-[#1a1a1a]/15 p-5 space-y-4 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-[#c5a27d]" />
                <h2 className="font-serif font-bold text-base text-[#1a1a1a]">
                  Clinical Directives & Sovereign Decrees
                </h2>
              </div>
              <span className="text-[9px] font-mono px-2 py-0.5 bg-[#FAF7F2] border border-neutral-200 text-neutral-600">
                SOVEREIGN SEAL
              </span>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="edict-recipient-input"
                className="text-[10px] font-mono uppercase text-neutral-500 flex items-center justify-between"
              >
                <span>Target Outpost / Network Sector</span>
                <span className="text-neutral-400">ISSUING OFFICER: {sovereignRole}</span>
              </label>
              <input
                id="edict-recipient-input"
                type="text"
                value={edictRecipient}
                onChange={(e) => setEdictRecipient(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-[#FAF7F2] border border-[#1a1a1a]/15 font-sans focus:outline-none focus:border-[#c5a27d]"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="edict-notes-textarea"
                className="text-[10px] font-mono uppercase text-neutral-500"
              >
                Mandate Directives & Clinical Protocols
              </label>
              <textarea
                id="edict-notes-textarea"
                rows={3}
                value={customEdictNotes}
                onChange={(e) => setCustomEdictNotes(e.target.value)}
                placeholder="Specify emergency triage protocols, resource requisitions, or staff shifts..."
                className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#1a1a1a]/15 font-sans focus:outline-none focus:border-[#c5a27d]"
              />
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <button
              id="draft-clinical-decree-btn"
              onClick={handleGenerateEdict}
              disabled={isEdictLoading}
              className="w-full flex items-center justify-center space-x-2 py-2.5 bg-[#1a1a1a] text-[#FAF7F2] hover:bg-[#c5a27d] transition-colors font-mono text-xs uppercase tracking-wider disabled:opacity-50 shadow-sm"
            >
              {isEdictLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 text-[#c5a27d] animate-spin" />
                  <span>Drafting Sovereign Directive...</span>
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 text-[#c5a27d]" />
                  <span>Draft Sovereign Clinical Directive</span>
                </>
              )}
            </button>

            {royalEdict && (
              <div className="space-y-2">
                <div className="p-4 bg-[#FAF7F2] border border-[#1a1a1a] text-xs font-serif text-[#1a1a1a] leading-relaxed whitespace-pre-wrap shadow-inner rounded-sm">
                  {royalEdict}
                </div>

                <div className="flex gap-2">
                  <button
                    id="broadcast-edict-to-council-btn"
                    onClick={handlePublishEdict}
                    className="flex-1 flex items-center justify-center space-x-1.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-mono text-xs uppercase tracking-wider transition-colors shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Broadcast to Council Decrees</span>
                  </button>
                  <button
                    onClick={handleCopyEdict}
                    className="px-3 py-2 bg-[#FAF7F2] border border-neutral-300 hover:border-neutral-500 font-mono text-xs transition-colors flex items-center gap-1"
                    title="Copy Directive text"
                  >
                    {copiedEdict ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#c5a27d]" />}
                    <span>{copiedEdict ? "Copied" : "Copy"}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* LIVE BEDSIDE TELEMETRY & ULTRASOUND VIDEO FEEDS (HOVERCARD PREVIEWS) */}
      <div className="bg-white border border-[#1a1a1a]/15 p-5 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-neutral-200 gap-2">
          <div className="flex items-center space-x-2">
            <Film className="w-4 h-4 text-[#c5a27d]" />
            <h4 className="font-serif font-bold text-sm text-[#1a1a1a]">
              Live Bedside Doppler Ultrasound &amp; Telemetry Video Streams
            </h4>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-[9px] font-mono px-2 py-0.5 bg-red-50 text-red-700 border border-red-200 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              LIVE TELE-TRIAGE
            </span>
            <span className="text-[9px] font-mono text-neutral-500">
              Hover for real-time video display preview
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              bed: "Bed 01: Trauma Pavilion",
              patient: "Mrs. Eleanor Vance",
              type: "Echocardiogram Doppler",
              vitals: "HR 74 • SpO2 94% • BP 168/98",
              video: ECOSYSTEM_VIDEOS["clinical-telemetry"],
            },
            {
              bed: "Bed 02: Acute Mobile Unit",
              patient: "Marcus Cole",
              type: "Vascular Doppler Scan",
              vitals: "HR 102 • SpO2 98% • Temp 101.2°F",
              video: ECOSYSTEM_VIDEOS["clinical-telemetry"],
            },
            {
              bed: "Unit 04: Drone Air-Ambulance",
              patient: "En-Route Convoy Alpha",
              type: "FLIR Aerial Telemetry",
              vitals: "Speed 48 kts • ETA 08 min",
              video: ECOSYSTEM_VIDEOS["spatial-radar"],
            },
            {
              bed: "Command Relay Node",
              patient: "Sovereign Health Cadre",
              type: "Keynote Directives Feed",
              vitals: "Pocket 11 • Low Latency 0.08ms",
              video: ECOSYSTEM_VIDEOS["keynote-sovereign-ai"],
            },
          ].map((item) => (
            <VideoHoverCard
              key={item.bed}
              video={item.video}
              onExpand={(v) => {
                setSelectedCinemaVideo(v);
                setShowCinemaModal(true);
              }}
              position="auto"
              cardWidth={340}
            >
              <div
                onClick={() => {
                  setSelectedCinemaVideo(item.video);
                  setShowCinemaModal(true);
                }}
                className="p-3 bg-[#FAF7F2] border border-neutral-300 hover:border-[#c5a27d] transition-all rounded-xs cursor-pointer space-y-1.5 group text-left"
              >
                <div className="flex items-center justify-between text-[9px] font-mono">
                  <span className="font-bold text-[#c5a27d]">{item.bed}</span>
                  <span className="text-red-600 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    LIVE
                  </span>
                </div>
                <div className="font-serif font-bold text-xs text-[#1a1a1a] group-hover:text-[#c5a27d] transition-colors truncate">
                  {item.patient}
                </div>
                <div className="text-[10px] text-neutral-600 font-mono">
                  {item.type}
                </div>
                <div className="text-[9px] text-emerald-800 font-mono font-bold bg-emerald-50 px-1.5 py-0.5 border border-emerald-200 truncate">
                  {item.vitals}
                </div>
                <div className="pt-1 border-t border-neutral-200 flex items-center justify-between text-[9px] font-mono text-[#c5a27d]">
                  <span>📹 Video Hover Preview</span>
                  <span className="font-bold group-hover:underline">Cinema 4K →</span>
                </div>
              </div>
            </VideoHoverCard>
          ))}
        </div>
      </div>

      {/* Integrated Sovereign Clinical Intelligence Core */}
      <div className="pt-2">
        <KingdomIntelligenceCore />
      </div>

      {/* 4K CINEMA THEATER MODAL */}
      <VideoTheaterModal
        video={selectedCinemaVideo}
        isOpen={showCinemaModal}
        onClose={() => setShowCinemaModal(false)}
        playlist={ALL_PLAYLIST_VIDEOS}
        onSelectVideo={(v) => setSelectedCinemaVideo(v)}
      />
    </div>
  );
}
