"use client";
import React, { useState, useEffect } from 'react';
import { Sparkles, RotateCcw, ShieldCheck } from 'lucide-react';
import { getAppStateFromIDB, setAppStateToIDB } from '@/lib/indexedDB';

const defaultPuzzle = [
  [5, 3, 0, 0, 7, 0, 0, 0, 0],
  [6, 0, 0, 1, 9, 5, 0, 0, 0],
  [0, 9, 8, 0, 0, 0, 0, 6, 0],
  [8, 0, 0, 0, 6, 0, 0, 0, 3],
  [4, 0, 0, 8, 0, 3, 0, 0, 1],
  [7, 0, 0, 0, 2, 0, 0, 0, 6],
  [0, 6, 0, 0, 0, 0, 2, 8, 0],
  [0, 0, 0, 4, 1, 9, 0, 0, 5],
  [0, 0, 0, 0, 8, 0, 0, 7, 9],
];

export default function Sudoku() {
  const [grid, setGrid] = useState<number[][]>(defaultPuzzle);

  useEffect(() => {
    async function loadSavedState() {
      try {
        const saved = await getAppStateFromIDB<number[][]>("sudokuGrid");
        if (saved && Array.isArray(saved) && saved.length === 9) {
          setGrid(saved);
        }
      } catch (e) {
        console.warn("Could not load Runestone Cipher grid from IndexedDB", e);
      }
    }
    loadSavedState();
  }, []);

  const handleChange = (row: number, col: number, value: string) => {
    const rawNum = parseInt(value);
    const newVal = isNaN(rawNum) ? 0 : Math.min(Math.max(rawNum, 0), 9);
    const newGrid = grid.map((r, rIdx) =>
      r.map((c, cIdx) => (rIdx === row && cIdx === col ? newVal : c))
    );
    setGrid(newGrid);
    setAppStateToIDB("sudokuGrid", newGrid).catch((err) => {
      console.warn("Error persisting Runestone cipher state to IndexedDB:", err);
    });
  };

  const handleReset = () => {
    setGrid(defaultPuzzle);
    setAppStateToIDB("sudokuGrid", defaultPuzzle).catch(console.warn);
  };

  return (
    <div className="p-6 bg-[#FAF7F2] border border-[#1a1a1a]/15 shadow-sm rounded-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-5 h-5 text-[#c5a27d]" />
          <div>
            <h2 className="text-lg font-serif tracking-tight text-[#1a1a1a]">Runestone Tactical Cipher</h2>
            <p className="text-[10px] font-mono text-neutral-500">Decrypt ancient arcane glyph grids (Sudoku protocol)</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-[10px] font-mono px-2 py-1 bg-white border border-[#1a1a1a]/20 hover:bg-[#FAF7F2] text-neutral-700 transition-colors"
            title="Reset Cipher"
          >
            <RotateCcw className="w-3 h-3 text-[#c5a27d]" />
            <span>Reset</span>
          </button>
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-white border border-[#1a1a1a]/15 text-neutral-600">
            IDB Persisted
          </span>
        </div>
      </div>

      <div className="inline-block border-2 border-[#1a1a1a] bg-white shadow-sm">
        <div className="grid grid-cols-9">
          {grid.map((row, rIdx) =>
            row.map((cell, cIdx) => (
              <input
                key={`${rIdx}-${cIdx}`}
                type="text"
                maxLength={1}
                value={cell === 0 ? '' : cell}
                onChange={(e) => handleChange(rIdx, cIdx, e.target.value)}
                className={`w-8 h-8 sm:w-9 sm:h-9 text-center border font-mono font-bold text-sm bg-transparent focus:bg-[#FAF7F2] focus:outline-none focus:ring-1 focus:ring-[#c5a27d] ${
                  (rIdx + 1) % 3 === 0 && rIdx < 8 ? 'border-b-2 border-b-[#1a1a1a]' : 'border-b border-neutral-200'
                } ${
                  (cIdx + 1) % 3 === 0 && cIdx < 8 ? 'border-r-2 border-r-[#1a1a1a]' : 'border-r border-neutral-200'
                } ${cell !== 0 ? 'text-[#1a1a1a]' : 'text-neutral-400'}`}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
