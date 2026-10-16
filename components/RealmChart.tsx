"use client";

import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

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
  const gridStroke = isDark ? "rgba(255, 255, 255, 0.08)" : "#e6e4df";
  const textStroke = isDark ? "#a1a1aa" : "#1a1a1a";
  const manaStroke = isDark ? "#60a5fa" : "#1a1a1a";
  const tooltipBg = isDark ? "#14161d" : "#FAF7F2";
  const tooltipBorder = isDark ? "1px solid rgba(197, 162, 125, 0.4)" : "1px solid #1a1a1a";
  const tooltipColor = isDark ? "#f4f4f5" : "#1a1a1a";

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
        <XAxis dataKey="name" tick={{ fontSize: 9, fontFamily: "monospace", fill: textStroke }} stroke={textStroke} />
        <YAxis domain={[0, 160]} tick={{ fontSize: 9, fontFamily: "monospace", fill: textStroke }} stroke={textStroke} />
        <Tooltip
          contentStyle={{
            fontSize: 10,
            fontFamily: "monospace",
            backgroundColor: tooltipBg,
            border: tooltipBorder,
            color: tooltipColor,
            borderRadius: "2px",
          }}
        />
        <Legend wrapperStyle={{ fontSize: "10px", fontFamily: "monospace", paddingTop: "4px" }} />
        <Line
          type="monotone"
          dataKey="gold"
          stroke="#c5a27d"
          strokeWidth={2}
          name="Treasury Gold (x100)"
          activeDot={{ r: 5 }}
        />
        <Line
          type="monotone"
          dataKey="mana"
          stroke={manaStroke}
          strokeWidth={1.5}
          name="Mana Resonance (%)"
        />
        <Line
          type="monotone"
          dataKey="garrison"
          stroke="#9ca3af"
          strokeWidth={1.5}
          strokeDasharray="4 4"
          name="Care Cadre / Staffing"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
