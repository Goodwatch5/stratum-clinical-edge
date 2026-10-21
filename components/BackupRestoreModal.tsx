"use client";

import React, { useState, useRef } from "react";
import { Upload, AlertCircle, Check, FileText, Castle, ShieldAlert, X } from "lucide-react";
import { Stronghold } from "@/app/page";

interface BackupRestoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRestore: (strongholds: Stronghold[], mode: "replace" | "merge") => void;
}

export default function BackupRestoreModal({
  isOpen,
  onClose,
  onRestore,
}: BackupRestoreModalProps) {
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<{
    format?: string;
    version?: string;
    exportedAt?: string;
    exportedBy?: string;
    strongholds: Stronghold[];
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [restoreMode, setRestoreMode] = useState<"merge" | "replace">("merge");
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const processFile = (file: File) => {
    setErrorMsg(null);
    setFileName(file.name);

    if (!file.name.endsWith(".json")) {
      setErrorMsg("File must be a valid .json snapshot file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        setFileContent(text);
        const json = JSON.parse(text);

        let extractedStrongholds: Stronghold[] = [];

        if (Array.isArray(json)) {
          extractedStrongholds = json;
        } else if (json && Array.isArray(json.strongholds)) {
          extractedStrongholds = json.strongholds;
        } else {
          throw new Error("Invalid format: JSON does not contain a list of strongholds.");
        }

        // Validate basic stronghold schema
        const validList = extractedStrongholds.filter(
          (s) => typeof s.id === "string" && typeof s.name === "string"
        );

        if (validList.length === 0) {
          throw new Error("No valid stronghold records found in this backup file.");
        }

        setParsedData({
          format: json.format || "raw-array",
          version: json.version || "1.0",
          exportedAt: json.exportedAt || "Unknown date",
          exportedBy: json.exportedBy || "Sovereign Archon",
          strongholds: validList,
        });
      } catch (err: any) {
        setErrorMsg(err.message || "Failed to parse backup JSON file.");
        setParsedData(null);
      }
    };
    reader.onerror = () => {
      setErrorMsg("Error reading backup file from disk.");
    };
    reader.readAsText(file);
  };

  const handleConfirmRestore = () => {
    if (!parsedData || parsedData.strongholds.length === 0) return;
    onRestore(parsedData.strongholds, restoreMode);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white border-2 border-[#1a1a1a] shadow-2xl max-w-lg w-full p-6 space-y-4 font-sans">
        <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
          <div className="flex items-center space-x-2">
            <Upload className="w-5 h-5 text-[#c5a27d]" />
            <h3 className="font-serif font-bold text-lg text-[#1a1a1a]">Restore Stronghold Backup</h3>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700 font-mono text-sm"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dropzone */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-[#1a1a1a]/30 hover:border-[#c5a27d] bg-[#FAF7F2] p-6 text-center cursor-pointer transition-colors space-y-2"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="hidden"
          />
          <Upload className="w-8 h-8 text-[#c5a27d] mx-auto" />
          <div className="text-xs font-mono font-bold text-[#1a1a1a]">
            {fileName ? fileName : "Click to select or drag & drop backup JSON file"}
          </div>
          <div className="text-[10px] text-neutral-500 font-mono">
            Accepts official `strongholds-backup-*.json` or exported realm arrays
          </div>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 flex items-start space-x-2 text-xs text-red-700 font-mono">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Parsed Inspection Preview */}
        {parsedData && (
          <div className="space-y-3 bg-[#FAF7F2] border border-[#1a1a1a]/15 p-3.5 text-xs font-mono">
            <div className="flex items-center justify-between text-[#1a1a1a] font-bold border-b border-neutral-200 pb-2">
              <span className="flex items-center gap-1.5 text-emerald-700">
                <Check className="w-4 h-4" /> Valid Backup Archive
              </span>
              <span className="text-[10px] bg-neutral-200 px-1.5 py-0.5">
                {parsedData.strongholds.length} Citadels Found
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px] text-neutral-600">
              <div>
                <span className="text-neutral-400">Exported Date:</span>
                <div className="text-[#1a1a1a] truncate">{parsedData.exportedAt}</div>
              </div>
              <div>
                <span className="text-neutral-400">Author Archon:</span>
                <div className="text-[#1a1a1a] truncate">{parsedData.exportedBy}</div>
              </div>
            </div>

            <div className="max-h-28 overflow-y-auto space-y-1 bg-white p-2 border border-neutral-200 text-[11px]">
              {parsedData.strongholds.map((s) => (
                <div key={s.id} className="flex items-center justify-between border-b border-neutral-100 py-1 last:border-0">
                  <span className="font-bold text-[#1a1a1a]">{s.name}</span>
                  <span className="text-[9px] text-neutral-500 font-mono">Staffing {s.age * 100}</span>
                </div>
              ))}
            </div>

            {/* Restore Mode Selector */}
            <div className="pt-2 border-t border-neutral-200 space-y-1.5">
              <label className="text-[10px] uppercase text-neutral-500 font-bold">Import Strategy</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRestoreMode("merge")}
                  className={`p-2 text-left border text-xs transition-colors ${
                    restoreMode === "merge"
                      ? "bg-[#1a1a1a] text-white border-[#c5a27d]"
                      : "bg-white hover:bg-neutral-50 text-neutral-700 border-neutral-300"
                  }`}
                >
                  <div className="font-bold">Merge State</div>
                  <div className="text-[9px] opacity-75">Keep existing & add new</div>
                </button>
                <button
                  type="button"
                  onClick={() => setRestoreMode("replace")}
                  className={`p-2 text-left border text-xs transition-colors ${
                    restoreMode === "replace"
                      ? "bg-red-900 text-white border-red-500"
                      : "bg-white hover:bg-neutral-50 text-neutral-700 border-neutral-300"
                  }`}
                >
                  <div className="font-bold">Replace Realm</div>
                  <div className="text-[9px] opacity-75">Overwrite all strongholds</div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-2 pt-3 border-t border-neutral-200 font-mono text-xs">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!parsedData}
            onClick={handleConfirmRestore}
            className="px-4 py-1.5 bg-[#1a1a1a] text-[#FAF7F2] hover:bg-[#c5a27d] transition-colors disabled:opacity-40 uppercase"
          >
            Apply Restore
          </button>
        </div>
      </div>
    </div>
  );
}
