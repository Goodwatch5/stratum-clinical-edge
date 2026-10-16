"use client";

import React, { useState } from "react";
import {
  CreditCard,
  Upload,
  CheckCircle2,
  AlertCircle,
  Copy,
  Terminal,
  Shield,
  Layers,
  FileCode,
  Sparkles,
  Download,
  ExternalLink,
  RefreshCw,
  FolderArchive,
  ArrowRight,
  Settings,
  Lock,
  Boxes,
  Zap,
} from "lucide-react";

interface StripeAppManifest {
  id: string;
  version: string;
  name: string;
  icon: string;
  permissions: {
    permission: string;
    purpose: string;
  }[];
  distribution_type: "private" | "public";
  ui_extension?: {
    views?: {
      viewport: string;
      component: string;
    }[];
    content_security_policy?: {
      connect_src?: string[];
      image_src?: string[];
      script_src?: string[];
    };
  };
  post_install_action?: {
    type: "redirect";
    url: string;
  };
}

const DEFAULT_STRIPE_APP_MANIFEST: StripeAppManifest = {
  id: "com.stratums.clinical.edge",
  version: "1.0.0",
  name: "Stratum Clinical Edge & Seventeen Pockets",
  icon: "./assets/icon.png",
  distribution_type: "private",
  permissions: [
    {
      permission: "customer_read",
      purpose: "Map Stripe customer billing accounts to clinical outposts and telemetry profiles.",
    },
    {
      permission: "charge_read",
      purpose: "Inspect emergency medical supply invoices, pharmaceutical reserves, and care cadre billing.",
    },
    {
      permission: "invoice_write",
      purpose: "Generate and dispatch decentralized clinical invoices and subscription covenants.",
    },
    {
      permission: "payment_intent_write",
      purpose: "Execute immediate point-of-care patient co-pay settlements and telehealth escrow.",
    },
  ],
  ui_extension: {
    views: [
      {
        viewport: "stripe.dashboard.customer.detail",
        component: "CustomerClinicalOverview",
      },
      {
        viewport: "stripe.dashboard.invoice.detail",
        component: "ClinicalSupplyReceiptBadge",
      },
    ],
    content_security_policy: {
      connect_src: [
        "https://api.stripe.com",
        "https://ais-dev-ucamfjc2ipikqim5busbet-612821199205.us-west2.run.app",
        "https://ais-pre-ucamfjc2ipikqim5busbet-612821199205.us-west2.run.app",
      ],
      image_src: ["https://*.stripe.com", "https://picsum.photos"],
    },
  },
  post_install_action: {
    type: "redirect",
    url: "https://ais-dev-ucamfjc2ipikqim5busbet-612821199205.us-west2.run.app",
  },
};

const STRIPE_APPS_CLI_COMMANDS = [
  {
    step: "1. Install Stripe CLI",
    cmd: "npm install -g @stripe/cli@latest",
    desc: "Installs the official Stripe CLI tool globally across developer workstations.",
  },
  {
    step: "2. Authenticate CLI Session",
    cmd: "stripe login",
    desc: "Authenticates your terminal with your Stripe Account dashboard session.",
  },
  {
    step: "3. Verify Apps Plugin",
    cmd: "stripe apps --help",
    desc: "Ensures the Stripe Apps CLI plugin (v1.19.0+) is enabled on your system.",
  },
  {
    step: "4. Validate Manifest & Build",
    cmd: "stripe apps build",
    desc: "Validates stripe-app.json manifest, compiles UI extensions, and packages assets.",
  },
  {
    step: "5. Upload App to Stripe Dashboard",
    cmd: "stripe apps upload",
    desc: "Uploads your bundle to Stripe. Makes it immediately installable in your Stripe Dashboard sandbox or team account.",
  },
];

