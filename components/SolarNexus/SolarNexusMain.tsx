"use client";

import React, { useState } from "react";
import {
  Globe,
  GitBranch,
  Layers,
  Zap,
  BookOpen,
  Activity,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Sun,
  Award,
  ArrowLeft,
  Sparkles,
  Info,
  Cpu
} from "lucide-react";
import dynamic from "next/dynamic";
import type { PocketNodeData } from "./SolarNexusGlobe";
import type { GitLabProjectNode } from "./GitLabNetworkGraph";
import ServicesRegistry20, { PocketService } from "./ServicesRegistry20";
import SpecializedPocketsSuite from "./SpecializedPocketsSuite";
import GitBookDocsViewer from "./GitBookDocsViewer";
import MeshTelemetryConsole from "./MeshTelemetryConsole";
import GitLabBuildsConsole from "./GitLabBuildsConsole";

const SolarNexusGlobe = dynamic(() => import("./SolarNexusGlobe"), {
  ssr: false,
  loading: () => (
    <div className="bg-[#111923] border border-[#2a384c] p-12 text-center text-neutral-400 font-mono text-sm flex flex-col items-center justify-center space-y-3 min-h-[500px]">
      <div className="w-8 h-8 border-2 border-[#c5a27d] border-t-transparent rounded-full animate-spin" />
      <span>Initializing 3D Three.js Solar Nexus Coordinates...</span>
    </div>
  ),
});

const GitLabNetworkGraph = dynamic(() => import("./GitLabNetworkGraph"), {
  ssr: false,
  loading: () => (
    <div className="bg-[#111923] border border-[#2a384c] p-12 text-center text-neutral-400 font-mono text-sm flex flex-col items-center justify-center space-y-3 min-h-[500px]">
      <div className="w-8 h-8 border-2 border-[#c5a27d] border-t-transparent rounded-full animate-spin" />
      <span>Calculating D3.js Force Simulation Nodes...</span>
    </div>
  ),
});

