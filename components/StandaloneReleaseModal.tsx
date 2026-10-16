"use client";

import React, { useState } from "react";
import { 
  X, 
  ExternalLink, 
  Copy, 
  Check, 
  Globe, 
  Terminal, 
  Server, 
  ShieldCheck, 
  Download, 
  HardDrive, 
  Cloud,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";

interface StandaloneReleaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function StandaloneReleaseModal({ isOpen, onClose }: StandaloneReleaseModalProps) {
  const [activeTab, setActiveTab] = useState<"github-vercel" | "docker" | "node" | "firebase" | "env">("github-vercel");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#fdfcfb] text-[#1a1a1a] rounded-xl shadow-2xl border border-stone-200 flex flex-col overflow-hidden font-sans">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-[#FAF7F2]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#c5a27d]/20 border border-[#c5a27d]/40 flex items-center justify-center text-[#9a7852]">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-stone-900 tracking-tight">
                Standalone Release & External Deployment
              </h2>
              <p className="text-xs text-stone-500 font-mono">
                Deploy Stratum Clinical Edge outside Google AI Studio to Vercel, Cloud Run, Docker, or VPS
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-200 bg-stone-100/70 px-6 gap-2 pt-2 text-xs font-medium">
          <button
            onClick={() => setActiveTab("github-vercel")}
            className={`flex items-center gap-2 px-3 py-2 border-b-2 transition-all ${
              activeTab === "github-vercel"
                ? "border-[#c5a27d] text-stone-900 font-semibold bg-[#fdfcfb] rounded-t"
                : "border-transparent text-stone-500 hover:text-stone-800"
            }`}
          >
            <Cloud className="w-4 h-4 text-[#c5a27d]" />
            GitHub & Vercel (Fastest)
          </button>
          <button
            onClick={() => setActiveTab("docker")}
            className={`flex items-center gap-2 px-3 py-2 border-b-2 transition-all ${
              activeTab === "docker"
                ? "border-[#c5a27d] text-stone-900 font-semibold bg-[#fdfcfb] rounded-t"
                : "border-transparent text-stone-500 hover:text-stone-800"
            }`}
          >
            <Server className="w-4 h-4 text-blue-600" />
            Docker & Compose
          </button>
          <button
            onClick={() => setActiveTab("node")}
            className={`flex items-center gap-2 px-3 py-2 border-b-2 transition-all ${
              activeTab === "node"
                ? "border-[#c5a27d] text-stone-900 font-semibold bg-[#fdfcfb] rounded-t"
                : "border-transparent text-stone-500 hover:text-stone-800"
            }`}
          >
            <Terminal className="w-4 h-4 text-emerald-600" />
            Node.js / VPS
          </button>
          <button
            onClick={() => setActiveTab("firebase")}
            className={`flex items-center gap-2 px-3 py-2 border-b-2 transition-all ${
              activeTab === "firebase"
                ? "border-[#c5a27d] text-stone-900 font-semibold bg-[#fdfcfb] rounded-t"
                : "border-transparent text-stone-500 hover:text-stone-800"
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            Firebase Domain Whitelist
          </button>
          <button
            onClick={() => setActiveTab("env")}
            className={`flex items-center gap-2 px-3 py-2 border-b-2 transition-all ${
              activeTab === "env"
                ? "border-[#c5a27d] text-stone-900 font-semibold bg-[#fdfcfb] rounded-t"
                : "border-transparent text-stone-500 hover:text-stone-800"
            }`}
          >
            <HardDrive className="w-4 h-4 text-purple-600" />
            Env Variables (.env)
          </button>
        </div>

        {/* Zero-Secret Guarantee Banner */}
        <div className="mx-6 mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold">Zero Secrets Required:</span> The entire application is self-contained. Firebase configuration is bundled in the repo, and clinical AI features automatically run via the local edge heuristic engine.
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href="/api/export-bundle"
              download="stratum-clinical-edge.tar.gz"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-emerald-700 hover:bg-emerald-800 text-white font-mono text-xs font-semibold shadow-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Download Code (.tar.gz)
            </a>
          </div>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          
          {/* TAB 1: GITHUB & VERCEL */}
          {activeTab === "github-vercel" && (
            <div className="space-y-4">
              <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-lg text-amber-900 text-xs flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Why was there a placeholder?</strong> GitHub does not automatically create repositories for private projects — you must first create a blank repository on your own GitHub account (takes 30 seconds).
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-serif font-bold text-base text-stone-900">
                  Step 1: Create your blank repository on GitHub
                </h3>
                <ol className="list-decimal list-inside space-y-1 text-xs text-stone-600">
                  <li>Open <a href="https://github.com/new" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-semibold inline-flex items-center gap-1">github.com/new <ExternalLink className="w-3 h-3" /></a></li>
                  <li>Enter repository name: <code className="bg-stone-200 px-1 py-0.5 rounded text-stone-900 font-bold">stratum-clinical-edge</code></li>
                  <li>Leave &ldquo;Add a README file&rdquo; <strong>unchecked</strong> (the repo already has one).</li>
                  <li>Click <strong>Create repository</strong>. GitHub will give you your personal URL.</li>
                </ol>
              </div>

              <div className="space-y-3 pt-2 border-t border-stone-200">
                <h3 className="font-serif font-bold text-base text-stone-900">
                  Step 2: Push your code
                </h3>
                <p className="text-xs text-stone-600">
                  Copy and run this in your terminal (replace with your actual GitHub username):
                </p>
                <div className="relative group bg-[#1a1a1a] text-stone-100 p-3.5 rounded-lg font-mono text-xs overflow-x-auto">
                  <button
                    onClick={() => handleCopy("git remote add origin https://github.com/<YOUR-USERNAME>/stratum-clinical-edge.git\ngit push -u origin main", "git-push")}
                    className="absolute top-2.5 right-2.5 p-1.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors flex items-center gap-1"
                    title="Copy commands"
                  >
                    {copiedKey === "git-push" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span className="text-[10px]">{copiedKey === "git-push" ? "Copied" : "Copy"}</span>
                  </button>
                  <pre className="text-stone-300 leading-relaxed">
{`# 1. Connect to your new repository (use your GitHub username):
git remote add origin https://github.com/<YOUR-USERNAME>/stratum-clinical-edge.git

# 2. Push all code to main:
git push -u origin main`}
                  </pre>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-stone-200">
                <h3 className="font-serif font-bold text-base text-stone-900">
                  Step 2: Connect to Vercel
                </h3>
                <ol className="list-decimal list-inside space-y-1.5 text-xs text-stone-600">
                  <li>Visit <a href="https://vercel.com/new" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-medium inline-flex items-center gap-1">vercel.com/new <ExternalLink className="w-3 h-3" /></a> and authenticate.</li>
                  <li>Select your imported GitHub repository.</li>
                  <li>In <strong>Environment Variables</strong>, you can <strong>leave everything blank</strong>! The app is completely functional out of the box with zero secrets.</li>
                  <li>Click <strong>Deploy</strong>. Vercel compiles and publishes your app in ~60 seconds.</li>
                </ol>
              </div>

              <div className="p-3 bg-stone-100 border border-stone-200 rounded-lg text-xs space-y-1">
                <span className="font-semibold text-stone-800">Important for Google Login:</span>
                <p className="text-stone-600">
                  Once your domain is live (e.g. <code className="bg-stone-200 px-1 py-0.5 rounded text-stone-800">your-app.vercel.app</code>), add it to your Firebase Console under Authentication &rarr; Settings &rarr; Authorized Domains.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: DOCKER & COMPOSE */}
          {activeTab === "docker" && (
            <div className="space-y-4">
              <p className="text-xs text-stone-600">
                The repository includes a hardened, multi-stage <code className="bg-stone-200 px-1 py-0.5 rounded text-stone-800">Dockerfile</code> and <code className="bg-stone-200 px-1 py-0.5 rounded text-stone-800">docker-compose.yml</code> configured with non-root user execution, Node.js 20-alpine runtime, and native <code className="bg-stone-200 px-1 py-0.5 rounded text-stone-800">/api/health</code> probes.
              </p>

              <div className="space-y-2">
                <h4 className="font-serif font-bold text-sm text-stone-900">Run with Docker Compose (Recommended)</h4>
                <div className="relative group bg-[#1a1a1a] text-stone-100 p-3.5 rounded-lg font-mono text-xs overflow-x-auto">
                  <button
                    onClick={() => handleCopy("docker compose up --build -d\ncurl http://localhost:3000/api/health", "docker-compose")}
                    className="absolute top-2.5 right-2.5 p-1.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors flex items-center gap-1"
                  >
                    {copiedKey === "docker-compose" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span className="text-[10px]">{copiedKey === "docker-compose" ? "Copied" : "Copy"}</span>
                  </button>
                  <pre className="text-stone-300 leading-relaxed">
{`# 1. Build and run containerized stack in detached mode:
docker compose up --build -d

# 2. Check health probe:
curl http://localhost:3000/api/health`}
                  </pre>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-stone-200">
                <h4 className="font-serif font-bold text-sm text-stone-900">Run with Standalone Docker</h4>
                <div className="relative group bg-[#1a1a1a] text-stone-100 p-3.5 rounded-lg font-mono text-xs overflow-x-auto">
                  <button
                    onClick={() => handleCopy("docker build -t stratum-clinical-edge:latest .\ndocker run -d -p 3000:3000 -e GEMINI_API_KEY=\"your_key\" stratum-clinical-edge:latest", "docker-standalone")}
                    className="absolute top-2.5 right-2.5 p-1.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors flex items-center gap-1"
                  >
                    {copiedKey === "docker-standalone" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span className="text-[10px]">{copiedKey === "docker-standalone" ? "Copied" : "Copy"}</span>
                  </button>
                  <pre className="text-stone-300 leading-relaxed">
{`# Build image:
docker build -t stratum-clinical-edge:latest .

# Run container on port 3000:
docker run -d -p 3000:3000 -e GEMINI_API_KEY="your_key" stratum-clinical-edge:latest`}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: NODE.JS / VPS */}
          {activeTab === "node" && (
            <div className="space-y-4">
              <p className="text-xs text-stone-600">
                Run directly on any Ubuntu, Debian, macOS, or Windows host using Node.js 20+ and PM2 process manager for high uptime.
              </p>

              <div className="space-y-2">
                <h4 className="font-serif font-bold text-sm text-stone-900">Production Build & Start</h4>
                <div className="relative group bg-[#1a1a1a] text-stone-100 p-3.5 rounded-lg font-mono text-xs overflow-x-auto">
                  <button
                    onClick={() => handleCopy("npm ci\ncp .env.example .env.local\nnpm run build\nnpm start", "node-start")}
                    className="absolute top-2.5 right-2.5 p-1.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors flex items-center gap-1"
                  >
                    {copiedKey === "node-start" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span className="text-[10px]">{copiedKey === "node-start" ? "Copied" : "Copy"}</span>
                  </button>
                  <pre className="text-stone-300 leading-relaxed">
{`# 1. Install production dependencies:
npm ci

# 2. Configure environment (set GEMINI_API_KEY):
cp .env.example .env.local

# 3. Build optimized Next.js production bundle:
npm run build

# 4. Launch production server on port 3000:
npm start`}
                  </pre>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-stone-200">
                <h4 className="font-serif font-bold text-sm text-stone-900">Packaged Release Bundle</h4>
                <p className="text-xs text-stone-600">
                  Generate a clean, self-contained release archive bundle without cache:
                </p>
                <div className="relative group bg-[#1a1a1a] text-stone-100 p-3.5 rounded-lg font-mono text-xs overflow-x-auto">
                  <button
                    onClick={() => handleCopy("npm run export:bundle", "export-bundle")}
                    className="absolute top-2.5 right-2.5 p-1.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors flex items-center gap-1"
                  >
                    {copiedKey === "export-bundle" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span className="text-[10px]">{copiedKey === "export-bundle" ? "Copied" : "Copy"}</span>
                  </button>
                  <pre className="text-stone-300 leading-relaxed">
{`# Generates clean tarball inside ./release-bundle/
npm run export:bundle`}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: FIREBASE DOMAIN WHITELIST */}
          {activeTab === "firebase" && (
            <div className="space-y-4">
              <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-lg text-amber-900 text-xs flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Mandatory for External Google Authentication:</strong> Google OAuth blocks logins from unlisted hostnames with <code className="bg-amber-100 px-1 py-0.5 rounded text-amber-950 font-mono">auth/unauthorized-domain</code>.
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-serif font-bold text-sm text-stone-900">How to Authorize Your Domain:</h4>
                <ol className="list-decimal list-inside space-y-2 text-xs text-stone-600">
                  <li>Open the <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-medium inline-flex items-center gap-1">Firebase Console <ExternalLink className="w-3 h-3" /></a>.</li>
                  <li>Select project: <code className="bg-stone-200 px-1.5 py-0.5 rounded text-stone-800 font-mono">upbeat-button-464121-g2</code> (or your custom project).</li>
                  <li>Click <strong>Authentication</strong> in the left sidebar, then click the <strong>Settings</strong> tab.</li>
                  <li>Scroll to <strong>Authorized domains</strong> and click <strong>Add domain</strong>.</li>
                  <li>Add your live external URL or domain (e.g. <code className="bg-stone-200 px-1.5 py-0.5 rounded text-stone-800 font-mono">your-domain.com</code> or <code className="bg-stone-200 px-1.5 py-0.5 rounded text-stone-800 font-mono">*.vercel.app</code>).</li>
                </ol>
              </div>

              <div className="p-3.5 bg-stone-100 rounded-lg border border-stone-200 text-xs space-y-2">
                <span className="font-bold text-stone-800">Current Production Database Coordinates:</span>
                <div className="font-mono text-[11px] text-stone-600 space-y-1">
                  <div>Project ID: <span className="text-stone-900 font-semibold">upbeat-button-464121-g2</span></div>
                  <div>Firestore DB: <span className="text-stone-900 font-semibold">ai-studio-rightwayclinical-32e6c470-a50f-42e1-8571-07866613377c</span></div>
                  <div>Security Rules: <span className="text-emerald-700 font-semibold">firestore.rules (Included in repo)</span></div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: ENV VARIABLES */}
          {activeTab === "env" && (
            <div className="space-y-4">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 text-xs">
                <strong>No secrets required!</strong> You do not need to configure any of these variables. Stratum Clinical Edge already bundles its client configurations and local heuristic AI models. These variables are strictly optional overrides if you ever want to connect your own custom accounts.
              </div>

              <div className="relative group bg-[#1a1a1a] text-stone-100 p-3.5 rounded-lg font-mono text-xs overflow-x-auto">
                <button
                  onClick={() => handleCopy(`GEMINI_API_KEY=your_key_here
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=upbeat-button-464121-g2.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=upbeat-button-464121-g2
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=upbeat-button-464121-g2.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=248946685771
NEXT_PUBLIC_FIREBASE_APP_ID=1:248946685771:web:0a2bea26918f83a7235ace
NEXT_PUBLIC_FIREBASE_FIRESTORE_DATABASE_ID=ai-studio-rightwayclinical-32e6c470-a50f-42e1-8571-07866613377c`, "env-vars")}
                  className="absolute top-2.5 right-2.5 p-1.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors flex items-center gap-1"
                >
                  {copiedKey === "env-vars" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span className="text-[10px]">{copiedKey === "env-vars" ? "Copied" : "Copy"}</span>
                </button>
                <pre className="text-stone-300 leading-relaxed">
{`# Gemini AI API Key (Server-Side)
GEMINI_API_KEY=your_gemini_api_key_here

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=upbeat-button-464121-g2.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=upbeat-button-464121-g2
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=upbeat-button-464121-g2.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=248946685771
NEXT_PUBLIC_FIREBASE_APP_ID=1:248946685771:web:0a2bea26918f83a7235ace
NEXT_PUBLIC_FIREBASE_FIRESTORE_DATABASE_ID=ai-studio-rightwayclinical-32e6c470-a50f-42e1-8571-07866613377c`}
                </pre>
              </div>

              <p className="text-[11px] text-stone-500 italic">
                *Note: If environment variables are omitted, the application automatically falls back to the bundled <code>firebase-applet-config.json</code> file.
              </p>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-stone-200 bg-[#FAF7F2] text-xs">
          <span className="text-stone-500 font-serif italic">
            Full documentation in <code className="text-stone-700 font-mono font-semibold">RELEASE.md</code> and <code className="text-stone-700 font-mono font-semibold">DEPLOY.md</code>
          </span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-stone-900 text-stone-100 hover:bg-stone-800 font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
