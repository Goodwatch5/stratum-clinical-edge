"use client";

import React, { useState } from "react";
import {
  Bell,
  Send,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Zap,
  Play,
  Terminal,
  Layers,
  Sparkles,
  Award,
  BookOpen,
  GitPullRequest,
  Check,
  ShieldAlert,
  ArrowRight
} from "lucide-react";

export default function SpecializedPocketsSuite() {
  const [activeModule, setActiveModule] = useState<
    "alert-system" | "autofix-pipeline" | "multimodal-bridge" | "training-platform"
  >("alert-system");

  // ALERT SYSTEM STATE
  const [alertChannel, setAlertChannel] = useState<"discord" | "telegram" | "email">("discord");
  const [alertSeverity, setAlertSeverity] = useState<"INFO" | "WARNING" | "CRITICAL">("CRITICAL");
  const [alertMessage, setAlertMessage] = useState<string>(
    "Sub-Second Sync latency exceeded 45ms threshold on Frankfurt Node (Pocket 04)."
  );
  const [dispatchedAlerts, setDispatchedAlerts] = useState<
    { id: string; channel: string; severity: string; message: string; timestamp: string }[]
  >([
    {
      id: "ALT-8841",
      channel: "Discord",
      severity: "CRITICAL",
      message: "Database failover drill executed smoothly on Neon Vault (Pocket 03).",
      timestamp: "10 mins ago",
    },
    {
      id: "ALT-8840",
      channel: "Telegram",
      severity: "INFO",
      message: "GitLab Pages Solar Nexus scheduled refresh pipeline passed with 0 errors.",
      timestamp: "1 hour ago",
    },
  ]);
  const [isSendingAlert, setIsSendingAlert] = useState<boolean>(false);

  // AUTO-FIX PIPELINE STATE
  const [pipelineSteps, setPipelineSteps] = useState<
    { title: string; status: "pending" | "running" | "completed" }[]
  >([
    { title: "Monitor (Pocket 09) Issue Detection", status: "completed" },
    { title: "Intelligence (Pocket 02) Root-Cause Synthesis", status: "completed" },
    { title: "Auto-Fix Git Commit Generated (!MR-42)", status: "completed" },
    { title: "GitLab CI Pipeline Deployment with Zero-Downtime", status: "completed" },
  ]);
  const [isAutoFixRunning, setIsAutoFixRunning] = useState<boolean>(false);

  // MULTIMODAL BRIDGE STATE
  const [bridgePrompt, setBridgePrompt] = useState<string>(
    "Analyze the bedside clinical telemetry chart and extract key cardiovascular anomalies."
  );
  const [bridgeResult, setBridgeResult] = useState<string>("");
  const [isBridgeRunning, setIsBridgeRunning] = useState<boolean>(false);

  // TRAINING PLATFORM STATE
  const [quizAnswers, setQuizAnswers] = useState<{ [key: number]: number }>({});
  const [certIssued, setCertIssued] = useState<boolean>(false);

  const handleSendAlert = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSendingAlert(true);
    setTimeout(() => {
      const newAlert = {
        id: `ALT-${Math.floor(1000 + Math.random() * 9000)}`,
        channel: alertChannel.toUpperCase(),
        severity: alertSeverity,
        message: alertMessage,
        timestamp: "Just now",
      };
      setDispatchedAlerts([newAlert, ...dispatchedAlerts]);
      setIsSendingAlert(false);
    }, 450);
  };

  const handleTriggerAutoFix = () => {
    setIsAutoFixRunning(true);
    setPipelineSteps([
      { title: "Monitor (Pocket 09) Issue Detection", status: "running" },
      { title: "Intelligence (Pocket 02) Root-Cause Synthesis", status: "pending" },
      { title: "Auto-Fix Git Commit Generated (!MR-43)", status: "pending" },
      { title: "GitLab CI Pipeline Deployment with Zero-Downtime", status: "pending" },
    ]);

    setTimeout(() => {
      setPipelineSteps((prev) => [
        { ...prev[0], status: "completed" },
        { ...prev[1], status: "running" },
        prev[2],
        prev[3],
      ]);
    }, 800);

    setTimeout(() => {
      setPipelineSteps((prev) => [
        prev[0],
        { ...prev[1], status: "completed" },
        { ...prev[2], status: "running" },
        prev[3],
      ]);
    }, 1600);

    setTimeout(() => {
      setPipelineSteps((prev) => [
        prev[0],
        prev[1],
        { ...prev[2], status: "completed" },
        { ...prev[3], status: "completed" },
      ]);
      setIsAutoFixRunning(false);
    }, 2400);
  };

  const handleRunBridge = () => {
    setIsBridgeRunning(true);
    setTimeout(() => {
      setBridgeResult(
        "[T5Gemma 2 1B-1B • SigLIP 417M Enc]: Vision tensor extracted 256 tokens. Context length 128K verified. Diagnosis: Stable sinus rhythm observed, non-critical ST fluctuation noted. Telemetry relayed to Pocket 10."
      );
      setIsBridgeRunning(false);
    }, 750);
  };

  return (
    <div className="space-y-6">
      {/* Module Selector Bar */}
      <div className="bg-white border border-[#1a1a1a]/15 p-3 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveModule("alert-system")}
            className={`px-3 py-1.5 text-xs font-mono font-semibold border transition-all ${
              activeModule === "alert-system"
                ? "bg-[#1a1a1a] text-white border-[#c5a27d]"
                : "bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50"
            }`}
          >
            🔔 Pocket 10: Multi-Channel Alert
          </button>

          <button
            onClick={() => setActiveModule("autofix-pipeline")}
            className={`px-3 py-1.5 text-xs font-mono font-semibold border transition-all ${
              activeModule === "autofix-pipeline"
                ? "bg-[#1a1a1a] text-white border-[#c5a27d]"
                : "bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50"
            }`}
          >
            ⚙️ Auto-Fix &amp; Auto-Deploy Pipeline
          </button>

          <button
            onClick={() => setActiveModule("multimodal-bridge")}
            className={`px-3 py-1.5 text-xs font-mono font-semibold border transition-all ${
              activeModule === "multimodal-bridge"
                ? "bg-[#1a1a1a] text-white border-[#c5a27d]"
                : "bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50"
            }`}
          >
            🌉 Multimodal Bridge (T5Gemma 2)
          </button>

          <button
            onClick={() => setActiveModule("training-platform")}
            className={`px-3 py-1.5 text-xs font-mono font-semibold border transition-all ${
              activeModule === "training-platform"
                ? "bg-[#1a1a1a] text-white border-[#c5a27d]"
                : "bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50"
            }`}
          >
            🎓 Course-001 Training &amp; Certs
          </button>
        </div>

        <span className="text-[10px] font-mono text-neutral-500">
          Source: Seventeen Pockets GitBook Documentation
        </span>
      </div>

      {/* MODULE 1: POCKET 10 ALERT SYSTEM */}
      {activeModule === "alert-system" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Dispatcher Form */}
          <div className="bg-white border border-[#1a1a1a]/15 p-5 shadow-xs space-y-4">
            <div className="border-b border-neutral-200 pb-2">
              <span className="text-[10px] font-mono px-2 py-0.5 bg-red-100 text-red-800 border border-red-300 font-bold">
                POCKET 10
              </span>
              <h3 className="font-serif font-bold text-base text-[#1a1a1a] mt-1">
                Real-Time Multi-Channel Notification Service
              </h3>
              <p className="text-xs text-neutral-600">
                Multi-channel notifications for infrastructure incidents. Integrates with UptimeRobot and database triggers.
              </p>
            </div>

            <form onSubmit={handleSendAlert} className="space-y-3 text-xs font-mono">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-neutral-500 uppercase block mb-1">Channel</label>
                  <select
                    value={alertChannel}
                    onChange={(e: any) => setAlertChannel(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-neutral-300 bg-white"
                  >
                    <option value="discord">Discord Webhook (Rich Embed)</option>
                    <option value="telegram">Telegram Bot API</option>
                    <option value="email">SMTP Email Dispatch</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-neutral-500 uppercase block mb-1">Severity</label>
                  <select
                    value={alertSeverity}
                    onChange={(e: any) => setAlertSeverity(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-neutral-300 bg-white"
                  >
                    <option value="INFO">INFO (Notice)</option>
                    <option value="WARNING">WARNING (Threshold)</option>
                    <option value="CRITICAL">CRITICAL (Action Required)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-neutral-500 uppercase block mb-1">Alert Payload</label>
                <textarea
                  rows={3}
                  value={alertMessage}
                  onChange={(e) => setAlertMessage(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-neutral-300 focus:outline-none focus:border-[#c5a27d]"
                />
              </div>

              <button
                type="submit"
                disabled={isSendingAlert}
                className="w-full py-2 bg-[#1a1a1a] hover:bg-[#333] text-white font-mono text-xs border border-[#c5a27d] flex items-center justify-center space-x-1.5 transition-colors"
              >
                <Send className="w-3.5 h-3.5 text-[#c5a27d]" />
                <span>{isSendingAlert ? "Dispatching..." : "Broadcast Multi-Channel Alert"}</span>
              </button>
            </form>
          </div>

          {/* Alert Stream Feed */}
          <div className="bg-white border border-[#1a1a1a]/15 p-5 shadow-xs space-y-4">
            <div className="border-b border-neutral-200 pb-2 flex items-center justify-between">
              <h4 className="font-serif font-bold text-base text-[#1a1a1a]">
                Live Incident Dispatch Feed
              </h4>
              <span className="text-[10px] font-mono text-neutral-500">Pocket 10 Output</span>
            </div>

            <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
              {dispatchedAlerts.map((a) => (
                <div key={a.id} className="p-3 bg-[#FAF7F2] border border-neutral-300 space-y-1 text-xs font-mono">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#1a1a1a]">{a.id} • {a.channel}</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 font-bold ${
                        a.severity === "CRITICAL"
                          ? "bg-red-100 text-red-800 border border-red-300"
                          : a.severity === "WARNING"
                          ? "bg-amber-100 text-amber-800 border border-amber-300"
                          : "bg-blue-100 text-blue-800 border border-blue-300"
                      }`}
                    >
                      {a.severity}
                    </span>
                  </div>
                  <p className="text-neutral-700 text-[11px] leading-relaxed">{a.message}</p>
                  <span className="text-[9px] text-neutral-400 block pt-1">{a.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODULE 2: AUTO-FIX & AUTO-DEPLOY PIPELINE */}
      {activeModule === "autofix-pipeline" && (
        <div className="bg-white border border-[#1a1a1a]/15 p-6 shadow-xs space-y-6">
          <div className="border-b border-neutral-200 pb-3 flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-xs font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 border border-emerald-300 font-bold">
                CI/CD INFRASTRUCTURE
              </span>
              <h3 className="font-serif font-bold text-lg text-[#1a1a1a] mt-1">
                Zero-Downtime Auto-Fix &amp; Auto-Deploy Pipeline
              </h3>
              <p className="text-xs text-neutral-600">
                Automated pipeline that detects issues, applies fixes, and deploys updates without manual intervention.
              </p>
            </div>

            <button
              onClick={handleTriggerAutoFix}
              disabled={isAutoFixRunning}
              className="px-4 py-2 bg-[#1a1a1a] text-white hover:bg-[#333] font-mono text-xs border border-[#c5a27d] flex items-center space-x-2 transition-colors"
            >
              <Zap className={`w-3.5 h-3.5 text-[#c5a27d] ${isAutoFixRunning ? "animate-spin" : ""}`} />
              <span>{isAutoFixRunning ? "Running Remediation..." : "Simulate Auto-Fix Trigger"}</span>
            </button>
          </div>

          {/* 4 Pipeline Stages */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {pipelineSteps.map((step, idx) => (
              <div
                key={idx}
                className={`p-4 border transition-all ${
                  step.status === "completed"
                    ? "bg-emerald-50/50 border-emerald-300 text-emerald-900"
                    : step.status === "running"
                    ? "bg-amber-50/70 border-amber-400 text-amber-900 animate-pulse"
                    : "bg-[#FAF7F2] border-neutral-200 text-neutral-500"
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase mb-2">
                  <span>Stage 0{idx + 1}</span>
                  {step.status === "completed" ? (
                    <span className="text-emerald-700 flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>PASS</span>
                    </span>
                  ) : step.status === "running" ? (
                    <span className="text-amber-700">RUNNING...</span>
                  ) : (
                    <span>QUEUED</span>
                  )}
                </div>
                <h4 className="font-serif font-bold text-sm text-[#1a1a1a]">{step.title}</h4>
              </div>
            ))}
          </div>

          <div className="bg-[#FAF7F2] border border-neutral-300 p-3 text-xs font-mono text-neutral-700 flex items-center justify-between">
            <span>GitLab Pipeline Status: <strong className="text-emerald-700">100% Passing</strong> (Job ID: #48102)</span>
            <span>Target Branch: <code>main</code> • Rollback Guard: Active</span>
          </div>
        </div>
      )}

      {/* MODULE 3: MULTIMODAL BRIDGE (T5GEMMA 2) */}
      {activeModule === "multimodal-bridge" && (
        <div className="bg-white border border-[#1a1a1a]/15 p-6 shadow-xs space-y-6">
          <div className="border-b border-neutral-200 pb-3">
            <span className="text-xs font-mono bg-blue-100 text-blue-800 px-2 py-0.5 border border-blue-300 font-bold">
              ENCODER-DECODER SERVICE
            </span>
            <h3 className="font-serif font-bold text-lg text-[#1a1a1a] mt-1">
              Multimodal Bridge Pocket — T5Gemma 2 (1B-1B)
            </h3>
            <p className="text-xs text-neutral-600">
              Vision-to-text and text-to-text processing leveraging Google&apos;s T5Gemma 2 encoder-decoder architecture with frozen SigLIP vision encoder (417M params).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
            <div className="bg-[#FAF7F2] p-3 border border-neutral-200">
              <span className="text-[9px] text-neutral-500 uppercase block">Context Window</span>
              <span className="text-base font-bold text-[#1a1a1a]">128K Tokens</span>
            </div>
            <div className="bg-[#FAF7F2] p-3 border border-neutral-200">
              <span className="text-[9px] text-neutral-500 uppercase block">Vision Tokens</span>
              <span className="text-base font-bold text-sky-700">256 Image Tokens</span>
            </div>
            <div className="bg-[#FAF7F2] p-3 border border-neutral-200">
              <span className="text-[9px] text-neutral-500 uppercase block">Language Coverage</span>
              <span className="text-base font-bold text-[#c5a27d]">140+ Languages</span>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[11px] font-mono uppercase text-neutral-600 block">
              Test Prompt / Multimodal Query
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={bridgePrompt}
                onChange={(e) => setBridgePrompt(e.target.value)}
                className="flex-1 px-3 py-2 text-xs font-mono border border-neutral-300 focus:outline-none focus:border-[#c5a27d]"
              />
              <button
                onClick={handleRunBridge}
                disabled={isBridgeRunning}
                className="px-4 py-2 bg-[#1a1a1a] hover:bg-[#333] text-white font-mono text-xs border border-[#c5a27d] transition-colors"
              >
                {isBridgeRunning ? "Inferring..." : "Execute Bridge"}
              </button>
            </div>

            {bridgeResult && (
              <div className="p-3 bg-[#FAF7F2] border border-blue-300 text-xs font-mono text-neutral-800 animate-in fade-in">
                <span className="text-[9px] text-blue-700 uppercase block font-bold mb-1">
                  Multimodal Bridge Result:
                </span>
                <p className="leading-relaxed">{bridgeResult}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODULE 4: COURSE-001 TRAINING & CERTIFICATION */}
      {activeModule === "training-platform" && (
        <div className="bg-white border border-[#1a1a1a]/15 p-6 shadow-xs space-y-6">
          <div className="border-b border-neutral-200 pb-3 flex items-center justify-between">
            <div>
              <span className="text-xs font-mono bg-amber-100 text-amber-800 px-2 py-0.5 border border-amber-300 font-bold">
                COURSE-001
              </span>
              <h3 className="font-serif font-bold text-lg text-[#1a1a1a] mt-1">
                Collaborative Development &amp; CI/CD Mastery
              </h3>
              <p className="text-xs text-neutral-600">
                Official curriculum from the Seventeen Pockets Training Platform. Complete the check to issue your certificate.
              </p>
            </div>
            <Award className="w-8 h-8 text-[#c5a27d]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Lesson 04 */}
            <div className="bg-[#FAF7F2] p-4 border border-neutral-200 space-y-2">
              <span className="text-[10px] font-mono text-[#c5a27d] uppercase font-bold">Lesson 04</span>
              <h4 className="font-serif font-bold text-sm text-[#1a1a1a]">
                Merge Requests and Code Review
              </h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Master MR branch workflows, constructive review feedback, conflict resolution, and atomic commit structuring.
              </p>
              <div className="text-[10px] font-mono text-emerald-700 bg-emerald-50 p-1.5 border border-emerald-200">
                Core: Review hygiene • Approvals • Squash &amp; rebase
              </div>
            </div>

            {/* Lesson 05 */}
            <div className="bg-[#FAF7F2] p-4 border border-neutral-200 space-y-2">
              <span className="text-[10px] font-mono text-[#c5a27d] uppercase font-bold">Lesson 05</span>
              <h4 className="font-serif font-bold text-sm text-[#1a1a1a]">
                Introduction to CI/CD
              </h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Automate testing and deployment with CI/CD pipelines, runner concurrency, artifact caching, and zero-downtime deployment.
              </p>
              <div className="text-[10px] font-mono text-emerald-700 bg-emerald-50 p-1.5 border border-emerald-200">
                Core: GitLab CI/CD • Runner executors • Rollback sanity
              </div>
            </div>
          </div>

          {/* Interactive Check & Certificate Generator */}
          <div className="p-4 bg-white border-2 border-[#1a1a1a]/20 space-y-4">
            <h4 className="font-serif font-bold text-sm text-[#1a1a1a]">
              Knowledge Verification Assessment
            </h4>

            <div className="space-y-2 text-xs font-mono">
              <p className="text-neutral-800 font-semibold">
                Q: In the Seventeen Pockets deployment order, what role does Pocket 01 (Nexus) play?
              </p>
              <div className="space-y-1">
                {[
                  "Central Hub for 3D visualization and service discovery registry",
                  "Isolated offline battery storage unit",
                  "Only a CSS stylesheet repository",
                ].map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => setQuizAnswers({ ...quizAnswers, 1: i })}
                    className={`w-full text-left p-2 border transition-colors ${
                      quizAnswers[1] === i
                        ? "bg-[#1a1a1a] text-white border-[#c5a27d]"
                        : "bg-[#FAF7F2] hover:bg-neutral-100 border-neutral-300 text-neutral-700"
                    }`}
                  >
                    <span>{opt}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setCertIssued(true)}
              className="py-2 px-4 bg-[#c5a27d] hover:bg-[#d4b38e] text-[#1a1a1a] font-mono text-xs font-bold uppercase transition-colors"
            >
              Generate Official Course Certificate →
            </button>

            {certIssued && (
              <div className="p-4 bg-[#FAF7F2] border-2 border-[#c5a27d] text-center space-y-2 animate-in zoom-in-95">
                <span className="text-[10px] font-mono uppercase text-[#c5a27d] font-bold tracking-widest block">
                  Official Verification Record
                </span>
                <h3 className="font-serif font-bold text-base text-[#1a1a1a]">
                  Seventeen Pockets Ecosystem Developer Certification
                </h3>
                <p className="text-xs text-neutral-600">
                  Awarded to: <strong>Architect Odell Anderson Jr.</strong>
                </p>
                <div className="text-[10px] font-mono text-neutral-500 pt-2 border-t border-neutral-300">
                  Credentials ID: <code>SP-CERT-2026-99214</code> • Validated on Pocket 08 CI/CD Matrix
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
