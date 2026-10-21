"use client";
import React, { useState, useEffect } from 'react';
import { Wheat, ShieldCheck, Plus, CheckCircle2, FileSpreadsheet, Check } from 'lucide-react';
import { getAppStateFromIDB, setAppStateToIDB } from '@/lib/indexedDB';
import { downloadCSV } from '@/lib/csvExporter';

interface ProvisionItem {
  id: string;
  name: string;
  category: "Grain" | "Livestock" | "Fish & Salts" | "Mana Elixirs" | "Armament Forging";
  reserveUnits: number;
  fortressTarget: string;
  certified: boolean;
}

const initialProvisions: ProvisionItem[] = [
  { id: "PRV-1", name: "Sun-Cured Rye & Barley Sacks", category: "Grain", reserveUnits: 4500, fortressTarget: "Aethelgard High Citadel", certified: true },
  { id: "PRV-2", name: "Silverfin Trout & Brine Barrels", category: "Fish & Salts", reserveUnits: 1800, fortressTarget: "Valyria Shoreline Bastion", certified: true },
  { id: "PRV-3", name: "Concentrated Aether Mana Draughts", category: "Mana Elixirs", reserveUnits: 620, fortressTarget: "Obsidian Spire Sanctum", certified: true },
  { id: "PRV-4", name: "Forged Damascus Halberds & Shields", category: "Armament Forging", reserveUnits: 950, fortressTarget: "Frostveil Frontline Keep", certified: true },
];

export default function ProvisionsTracker() {
  const [items, setItems] = useState<ProvisionItem[]>(initialProvisions);
  const [newItemName, setNewItemName] = useState("");
  const [newUnits, setNewUnits] = useState("500");
  const [newCategory, setNewCategory] = useState<ProvisionItem["category"]>("Grain");
  const [newFortress, setNewFortress] = useState("Aethelgard High Citadel");
  const [exportedRecently, setExportedRecently] = useState(false);

  useEffect(() => {
    async function loadSaved() {
      try {
        const saved = await getAppStateFromIDB<ProvisionItem[]>("kingdomProvisions");
        if (saved && Array.isArray(saved) && saved.length > 0) {
          setItems(saved);
        }
      } catch (e) {
        console.warn("Could not load provisions from IndexedDB", e);
      }
    }
    loadSaved();
  }, []);

  const handleExportCSV = () => {
    try {
      const headers = [
        "Provision ID",
        "Resource Item Name",
        "Category",
        "Reserve Units",
        "Destination Stronghold",
        "Certification Status",
        "Export Timestamp"
      ];
      const timeStamp = new Date().toISOString();
      const rows = items.map((item) => [
        item.id,
        item.name,
        item.category,
        item.reserveUnits,
        item.fortressTarget,
        item.certified ? "Certified Sovereign Resource" : "Pending Inspection",
        timeStamp
      ]);

      const dateStr = timeStamp.slice(0, 10);
      const filename = `stratum-provisions-${dateStr}.csv`;
      const success = downloadCSV(filename, headers, rows);
      if (success) {
        setExportedRecently(true);
        setTimeout(() => setExportedRecently(false), 3000);
      }
    } catch (e) {
      console.error("Provisions CSV export failed:", e);
    }
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const newItem: ProvisionItem = {
      id: `PRV-${Date.now()}`,
      name: newItemName.trim(),
      category: newCategory,
      reserveUnits: parseInt(newUnits) || 100,
      fortressTarget: newFortress,
      certified: true,
    };

    const updated = [newItem, ...items];
    setItems(updated);
    setNewItemName("");
    setAppStateToIDB("kingdomProvisions", updated).catch((err) => {
      console.warn("Error saving provisions to IndexedDB", err);
    });
  };

  return (
    <div className="p-6 bg-[#FAF7F2] border border-[#1a1a1a]/15 shadow-sm rounded-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <Wheat className="w-5 h-5 text-[#c5a27d]" />
          <div>
            <h2 className="text-lg font-serif tracking-tight text-[#1a1a1a]">Granary & Guild Provisions</h2>
            <p className="text-[10px] font-mono text-neutral-500">
              Clinical supply caches, rations, and pharmaceutical reserves
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            id="export-provisions-csv-btn"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1 bg-white border border-[#1a1a1a]/20 hover:border-[#c5a27d] text-[#1a1a1a] hover:bg-[#FAF7F2] transition-colors text-xs font-mono uppercase tracking-wider shadow-xs"
            title="Export provisions and resource allocations to CSV for external spreadsheet reporting"
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
          <span className="text-[10px] font-mono uppercase px-2 py-1 bg-white border border-[#1a1a1a]/15 text-neutral-600">
            IDB Vault Synced
          </span>
        </div>
      </div>

      <form onSubmit={handleAdd} className="mb-4 grid grid-cols-1 sm:grid-cols-4 gap-2">
        <input
          id="provision-title-input"
          type="text"
          placeholder="Provision Title (e.g. Smoked Sturgeon Barrels)"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          suppressHydrationWarning
          className="sm:col-span-2 px-3 py-1.5 text-xs bg-white border border-[#1a1a1a]/20 font-sans focus:outline-none focus:border-[#c5a27d]"
        />
        <select
          id="provision-category-select"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value as any)}
          suppressHydrationWarning
          className="px-2 py-1.5 text-xs bg-white border border-[#1a1a1a]/20 font-sans focus:outline-none"
        >
          <option value="Grain">Grain & Bread</option>
          <option value="Fish & Salts">Fish & Salts</option>
          <option value="Livestock">Livestock</option>
          <option value="Mana Elixirs">Mana Elixirs</option>
          <option value="Armament Forging">Armament Forging</option>
        </select>
        <button
          id="provision-allocate-btn"
          type="submit"
          className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#1a1a1a] text-white text-xs font-mono uppercase tracking-wider hover:bg-[#c5a27d] transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Allocate</span>
        </button>
      </form>

      <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-2.5 bg-white border border-[#1a1a1a]/10 text-xs hover:border-[#c5a27d]/50 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <div>
                <div className="font-serif font-bold text-[#1a1a1a]">{item.name}</div>
                <div className="text-[10px] text-neutral-500 font-mono">
                  {item.category} • Destination: {item.fortressTarget}
                </div>
              </div>
            </div>
            <div className="text-right font-mono font-bold text-neutral-800 shrink-0">
              {item.reserveUnits.toLocaleString()} units
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
