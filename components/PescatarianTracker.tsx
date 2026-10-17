"use client";
import React, { useState } from 'react';
import { Wheat, ShieldCheck, FileSpreadsheet, Check } from 'lucide-react';
import { downloadCSV } from '@/lib/csvExporter';

interface ProvisionRation {
  name: string;
  recommended: boolean;
  justification: string;
  sustainScore: number;
  calories: number;
  manaYield: number;
  protein: number;
  durabilityDays: number;
  x: number;
  y: number;
}

const sovereignProvisions: ProvisionRation[] = [
  { name: 'Smoked Arctic Char', recommended: true, justification: 'Sovereign-grade protein and omega oils. Boosts clinical personnel stamina and cold resilience.', sustainScore: 9, calories: 210, manaYield: 45, protein: 22, durabilityDays: 90, x: 22, y: 28 },
  { name: 'Cured Wild Boar', recommended: false, justification: 'Heavy fat content. Requires salt stores and causes fatigue during extended clinical shifts.', sustainScore: 4, calories: 290, manaYield: 10, protein: 24, durabilityDays: 45, x: 52, y: 55 },
  { name: 'Golden Sun-Grain Bread', recommended: true, justification: 'Dense caloric core with slow carbohydrate burn for extended emergency shifts and healthcare operations.', sustainScore: 8, calories: 180, manaYield: 60, protein: 6, durabilityDays: 60, x: 78, y: 22 },
  { name: 'Fermented Spore Mead', recommended: false, justification: 'Volatile fermentation; causes erratic cognitive resonance among practitioners.', sustainScore: 3, calories: 120, manaYield: 85, protein: 0, durabilityDays: 30, x: 38, y: 72 },
];

export default function PescatarianTracker() {
  const [hoveredItem, setHoveredItem] = useState<ProvisionRation | null>(null);
  const [exportedRecently, setExportedRecently] = useState(false);

  const handleExportCSV = () => {
    try {
      const headers = [
        "Ration Name",
        "Clinical Recommendation",
        "Justification & Clinical Telemetry",
        "Sustain Score (1-10)",
        "Calories (kcal)",
        "Mana Yield (%)",
        "Protein (g)",
        "Shelf Life Durability (Days)",
        "Export Timestamp"
      ];
      const timeStamp = new Date().toISOString();
      const rows = sovereignProvisions.map((food) => [
        food.name,
        food.recommended ? "Crown Approved (Recommended)" : "Restricted",
        food.justification,
        food.sustainScore,
        food.calories,
        food.manaYield,
        food.protein,
        food.durabilityDays,
        timeStamp
      ]);

      const dateStr = timeStamp.slice(0, 10);
      const filename = `stratum-granary-rations-matrix-${dateStr}.csv`;
      const success = downloadCSV(filename, headers, rows);
      if (success) {
        setExportedRecently(true);
        setTimeout(() => setExportedRecently(false), 3000);
      }
    } catch (e) {
      console.error("Rations CSV export failed:", e);
    }
  };

  return (
    <div className="p-6 bg-white border border-[#1a1a1a]/15 shadow-sm relative w-full h-[450px]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <Wheat className="w-5 h-5 text-[#c5a27d]" />
          <h2 className="text-xl font-serif text-[#1a1a1a]">Royal Granary & Provisions Matrix</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            id="export-rations-matrix-csv-btn"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1 bg-white border border-[#1a1a1a]/20 hover:border-[#c5a27d] text-[#1a1a1a] hover:bg-[#FAF7F2] transition-colors text-xs font-mono uppercase tracking-wider shadow-xs"
            title="Export nutritional and resilience metrics to CSV for offline reporting"
          >
            {exportedRecently ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">CSV Exported</span>
              </>
            ) : (
              <>
                <FileSpreadsheet className="w-3.5 h-3.5 text-[#c5a27d]" />
                <span>Export to CSV</span>
              </>
            )}
          </button>
          <span className="text-[10px] font-mono text-neutral-500 uppercase px-2 py-1 bg-[#FAF7F2] border border-neutral-200">
            Tactical Quality Grid
          </span>
        </div>
      </div>

      <div className="relative w-full h-72 bg-[#FAF7F2] border border-neutral-300">
        {/* Radar grid lines */}
        <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 pointer-events-none opacity-30">
          <div className="border-r border-b border-neutral-400"></div>
          <div className="border-r border-b border-neutral-400"></div>
          <div className="border-r border-b border-neutral-400"></div>
          <div className="border-b border-neutral-400"></div>
          <div className="border-r border-b border-neutral-400"></div>
          <div className="border-r border-b border-neutral-400"></div>
          <div className="border-r border-b border-neutral-400"></div>
          <div className="border-b border-neutral-400"></div>
          <div className="border-r border-b border-neutral-400"></div>
          <div className="border-r border-b border-neutral-400"></div>
          <div className="border-r border-b border-neutral-400"></div>
          <div className="border-b border-neutral-400"></div>
        </div>

        {sovereignProvisions.map((food, idx) => (
          <div
            key={idx}
            className="absolute group cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${food.x}%`, top: `${food.y}%` }}
            onMouseEnter={() => setHoveredItem(food)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            {/* Score pill */}
            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-mono font-bold text-[#c5a27d] whitespace-nowrap bg-white/90 px-1 border border-neutral-300">
              {food.sustainScore}/10 SUSTAIN
            </span>
            
            {/* Visual Dot */}
            <div className={`w-4 h-4 rounded-full border-2 border-white shadow-md transition-transform hover:scale-125 ${food.recommended ? 'bg-emerald-700' : 'bg-amber-700'}`} />

            {/* Hover Tooltip */}
            {hoveredItem && hoveredItem.name === food.name && (
              <div className="absolute -top-28 left-1/2 -translate-x-1/2 w-64 bg-white p-3.5 border border-[#1a1a1a] z-50 shadow-2xl text-xs font-sans rounded-sm">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-serif font-bold text-[#1a1a1a]">{food.name}</h3>
                  <span className={`text-[9px] font-mono px-1.5 py-0.2 uppercase ${food.recommended ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'}`}>
                    {food.recommended ? 'Crown Approved' : 'Restricted'}
                  </span>
                </div>
                <p className="text-neutral-600 text-[11px] mb-2 leading-tight">{food.justification}</p>
                <div className="grid grid-cols-2 gap-y-1 text-[10px] font-mono text-neutral-600 border-t border-neutral-200 pt-1.5">
                  <span>Energy: {food.calories} kcal</span>
                  <span>Mana Flux: +{food.manaYield}%</span>
                  <span>Protein: {food.protein}g</span>
                  <span>Shelf Life: {food.durabilityDays}d</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <p className="mt-3 text-[10px] text-neutral-500 font-mono uppercase tracking-wider">
        Hover markers to inspect royal grain resilience and mana-sustenance telemetry.
      </p>
    </div>
  );
}
