"use client";

import React, { useState } from "react";
import {
  Layers,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  GitBranch,
  Filter,
  Check,
  Info,
  Sparkles,
  ChevronRight,
  ChevronDown,
  Cpu,
  Globe,
  Database,
  Radio,
  Zap,
  Film,
  Play,
  Maximize2,
} from "lucide-react";
import { ALL_20_POCKETS, PocketService } from "./SolarNexus/ServicesRegistry20";
import VideoHoverCard from "./VideoHoverCard";
import VideoTheaterModal, { VideoData } from "./VideoTheaterModal";
import { ECOSYSTEM_VIDEOS, ALL_PLAYLIST_VIDEOS } from "@/lib/videoRegistry";

const POCKET_VIDEO_MAP: Record<number, string> = {
  1: "clinical-telemetry",
  4: "sync-pulse",
  7: "keynote-sovereign-ai",
  8: "spatial-radar",
  11: "entertainment-stream",
  15: "orbital-globe",
};

interface PocketStatusMatrixProps {
  onSelectPocket?: (pocketId: number) => void;
  onNavigateTab?: (tabName: string) => void;
  isDark?: boolean;
}

export default function PocketStatusMatrix({
  onSelectPocket,
  onNavigateTab,
  isDark = false,
}: PocketStatusMatrixProps) {
  const [filterCategory, setFilterCategory] = useState<"all" | "core" | "interpretability">("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "Live" | "Ready">("all");
  const [expandedPocketId, setExpandedPocketId] = useState<number | null>(null);
  const [selectedCinemaVideo, setSelectedCinemaVideo] = useState<VideoData | null>(null);
  const [showCinemaModal, setShowCinemaModal] = useState<boolean>(false);

  const filteredPockets = ALL_20_POCKETS.filter((p) => {
    if (filterCategory !== "all" && p.category !== filterCategory) return false;
    if (filterStatus !== "all" && p.status !== filterStatus) return false;
    return true;
  });

  const liveCount = ALL_20_POCKETS.filter((p) => p.status === "Live").length;
  const readyCount = ALL_20_POCKETS.filter((p) => p.status === "Ready").length;

  return (
    <div
      className={`border rounded-xs p-5 sm:p-6 space-y-6 ${
        isDark
          ? "bg-[#111923] border-[#1f2d3d] text-neutral-100"
          : "bg-white border-[#1a1a1a]/20 text-[#1a1a1a]"
      } shadow-xs`}
    >
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#1a1a1a]/15 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-[#c5a27d]/20 text-[#c5a27d] border border-[#c5a27d]/40 rounded-xs">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base sm:text-lg font-serif font-bold text-[#1a1a1a]">
                  Universal Pocket Status Matrix (01 – 20)
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold rounded-xs">
                  100% OPERATIONAL
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-[#c5a27d]/20 text-[#1a1a1a] border border-[#c5a27d]/40 font-bold rounded-xs">
                  SIMULATION DATASET
                </span>
              </div>
              <p className="text-xs font-mono text-neutral-500 mt-0.5">
                Comprehensive operational ledger across Core Infrastructure (Pockets 01–12) and Interpretability &amp; Scaling Layers (Pockets 13–20).
              </p>
            </div>
          </div>
        </div>

        {/* EVOLUTION CONTEXT BADGE */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <div className="px-2.5 py-1.5 bg-neutral-100 border border-neutral-300 text-neutral-700">
            <span className="text-neutral-500">Foundation:</span>{" "}
            <span className="font-bold text-[#1a1a1a]">Seventeen Pockets</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-[#c5a27d]" />
          <div className="px-2.5 py-1.5 bg-[#c5a27d]/20 border border-[#c5a27d] text-[#1a1a1a] font-bold">
            Solar Nexus 20-Pocket Mesh
          </div>
        </div>
      </div>

      {/* FILTER CONTROLS & COUNTERS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-50 p-3 border border-neutral-200 text-xs font-mono">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-neutral-500 font-bold uppercase text-[10px] flex items-center gap-1">
            <Filter className="w-3 h-3" />
            Filter Layer:
          </span>
          <button
            onClick={() => setFilterCategory("all")}
            className={`px-2 py-1 transition-colors cursor-pointer ${
              filterCategory === "all"
                ? "bg-[#1a1a1a] text-white font-bold"
                : "bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-100"
            }`}
          >
            All 20 Pockets
          </button>
          <button
            onClick={() => setFilterCategory("core")}
            className={`px-2 py-1 transition-colors cursor-pointer ${
              filterCategory === "core"
                ? "bg-[#1a1a1a] text-white font-bold"
                : "bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-100"
            }`}
          >
            Core 01–12
          </button>
          <button
            onClick={() => setFilterCategory("interpretability")}
            className={`px-2 py-1 transition-colors cursor-pointer ${
              filterCategory === "interpretability"
                ? "bg-[#1a1a1a] text-white font-bold"
                : "bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-100"
            }`}
          >
            Interpretability 13–20
          </button>
        </div>

        <div className="flex items-center space-x-3 text-[11px]">
          <span className="flex items-center gap-1.5 text-emerald-800 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            {liveCount} Live
          </span>
          <span className="flex items-center gap-1.5 text-blue-800 font-bold">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            {readyCount} Standby/Ready
          </span>
          {onNavigateTab && (
            <button
              onClick={() => onNavigateTab("seventeen-pockets")}
              className="text-[#c5a27d] hover:underline font-bold flex items-center gap-1"
            >
              <span>Ecosystem Topology</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* COMPACT MATRIX GRID VIEW */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-10 gap-2 font-mono text-xs">
        {ALL_20_POCKETS.map((p) => {
          const isSelected = expandedPocketId === p.id;
          const isLive = p.status === "Live";
          const videoKey = POCKET_VIDEO_MAP[p.id];
          const hasVideo = !!videoKey && !!ECOSYSTEM_VIDEOS[videoKey];

          const buttonNode = (
            <button
              onClick={() => {
                setExpandedPocketId(isSelected ? null : p.id);
                if (onSelectPocket) onSelectPocket(p.id);
              }}
              className={`p-2 border transition-all text-left flex flex-col justify-between h-20 w-full rounded-xs cursor-pointer ${
                isSelected
                  ? "bg-[#1a1a1a] text-white border-[#c5a27d] shadow-md scale-102"
                  : isLive
                  ? "bg-emerald-50/70 border-emerald-300/80 hover:border-emerald-500 text-neutral-800"
                  : "bg-blue-50/70 border-blue-300/80 hover:border-blue-500 text-neutral-800"
              }`}
              title={`Pocket ${p.id.toString().padStart(2, "0")}: ${p.name} (${p.status})${hasVideo ? " • Hover for Video Preview" : ""}`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-bold text-[10px] opacity-75">
                  P{p.id.toString().padStart(2, "0")}
                </span>
                <div className="flex items-center space-x-1">
                  {hasVideo && (
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" title="Live Video Stream" />
                  )}
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isLive ? "bg-emerald-500" : "bg-blue-500"
                    }`}
                  />
                </div>
              </div>
              <div className="font-semibold text-xs truncate leading-tight mt-1">{p.name}</div>
              <div className="flex items-center justify-between text-[9px] opacity-80 pt-1 border-t border-current/10">
                <span>v{p.version}</span>
                <span className="font-bold">{p.metrics.latency}</span>
              </div>
            </button>
          );

          if (hasVideo) {
            return (
              <VideoHoverCard
                key={p.id}
                video={ECOSYSTEM_VIDEOS[videoKey]}
                onExpand={(v) => {
                  setSelectedCinemaVideo(v);
                  setShowCinemaModal(true);
                }}
                position="auto"
                cardWidth={330}
              >
                {buttonNode}
              </VideoHoverCard>
            );
          }

          return <React.Fragment key={p.id}>{buttonNode}</React.Fragment>;
        })}
      </div>

      {/* DETAILED POCKET STATUS TABLE */}
      <div className="overflow-x-auto border border-[#1a1a1a]/15 rounded-xs">
        <table className="w-full text-left font-mono text-xs">
          <thead className="bg-[#1a1a1a] text-[#FAF7F2] text-[10px] uppercase tracking-wider">
            <tr>
              <th className="p-3">Pocket</th>
              <th className="p-3">Service Name</th>
              <th className="p-3">Layer</th>
              <th className="p-3">Status</th>
              <th className="p-3">Version</th>
              <th className="p-3">Latency / Throughput</th>
              <th className="p-3">Dependencies</th>
              <th className="p-3 text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 bg-white">
            {filteredPockets.map((p) => {
              const isExpanded = expandedPocketId === p.id;
              const isLive = p.status === "Live";
              return (
                <React.Fragment key={p.id}>
                  <tr
                    onClick={() => setExpandedPocketId(isExpanded ? null : p.id)}
                    className={`hover:bg-neutral-50 transition-colors cursor-pointer ${
                      isExpanded ? "bg-amber-50/60 font-semibold" : ""
                    }`}
                  >
                    <td className="p-3 font-bold text-[#c5a27d]">
                      #{p.id.toString().padStart(2, "0")}
                    </td>
                    <td className="p-3 font-bold text-[#1a1a1a] flex items-center gap-1.5 flex-wrap">
                      <span>{p.name}</span>
                      {p.id <= 17 && (
                        <span className="text-[8px] bg-neutral-200 text-neutral-700 px-1 py-0.2 rounded-xs font-normal">
                          Foundation
                        </span>
                      )}
                      {p.id > 17 && (
                        <span className="text-[8px] bg-purple-100 text-purple-800 px-1 py-0.2 rounded-xs font-normal">
                          Nexus 20+
                        </span>
                      )}
                      {POCKET_VIDEO_MAP[p.id] && (
                        <VideoHoverCard
                          video={ECOSYSTEM_VIDEOS[POCKET_VIDEO_MAP[p.id]]}
                          onExpand={(v) => {
                            setSelectedCinemaVideo(v);
                            setShowCinemaModal(true);
                          }}
                          position="right"
                          cardWidth={340}
                        >
                          <span className="text-[8px] bg-red-50 text-red-700 border border-red-200 hover:bg-red-600 hover:text-white px-1.5 py-0.5 rounded-xs font-mono font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                            <span>📹 Feed</span>
                          </span>
                        </VideoHoverCard>
                      )}
                    </td>
                    <td className="p-3 capitalize text-neutral-600">
                      {p.category === "core" ? "Core (01-12)" : "Interpretability (13-20)"}
                    </td>
                    <td className="p-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-xs text-[10px] font-bold ${
                          isLive
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                            : "bg-blue-100 text-blue-800 border border-blue-300"
                        }`}
                      >
                        <Check className="w-2.5 h-2.5" />
                        <span>{p.status}</span>
                      </span>
                    </td>
                    <td className="p-3 text-neutral-700">v{p.version}</td>
                    <td className="p-3 text-neutral-700">
                      {p.metrics.latency} • {p.metrics.throughput}
                    </td>
                    <td className="p-3 text-[11px] text-neutral-500">
                      {p.dependencies.length > 0 ? p.dependencies.join(", ") : "None (Root)"}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedPocketId(isExpanded ? null : p.id);
                        }}
                        className="text-[#c5a27d] hover:text-[#1a1a1a] p-1"
                      >
                        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </button>
                    </td>
                  </tr>

                  {/* EXPANDED ACCORDION VIEW */}
                  {isExpanded && (
                    <tr className="bg-neutral-50/90 border-b border-neutral-200">
                      <td colSpan={8} className="p-4 space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-1">
                            <div className="text-[10px] text-neutral-500 uppercase font-bold">
                              Description &amp; Objective
                            </div>
                            <p className="font-sans text-xs text-neutral-800 leading-relaxed">
                              {p.description}
                            </p>
                          </div>

                          <div className="space-y-1">
                            <div className="text-[10px] text-neutral-500 uppercase font-bold">
                              Verified Tech Stack
                            </div>
                            <div className="text-xs text-neutral-800 bg-white p-2 border border-neutral-200 rounded-xs">
                              {p.techStack}
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="text-[10px] text-neutral-500 uppercase font-bold">
                              Production SLA Metrics
                            </div>
                            <div className="text-xs text-neutral-800 bg-white p-2 border border-neutral-200 rounded-xs space-y-1">
                              <div className="flex justify-between">
                                <span>Target Latency:</span>
                                <span className="font-bold text-emerald-700">{p.metrics.latency}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Measured Uptime:</span>
                                <span className="font-bold text-emerald-700">{p.metrics.uptime}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Peak Throughput:</span>
                                <span className="font-bold">{p.metrics.throughput}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between pt-2 border-t border-neutral-200 text-xs">
                          <span className="text-neutral-500 text-[11px]">
                            Pocket #{p.id} integrates with safe seventeen-pockets edge containers and IndexedDB Local vault.
                          </span>
                          <div className="flex items-center gap-2">
                            {POCKET_VIDEO_MAP[p.id] && (
                              <button
                                onClick={() => {
                                  setSelectedCinemaVideo(ECOSYSTEM_VIDEOS[POCKET_VIDEO_MAP[p.id]]);
                                  setShowCinemaModal(true);
                                }}
                                className="px-2.5 py-1 bg-[#c5a27d] text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white transition-colors font-bold flex items-center gap-1 text-[11px]"
                              >
                                <Play className="w-3 h-3 fill-current" />
                                <span>Watch Video Telemetry</span>
                              </button>
                            )}
                            {onNavigateTab && (
                              <button
                                onClick={() => onNavigateTab("mesh-telemetry")}
                                className="px-2.5 py-1 bg-white hover:bg-neutral-100 border border-neutral-300 text-neutral-800 font-bold"
                              >
                                Ping Pocket in Telemetry
                              </button>
                            )}
                            {onNavigateTab && (
                              <button
                                onClick={() => onNavigateTab("gitlab-builds")}
                                className="px-2.5 py-1 bg-[#1a1a1a] text-white hover:bg-neutral-800 font-bold"
                              >
                                View GitLab CI Artifact
                              </button>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
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
