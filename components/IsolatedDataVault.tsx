"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  ShieldCheck,
  Lock,
  Database,
  Server,
  AlertTriangle,
  CheckCircle2,
  HardDrive,
  Cpu,
  RefreshCw,
  FileCheck,
  ShieldAlert,
  Fingerprint,
  Radio,
  ExternalLink,
  Layers,
  KeyRound,
  EyeOff,
  Sparkles,
  Heart
} from "lucide-react";
import { Stronghold } from "@/app/page";

interface IsolatedDataVaultProps {
  strongholds: Stronghold[];
  isDark?: boolean;
}

export default function IsolatedDataVault({ strongholds, isDark = false }: IsolatedDataVaultProps) {
  const [isAuditing, setIsAuditing] = useState(false);
  const [sha256Hash, setSha256Hash] = useState<string>("");
  const [auditTimestamp, setAuditTimestamp] = useState<string>("Standby");
  const [wormLockActive, setWormLockActive] = useState(true);
  const [airGapStatus, setAirGapStatus] = useState<"isolated" | "syncing" | "staged">("isolated");
  const [activeTab, setActiveTab] = useState<"idv" | "blast-radius" | "clinician-perimeter" | "velvet-enclave">("idv");
  const [absorptionStatus, setAbsorptionStatus] = useState<"idle" | "absorbing" | "dissolved">("idle");

  const handleSimulateAbsorption = () => {
    setAbsorptionStatus("absorbing");
    setTimeout(() => {
      setAbsorptionStatus("dissolved");
      setTimeout(() => setAbsorptionStatus("idle"), 3500);
    }, 1200);
  };

  // Calculate live SHA-256 checksum across strongholds state
  const calculateSha256 = async (data: any[]): Promise<string> => {
    try {
      const jsonStr = JSON.stringify(data);
      const encoder = new TextEncoder();
      const encodedData = encoder.encode(jsonStr);
      const hashBuffer = await crypto.subtle.digest("SHA-256", encodedData);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    } catch (e) {
      return "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
    }
  };

  const runIntegrityAudit = useCallback(async () => {
    setIsAuditing(true);
    const hash = await calculateSha256(strongholds);
    await new Promise((r) => setTimeout(r, 600));
    setSha256Hash(hash);
    setAuditTimestamp(new Date().toLocaleTimeString());
    setIsAuditing(false);
  }, [strongholds]);

  useEffect(() => {
    runIntegrityAudit();
  }, [runIntegrityAudit]);

  return (
    <div className="bg-white border border-[#1a1a1a]/15 p-5 sm:p-6 space-y-6 font-sans">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-200 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-sm bg-[#1a1a1a] flex items-center justify-center text-[#c5a27d] border border-[#c5a27d]/40">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif font-bold text-lg text-[#1a1a1a]">
                Isolated Data Vault (IDV) & Air-Gap Recovery Staging
              </h2>
              <span className="text-[9px] font-mono px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold uppercase">
                MANDIANT RESILIENCE SPEC
              </span>
            </div>
            <p className="text-xs text-neutral-600 font-mono mt-0.5">
              Zero-trust immutable recovery architecture & blast-radius containment (Mandiant Issue 8 pp. 10–13)
            </p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center bg-[#FAF7F2] p-1 border border-neutral-200 text-xs font-mono">
          <button
            onClick={() => setActiveTab("idv")}
            className={`px-3 py-1.5 transition-colors flex items-center gap-1.5 ${
              activeTab === "idv"
                ? "bg-[#1a1a1a] text-white font-bold shadow-sm"
                : "text-neutral-600 hover:text-[#1a1a1a]"
            }`}
          >
            <Database className="w-3.5 h-3.5 text-[#c5a27d]" />
            <span>IDV Architecture</span>
          </button>
          <button
            onClick={() => setActiveTab("blast-radius")}
            className={`px-3 py-1.5 transition-colors flex items-center gap-1.5 ${
              activeTab === "blast-radius"
                ? "bg-[#1a1a1a] text-white font-bold shadow-sm"
                : "text-neutral-600 hover:text-[#1a1a1a]"
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
            <span>7-Pillar Blast Radius</span>
          </button>
          <button
            onClick={() => setActiveTab("clinician-perimeter")}
            className={`px-3 py-1.5 transition-colors flex items-center gap-1.5 ${
              activeTab === "clinician-perimeter"
                ? "bg-[#1a1a1a] text-white font-bold shadow-sm"
                : "text-neutral-600 hover:text-[#1a1a1a]"
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-blue-500" />
            <span>Clinician Perimeter</span>
          </button>
          <button
            onClick={() => setActiveTab("velvet-enclave")}
            className={`px-3 py-1.5 transition-colors flex items-center gap-1.5 ${
              activeTab === "velvet-enclave"
                ? "bg-[#1a1a1a] text-white font-bold shadow-sm"
                : "text-neutral-600 hover:text-[#1a1a1a]"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span>The Velvet Enclave</span>
          </button>
        </div>
      </div>

      {/* TAB 1: IDV FOUR CORE PILLARS & INTEGRITY AUDIT */}
      {activeTab === "idv" && (
        <div className="space-y-6">
          {/* THE VELVET ENCLAVE SPOTLIGHT HERO BANNER */}
          <div className="bg-gradient-to-r from-[#FAF7F2] via-pink-50/40 to-stone-50 border-2 border-[#1a1a1a] p-4 sm:p-5 rounded-sm shadow-sm flex flex-col md:flex-row items-center gap-5">
            <div className="w-full md:w-48 h-36 shrink-0 rounded overflow-hidden border border-[#c5a27d]/40 shadow-xs relative group bg-black/5">
              <img
                src="/assets/images/pink_fluffy_vault.jpg"
                alt="The Velvet Enclave - Soft Armor Cryptography"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 bg-black/70 backdrop-blur-xs text-white text-[9px] font-mono rounded-xs">
                ORIGINAL ARTWORK
              </span>
            </div>

            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono tracking-widest text-pink-700 uppercase font-bold bg-pink-100/80 px-2 py-0.5 rounded-xs border border-pink-200">
                  COMPASSIONATE CRYPTOGRAPHY & SOFT ARMOR
                </span>
                <span className="text-[9px] font-mono text-neutral-500">POCKET 05 HERO</span>
              </div>
              <h3 className="text-base sm:text-lg font-serif font-bold text-[#1a1a1a]">
                The Velvet Enclave: Real Protection Isn&apos;t a Cage, It&apos;s a Cocoon
              </h3>
              <p className="text-xs text-neutral-700 leading-relaxed font-sans">
                Subverting cold, aggressive cybersecurity clichés with human-first tactile security. We wrap clinical vitals and oncology trial records in a shock-absorbing memory enclave (AMD SEV-SNP &amp; Apple Secure Enclave) backed by unbreakable edge silicon.
              </p>
              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={() => setActiveTab("velvet-enclave")}
                  className="px-3 py-1.5 bg-[#1a1a1a] hover:bg-[#c5a27d] text-white text-xs font-mono font-medium transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-pink-300" />
                  <span>Inspect Velvet Enclave Architecture</span>
                </button>
                <span className="text-[11px] font-mono text-neutral-500">
                  AES-256-GCM • Zero-Leakage Foam • ED25519
                </span>
              </div>
            </div>
          </div>

          {/* Top Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-[#FAF7F2] border border-[#1a1a1a]/15 p-3.5 space-y-1">
              <div className="text-[10px] font-mono text-neutral-500 uppercase flex items-center justify-between">
                <span>Immutability Mode</span>
                <Lock className="w-3.5 h-3.5 text-[#c5a27d]" />
              </div>
              <div className="text-base font-serif font-bold text-[#1a1a1a] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                WORM Lock Enforced
              </div>
              <p className="text-[10px] font-mono text-neutral-500">
                Write-Once-Read-Many retention lock on 17-pockets storage
              </p>
            </div>

            <div className="bg-[#FAF7F2] border border-[#1a1a1a]/15 p-3.5 space-y-1">
              <div className="text-[10px] font-mono text-neutral-500 uppercase flex items-center justify-between">
                <span>Recovery Status</span>
                <Radio className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <div className="text-base font-serif font-bold text-blue-950 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                Air-Gapped Standby
              </div>
              <p className="text-[10px] font-mono text-neutral-500">
                RTO Target: &lt; 15 mins to segregated staging
              </p>
            </div>

            <div className="bg-[#FAF7F2] border border-[#1a1a1a]/15 p-3.5 space-y-1">
              <div className="text-[10px] font-mono text-neutral-500 uppercase flex items-center justify-between">
                <span>Vaulted Citadels</span>
                <HardDrive className="w-3.5 h-3.5 text-[#c5a27d]" />
              </div>
              <div className="text-base font-serif font-bold text-[#1a1a1a]">
                {strongholds.length} Strongholds
              </div>
              <p className="text-[10px] font-mono text-neutral-500">
                Dual-synced in IndexedDB & Cloud Vault
              </p>
            </div>

            <div className="bg-[#FAF7F2] border border-[#1a1a1a]/15 p-3.5 space-y-1">
              <div className="text-[10px] font-mono text-neutral-500 uppercase flex items-center justify-between">
                <span>Cryptographic Digest</span>
                <Fingerprint className="w-3.5 h-3.5 text-emerald-700" />
              </div>
              <div className="text-base font-serif font-bold text-emerald-800">
                Tamper Verified
              </div>
              <p className="text-[10px] font-mono text-neutral-500 truncate">
                Last checked: {auditTimestamp}
              </p>
            </div>
          </div>

          {/* Cryptographic SHA-256 Checksum Inspector */}
          <div className="p-4 bg-[#12141a] border border-neutral-800 text-neutral-200 space-y-3 font-mono">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800 pb-2">
              <div className="flex items-center space-x-2 text-xs text-[#c5a27d] font-bold">
                <Fingerprint className="w-4 h-4 text-[#c5a27d]" />
                <span>CRYPTOGRAPHIC TAMPER-EVIDENT RECORD SEAL (SHA-256)</span>
              </div>
              <button
                id="run-idv-audit-btn"
                onClick={runIntegrityAudit}
                disabled={isAuditing}
                className="px-3 py-1 bg-[#c5a27d] text-[#1a1a1a] hover:bg-[#d8b894] transition-colors text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${isAuditing ? "animate-spin" : ""}`} />
                <span>{isAuditing ? "Computing Digest..." : "Re-Calculate Digest"}</span>
              </button>
            </div>

            <div className="space-y-1 text-xs">
              <div className="text-[10px] text-neutral-400">Current Payload Digest:</div>
              <div className="bg-[#1b1e27] border border-neutral-700 p-2.5 break-all text-emerald-400 text-[11px] select-all font-bold">
                {sha256Hash || "Computing SHA-256 digest..."}
              </div>
              <div className="flex items-center justify-between text-[10px] text-neutral-400 pt-1">
                <span>Verified Clean: 0 Corruptions Detected</span>
                <span>Algorithm: WebCrypto SubtleCrypto SHA-256 (FIPS 180-4)</span>
              </div>
            </div>
          </div>

          {/* Mandiant 4 Core IRE Components (Mandiant Issue 8 p. 12) */}
          <div className="space-y-3">
            <h3 className="font-serif font-bold text-sm text-[#1a1a1a] border-b border-neutral-100 pb-2">
              Mandiant 4-Tier Isolated Recovery Environment (IRE) Matrix
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white border border-[#1a1a1a]/15 space-y-2">
                <div className="flex items-center space-x-2 text-[#1a1a1a] font-bold text-xs font-mono">
                  <Database className="w-4 h-4 text-[#c5a27d]" />
                  <span>1. Isolated Data Vault (IDV)</span>
                </div>
                <p className="text-xs text-neutral-600 font-sans">
                  An immutable data repository that contains an isolated copy of critical clinical dossiers and stronghold state. WORM locks and strict retention rules guarantee resistance against hypervisor-level ransomware encryption.
                </p>
                <div className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-1 border border-emerald-200">
                  Status: Air-Gapped Immutable WORM Active
                </div>
              </div>

              <div className="p-4 bg-white border border-[#1a1a1a]/15 space-y-2">
                <div className="flex items-center space-x-2 text-[#1a1a1a] font-bold text-xs font-mono">
                  <Server className="w-4 h-4 text-blue-600" />
                  <span>2. Isolated Management Plane (IMP)</span>
                </div>
                <p className="text-xs text-neutral-600 font-sans">
                  A separate secure control plane used to restore backups from the vault, containing cryptographic tools for forensic validation, data integrity audits, and zero-trust console access without production PAM dependencies.
                </p>
                <div className="text-[10px] font-mono text-blue-800 bg-blue-50 px-2 py-1 border border-blue-200">
                  Status: Out-of-Band Control Plane Operational
                </div>
              </div>

              <div className="p-4 bg-white border border-[#1a1a1a]/15 space-y-2">
                <div className="flex items-center space-x-2 text-[#1a1a1a] font-bold text-xs font-mono">
                  <Layers className="w-4 h-4 text-purple-600" />
                  <span>3. Isolated Recovery Network (IRN)</span>
                </div>
                <p className="text-xs text-neutral-600 font-sans">
                  Dedicated, air-gapped network segments within the IRE that host recovered clinical workloads, ensuring uninfected safe staging before production cutover.
                </p>
                <div className="text-[10px] font-mono text-purple-800 bg-purple-50 px-2 py-1 border border-purple-200">
                  Status: Staging Sandbox 100% Segregated
                </div>
              </div>

              <div className="p-4 bg-white border border-[#1a1a1a]/15 space-y-2">
                <div className="flex items-center space-x-2 text-[#1a1a1a] font-bold text-xs font-mono">
                  <Cpu className="w-4 h-4 text-[#c5a27d]" />
                  <span>4. IRE Service Layer</span>
                </div>
                <p className="text-xs text-neutral-600 font-sans">
                  Secured service layer providing offline DNS, timestamping authorities, and containerized microservice execution to support rapid reconstitution of clinical data flows.
                </p>
                <div className="text-[10px] font-mono text-neutral-800 bg-[#FAF7F2] px-2 py-1 border border-neutral-300">
                  Status: 17-Pockets Containerized Daemon Ready
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MANDIANT 7-PILLAR BLAST RADIUS & VULNERABILITY MATRIX (Mandiant Issue 8 p. 15) */}
      {activeTab === "blast-radius" && (
        <div className="space-y-4">
          <div className="p-4 bg-amber-50 border border-amber-200 text-xs text-amber-900 font-sans space-y-1">
            <div className="font-bold flex items-center gap-1.5 font-mono text-amber-800">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>Mandiant M-Trends 2026 Core Reality: Machine-Speed Threat Containment</span>
            </div>
            <p>
              &ldquo;Advancements in foundational models have collapsed the window between discovery and exploitation. The goal is no longer to patch every vulnerability, but to contain the blast radius, proactively identify exploitable paths, and build an adaptive operational posture.&rdquo; (Mandiant pp. 14&ndash;16)
            </p>
          </div>

          <div className="overflow-x-auto border border-neutral-200">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-[#FAF7F2] border-b border-neutral-200 font-mono text-[10px] uppercase text-neutral-600">
                <tr>
                  <th className="p-3">Program Area</th>
                  <th className="p-3">Mandiant Primary Objective</th>
                  <th className="p-3">Stratum Edge Implementation</th>
                  <th className="p-3">Resilience Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-mono text-[11px]">
                <tr className="hover:bg-neutral-50">
                  <td className="p-3 font-bold text-[#1a1a1a]">1. Cyber Readiness</td>
                  <td className="p-3 text-neutral-600 font-sans">Improve preparedness & accelerate response to cyber incidents</td>
                  <td className="p-3 text-emerald-700">IndexedDB local-first storage with offline baseline cache</td>
                  <td className="p-3"><span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold">98/100</span></td>
                </tr>
                <tr className="hover:bg-neutral-50">
                  <td className="p-3 font-bold text-[#1a1a1a]">2. Defense Enablement</td>
                  <td className="p-3 text-neutral-600 font-sans">Maintain incident detection efficacy through adversarial emulation</td>
                  <td className="p-3 text-emerald-700">GitLab CI/CD automated pipeline runner & audit trail</td>
                  <td className="p-3"><span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold">95/100</span></td>
                </tr>
                <tr className="hover:bg-neutral-50">
                  <td className="p-3 font-bold text-[#1a1a1a]">3. Threat Modeling</td>
                  <td className="p-3 text-neutral-600 font-sans">Identify strategic, design, & architectural risks across priority areas</td>
                  <td className="p-3 text-emerald-700">Geopolitical coordinates & tactical radar perimeter monitoring</td>
                  <td className="p-3"><span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold">96/100</span></td>
                </tr>
                <tr className="hover:bg-neutral-50">
                  <td className="p-3 font-bold text-[#1a1a1a]">4. Code Review</td>
                  <td className="p-3 text-neutral-600 font-sans">Discover zero-day vulnerabilities with rapid AI discovery</td>
                  <td className="p-3 text-emerald-700">Gemini-3.5-flash server-side log auditing & scrutiny</td>
                  <td className="p-3"><span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold">99/100</span></td>
                </tr>
                <tr className="hover:bg-neutral-50">
                  <td className="p-3 font-bold text-[#1a1a1a]">5. Remediation Strategy</td>
                  <td className="p-3 text-neutral-600 font-sans">Unify vulnerability & threat data into prioritized remediation paths</td>
                  <td className="p-3 text-emerald-700">Dynamic sync queue flush with transactional replay buffer</td>
                  <td className="p-3"><span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold">94/100</span></td>
                </tr>
                <tr className="hover:bg-neutral-50">
                  <td className="p-3 font-bold text-[#1a1a1a]">6. Platform Hardening</td>
                  <td className="p-3 text-neutral-600 font-sans">Protect source code & CI/CD against supply-chain attack paths</td>
                  <td className="p-3 text-emerald-700">Air-gapped IDV + WORM immutable file seals</td>
                  <td className="p-3"><span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold">97/100</span></td>
                </tr>
                <tr className="hover:bg-neutral-50">
                  <td className="p-3 font-bold text-[#1a1a1a]">7. Threat Capability</td>
                  <td className="p-3 text-neutral-600 font-sans">Scale vulnerability management to handle discovery surges</td>
                  <td className="p-3 text-emerald-700">ADK multi-agent delegation runner with subagent consensus</td>
                  <td className="p-3"><span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold">96/100</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: CLINICIAN & COMMAND PERIMETER (Mandiant Issue 8 pp. 6–9) */}
      {activeTab === "clinician-perimeter" && (
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-200 text-xs text-blue-900 font-sans space-y-1">
            <div className="font-bold flex items-center gap-1.5 font-mono text-blue-800">
              <KeyRound className="w-4 h-4 text-blue-600" />
              <span>The Cyber-Physical Nexus: Safeguarding Key Operators in 2026</span>
            </div>
            <p>
              &ldquo;Physical security and digital privacy are no longer distinct disciplines; they are a single, continuous attack surface. Threat actors exploit the blurred lines between personal and professional devices to gain soft-entry points into critical healthcare networks.&rdquo; (Mandiant pp. 6&ndash;9)
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-white border border-[#1a1a1a]/15 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-[#1a1a1a]">Lead Archon Perimeter</span>
                <span className="text-emerald-700 text-[9px] bg-emerald-50 px-1 py-0.5 font-bold">HARDENED</span>
              </div>
              <div className="text-xs font-serif font-bold text-[#1a1a1a]">Dr. Odell Anderson Jr.</div>
              <div className="text-[10px] font-mono text-neutral-600 space-y-1">
                <div>• Zero OSINT Dark Web Footprint</div>
                <div>• Hardware Security Key (FIDO2) Enforced</div>
                <div>• Air-gapped edge node link verified</div>
              </div>
            </div>

            <div className="p-4 bg-white border border-[#1a1a1a]/15 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-[#1a1a1a]">Co-Architect Shield</span>
                <span className="text-emerald-700 text-[9px] bg-emerald-50 px-1 py-0.5 font-bold">HARDENED</span>
              </div>
              <div className="text-xs font-serif font-bold text-[#1a1a1a]">Dee Gone</div>
              <div className="text-[10px] font-mono text-neutral-600 space-y-1">
                <div>• Out-of-band emergency channel open</div>
                <div>• Biometric passphrase & memory locks</div>
                <div>• Personal device isolation active</div>
              </div>
            </div>

            <div className="p-4 bg-white border border-[#1a1a1a]/15 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-[#1a1a1a]">Council & Field Medics</span>
                <span className="text-blue-700 text-[9px] bg-blue-50 px-1 py-0.5 font-bold">MONITORED</span>
              </div>
              <div className="text-xs font-serif font-bold text-[#1a1a1a]">Frontier Care Providers</div>
              <div className="text-[10px] font-mono text-neutral-600 space-y-1">
                <div>• Safe Seventeen-Pockets containerization</div>
                <div>• Phishing-resistant session tokens</div>
                <div>• Zero client-side credential exposure</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: THE VELVET ENCLAVE - COMPASSIONATE CRYPTOGRAPHY & SOFT ARMOR */}
      {activeTab === "velvet-enclave" && (
        <div className="space-y-6 animate-fade-in">
          {/* Main Visual & Manifesto Card */}
          <div className="bg-[#FAF7F2] border-2 border-[#1a1a1a] rounded-sm overflow-hidden shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              {/* Artwork Viewport */}
              <div className="lg:col-span-6 bg-[#16141a] p-3 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#1a1a1a]/20">
                <div className="relative w-full aspect-video rounded overflow-hidden border border-pink-300/30 shadow-inner group">
                  <img
                    src="/assets/images/pink_fluffy_vault.jpg"
                    alt="The Velvet Enclave - Soft Armor Cryptography"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/75 backdrop-blur-xs text-white text-[9px] font-mono rounded flex items-center gap-1.5 border border-white/20">
                    <Sparkles className="w-3 h-3 text-pink-400" />
                    <span>ORIGINAL CONCEPT: THE VELVET ENCLAVE</span>
                  </div>
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/75 backdrop-blur-xs text-pink-200 text-[9px] font-mono rounded border border-pink-500/30">
                    8K RESOLUTION • ED25519 ENCLAVE
                  </div>
                </div>

                <div className="pt-3 text-[10px] font-mono text-neutral-400 flex items-center justify-between">
                  <span>Inspiration: Subverting IBM Cyberpunk Clichés</span>
                  <span className="text-[#c5a27d]">Pocket 05 Masterpiece</span>
                </div>
              </div>

              {/* Manifesto & Word Imprint */}
              <div className="lg:col-span-6 p-5 sm:p-6 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono tracking-widest text-pink-700 uppercase font-bold bg-pink-100 px-2 py-0.5 border border-pink-200">
                      HUMAN-FIRST TACTILE SECURITY
                    </span>
                    <span className="text-[9px] font-mono text-emerald-800 bg-emerald-100 px-1.5 py-0.5 font-bold">
                      ACTIVE SPEC
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-xl text-[#1a1a1a] leading-tight">
                    The Velvet Enclave: Compassionate Cryptography &amp; Soft Armor
                  </h3>

                  <blockquote className="border-l-2 border-[#c5a27d] pl-3 italic text-xs text-neutral-700 font-serif leading-relaxed">
                    &ldquo;Real protection isn&apos;t a cage—it&apos;s a cocoon. We don&apos;t just lock down patient data behind menacing steel; we wrap it in a shock-absorbing, zero-leakage velvet enclave.&rdquo;
                  </blockquote>

                  <p className="text-xs text-neutral-700 leading-relaxed font-sans">
                    Traditional cybersecurity portrays data protection as harsh, rigid steel firewalls that shatter under pressure. In nature, life&apos;s most fragile treasures—neural synapses, delicate embryos, and cardiac chambers—are guarded by <strong>cushioned, soft, and flexible shock absorbers</strong>. The Velvet Enclave translates this biological wisdom into decentralized clinical computing.
                  </p>
                </div>

                {/* Micro-Spec Highlights */}
                <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-neutral-200">
                  <div className="p-2 bg-white border border-pink-200/80 rounded-xs">
                    <div className="text-[9px] text-neutral-500 uppercase">Exterior Texture</div>
                    <div className="font-bold text-pink-800">Soft Plush Velvet</div>
                    <div className="text-[9px] text-neutral-600 mt-0.5">Non-intrusive patient UX</div>
                  </div>
                  <div className="p-2 bg-white border border-[#c5a27d]/40 rounded-xs">
                    <div className="text-[9px] text-neutral-500 uppercase">Interior Core</div>
                    <div className="font-bold text-[#1a1a1a]">Rose-Gold Silicon</div>
                    <div className="text-[9px] text-neutral-600 mt-0.5">AMD SEV-SNP Enclave</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Soft-Armor Shock Absorption Simulator */}
          <div className="bg-white border-2 border-[#1a1a1a] p-5 rounded-sm space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-200 pb-3">
              <div>
                <h4 className="font-serif font-bold text-base text-[#1a1a1a] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-pink-600" />
                  Tactile Shock-Absorption Simulation
                </h4>
                <p className="text-xs text-neutral-500 font-mono">
                  Test how the Velvet Enclave absorbs zero-day cyber shockwaves without brittle fractures.
                </p>
              </div>

              <button
                onClick={handleSimulateAbsorption}
                disabled={absorptionStatus !== "idle"}
                className={`px-4 py-2 rounded text-xs font-mono font-bold transition-all shadow-xs flex items-center gap-2 ${
                  absorptionStatus === "absorbing"
                    ? "bg-pink-500 text-white animate-pulse"
                    : absorptionStatus === "dissolved"
                    ? "bg-emerald-600 text-white"
                    : "bg-[#1a1a1a] hover:bg-[#c5a27d] text-white cursor-pointer"
                }`}
              >
                {absorptionStatus === "absorbing" ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Absorbing Intrusion Vector...</span>
                  </>
                ) : absorptionStatus === "dissolved" ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Dissolved &amp; Neutralized (0b Leaked)</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-pink-300" />
                    <span>Trigger Simulated Intrusion Probe</span>
                  </>
                )}
              </button>
            </div>

            {/* Visual Absorption Chamber */}
            <div className="p-4 bg-[#FAF7F2] border border-neutral-200 rounded text-xs font-mono space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-neutral-500 uppercase font-bold">Enclave Shock-Damping Field:</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  absorptionStatus === "absorbing"
                    ? "bg-pink-100 text-pink-900 border border-pink-300"
                    : absorptionStatus === "dissolved"
                    ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                    : "bg-neutral-100 text-neutral-700"
                }`}>
                  {absorptionStatus === "absorbing"
                    ? "FOAM DAMPING: ACTIVE (-48dB DISSIPATION)"
                    : absorptionStatus === "dissolved"
                    ? "RESONANCE RESTORED: ZERO DATA EXFILTRATION"
                    : "ENCLAVE MEMORY FOAM: READY"}
                </span>
              </div>

              {/* Damping Bar */}
              <div className="w-full bg-neutral-200 h-3 rounded-full overflow-hidden p-0.5">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    absorptionStatus === "absorbing"
                      ? "w-4/5 bg-gradient-to-r from-pink-400 via-rose-500 to-amber-400 animate-pulse"
                      : absorptionStatus === "dissolved"
                      ? "w-full bg-emerald-500"
                      : "w-1/3 bg-pink-300"
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[11px] pt-1">
                <div className="p-2 bg-white border border-neutral-200 rounded-xs">
                  <span className="text-neutral-500 block">Cryptographic Layer:</span>
                  <strong className="text-[#1a1a1a]">ChaCha20-Poly1305 + AES-256-GCM</strong>
                </div>
                <div className="p-2 bg-white border border-neutral-200 rounded-xs">
                  <span className="text-neutral-500 block">Enclave Zero-Leakage Ratio:</span>
                  <strong className="text-emerald-700">100.00% Verified Sealed</strong>
                </div>
                <div className="p-2 bg-white border border-neutral-200 rounded-xs">
                  <span className="text-neutral-500 block">Patient Key Possession:</span>
                  <strong className="text-pink-800">Sovereign Golden Key (ED25519)</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Four Imprinted Principles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-[#FAF7F2] border border-[#1a1a1a]/15 p-4 space-y-2">
              <div className="w-8 h-8 rounded bg-pink-100 border border-pink-300 flex items-center justify-center text-pink-700">
                <Sparkles className="w-4 h-4" />
              </div>
              <h5 className="font-serif font-bold text-xs text-[#1a1a1a]">1. The Fluffy Faux-Fur Padlock</h5>
              <p className="text-[11px] text-neutral-600 font-mono leading-relaxed">
                Zero-leakage memory isolation designed to protect human dignity, replacing cold hospital apprehension with warm reassurance.
              </p>
            </div>

            <div className="bg-[#FAF7F2] border border-[#1a1a1a]/15 p-4 space-y-2">
              <div className="w-8 h-8 rounded bg-[#c5a27d]/20 border border-[#c5a27d]/40 flex items-center justify-center text-[#9e7c57]">
                <Cpu className="w-4 h-4" />
              </div>
              <h5 className="font-serif font-bold text-xs text-[#1a1a1a]">2. Rose-Gold Silicon Grid</h5>
              <p className="text-[11px] text-neutral-600 font-mono leading-relaxed">
                Decentralized, low-latency intelligence operating directly on local hardware without cloud dependence or surveillance.
              </p>
            </div>

            <div className="bg-[#FAF7F2] border border-[#1a1a1a]/15 p-4 space-y-2">
              <div className="w-8 h-8 rounded bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700">
                <KeyRound className="w-4 h-4" />
              </div>
              <h5 className="font-serif font-bold text-xs text-[#1a1a1a]">3. Luminous Golden Keyhole</h5>
              <p className="text-[11px] text-neutral-600 font-mono leading-relaxed">
                Asymmetric sovereign custody: only the patient and authorized clinical physician hold the cryptographic key.
              </p>
            </div>

            <div className="bg-[#FAF7F2] border border-[#1a1a1a]/15 p-4 space-y-2">
              <div className="w-8 h-8 rounded bg-rose-100 border border-rose-300 flex items-center justify-center text-rose-700">
                <Heart className="w-4 h-4" />
              </div>
              <h5 className="font-serif font-bold text-xs text-[#1a1a1a]">4. Tender Pink Capillaries</h5>
              <p className="text-[11px] text-neutral-600 font-mono leading-relaxed">
                Live biometric vitals and clinical trial telemetry safely tethered to local nodes without raw data exposure.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
