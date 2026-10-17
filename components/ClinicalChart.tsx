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
} from "recharts";

interface ClinicalChartProps {
  data: Array<{
    name: string;
    oxygen: number;
    systolic: number;
    diastole: number;
    temperature: number;
  }>;
}

export default function ClinicalChart({ data }: ClinicalChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e6e4df" />
        <XAxis dataKey="name" tick={{ fontSize: 9, fontFamily: "monospace" }} stroke="#1a1a1a" />
        <YAxis domain={[60, 150]} tick={{ fontSize: 9, fontFamily: "monospace" }} stroke="#1a1a1a" />
        <Tooltip contentStyle={{ fontSize: 10, fontFamily: "sans-serif", backgroundColor: "#FAF7F2", border: "1px solid #1a1a1a" }} />
        <Line type="monotone" dataKey="systolic" stroke="#c5a27d" strokeWidth={2} name="Systolic" activeDot={{ r: 5 }} />
        <Line type="monotone" dataKey="oxygen" stroke="#1a1a1a" strokeWidth={1.5} name="SpO2 (%)" />
      </LineChart>
    </ResponsiveContainer>
  );
}