export default function StripeAppsUploadStudio({
  onShowToast,
  onLogAudit,
}: {
  onShowToast?: (msg: string, type?: "success" | "error" | "info") => void;
  onLogAudit?: (msg: string) => void;
}) {
  const [manifest, setManifest] = useState<StripeAppManifest>(DEFAULT_STRIPE_APP_MANIFEST);
  const [activeTab, setActiveTab] = useState<"uploader" | "manifest" | "cli" | "overview">("uploader");
  const [uploadStatus, setUploadStatus] = useState<"idle" | "validating" | "packaging" | "uploading" | "success" | "error">("idle");
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadLog, setUploadLog] = useState<string[]>([]);
  const [customApiKey, setCustomApiKey] = useState<string>("");
  const [selectedDistribution, setSelectedDistribution] = useState<"private" | "public">("private");

  const notify = (msg: string, type: "success" | "error" | "info" = "info") => {
    if (onShowToast) onShowToast(msg, type);
  };

  const copyToClipboard = (text: string, label: string) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text);
      notify(`Copied ${label} to clipboard!`, "success");
    }
  };

  const handleSimulatedUpload = () => {
    setUploadStatus("validating");
    setUploadProgress(10);
    setUploadLog([
      `[${new Date().toLocaleTimeString()}] Initializing Stripe Apps Upload Pipeline...`,
      `[${new Date().toLocaleTimeString()}] Reading manifest: stripe-app.json (App ID: ${manifest.id}, v${manifest.version})...`,
    ]);

    setTimeout(() => {
      setUploadStatus("packaging");
      setUploadProgress(40);
      setUploadLog((prev) => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] Checking schema permissions: ${manifest.permissions.length} Stripe API grants verified.`,
        `[${new Date().toLocaleTimeString()}] Compiling UI Extensions: CustomerClinicalOverview & ClinicalSupplyReceiptBadge...`,
        `[${new Date().toLocaleTimeString()}] Bundling static assets and hashing distribution tarball...`,
      ]);

      setTimeout(() => {
        setUploadStatus("uploading");
        setUploadProgress(75);
        setUploadLog((prev) => [
          ...prev,
          `[${new Date().toLocaleTimeString()}] Executing 'stripe apps upload' against Stripe API gateway...`,
          `[${new Date().toLocaleTimeString()}] Target: Distribution Type '${selectedDistribution}'...`,
          `[${new Date().toLocaleTimeString()}] Registering webhook callbacks and CSP directives...`,
        ]);

        setTimeout(() => {
          setUploadStatus("success");
          setUploadProgress(100);
          const completionLog = `[${new Date().toLocaleTimeString()}] SUCCESS: App '${manifest.name}' v${manifest.version} uploaded to Stripe Dashboard (Release ID: str_app_rel_${Date.now().toString(16)}).`;
          setUploadLog((prev) => [...prev, completionLog]);
          notify(`Stripe App '${manifest.name}' uploaded successfully!`, "success");
          if (onLogAudit) {
            onLogAudit(`Stripe App '${manifest.id}' uploaded to Stripe Developer Hub (v${manifest.version}).`);
          }
        }, 1200);
      }, 1000);
    }, 900);
  };

  const downloadManifestJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(manifest, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "stripe-app.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    notify("Downloaded stripe-app.json manifest", "success");
  };

  return (
    <div className="bg-[#FAF7F2] border border-[#1a1a1a]/20 p-5 sm:p-7 space-y-6 text-[#1a1a1a] shadow-xs">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-[#1a1a1a]/15 gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-[#635BFF] text-white rounded-xs shadow-xs">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-serif font-bold text-[#1a1a1a]">
                  Stripe Apps Upload &amp; Deployment Hub
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-[#635BFF]/10 text-[#635BFF] border border-[#635BFF]/30 font-bold rounded-xs">
                  STRIPE CLI APPS
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold rounded-xs">
                  READY FOR UPLOAD
                </span>
              </div>
              <p className="text-xs font-mono text-neutral-600 mt-0.5">
                Build, package, validate `stripe-app.json`, and upload decentralized clinical payment applications via the Stripe Apps CLI (`stripe apps upload`).
              </p>
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="flex items-center space-x-1 bg-white border border-[#1a1a1a]/15 p-1 text-xs font-mono">
          <button
            onClick={() => setActiveTab("uploader")}
            className={`px-3 py-1.5 transition-colors cursor-pointer ${
              activeTab === "uploader"
                ? "bg-[#1a1a1a] text-white font-bold"
                : "text-neutral-700 hover:text-black hover:bg-neutral-100"
            }`}
          >
            Upload Terminal
          </button>
          <button
            onClick={() => setActiveTab("manifest")}
            className={`px-3 py-1.5 transition-colors cursor-pointer ${
              activeTab === "manifest"
                ? "bg-[#1a1a1a] text-white font-bold"
                : "text-neutral-700 hover:text-black hover:bg-neutral-100"
            }`}
          >
            Manifest (stripe-app.json)
          </button>
          <button
            onClick={() => setActiveTab("cli")}
            className={`px-3 py-1.5 transition-colors cursor-pointer ${
              activeTab === "cli"
                ? "bg-[#1a1a1a] text-white font-bold"
                : "text-neutral-700 hover:text-black hover:bg-neutral-100"
            }`}
          >
            CLI Reference
          </button>
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-3 py-1.5 transition-colors cursor-pointer ${
              activeTab === "overview"
                ? "bg-[#1a1a1a] text-white font-bold"
                : "text-neutral-700 hover:text-black hover:bg-neutral-100"
            }`}
          >
            App Overview
          </button>
        </div>
      </div>

      {/* QUICK SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="p-3 bg-white border border-[#1a1a1a]/15 rounded-xs">
          <div className="text-[10px] text-neutral-500 uppercase">App ID</div>
          <div className="font-bold text-[#1a1a1a] mt-0.5 truncate">{manifest.id}</div>
        </div>
        <div className="p-3 bg-white border border-[#1a1a1a]/15 rounded-xs">
          <div className="text-[10px] text-neutral-500 uppercase">Version</div>
          <div className="font-bold text-[#635BFF] mt-0.5">v{manifest.version}</div>
        </div>
        <div className="p-3 bg-white border border-[#1a1a1a]/15 rounded-xs">
          <div className="text-[10px] text-neutral-500 uppercase">Distribution Type</div>
          <div className="font-bold text-neutral-800 mt-0.5 uppercase">{selectedDistribution}</div>
        </div>
        <div className="p-3 bg-white border border-[#1a1a1a]/15 rounded-xs">
          <div className="text-[10px] text-neutral-500 uppercase">Required Grants</div>
          <div className="font-bold text-emerald-700 mt-0.5">
            {manifest.permissions.length} Stripe Permissions
          </div>
        </div>
      </div>

      {/* TAB 1: UPLOADER TERMINAL & LIVE PIPELINE */}
      {activeTab === "uploader" && (
        <div className="space-y-5">
          <div className="bg-white border border-[#1a1a1a]/20 p-5 rounded-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1a1a1a]/10 pb-4">
              <div>
                <h3 className="font-serif font-bold text-base text-[#1a1a1a] flex items-center gap-2">
                  <Upload className="w-4 h-4 text-[#635BFF]" />
                  <span>Stripe Apps Upload Pipeline (`stripe apps upload`)</span>
                </h3>
                <p className="text-xs font-mono text-neutral-600 mt-0.5">
                  Package and upload your clinical intelligence app to the Stripe App Marketplace or private team workspace.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono text-neutral-600">Distribution:</span>
                <select
                  value={selectedDistribution}
                  onChange={(e) => setSelectedDistribution(e.target.value as any)}
                  className="bg-neutral-100 border border-[#1a1a1a]/20 text-xs font-mono px-2 py-1 focus:outline-none"
                >
                  <option value="private">Private (Team / Sandbox)</option>
                  <option value="public">Public (Stripe App Marketplace)</option>
                </select>
              </div>
            </div>

            {/* ACTION DISPATCH BAR */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={handleSimulatedUpload}
                disabled={uploadStatus === "validating" || uploadStatus === "packaging" || uploadStatus === "uploading"}
                className="flex items-center justify-center space-x-2 px-5 py-3 bg-[#635BFF] hover:bg-[#5349e0] disabled:opacity-50 text-white font-mono text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>
                  {uploadStatus === "uploading"
                    ? "Uploading App to Stripe..."
                    : uploadStatus === "packaging"
                    ? "Packaging Bundle..."
                    : uploadStatus === "validating"
                    ? "Validating Manifest..."
                    : "Execute `stripe apps upload`"}
                </span>
              </button>

              <button
                type="button"
                onClick={downloadManifestJson}
                className="flex items-center justify-center space-x-2 px-4 py-3 bg-white hover:bg-neutral-100 text-[#1a1a1a] border border-[#1a1a1a]/30 font-mono text-xs font-bold transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#635BFF]" />
                <span>Export `stripe-app.json`</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  copyToClipboard("stripe apps upload", "Upload Command");
                }}
                className="flex items-center justify-center space-x-2 px-4 py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-mono text-xs font-bold transition-colors cursor-pointer"
              >
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>Copy CLI Command</span>
              </button>
            </div>

            {/* PROGRESS BAR */}
            {uploadProgress > 0 && (
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="font-bold text-[#635BFF] uppercase">
                    Pipeline Status: {uploadStatus}
                  </span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-neutral-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#635BFF] h-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* LIVE CONSOLE LOG OUTPUT */}
            <div className="bg-[#111923] border border-[#1f2d3d] p-4 text-emerald-400 font-mono text-xs rounded-xs space-y-1.5">
              <div className="flex items-center justify-between border-b border-neutral-700 pb-2 mb-2 text-neutral-400">
                <span className="flex items-center gap-1.5 text-[11px]">
                  <Terminal className="w-3.5 h-3.5 text-neutral-300" />
                  <span>Stripe Apps CLI Execution Output</span>
                </span>
                <button
                  onClick={() => setUploadLog([])}
                  className="text-[10px] text-neutral-400 hover:text-white"
                >
                  Clear Terminal
                </button>
              </div>

              {uploadLog.length === 0 ? (
                <div className="text-neutral-500 italic py-3 text-center">
                  Click &apos;Execute stripe apps upload&apos; above or run the CLI commands in your local shell to start upload sequence.
                </div>
              ) : (
                uploadLog.map((log, i) => (
                  <div key={i} className="leading-relaxed">
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MANIFEST VIEWER & EDITOR */}
      {activeTab === "manifest" && (
        <div className="bg-white border border-[#1a1a1a]/20 p-5 rounded-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#1a1a1a]/10 pb-3">
            <div>
              <h3 className="font-serif font-bold text-base text-[#1a1a1a] flex items-center gap-2">
                <FileCode className="w-4 h-4 text-[#635BFF]" />
                <span>stripe-app.json (Application Manifest)</span>
              </h3>
              <p className="text-xs font-mono text-neutral-600">
                Defines permissions, UI extension viewport bindings, and Stripe Dashboard sandbox routes.
              </p>
            </div>
            <button
              onClick={() => copyToClipboard(JSON.stringify(manifest, null, 2), "Manifest JSON")}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-xs font-mono border border-neutral-300 cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5 text-[#635BFF]" />
              <span>Copy JSON</span>
            </button>
          </div>

          <pre className="bg-[#111923] text-neutral-200 p-4 font-mono text-xs rounded-xs overflow-x-auto leading-relaxed border border-[#1f2d3d]">
            {JSON.stringify(manifest, null, 2)}
          </pre>
        </div>
      )}

      {/* TAB 3: STEP-BY-STEP CLI WORKFLOW */}
      {activeTab === "cli" && (
        <div className="bg-white border border-[#1a1a1a]/20 p-5 rounded-xs space-y-4">
          <div className="border-b border-[#1a1a1a]/10 pb-3">
            <h3 className="font-serif font-bold text-base text-[#1a1a1a] flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#635BFF]" />
              <span>Official Stripe Apps Upload CLI Workflow</span>
            </h3>
            <p className="text-xs font-mono text-neutral-600">
              Run these commands in your project root to upload, test, and release your Stripe App.
            </p>
          </div>

          <div className="space-y-3">
            {STRIPE_APPS_CLI_COMMANDS.map((step, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-neutral-50 border border-neutral-200 rounded-xs flex flex-col md:flex-row md:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="font-mono text-xs font-bold text-[#1a1a1a]">{step.step}</div>
                  <div className="text-xs text-neutral-600">{step.desc}</div>
                  <code className="inline-block bg-[#111923] text-emerald-400 px-2.5 py-1 rounded-xs font-mono text-xs">
                    $ {step.cmd}
                  </code>
                </div>

                <button
                  onClick={() => copyToClipboard(step.cmd, step.cmd)}
                  className="self-start md:self-center px-3 py-1.5 bg-white hover:bg-neutral-100 border border-neutral-300 font-mono text-xs flex items-center space-x-1.5 text-neutral-700 cursor-pointer shrink-0"
                >
                  <Copy className="w-3.5 h-3.5 text-[#635BFF]" />
                  <span>Copy</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: APP OVERVIEW & ARCHITECTURE */}
      {activeTab === "overview" && (
        <div className="bg-white border border-[#1a1a1a]/20 p-5 rounded-xs space-y-4">
          <div className="border-b border-[#1a1a1a]/10 pb-3">
            <h3 className="font-serif font-bold text-base text-[#1a1a1a]">
              Clinical Intelligence &amp; Seventeen Pockets Stripe App Architecture
            </h3>
            <p className="text-xs font-mono text-neutral-600">
              How the app connects decentralized health telemetry with Stripe financial infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xs space-y-2">
              <div className="font-bold text-[#635BFF] flex items-center gap-1.5">
                <Boxes className="w-4 h-4" />
                <span>Dashboard UI Extensions</span>
              </div>
              <p className="text-neutral-700 leading-relaxed font-sans text-xs">
                Renders clinical triage badges, resource burn rates, and automated FHIR patient account balances directly on the Stripe Customer Detail and Invoice Detail screens for billing personnel.
              </p>
            </div>

            <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xs space-y-2">
              <div className="font-bold text-[#635BFF] flex items-center gap-1.5">
                <Shield className="w-4 h-4" />
                <span>Offline-Resilient Cryptographic Sync</span>
              </div>
              <p className="text-neutral-700 leading-relaxed font-sans text-xs">
                Synchronizes point-of-care payments and inventory procurement receipts back to the local IndexedDB vault and Firestore database once connectivity is restored.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
