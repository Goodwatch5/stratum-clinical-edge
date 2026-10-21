"use client";

import React, { useState } from "react";

interface RealmChartProps {
  data: Array<{
    name: string;
    mana: number;
    gold: number;
    garrison: number;
    grain: number;
  }>;
  isDark?: boolean;
}

export default function RealmChart({ data, isDark = false }: RealmChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-xs font-mono text-neutral-400">
        No Telemetry Data Available
      </div>
    );
  }

  // Dimensions & Padding
  const width = 500;
  const height = 200;
  const padding = { top: 20, right: 30, bottom: 35, left: 45 };

  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;
  const maxY = 160;

  // Coordinate scales
  const getX = (idx: number) => padding.left + (idx / Math.max(1, data.length - 1)) * chartW;
  const getY = (val: number) => padding.top + chartH - (Math.min(maxY, Math.max(0, val)) / maxY) * chartH;

  // Build SVG path strings with smooth curves
  const makePath = (key: "gold" | "mana" | "garrison") => {
    return data.reduce((acc, pt, i) => {
      const x = getX(i);
      const y = getY(pt[key]);
      if (i === 0) return `M ${x.toFixed(1)} ${y.toFixed(1)}`;
      // Simple smooth curve control points
      const prevX = getX(i - 1);
      const prevY = getY(data[i - 1][key]);
      const cpX1 = prevX + (x - prevX) / 2;
      const cpY1 = prevY;
      const cpX2 = prevX + (x - prevX) / 2;
      const cpY2 = y;
      return `${acc} C ${cpX1.toFixed(1)} ${cpY1.toFixed(1)}, ${cpX2.toFixed(1)} ${cpY2.toFixed(1)}, ${x.toFixed(1)} ${y.toFixed(1)}`;
    }, "");
  };

  const goldPath = makePath("gold");
  const manaPath = makePath("mana");
  const garrisonPath = makePath("garrison");

  // Visual themes
  const gridStroke = isDark ? "rgba(255, 255, 255, 0.08)" : "#e6e4df";
  const textStroke = isDark ? "#a1a1aa" : "#737373";
  const manaColor = isDark ? "#60a5fa" : "#3b82f6";
  const goldColor = "#c5a27d";
  const garrisonColor = isDark ? "#9ca3af" : "#6b7280";
  const tooltipBg = isDark ? "#18181b" : "#FAF7F2";
  const tooltipBorder = isDark ? "rgba(197, 162, 125, 0.4)" : "#1a1a1a";

  const yTicks = [0, 40, 80, 120, 160];

  return (
    <div className="relative w-full h-full flex flex-col justify-between select-none">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full overflow-visible"
        preserveAspectRatio="none"
      >
        {/* Horizontal Grid lines and Y-axis labels */}
        {yTicks.map((tick) => {
          const y = getY(tick);
          return (
            <g key={tick}>
              <line
                x1={padding.left}
                y1={y}
                x2={width - padding.right}
                y2={y}
                stroke={gridStroke}
                strokeDasharray="3 3"
                strokeWidth={1}
              />
              <text
                x={padding.left - 8}
                y={y + 3}
                textAnchor="end"
                fontSize={9}
                fontFamily="monospace"
                fill={textStroke}
              >
                {tick}
              </text>
            </g>
          );
        })}

        {/* X-axis labels and vertical guide lines */}
        {data.map((d, i) => {
          const x = getX(i);
          return (
            <g key={d.name}>
              <line
                x1={x}
                y1={padding.top}
                x2={x}
                y2={height - padding.bottom}
                stroke={gridStroke}
                strokeWidth={hoveredIndex === i ? 1.5 : 0.5}
                strokeDasharray={hoveredIndex === i ? "none" : "2 2"}
                opacity={hoveredIndex === i ? 0.9 : 0.3}
              />
              <text
                x={x}
                y={height - padding.bottom + 15}
                textAnchor="middle"
                fontSize={9}
                fontFamily="monospace"
                fill={hoveredIndex === i ? "#c5a27d" : textStroke}
                fontWeight={hoveredIndex === i ? "bold" : "normal"}
              >
                {d.name}
              </text>
            </g>
          );
        })}

        {/* Line 1: Garrison / Staffing (dashed gray) */}
        <path
          d={garrisonPath}
          fill="none"
          stroke={garrisonColor}
          strokeWidth={1.5}
          strokeDasharray="4 4"
        />

        {/* Line 2: Mana Resonance (%) */}
        <path
          d={manaPath}
          fill="none"
          stroke={manaColor}
          strokeWidth={2}
        />

        {/* Line 3: Treasury Gold (x100) */}
        <path
          d={goldPath}
          fill="none"
          stroke={goldColor}
          strokeWidth={2.5}
        />

        {/* Data Points / Interactive Dots */}
        {data.map((d, i) => {
          const x = getX(i);
          const yGold = getY(d.gold);
          const yMana = getY(d.mana);
          const yGarrison = getY(d.garrison);
          const isSelected = hoveredIndex === i;

          return (
            <g key={i} className="cursor-pointer" onMouseEnter={() => setHoveredIndex(i)}>
              {/* Invisible touch/hover hit zone */}
              <rect
                x={x - 20}
                y={padding.top}
                width={40}
                height={chartH}
                fill="transparent"
              />

              {/* Garrison Dot */}
              <circle
                cx={x}
                cy={yGarrison}
                r={isSelected ? 4.5 : 2.5}
                fill={garrisonColor}
                stroke={isDark ? "#14161d" : "#FAF7F2"}
                strokeWidth={1.5}
                className="transition-all duration-150"
              />

              {/* Mana Dot */}
              <circle
                cx={x}
                cy={yMana}
                r={isSelected ? 5 : 3}
                fill={manaColor}
                stroke={isDark ? "#14161d" : "#FAF7F2"}
                strokeWidth={1.5}
                className="transition-all duration-150"
              />

              {/* Gold Dot */}
              <circle
                cx={x}
                cy={yGold}
                r={isSelected ? 6 : 3.5}
                fill={goldColor}
                stroke={isDark ? "#14161d" : "#FAF7F2"}
                strokeWidth={2}
                className="transition-all duration-150"
              />
            </g>
          );
        })}
      </svg>

      {/* Floating Hover Tooltip */}
      {hoveredIndex !== null && data[hoveredIndex] && (
        <div
          className="absolute z-10 pointer-events-none p-2 rounded shadow-lg text-[10px] font-mono border"
          style={{
            left: `${((getX(hoveredIndex) / width) * 100).toFixed(1)}%`,
            top: "10%",
            transform: "translateX(-50%)",
            backgroundColor: tooltipBg,
            borderColor: tooltipBorder,
          }}
        >
          <div className="font-bold text-neutral-800 dark:text-neutral-100 border-b border-neutral-200/50 pb-1 mb-1">
            {data[hoveredIndex].name}
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center justify-between gap-3 text-[#c5a27d]">
              <span>Gold Reserve:</span>
              <span className="font-bold">{data[hoveredIndex].gold * 100} oz</span>
            </div>
            <div className="flex items-center justify-between gap-3 text-blue-500">
              <span>Mana Flux:</span>
              <span className="font-bold">{data[hoveredIndex].mana}%</span>
            </div>
            <div className="flex items-center justify-between gap-3 text-neutral-500">
              <span>Staffing / Cadre:</span>
              <span className="font-bold">{data[hoveredIndex].garrison} units</span>
            </div>
            <div className="flex items-center justify-between gap-3 text-amber-600">
              <span>Grain Cache:</span>
              <span className="font-bold">{data[hoveredIndex].grain} sacks</span>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Legend */}
      <div className="flex items-center justify-center gap-4 text-[10px] font-mono pt-1 text-neutral-600 dark:text-neutral-400">
        <div className="flex items-center gap-1.5 cursor-pointer">
          <span className="w-2.5 h-2.5 rounded-full bg-[#c5a27d]" />
          <span>Treasury Gold (x100)</span>
        </div>
        <div className="flex items-center gap-1.5 cursor-pointer">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
          <span>Mana Resonance (%)</span>
        </div>
        <div className="flex items-center gap-1.5 cursor-pointer">
          <span className="w-2.5 h-0.5 bg-neutral-400 border-b border-dashed border-neutral-600" />
          <span>Care Cadre / Staffing</span>
        </div>
      </div>
    </div>
  );
}