export default function SolarNexusMain({
  onReturnToClinical,
}: {
  onReturnToClinical?: () => void;
}) {
  const [activeTab, setActiveTab] = useState<
    | "globe-3d"
    | "gitlab-network"
    | "gitlab-builds"
    | "services-20"
    | "mesh-telemetry"
    | "specialized"
    | "gitbook-docs"
  >("globe-3d");

  const [selectedGlobeNode, setSelectedGlobeNode] = useState<PocketNodeData | null>(null);
  const [selectedRegistryPocketId, setSelectedRegistryPocketId] = useState<number | undefined>(undefined);

  const handleGlobeSelectNode = (node: PocketNodeData) => {
    setSelectedGlobeNode(node);
    setSelectedRegistryPocketId(node.id);
    setActiveTab("services-20");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* SEPARATE ADDITION HERO BANNER & LIVE BADGES */}
      <div className="bg-[#111923] border-2 border-[#c5a27d] p-5 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#c5a27d]/15 to-transparent pointer-events-none rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-[#c5a27d] text-[#1a1a1a] font-bold">
                SEPARATE EXPANSION MODULE
              </span>
              <span className="text-[10px] font-mono text-[#c5a27d] border border-[#c5a27d]/40 px-2 py-0.5">
                https://branded-by-odell.gitbook.io/seventeen-pockets-by-odell
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <img
                src="/src/assets/images/odlc_brand_logo_1791603956565.jpg"
                alt="ODLC Logo"
                className="w-10 h-10 rounded border border-[#c5a27d] object-cover"
                referrerPolicy="no-referrer"
              />
              <div>
                <h1 className="font-serif font-bold text-xl md:text-2xl text-[#FAF7F2] tracking-wide">
                  The Solar Nexus — Seventeen Pockets
                </h1>
                <p className="text-xs font-mono text-neutral-300">
                  Connecting Humanity Solarly • GitLab Project Network &amp; 20-Pocket Interpretability Matrix
                </p>
              </div>
            </div>
          </div>

          {/* Badges straight from the GitBook README */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 bg-emerald-950 border border-emerald-500 text-emerald-300 font-mono text-xs font-bold flex items-center space-x-1.5 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
              <span>20/20 Pockets: LIVE</span>
            </span>

            <span className="px-2.5 py-1 bg-emerald-950 border border-emerald-500 text-emerald-400 font-mono text-xs font-bold flex items-center space-x-1 shadow-xs">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Status: Operational</span>
            </span>

            <span className="px-2.5 py-1 bg-emerald-950 border border-emerald-500 text-emerald-400 font-mono text-xs font-bold flex items-center space-x-1 shadow-xs">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Pipeline: 100%</span>
            </span>

            <span className="px-2.5 py-1 bg-emerald-950 border border-emerald-500 text-emerald-400 font-mono text-xs font-bold flex items-center space-x-1 shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Errors: 0</span>
            </span>

            <span className="px-2.5 py-1 bg-[#1a2332] border border-[#c5a27d]/40 text-[#c5a27d] font-mono text-xs font-bold flex items-center space-x-1">
              <Activity className="w-3.5 h-3.5" />
              <span>87ms Latency</span>
            </span>
          </div>
        </div>

        {/* Navigation Switch Tabs */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 pt-4 mt-4 border-t border-neutral-700/80">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setActiveTab("globe-3d")}
              className={`px-3 py-1.5 text-xs font-mono font-semibold transition-all flex items-center space-x-1.5 border ${
                activeTab === "globe-3d"
                  ? "bg-[#c5a27d] text-[#1a1a1a] border-[#c5a27d] font-bold shadow-sm"
                  : "bg-black/40 text-neutral-300 border-neutral-700 hover:border-[#c5a27d]"
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>1. 3D Solar Nexus Globe</span>
            </button>

            <button
              onClick={() => setActiveTab("gitlab-network")}
              className={`px-3 py-1.5 text-xs font-mono font-semibold transition-all flex items-center space-x-1.5 border ${
                activeTab === "gitlab-network"
                  ? "bg-[#c5a27d] text-[#1a1a1a] border-[#c5a27d] font-bold shadow-sm"
                  : "bg-black/40 text-neutral-300 border-neutral-700 hover:border-[#c5a27d]"
              }`}
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span>2. GitLab D3 Network Graph</span>
            </button>

            <button
              onClick={() => setActiveTab("services-20")}
              className={`px-3 py-1.5 text-xs font-mono font-semibold transition-all flex items-center space-x-1.5 border ${
                activeTab === "services-20"
                  ? "bg-[#c5a27d] text-[#1a1a1a] border-[#c5a27d] font-bold shadow-sm"
                  : "bg-black/40 text-neutral-300 border-neutral-700 hover:border-[#c5a27d]"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>3. 20-Pocket Registry &amp; Interpretability</span>
            </button>

            <button
              onClick={() => setActiveTab("specialized")}
              className={`px-3 py-1.5 text-xs font-mono font-semibold transition-all flex items-center space-x-1.5 border ${
                activeTab === "specialized"
                  ? "bg-[#c5a27d] text-[#1a1a1a] border-[#c5a27d] font-bold shadow-sm"
                  : "bg-black/40 text-neutral-300 border-neutral-700 hover:border-[#c5a27d]"
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>4. Specialized Pockets (Alert 10 / Auto-Fix)</span>
            </button>

            <button
              onClick={() => setActiveTab("gitlab-builds")}
              className={`px-3 py-1.5 text-xs font-mono font-semibold transition-all flex items-center space-x-1.5 border ${
                activeTab === "gitlab-builds"
                  ? "bg-[#c5a27d] text-[#1a1a1a] border-[#c5a27d] font-bold shadow-sm"
                  : "bg-black/40 text-neutral-300 border-neutral-700 hover:border-[#c5a27d]"
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>5. GitLab Real Builds &amp; Files</span>
            </button>

            <button
              onClick={() => setActiveTab("mesh-telemetry")}
              className={`px-3 py-1.5 text-xs font-mono font-semibold transition-all flex items-center space-x-1.5 border ${
                activeTab === "mesh-telemetry"
                  ? "bg-[#c5a27d] text-[#1a1a1a] border-[#c5a27d] font-bold shadow-sm"
                  : "bg-black/40 text-neutral-300 border-neutral-700 hover:border-[#c5a27d]"
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>6. Mesh Latency &amp; Pings (20/20)</span>
            </button>

            <button
              onClick={() => setActiveTab("gitbook-docs")}
              className={`px-3 py-1.5 text-xs font-mono font-semibold transition-all flex items-center space-x-1.5 border ${
                activeTab === "gitbook-docs"
                  ? "bg-[#c5a27d] text-[#1a1a1a] border-[#c5a27d] font-bold shadow-sm"
                  : "bg-black/40 text-neutral-300 border-neutral-700 hover:border-[#c5a27d]"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>7. GitBook Knowledge Base</span>
            </button>
          </div>

          {onReturnToClinical && (
            <button
              onClick={onReturnToClinical}
              className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-mono border border-neutral-600 flex items-center space-x-1 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#c5a27d]" />
              <span>Return to Stratum Clinical Edge</span>
            </button>
          )}
        </div>
      </div>

      {/* VIEW SWITCHER */}
      {activeTab === "globe-3d" && (
        <div className="space-y-4">
          <SolarNexusGlobe
            selectedNodeId={selectedGlobeNode?.id}
            onSelectNode={handleGlobeSelectNode}
          />

          <div className="bg-white border border-[#1a1a1a]/15 p-4 flex flex-wrap items-center justify-between gap-3 text-xs font-mono shadow-xs">
            <div className="flex items-center space-x-2">
              <Sun className="w-4 h-4 text-amber-500" />
              <span className="font-bold text-[#1a1a1a]">Solar Energy Calculation Engine:</span>
              <span className="text-neutral-600">
                17 Node mesh generating <strong>8,450.7 MWh / day</strong> allocated to sovereign edge containers.
              </span>
            </div>
            <button
              onClick={() => setActiveTab("services-20")}
              className="text-[#c5a27d] font-bold hover:underline flex items-center space-x-1"
            >
              <span>Explore 20-Pocket Registry</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {activeTab === "gitlab-network" && (
        <GitLabNetworkGraph
          onSelectProject={(proj) => {
            if (proj.pocketId) {
              setSelectedRegistryPocketId(proj.pocketId);
            }
          }}
        />
      )}

      {activeTab === "services-20" && (
        <ServicesRegistry20
          selectedPocketId={selectedRegistryPocketId}
          onSelectPocket={(p) => setSelectedRegistryPocketId(p.id)}
        />
      )}

      {activeTab === "mesh-telemetry" && (
        <MeshTelemetryConsole
          onSelectPocket={(pocketId) => {
            setSelectedRegistryPocketId(pocketId);
            setActiveTab("services-20");
          }}
          isDark={true}
        />
      )}

      {activeTab === "specialized" && <SpecializedPocketsSuite />}

      {activeTab === "gitlab-builds" && <GitLabBuildsConsole />}

      {activeTab === "gitbook-docs" && <GitBookDocsViewer />}
    </div>
  );
}
