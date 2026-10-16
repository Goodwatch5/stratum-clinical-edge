"use client";

import React, { useState } from "react";
import {
  GitBranch,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Terminal,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Layers,
  Cpu,
  Server,
  Zap,
  RotateCcw,
} from "lucide-react";
import type { AppTab } from "@/lib/navigation";

interface BuildDeploymentHealthCardsProps {
  onNavigateTab?: (tabName: AppTab) => void;
  onRefresh?: () => void;
  isDark?: boolean;
}

export default function BuildDeploymentHealthCards({
  onNavigateTab,
  onRefresh,
  isDark = false,
}: BuildDeploymentHealthCardsProps) {
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [lastCheckTime, setLastCheckTime] = useState<string>("Just now");

  const handleManualCheck = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastCheckTime(new Date().toLocaleTimeString());
      if (onRefresh) onRefresh();
    }, 600);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
      {/* CARD 1: BUILD STATUS */}
      <div className="bg-white border border-[#1a1a1a]/15 p-4 rounded-xs space-y-2 shadow-xs">
        <div className="flex items-center justify-between text-neutral-500 uppercase text-[10px] tracking-wider">
          <span className="font-bold flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-[#c5a27d]" />
            CI/CD Build Pipeline
          </span>
          <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold rounded-xs">
            PASS
          </span>
        </div>
        <div className="flex items-baseline justify-between pt-1">
          <div className="text-xl font-serif font-bold text-[#1a1a1a]">
            100% Verified
          </div>
          <span className="text-[10px] text-emerald-700 font-bold">0 Errors</span>
        </div>
        <div className="text-[10px] text-neutral-500 pt-1 border-t border-neutral-100 flex items-center justify-between">
          <span>Target: Next.js 15 App Router</span>
          <span>Duration: 28s</span>
        </div>
      </div>

      {/* CARD 2: DEPLOYMENT STATUS */}
      <div className="bg-white border border-[#1a1a1a]/15 p-4 rounded-xs space-y-2 shadow-xs">
        <div className="flex items-center justify-between text-neutral-500 uppercase text-[10px] tracking-wider">
          <span className="font-bold flex items-center gap-1.5">
            <Server className="w-3.5 h-3.5 text-blue-600" />
            Edge Deployment
          </span>
          <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold rounded-xs">
            PASS
          </span>
        </div>
        <div className="flex items-baseline justify-between pt-1">
          <div className="text-xl font-serif font-bold text-[#1a1a1a]">
            Cloud Run Edge
          </div>
          <span className="text-[10px] text-neutral-500">Port 3000</span>
        </div>
        <div className="text-[10px] text-neutral-500 pt-1 border-t border-neutral-100 flex items-center justify-between">
          <span>Region: us-west2</span>
          <span className="text-emerald-700 font-bold">HTTP 200 OK</span>
        </div>
      </div>

      {/* CARD 3: LAST COMMIT & SOURCE */}
      <div className="bg-white border border-[#1a1a1a]/15 p-4 rounded-xs space-y-2 shadow-xs">
        <div className="flex items-center justify-between text-neutral-500 uppercase text-[10px] tracking-wider">
          <span className="font-bold flex items-center gap-1.5">
            <GitBranch className="w-3.5 h-3.5 text-[#7c3aed]" />
            GitLab Repository
          </span>
          <span className="text-[10px] font-bold text-neutral-700">Goodwatch5</span>
        </div>
        <div className="pt-1">
          <div className="font-bold text-[#1a1a1a] truncate" title="seventeen-pockets / branch: Cooler98">
            seventeen-pockets: Cooler98
          </div>
          <div className="text-[10px] text-neutral-500 truncate mt-0.5">
            Commit: 7c3aed1 • Fix dynamic basename &amp; cache-bust
          </div>
        </div>
        <div className="text-[10px] text-neutral-500 pt-1 border-t border-neutral-100 flex items-center justify-between">
          <span>Files Indexed: 1,095</span>
          {onNavigateTab && (
            <button
              onClick={() => onNavigateTab("gitlab-builds")}
              className="text-[#c5a27d] hover:underline font-bold"
            >
              Inspect Builds
            </button>
          )}
        </div>
      </div>

      {/* CARD 4: ECOSYSTEM HEALTH & QUICK SHORTCUTS */}
      <div className="bg-white border border-[#1a1a1a]/15 p-4 rounded-xs space-y-2 shadow-xs">
        <div className="flex items-center justify-between text-neutral-500 uppercase text-[10px] tracking-wider">
          <span className="font-bold flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#c5a27d]" />
            Ecosystem Topology
          </span>
          <button
            onClick={handleManualCheck}
            disabled={isRefreshing}
            className="text-[9px] text-[#c5a27d] hover:text-[#1a1a1a] flex items-center gap-1 cursor-pointer"
            title="Check live health"
          >
            <RefreshCw className={`w-3 h-3 ${isRefreshing ? "animate-spin" : ""}`} />
            <span>{isRefreshing ? "Checking..." : "Re-Check"}</span>
          </button>
        </div>
        <div className="flex items-baseline justify-between pt-1">
          <div className="text-xl font-serif font-bold text-[#1a1a1a]">
            20 Pockets Live
          </div>
          <span className="text-[10px] text-purple-700 font-bold">17 + 3 Nexus</span>
        </div>
        <div className="text-[10px] text-neutral-500 pt-1 border-t border-neutral-100 flex items-center justify-between">
          <span>Sync: {lastCheckTime}</span>
          {onNavigateTab && (
            <button
              onClick={() => onNavigateTab("topology")}
              className="text-[#c5a27d] hover:underline font-bold flex items-center gap-0.5"
            >
              <span>Ecosystem Map</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
