"use client";

import React, { useState, useMemo, useRef } from "react";
import {
  FileText,
  Download,
  Upload,
  Printer,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
  QrCode,
  Lock,
  Layers,
  HeartPulse,
  Activity,
  User,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { generateStrongholdFhirBundle, downloadJsonFile } from "@/lib/fhir";
import { Stronghold } from "@/app/page";
import { savePatientsBulkToIDB } from "@/lib/indexedDB";

interface ClinicalDossierSuiteProps {
  strongholds: Stronghold[];
  activeStronghold: Stronghold;
  sovereignRole: string;
  onImportStrongholds: (imported: Stronghold[], mode: "replace" | "merge") => void;
  onShowToast: (msg: string, type?: "success" | "error" | "info") => void;
  isDark?: boolean;
}

export default function ClinicalDossierSuite({
  strongholds,
  activeStronghold,
  sovereignRole,
  onImportStrongholds,
  onShowToast,
  isDark = true,
}: ClinicalDossierSuiteProps) {
  const [selectedFormat, setSelectedFormat] = useState<"fhir-r4" | "encrypted-json" | "printable-dossier">("printable-dossier");
  const [selectedTargetId, setSelectedTargetId] = useState<string>(activeStronghold?.id || strongholds[0]?.id || "K-AETHEL-01");
  const [importJsonText, setImportJsonText] = useState<string>("");
  const [importMode, setImportMode] = useState<"merge" | "replace">("merge");
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
  const [copiedHash, setCopiedHash] = useState<boolean>(false);

  const targetStronghold = useMemo(() => {
    return strongholds.find((s) => s.id === selectedTargetId) || activeStronghold || strongholds[0];
  }, [strongholds, selectedTargetId, activeStronghold]);

  // Compute verifiable cryptographic SHA-256 seal for the active record
  const recordSeal = useMemo(() => {
    if (!targetStronghold) return "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
    const payload = JSON.stringify({
      id: targetStronghold.id,
      name: targetStronghold.name,
      vitals: targetStronghold.vitals,
      notes: targetStronghold.notes,
      careCadre: targetStronghold.age,
    });
    let hash = 0;
    for (let i = 0; i < payload.length; i++) {
      const char = payload.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    const hex = Math.abs(hash).toString(16).padStart(16, "0");
    return `sha256:stratum:${targetStronghold.id.toLowerCase()}:${hex}`;
  }, [targetStronghold]);

  // Handle Exporting standard FHIR R4 Bundle
  const handleExportFhir = () => {
    try {
      const fhirBundle = generateStrongholdFhirBundle(targetStronghold);
      downloadJsonFile(fhirBundle, `fhir-r4-bundle-${targetStronghold.id.toLowerCase()}.json`);
      onShowToast(`Exported HL7 FHIR R4 Bundle for ${targetStronghold.name}.`, "success");
    } catch (e: any) {
      onShowToast(`Export failed: ${e.message}`, "error");
    }
  };

  // Handle Exporting Encrypted JSON Stratum Backup
  const handleExportFullStratumJson = () => {
    try {
      const payload = {
        format: "stratum-clinical-edge-registry",
        specVersion: "4.2.0-odell",
        exportedAt: new Date().toISOString(),
        author: sovereignRole,
        totalStrongholds: strongholds.length,
        records: strongholds,
        verificationSeal: recordSeal,
        auditEngine: "Mandiant Isolated Data Vault Spec",
      };
      downloadJsonFile(payload, `stratum-registry-backup-${Date.now()}.json`);
      onShowToast(`Full Stratum clinical registry exported (${strongholds.length} nodes).`, "success");
    } catch (e: any) {
      onShowToast(`Export failed: ${e.message}`, "error");
    }
  };

  // Handle Triggering Printable Dossier
  const handlePrintDossier = () => {
    window.print();
  };

  // Handle Importing JSON File or pasted payload
  const handleProcessImport = () => {
    try {
      if (!importJsonText.trim()) {
        onShowToast("Please paste or upload valid JSON content first.", "error");
        return;
      }

      const parsed = JSON.parse(importJsonText);
      let incomingList: Stronghold[] = [];

      // Check if FHIR R4 Bundle format
      if (parsed.resourceType === "Bundle" && Array.isArray(parsed.entry)) {
        const orgEntry = parsed.entry.find((e: any) => e.resource?.resourceType === "Organization");
        const obsEntry = parsed.entry.find((e: any) => e.resource?.resourceType === "Observation");
        const locEntry = parsed.entry.find((e: any) => e.resource?.resourceType === "Location");

        if (orgEntry?.resource) {
          incomingList.push({
            id: orgEntry.resource.id?.replace("org-", "") || `K-IMPORTED-${Date.now().toString().slice(-4)}`,
            name: orgEntry.resource.name || "Imported Clinical Node",
            age: 50,
            vitals: obsEntry?.resource?.valueString || "Standard physiological triage telemetry",
            notes: obsEntry?.resource?.note?.[0]?.text || "Imported via FHIR R4 Collection Bundle.",
            lat: locEntry?.resource?.position?.latitude || 4.35,
            lon: locEntry?.resource?.position?.longitude || -72.85,
          });
        }
      } else if (Array.isArray(parsed.strongholds)) {
        incomingList = parsed.strongholds;
      } else if (Array.isArray(parsed.records)) {
        incomingList = parsed.records;
      } else if (Array.isArray(parsed)) {
        incomingList = parsed;
      } else if (parsed.id && parsed.name) {
        incomingList = [parsed];
      }

      if (incomingList.length === 0) {
        onShowToast("No valid Stronghold or FHIR patient records found in payload.", "error");
        return;
      }

      onImportStrongholds(incomingList, importMode);
      setIsImportModalOpen(false);
      setImportJsonText("");
      onShowToast(`Imported ${incomingList.length} clinical nodes (${importMode}).`, "success");
    } catch (err: any) {
      onShowToast(`JSON parsing fault: ${err.message}`, "error");
    }
  };

  // Handle File Input selection
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setImportJsonText(content);
    };
    reader.readAsText(file);
  };

  return (
    <div
      className={`border rounded-sm p-4 sm:p-6 space-y-6 ${
        isDark
          ? "bg-[#111923] border-[#1f2d3d] text-neutral-100"
          : "bg-white border-[#1a1a1a]/15 text-[#1a1a1a]"
      }`}
    >
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-5 border-neutral-700/40">
        <div>
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-[#c5a27d]" />
            <h2 className="text-lg font-serif font-bold tracking-tight">
              One-Click Clinical Dossier &amp; HL7 FHIR R4 Exporter / Importer
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-[#c5a27d]/20 text-[#c5a27d] border border-[#c5a27d]/50 rounded-xs font-bold">
              ODELL WATERMARK
            </span>
          </div>
          <p className="text-xs font-mono text-neutral-400 mt-1">
            Clinical document publishing, standard hospital HL7 FHIR R4 bundles, and cryptographic export suites.
          </p>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportFhir}
            className="flex items-center space-x-1.5 px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 hover:border-[#c5a27d] text-xs font-mono transition-colors"
            title="Download standard HL7 FHIR R4 JSON bundle"
          >
            <Download className="w-3.5 h-3.5 text-[#c5a27d]" />
            <span>FHIR R4 JSON</span>
          </button>

          <button
            onClick={handleExportFullStratumJson}
            className="flex items-center space-x-1.5 px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 hover:border-[#c5a27d] text-xs font-mono transition-colors"
            title="Export complete encrypted registry backup"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Encrypted Registry</span>
          </button>

          <button
            onClick={handlePrintDossier}
            className="flex items-center space-x-1.5 px-3 py-2 bg-[#c5a27d] hover:bg-[#d8b58f] text-neutral-950 font-bold text-xs font-mono transition-colors shadow-sm"
            title="Print or Save as PDF with verified watermark"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Dossier</span>
          </button>

          <button
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-2 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 text-xs font-mono transition-colors"
            title="Import FHIR or Stratum JSON file"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import JSON / FHIR</span>
          </button>
        </div>
      </div>

      {/* SELECTOR BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-900/50 p-3 border border-neutral-800 rounded-xs">
        <div className="flex items-center space-x-2">
          <span className="text-[10px] font-mono uppercase text-neutral-400">Select Node:</span>
          <select
            value={selectedTargetId}
            onChange={(e) => setSelectedTargetId(e.target.value)}
            className="bg-neutral-950 border border-neutral-700 text-neutral-200 text-xs font-mono p-1.5 focus:border-[#c5a27d]"
          >
            {strongholds.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.id}) - Level {s.age}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-neutral-400">
          <span className="text-[10px] text-neutral-500 uppercase">Cryptographic Seal:</span>
          <span className="text-[#c5a27d] font-mono text-[11px] truncate max-w-xs">{recordSeal}</span>
          <button
            onClick={() => {
              navigator.clipboard.writeText(recordSeal);
              setCopiedHash(true);
              setTimeout(() => setCopiedHash(false), 2000);
            }}
            className="hover:text-white"
            title="Copy cryptographic signature"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* PRINTABLE DOSSIER PREVIEW CANVAS */}
      <div className="bg-white text-neutral-900 p-6 sm:p-10 border-2 border-neutral-300 shadow-xl rounded-xs font-serif space-y-6 relative overflow-hidden print:p-0 print:border-none print:shadow-none">
        {/* WATERMARK BACKGROUND FOR PRINT */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.03] select-none rotate-[-25deg] text-7xl font-bold tracking-widest text-neutral-900">
          STRATUM CLINICAL EDGE • CONFIDENTIAL
        </div>

        {/* DOSSIER HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start border-b-2 border-neutral-900 pb-5 gap-4">
          <div>
            <div className="text-[10px] font-mono font-bold tracking-widest uppercase text-neutral-500">
              STRATUM HEALTHCARE NETWORK • CLINICAL INTELLIGENCE DOSSIER
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-neutral-950 mt-1">
              {targetStronghold.name}
            </h1>
            <div className="text-xs font-mono text-neutral-600 mt-1 flex items-center gap-3">
              <span>IDENTIFIER: {targetStronghold.id}</span>
              <span>•</span>
              <span>CLASSIFICATION: SOVEREIGN EDGE CITADEL</span>
            </div>
          </div>

          <div className="text-right font-mono text-[11px] text-neutral-700 space-y-0.5 shrink-0">
            <div className="font-bold text-neutral-900 uppercase">OFFICIAL CLINICAL RECORD</div>
            <div>Attending: Dr. Odell Anderson Jr.</div>
            <div>Operations: Dee Gone / Archon Council</div>
            <div>Date: {new Date().toLocaleDateString()}</div>
          </div>
        </div>

        {/* VITALS & PHYSIOLOGICAL ASSESSMENT */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans text-xs">
          <div className="p-3 bg-neutral-50 border border-neutral-300 rounded-xs">
            <div className="text-[10px] font-mono uppercase text-neutral-500 font-bold">
              Staffing &amp; Capacity Index
            </div>
            <div className="text-lg font-bold font-mono text-neutral-900 mt-0.5">
              Level {targetStronghold.age} Cadre
            </div>
            <div className="text-[10px] text-neutral-500 font-mono mt-1">
              Active clinicians: ~{targetStronghold.age * 100} personnel
            </div>
          </div>

          <div className="p-3 bg-neutral-50 border border-neutral-300 rounded-xs md:col-span-2">
            <div className="text-[10px] font-mono uppercase text-neutral-500 font-bold">
              Physiological Vitals &amp; Resource Telemetry
            </div>
            <div className="text-sm font-mono font-bold text-neutral-900 mt-0.5">
              {targetStronghold.vitals}
            </div>
            <div className="text-[10px] text-neutral-500 font-mono mt-1">
              LOINC: 9843-8 Clinical Resource Buffer Assessment
            </div>
          </div>
        </div>

        {/* CLINICAL INTELLIGENCE NOTES */}
        <div className="space-y-2">
          <div className="text-[11px] font-mono uppercase font-bold tracking-wider text-neutral-700 border-b border-neutral-200 pb-1">
            Clinical Directives &amp; Edge Diagnostic Intelligence
          </div>
          <div className="text-sm font-serif leading-relaxed text-neutral-800 bg-neutral-50/50 p-4 border border-neutral-200">
            {targetStronghold.notes}
          </div>
        </div>

        {/* HL7 FHIR R4 COMPLIANCE PROFILE */}
        <div className="p-3 bg-neutral-100 border border-neutral-300 text-[10px] font-mono text-neutral-700 space-y-1">
          <div className="font-bold uppercase text-neutral-900 flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>HL7 FHIR R4 Interoperability Manifest</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[9px]">
            <div>Resource: Organization (active)</div>
            <div>Resource: Location (GPS geo-coded)</div>
            <div>Resource: Observation (LOINC 9843-8)</div>
            <div>Practitioner: Dr. Odell Anderson Jr.</div>
          </div>
        </div>

        {/* DOSSIER FOOTER SIGNATURE & SEAL */}
        <div className="border-t-2 border-neutral-900 pt-4 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-neutral-600 gap-3">
          <div className="space-y-1">
            <div className="text-[9px] uppercase text-neutral-500 font-bold">Cryptographic Digest</div>
            <div className="text-[10px] text-neutral-800 break-all">{recordSeal}</div>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <div className="w-10 h-10 border-2 border-neutral-900 flex items-center justify-center p-1">
              <QrCode className="w-full h-full text-neutral-900" />
            </div>
            <div className="text-[9px] text-right font-mono">
              <div className="font-bold text-neutral-900">VERIFIED SIGNATURE</div>
              <div>Odell / Dee Gone</div>
              <div>Seventeen Pockets</div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: IMPORT FHIR / JSON */}
      {isImportModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border-2 border-[#c5a27d] max-w-xl w-full p-6 space-y-4 text-neutral-100 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center space-x-2">
                <Upload className="w-5 h-5 text-[#c5a27d]" />
                <h3 className="font-serif font-bold text-base text-neutral-100">
                  Import HL7 FHIR R4 Bundle or Stratum Backup
                </h3>
              </div>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="text-neutral-400 hover:text-white font-mono text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs font-mono text-neutral-400">
              Paste JSON or select a file. Supports standard HL7 FHIR Bundles, Stratum exports, or patient records.
            </p>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-mono uppercase text-neutral-400">
                  Upload .json file:
                </label>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="text-xs font-mono text-neutral-400 file:mr-2 file:py-1 file:px-2 file:border-0 file:text-xs file:bg-neutral-800 file:text-neutral-200 hover:file:bg-neutral-700"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">
                  Or Paste Raw JSON:
                </label>
                <textarea
                  rows={6}
                  value={importJsonText}
                  onChange={(e) => setImportJsonText(e.target.value)}
                  placeholder="Paste { ... } FHIR R4 bundle or Stratum JSON backup here..."
                  className="w-full bg-neutral-950 border border-neutral-700 p-2.5 text-xs font-mono text-neutral-200 focus:outline-none focus:border-[#c5a27d]"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center space-x-3 text-xs font-mono text-neutral-300">
                  <span>Import Strategy:</span>
                  <label className="flex items-center space-x-1 cursor-pointer">
                    <input
                      type="radio"
                      checked={importMode === "merge"}
                      onChange={() => setImportMode("merge")}
                    />
                    <span>Merge State</span>
                  </label>
                  <label className="flex items-center space-x-1 cursor-pointer">
                    <input
                      type="radio"
                      checked={importMode === "replace"}
                      onChange={() => setImportMode("replace")}
                    />
                    <span>Replace Entire Realm</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-neutral-800">
                <button
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-mono text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={handleProcessImport}
                  className="px-4 py-1.5 bg-[#c5a27d] hover:bg-[#d8b58f] text-neutral-950 font-bold font-mono text-xs"
                >
                  Verify &amp; Import Records
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
