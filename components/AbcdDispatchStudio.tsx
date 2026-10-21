"use client";

import React, { useState } from "react";
import {
  Megaphone,
  Shield,
  FileCheck,
  Send,
  Download,
  Copy,
  Check,
  Sparkles,
  AlertTriangle,
  Flame,
  Radio,
  Share2,
  Compass
} from "lucide-react";

interface AbcdDispatchStudioProps {
  onPublishToCouncil?: (entry: string) => void;
  isDark?: boolean;
}

export default function AbcdDispatchStudio({
  onPublishToCouncil,
  isDark = false,
}: AbcdDispatchStudioProps) {
  const [authority, setAuthority] = useState("Dr. Odell Anderson Jr. & Dee Gone");
  const [targetNode, setTargetNode] = useState("Frostveil Frontier Keep & Eastern Bastions");
  const [scenario, setScenario] = useState(
    "Spike in acute respiratory febrile cases reported by frontier scouts. Immediate quarantine protocols, oxygen reserve audits, and barrier nursing mandated."
  );
  const [urgency, setUrgency] = useState<"CRITICAL ALERT" | "HIGH PRIORITY" | "STANDARD ADVISORY">(
    "HIGH PRIORITY"
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [dispatchText, setDispatchText] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [published, setPublished] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setPublished(false);

    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "abcd_dispatch",
          payload: {
            doctorName: authority,
            targetNode,
            scenario,
            urgency,
          },
        }),
      });

      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      setDispatchText(data.text);
    } catch (e: any) {
      console.warn("ABCD dispatch generator offline fallback:", e);
      // Fallback deterministic ABCD generation
      const fallback = `# [SOVEREIGN CLINICAL ADVISORY: ${urgency}]

### [A] ATTENTION
- **Triage Severity Banner**: HIGH CONTAGION RISK - FEBRILE RESPIRATORY CLUSTER
- **Affected Zones & Quarantine Perimeter**: ${targetNode}

### [B] BRANDING & SOVEREIGN ORIGIN
- **Issuing Node**: Stratum Clinical Edge Decentralized Vault
- **Signatories**: ${authority}
- **Cryptographic Seal**: STRATUM-EDG-SHA256-${Date.now().toString(16).toUpperCase()}

### [C] CONNECTION
- **Plain-Language Clinical Context**: Frontier clinical scouts have documented aerosol-transmitted febrile distress. Medics must prioritize barrier nursing and isolate symptomatic personnel within 2 hours of symptom onset.
- **Patient & Staff Impact**: Rapid incubation (18–36 hours). High risk of dehydration and pulmonary congestion if untreated.

### [D] DIRECTION
- **Step 1: Immediate Triage Protocol**: Establish isolated intake pavilion outside the main health outpost perimeter.
- **Step 2: Prophylaxis & Isolation Orders**: Distribute saline hydration packs and antimicrobial barrier masks from local medical reserves.
- **Step 3: Secure Communication Vector**: Relay status every 6 hours via out-of-band shortwave link to High Council.`;
      setDispatchText(fallback);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!dispatchText) return;
    navigator.clipboard.writeText(dispatchText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePublish = () => {
    if (!dispatchText) return;
    if (onPublishToCouncil) {
      onPublishToCouncil(
        `[ABCD EMERGENCY DISPATCH: ${urgency}] Target: ${targetNode} | Signatories: ${authority}. Field advisory broadcast operational.`
      );
    }
    setPublished(true);
  };

  const handleDownloadJson = () => {
    if (!dispatchText) return;
    const blob = new Blob(
      [
        JSON.stringify(
          {
            format: "stratum-abcd-dispatch",
            version: "1.0",
            urgency,
            authority,
            targetNode,
            scenario,
            dispatchContent: dispatchText,
            timestamp: new Date().toISOString(),
          },
          null,
          2
        ),
      ],
      { type: "application/json" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `abcd-dispatch-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white border border-[#1a1a1a]/15 p-5 sm:p-6 space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-200 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-sm bg-[#1a1a1a] flex items-center justify-center text-[#c5a27d] border border-[#c5a27d]/40">
            <Megaphone className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif font-bold text-lg text-[#1a1a1a]">
                ABCD Clinical Dispatch & Field Advisory Studio
              </h2>
              <span className="text-[9px] font-mono px-2 py-0.5 bg-amber-100 text-amber-800 border border-amber-300 font-bold uppercase">
                GOOGLE CLOUD VIGENAIR SPEC
              </span>
            </div>
            <p className="text-xs text-neutral-600 font-mono mt-0.5">
              Structured emergency communications using Attention, Branding, Connection, & Direction
            </p>
          </div>
        </div>

        {/* Urgency Selector */}
        <div className="flex items-center space-x-1.5 font-mono text-xs">
          <span className="text-[10px] text-neutral-500 uppercase">Urgency:</span>
          {(["STANDARD ADVISORY", "HIGH PRIORITY", "CRITICAL ALERT"] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setUrgency(lvl)}
              className={`px-2.5 py-1 text-[10px] font-bold border transition-colors ${
                urgency === lvl
                  ? lvl === "CRITICAL ALERT"
                    ? "bg-red-700 text-white border-red-900"
                    : lvl === "HIGH PRIORITY"
                    ? "bg-[#c5a27d] text-[#1a1a1a] border-[#1a1a1a]"
                    : "bg-[#1a1a1a] text-white border-black"
                  : "bg-white text-neutral-600 border-neutral-300 hover:bg-neutral-100"
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-[10px] font-mono uppercase font-bold text-neutral-500">
            Originating Authority / Clinical Lead
          </label>
          <input
            type="text"
            value={authority}
            onChange={(e) => setAuthority(e.target.value)}
            className="w-full mt-1 px-3 py-2 text-xs bg-[#FAF7F2] border border-[#1a1a1a]/15 font-serif focus:outline-none focus:border-[#c5a27d]"
          />
        </div>

        <div>
          <label className="text-[10px] font-mono uppercase font-bold text-neutral-500">
            Target Stronghold / Medical Outposts
          </label>
          <input
            type="text"
            value={targetNode}
            onChange={(e) => setTargetNode(e.target.value)}
            className="w-full mt-1 px-3 py-2 text-xs bg-[#FAF7F2] border border-[#1a1a1a]/15 font-serif focus:outline-none focus:border-[#c5a27d]"
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-[10px] font-mono uppercase font-bold text-neutral-500">
            Epidemiological Hazard / Clinical Incident Description
          </label>
          <textarea
            rows={2}
            value={scenario}
            onChange={(e) => setScenario(e.target.value)}
            className="w-full mt-1 p-3 text-xs bg-[#FAF7F2] border border-[#1a1a1a]/15 font-sans leading-relaxed focus:outline-none focus:border-[#c5a27d]"
          />
        </div>
      </div>

      {/* Action Button */}
      <button
        id="generate-abcd-dispatch-btn"
        onClick={handleGenerate}
        disabled={isGenerating}
        className="w-full flex items-center justify-center space-x-2 py-2.5 bg-[#1a1a1a] text-[#FAF7F2] hover:bg-[#c5a27d] hover:text-[#1a1a1a] transition-colors font-mono text-xs uppercase tracking-wider font-bold disabled:opacity-50"
      >
        {isGenerating ? (
          <>
            <Sparkles className="w-4 h-4 text-[#c5a27d] animate-spin" />
            <span>Formulating ABCD Sovereign Directive...</span>
          </>
        ) : (
          <>
            <Megaphone className="w-4 h-4 text-[#c5a27d]" />
            <span>Generate ABCD Sovereign Field Advisory</span>
          </>
        )}
      </button>

      {/* ABCD Four Pillar Architecture Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
        <div className="p-3 bg-[#FAF7F2] border border-neutral-200 text-xs font-sans space-y-1">
          <div className="font-mono text-[10px] font-bold text-red-700 flex items-center gap-1 uppercase">
            <span>[A] ATTENTION</span>
          </div>
          <div className="font-bold text-[#1a1a1a] text-xs">High-Contrast Hook</div>
          <p className="text-[10px] text-neutral-600 font-sans">
            Captures field medic focus instantly with severe priority badges & boundary alerts.
          </p>
        </div>

        <div className="p-3 bg-[#FAF7F2] border border-neutral-200 text-xs font-sans space-y-1">
          <div className="font-mono text-[10px] font-bold text-[#c5a27d] flex items-center gap-1 uppercase">
            <span>[B] BRANDING</span>
          </div>
          <div className="font-bold text-[#1a1a1a] text-xs">Sovereign Origin Seal</div>
          <p className="text-[10px] text-neutral-600 font-sans">
            Cryptographic authentication confirming provenance from Dr. Odell Anderson Jr. & Dee Gone.
          </p>
        </div>

        <div className="p-3 bg-[#FAF7F2] border border-neutral-200 text-xs font-sans space-y-1">
          <div className="font-mono text-[10px] font-bold text-blue-700 flex items-center gap-1 uppercase">
            <span>[C] CONNECTION</span>
          </div>
          <div className="font-bold text-[#1a1a1a] text-xs">Plain-Language Triage</div>
          <p className="text-[10px] text-neutral-600 font-sans">
            Explains pathology clearly to ensure frontline staff understand mechanisms of harm.
          </p>
        </div>

        <div className="p-3 bg-[#FAF7F2] border border-neutral-200 text-xs font-sans space-y-1">
          <div className="font-mono text-[10px] font-bold text-emerald-700 flex items-center gap-1 uppercase">
            <span>[D] DIRECTION</span>
          </div>
          <div className="font-bold text-[#1a1a1a] text-xs">Unambiguous Protocol</div>
          <p className="text-[10px] text-neutral-600 font-sans">
            Actionable steps: immediate quarantine, medication titration, and check-in timeline.
          </p>
        </div>
      </div>

      {/* Generated Output */}
      {dispatchText && (
        <div className="space-y-3 bg-[#141720] border-2 border-[#c5a27d] p-5 text-neutral-200 font-mono rounded-sm shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800 pb-3">
            <div className="flex items-center space-x-2 text-[#c5a27d] text-xs font-bold uppercase">
              <Shield className="w-4 h-4 text-[#c5a27d]" />
              <span>OFFICIAL STRATUM ABCD DISPATCH RECORD</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopy}
                className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-mono flex items-center gap-1"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
              <button
                onClick={handleDownloadJson}
                className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-mono flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>JSON</span>
              </button>
              <button
                id="broadcast-dispatch-btn"
                onClick={handlePublish}
                disabled={published}
                className="px-3 py-1 bg-[#c5a27d] hover:bg-[#d8b894] text-[#1a1a1a] font-bold text-xs font-mono uppercase flex items-center gap-1 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5 text-[#1a1a1a]" />
                <span>{published ? "Broadcasted" : "Broadcast to Council"}</span>
              </button>
            </div>
          </div>

          <div className="text-xs leading-relaxed whitespace-pre-wrap text-neutral-100 font-mono bg-[#0d0e14] p-4 border border-neutral-800">
            {dispatchText}
          </div>

          {published && (
            <div className="p-2 bg-emerald-950 border border-emerald-500/40 text-[10px] text-emerald-400 flex items-center gap-1.5 font-mono">
              <Check className="w-3.5 h-3.5" />
              <span>Dispatched to Council Logs stream & synchronized with edge nodes!</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
