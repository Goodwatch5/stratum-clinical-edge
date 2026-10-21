"use client";

import React, { useState } from "react";
import { Stronghold } from "@/app/page";
import { Castle, Compass, Crosshair, Eye, Flame, Layers, ShieldCheck, Sparkles } from "lucide-react";

interface StrategicRadarMapProps {
  strongholds: Stronghold[];
  selectedId: string;
  onSelectStronghold: (id: string) => void;
  isDark?: boolean;
}

export default function StrategicRadarMap({
  strongholds,
  selectedId,
  onSelectStronghold,
  isDark = false,
}: StrategicRadarMapProps) {
  const [viewMode, setViewMode] = useState<"radar" | "heatmap" | "vectors">("radar");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const activeStronghold =
    strongholds.find((s) => s.id === selectedId) || strongholds[0];

  // Calculate coordinates normalized to 0-100%
  const getCoords = (s: Stronghold) => {
    const lat = s.lat !== undefined ? s.lat : 4.35;
    const lon = s.lon !== undefined ? s.lon : -72.85;
    const x = Math.max(12, Math.min(88, 50 + (lon + 72.85) * 40));
    const y = Math.max(12, Math.min(88, 50 - (lat - 4.35) * 40));
    return { x, y };
  };

  const activePos = activeStronghold ? getCoords(activeStronghold) : { x: 50, y: 50 };

  return (
    <div className="bg-white border border-[#1a1a1a]/15 p-5 space-y-4 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-3">
        <div className="flex items-center space-x-2.5">
          <Compass className="w-5 h-5 text-[#c5a27d]" />
          <div>
            <h3 className="font-serif font-bold text-sm text-[#1a1a1a]">
              Frontier Clinical Radar & Care Density Heatmap
            </h3>
            <p className="text-[10px] font-mono text-neutral-500">
              Live spatial projection of territorial clinical capacity & edge node resonance
            </p>
          </div>
        </div>

        {/* View mode toggles */}
        <div className="flex items-center bg-[#FAF7F2] p-1 border border-neutral-200 text-xs font-mono">
          <button
            onClick={() => setViewMode("radar")}
            className={`px-2.5 py-1 transition-colors flex items-center gap-1 ${
              viewMode === "radar"
                ? "bg-[#1a1a1a] text-white font-bold"
                : "text-neutral-600 hover:text-[#1a1a1a]"
            }`}
          >
            <Crosshair className="w-3 h-3" />
            <span>Radar Grid</span>
          </button>
          <button
            onClick={() => setViewMode("heatmap")}
            className={`px-2.5 py-1 transition-colors flex items-center gap-1 ${
              viewMode === "heatmap"
                ? "bg-[#1a1a1a] text-white font-bold"
                : "text-neutral-600 hover:text-[#1a1a1a]"
            }`}
          >
            <Flame className="w-3 h-3 text-[#c5a27d]" />
            <span>Care Density</span>
          </button>
          <button
            onClick={() => setViewMode("vectors")}
            className={`px-2.5 py-1 transition-colors flex items-center gap-1 ${
              viewMode === "vectors"
                ? "bg-[#1a1a1a] text-white font-bold"
                : "text-neutral-600 hover:text-[#1a1a1a]"
            }`}
          >
            <Layers className="w-3 h-3 text-blue-400" />
            <span>Supply Vectors</span>
          </button>
        </div>
      </div>

      {/* SVG Arcane Radar Canvas */}
      <div className="relative w-full h-80 bg-[#101216] border border-neutral-800 rounded-sm overflow-hidden select-none">
        {/* Radar Concentric Rings */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <radialGradient id="radarSweep" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#c5a27d" stopOpacity="0.12" />
              <stop offset="70%" stopColor="#c5a27d" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#c5a27d" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="vectorLine" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#c5a27d" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.3" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1="0%" y1="50%" x2="100%" y2="50%" stroke="#27272a" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="50%" y1="0%" x2="50%" y2="100%" stroke="#27272a" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="50%" cy="50%" r="20%" fill="none" stroke="#27272a" strokeWidth="1" />
          <circle cx="50%" cy="50%" r="35%" fill="none" stroke="#3f3f46" strokeWidth="1" strokeDasharray="4 4" />
          <circle cx="50%" cy="50%" r="48%" fill="url(#radarSweep)" stroke="#c5a27d" strokeWidth="1" strokeOpacity="0.3" />

          {/* Active Stronghold Range Wave */}
          <circle
            cx={`${activePos.x}%`}
            cy={`${activePos.y}%`}
            r="18%"
            fill="none"
            stroke="#c5a27d"
            strokeWidth="1.5"
            strokeDasharray="2 4"
            className="animate-pulse"
          />

          {/* Supply Vectors & Route Lines connecting strongholds */}
          {viewMode === "vectors" &&
            strongholds.map((s) => {
              const pos = getCoords(s);
              return (
                <line
                  key={`line-${s.id}`}
                  x1={`${activePos.x}%`}
                  y1={`${activePos.y}%`}
                  x2={`${pos.x}%`}
                  y2={`${pos.y}%`}
                  stroke="url(#vectorLine)"
                  strokeWidth={s.id === hoveredId ? 2 : 1}
                  strokeDasharray={s.id === selectedId ? "0" : "4 4"}
                />
              );
            })}
        </svg>

        {/* Heatmap Glow Filters */}
        {viewMode === "heatmap" && (
          <div className="absolute inset-0 pointer-events-none">
            {strongholds.map((s) => {
              const pos = getCoords(s);
              const intensity = Math.min(100, s.age * 1.5);
              return (
                <div
                  key={`heat-${s.id}`}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 rounded-full blur-xl"
                  style={{
                    left: `${pos.x}%`,
                    top: `${pos.y}%`,
                    width: `${intensity + 40}px`,
                    height: `${intensity + 40}px`,
                    background:
                      s.age >= 60
                        ? "radial-gradient(circle, rgba(197,162,125,0.45) 0%, rgba(239,68,68,0.2) 60%, transparent 80%)"
                        : "radial-gradient(circle, rgba(59,130,246,0.35) 0%, rgba(16,185,129,0.15) 60%, transparent 80%)",
                  }}
                />
              );
            })}
          </div>
        )}

        {/* Interactive Stronghold Nodes */}
        <div className="absolute inset-0">
          {strongholds.map((s) => {
            const pos = getCoords(s);
            const isSelected = s.id === selectedId;
            const isHovered = s.id === hoveredId;

            return (
              <div
                key={s.id}
                onClick={() => onSelectStronghold(s.id)}
                onMouseEnter={() => setHoveredId(s.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              >
                {/* Node marker */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all duration-200 ${
                    isSelected
                      ? "bg-[#c5a27d] border-white scale-125 shadow-lg shadow-[#c5a27d]/60 ring-4 ring-[#c5a27d]/20"
                      : isHovered
                      ? "bg-neutral-800 border-[#c5a27d] scale-110"
                      : "bg-[#181a20] border-neutral-600 hover:border-[#c5a27d]"
                  }`}
                >
                  <Castle
                    className={`w-3.5 h-3.5 ${
                      isSelected ? "text-[#1a1a1a]" : "text-[#c5a27d]"
                    }`}
                  />
                </div>

                {/* Care Cadre Staffing Badge */}
                <div
                  className={`absolute -top-2 -right-2 text-[8px] font-mono px-1 py-0.2 rounded-full border ${
                    isSelected
                      ? "bg-[#1a1a1a] text-[#FAF7F2] border-white font-bold"
                      : "bg-neutral-900 text-neutral-300 border-neutral-700"
                  }`}
                >
                  {s.age}
                </div>

                {/* Tooltip Card */}
                <div
                  className={`absolute left-8 top-1/2 -translate-y-1/2 bg-[#14171f] border border-[#c5a27d] text-white p-2.5 rounded-sm shadow-xl pointer-events-none min-w-[160px] z-30 transition-opacity ${
                    isHovered || isSelected ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono border-b border-neutral-800 pb-1 mb-1">
                    <span className="text-[#c5a27d] font-bold">{s.id}</span>
                    <span className="text-emerald-400">LVL {s.age}</span>
                  </div>
                  <div className="font-serif text-xs font-bold truncate text-[#FAF7F2]">{s.name}</div>
                  <div className="text-[9px] font-mono text-neutral-400 truncate mt-0.5">{s.vitals}</div>
                  <div className="text-[8px] font-mono text-neutral-500 mt-1">
                    Arcane Grid: [{s.lat?.toFixed(2)}, {s.lon?.toFixed(2)}]
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Corner HUD */}
        <div className="absolute bottom-2.5 left-2.5 bg-black/85 backdrop-blur-sm border border-neutral-800 p-2 text-[9px] font-mono text-neutral-300 space-y-0.5 pointer-events-none">
          <div className="text-[#c5a27d] font-bold uppercase flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
            ACTIVE SECTOR: {activeStronghold?.name}
          </div>
          <div className="text-neutral-400">
            RADAR BEARING: 43.8° N | CARE CADRE: {activeStronghold?.age * 100} CLINICIANS
          </div>
        </div>
      </div>
    </div>
  );
}
