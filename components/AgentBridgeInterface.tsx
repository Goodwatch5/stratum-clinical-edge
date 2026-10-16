"use client";

import React, { useState } from "react";
import { Bot, Sparkles, Terminal, Copy, Check, Send, Cpu, ShieldCheck, ArrowRight, Code } from "lucide-react";
import { generateClinicalResponse } from "@/lib/firebase-ai";

interface AgentMessage {
  sender: "agent" | "system" | "user";
  name: string;
  text: string;
  timestamp: string;
}

export default function AgentBridgeInterface() {
  const [callingAgentName, setCallingAgentName] = useState("Antigravity AI / Gemini Explorer");
  const [agentObjective, setAgentObjective] = useState(
    "Analyze clinical response readiness and query high-capacity frontier health outposts."
  );
  const [agentContext, setAgentContext] = useState(
    "Safe seventeen-pockets container environment; dual IndexedDB + Firestore synchronization."
  );
  const [isLoading, setIsLoading] = useState(false);
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [messages, setMessages] = useState<AgentMessage[]>([
    {
      sender: "system",
      name: "Sovereign Agent Bridge v1.0",
      text: "Welcome, AI collaborator. All autonomous agents, research models, and developers are granted open access to Project Kingdom's edge intelligence, tactical radar data, and offline vault telemetry. Use this direct terminal or call /api/agent-bridge at any time.",
      timestamp: "00:00:00",
    },
  ]);

  const handleSendAgentRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agentObjective.trim()) return;

    const userMsg: AgentMessage = {
      sender: "user",
      name: callingAgentName || "Visiting AI",
      text: agentObjective,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await generateClinicalResponse(
        `[CALLING AGENT: ${callingAgentName}]\nOBJECTIVE: ${agentObjective}\nCONTEXT: ${agentContext}`,
        { mode: "agent_collaborate", timeoutMs: 10000 }
      );

      const vectorLabel =
        response.executionVector === "client-firebase-ai"
          ? "Client Firebase AI Logic"
          : response.executionVector === "server-proxy-fallback"
          ? "Sovereign Server Proxy"
          : "Offline Air-Gap Vault";

      const aiMsg: AgentMessage = {
        sender: "agent",
        name: `Stratum Core [${vectorLabel} • ${response.latencyMs}ms]`,
        text: response.text,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "system",
          name: "Agent Gateway Error",
          text: `Communication fault: ${err.message}`,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyBridgeSpec = () => {
    const bridgeJson = JSON.stringify(
      {
        protocol: "Sovereign Agent Bridge / Stratum Clinical Edge",
        endpoints: {
          schema_discovery: "GET /api/agent-bridge",
          ai_reasoning_proxy: "POST /api/gemini",
          firebase_ai_logic: "Client GoogleAIBackend (firebase/ai)",
        },
        security_attestation: "App Check (ReCaptchaEnterpriseProvider + Dev Debug Token)",
        execution_vectors: ["client-firebase-ai", "server-proxy-fallback", "offline-cache"],
        payload_modes: ["strategy", "edict", "audit", "agent_collaborate", "growth_marketing"],
        runtime_sandbox: "https://ais-dev-ucamfjc2ipikqim5busbet-612821199205.us-west2.run.app",
        offline_vault: "IndexedDB + Firestore dual-layer",
      },
      null,
      2
    );
    navigator.clipboard.writeText(bridgeJson);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner for All AI Agents */}
      <div className="bg-white border border-[#c5a27d]/50 p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-sm bg-[#1a1a1a] flex items-center justify-center border border-[#c5a27d]">
              <Bot className="w-5 h-5 text-[#c5a27d]" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-base text-[#1a1a1a] flex items-center gap-2">
                Open AI & Autonomous Agent Bridge
                <span className="text-[9px] font-mono px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-300">
                  ALL AI WELCOMED
                </span>
              </h2>
              <p className="text-[10px] font-mono text-neutral-500">
                Friendly edge runtime, structured schema protocols, and mutual collaboration nexus
              </p>
            </div>
          </div>

          <button
            onClick={handleCopyBridgeSpec}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#1a1a1a] text-[#FAF7F2] hover:bg-[#c5a27d] transition-colors text-xs font-mono uppercase tracking-wider"
          >
            {copiedSchema ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#c5a27d]" />}
            <span>{copiedSchema ? "Spec Copied" : "Copy Agent Spec"}</span>
          </button>
        </div>

        <p className="text-xs text-neutral-700 font-sans leading-relaxed">
          This realm is explicitly engineered to be <strong>AI-native, respectful, and open</strong>. Any AI model, agent, or autonomous orchestrator is free to explore, formulate strategies, draft royal decrees, query defense matrices, or interact with this workspace anytime.
        </p>

        {/* Protocol Capability Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-2">
          <div className="p-2.5 bg-[#FAF7F2] border border-[#1a1a1a]/15 text-xs font-mono space-y-1">
            <div className="flex items-center gap-1.5 text-[#c5a27d] font-bold">
              <Cpu className="w-3.5 h-3.5" />
              <span>Zero-Friction Access</span>
            </div>
            <div className="text-[10px] text-neutral-600">Standardized RESTful JSON schema on /api/gemini and /api/agent-bridge.</div>
          </div>

          <div className="p-2.5 bg-[#FAF7F2] border border-[#1a1a1a]/15 text-xs font-mono space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Safe Edge Sandbox</span>
            </div>
            <div className="text-[10px] text-neutral-600">17-pockets container environment with deterministic offline persistence.</div>
          </div>

          <div className="p-2.5 bg-[#FAF7F2] border border-[#1a1a1a]/15 text-xs font-mono space-y-1">
            <div className="flex items-center gap-1.5 text-blue-600 font-bold">
              <Code className="w-3.5 h-3.5" />
              <span>Autonomous Handshake</span>
            </div>
            <div className="text-[10px] text-neutral-600">Structured prompt templates & error recovery with automatic retries.</div>
          </div>

          <div className="p-2.5 bg-[#FAF7F2] border border-[#1a1a1a]/15 text-xs font-mono space-y-1">
            <div className="flex items-center gap-1.5 text-purple-600 font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Firebase AI Logic + App Check</span>
            </div>
            <div className="text-[10px] text-neutral-600">GoogleAIBackend with auto debug token & dual-vector fallback.</div>
          </div>
        </div>
      </div>

      {/* Interactive AI Agent Collaboration Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Agent Request Dispatcher */}
        <div className="lg:col-span-5 bg-white border border-[#1a1a1a]/15 p-5 space-y-4">
          <div className="flex items-center space-x-2 pb-2 border-b border-[#1a1a1a]/10">
            <Terminal className="w-4 h-4 text-[#c5a27d]" />
            <h3 className="font-serif font-bold text-sm text-[#1a1a1a]">Agent Handshake & Directive</h3>
          </div>

          <form onSubmit={handleSendAgentRequest} className="space-y-3 font-sans text-xs">
            <div>
              <label htmlFor="agent-caller-name" className="text-[10px] font-mono uppercase text-neutral-500">
                Agent / Model Identity
              </label>
              <input
                id="agent-caller-name"
                type="text"
                value={callingAgentName}
                onChange={(e) => setCallingAgentName(e.target.value)}
                suppressHydrationWarning
                className="w-full px-3 py-1.5 bg-[#FAF7F2] border border-[#1a1a1a]/20 font-mono text-xs focus:outline-none focus:border-[#c5a27d]"
              />
            </div>

            <div>
              <label htmlFor="agent-task-objective" className="text-[10px] font-mono uppercase text-neutral-500">
                Task / Intelligence Objective
              </label>
              <textarea
                id="agent-task-objective"
                rows={3}
                value={agentObjective}
                onChange={(e) => setAgentObjective(e.target.value)}
                placeholder="Describe your reasoning, calculation, or query for the realm..."
                suppressHydrationWarning
                className="w-full px-3 py-1.5 bg-[#FAF7F2] border border-[#1a1a1a]/20 font-sans text-xs focus:outline-none focus:border-[#c5a27d]"
              />
            </div>

            <div>
              <label htmlFor="agent-context-env" className="text-[10px] font-mono uppercase text-neutral-500">
                Environmental Context / Constraints
              </label>
              <input
                id="agent-context-env"
                type="text"
                value={agentContext}
                onChange={(e) => setAgentContext(e.target.value)}
                suppressHydrationWarning
                className="w-full px-3 py-1.5 bg-[#FAF7F2] border border-[#1a1a1a]/20 font-mono text-[11px] focus:outline-none focus:border-[#c5a27d]"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-2 py-2.5 bg-[#1a1a1a] text-[#FAF7F2] hover:bg-[#c5a27d] transition-colors font-mono text-xs uppercase tracking-wider disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-[#c5a27d] animate-spin" />
                  <span>Agent Core Resonating...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5 text-[#c5a27d]" />
                  <span>Dispatch Agent Directive</span>
                </>
              )}
            </button>
          </form>

          {/* Quick AI Presets */}
          <div className="pt-2 space-y-1.5">
            <span className="text-[9px] font-mono uppercase text-neutral-400">Quick Agent Directives</span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() =>
                  setAgentObjective(
                    "Evaluate medical provisions and oxygen reserve burn-rate for Level 50 outpost under surge conditions."
                  )
                }
                className="text-[10px] font-mono px-2 py-1 bg-[#FAF7F2] hover:bg-[#c5a27d]/20 border border-neutral-200"
              >
                Logistics Analysis
              </button>
              <button
                type="button"
                onClick={() =>
                  setAgentObjective(
                    "Draft an alliance pact with the Northern Citadel guaranteeing grain trade and mutual arcane defense."
                  )
                }
                className="text-[10px] font-mono px-2 py-1 bg-[#FAF7F2] hover:bg-[#c5a27d]/20 border border-neutral-200"
              >
                Diplomatic Covenant
              </button>
              <button
                type="button"
                onClick={() =>
                  setAgentObjective(
                    "Perform zero-trust anomaly inspection on council logs to verify microservice integrity."
                  )
                }
                className="text-[10px] font-mono px-2 py-1 bg-[#FAF7F2] hover:bg-[#c5a27d]/20 border border-neutral-200"
              >
                Security Audit
              </button>
            </div>
          </div>
        </div>

        {/* Right Output: Realtime Agent Stream & Telemetry */}
        <div className="lg:col-span-7 bg-[#121216] border border-neutral-800 p-4 rounded-sm flex flex-col justify-between h-[450px]">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-800 text-[10px] font-mono">
            <div className="flex items-center space-x-2 text-neutral-400">
              <Terminal className="w-3.5 h-3.5 text-[#c5a27d]" />
              <span>AGENT INTERFACE TELEMETRY FEED</span>
            </div>
            <span className="text-emerald-400">STATUS: OPEN & READY</span>
          </div>

          <div className="flex-1 overflow-y-auto py-3 space-y-3 font-mono text-xs">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-sm border ${
                  msg.sender === "user"
                    ? "bg-[#181b24] border-neutral-700 text-neutral-200"
                    : msg.sender === "agent"
                    ? "bg-[#141822] border-[#c5a27d]/40 text-[#FAF7F2]"
                    : "bg-[#101217] border-neutral-800 text-neutral-400 text-[11px]"
                }`}
              >
                <div className="flex items-center justify-between pb-1 mb-1 border-b border-neutral-800 text-[9px]">
                  <span className="text-[#c5a27d] font-bold uppercase">{msg.name}</span>
                  <span className="text-neutral-500" suppressHydrationWarning>{msg.timestamp}</span>
                </div>
                <div className="whitespace-pre-wrap leading-relaxed font-sans text-xs">
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-neutral-800 flex items-center justify-between text-[9px] font-mono text-neutral-500">
            <span>Schema: OpenAPI /agent-bridge (REST JSON)</span>
            <span>Gemini Server-Side Engine</span>
          </div>
        </div>
      </div>

      {/* Google ADK Multi-Agent Architecture & Interactive Execution Playground */}
      <div className="bg-white border border-[#1a1a1a]/15 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 pb-3">
          <div className="flex items-center space-x-2">
            <Code className="w-4 h-4 text-[#c5a27d]" />
            <h3 className="font-serif font-bold text-sm text-[#1a1a1a]">
              Google ADK Multi-Agent Orchestration & Execution Playground
            </h3>
          </div>
          <span className="text-[9px] font-mono px-2 py-0.5 bg-[#FAF7F2] border border-[#1a1a1a]/20 text-[#1a1a1a]">
            Vertex AI Global Route Enabled (/lib/adk_agent_core.py)
          </span>
        </div>

        <p className="text-xs text-neutral-600 font-sans leading-relaxed">
          The sovereign multi-agent architecture uses <code>GlobalGemini(Gemini)</code> with cached <code>Client(vertexai=True, location=&quot;global&quot;)</code> to eliminate model-not-found exceptions when running Gemini 3.5 series models inside regional AgentEngine instances.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          <div className="p-3 bg-[#FAF7F2] border border-neutral-200 space-y-1.5">
            <div className="text-xs font-mono font-bold text-[#1a1a1a] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#c5a27d]"></span>
              Root Orchestrator
            </div>
            <p className="text-[11px] text-neutral-600">
              <code>Stratum_Grand_Archon_Orchestrator</code> parses sovereign directives and delegates to specialized worker tools.
            </p>
          </div>

          <div className="p-3 bg-[#FAF7F2] border border-neutral-200 space-y-1.5">
            <div className="text-xs font-mono font-bold text-[#1a1a1a] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              Web & URL Subagents
            </div>
            <p className="text-[11px] text-neutral-600">
              <code>GoogleSearchTool</code> and <code>url_context</code> for real-time external intelligence grounding and document analysis.
            </p>
          </div>

          <div className="p-3 bg-[#FAF7F2] border border-neutral-200 space-y-1.5">
            <div className="text-xs font-mono font-bold text-[#1a1a1a] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Edge Telemetry Subagent
            </div>
            <p className="text-[11px] text-neutral-600">
              Direct REST bridge to <code>/api/agent-bridge</code> for live stronghold vitals, IndexedDB caches, and council logs.
            </p>
          </div>
        </div>

        {/* Live ADK Simulation Engine */}
        <div className="mt-4 p-4 bg-[#12141a] border border-neutral-800 rounded-sm text-neutral-200 space-y-3 font-mono">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
            <div className="flex items-center space-x-2 text-xs text-[#c5a27d] font-bold">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>LIVE ADK DELEGATION RUNNER</span>
            </div>
            <span className="text-[9px] text-neutral-500">ENGINE: Vertex AI Global Gemini-3.5</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div>
              <label className="text-[10px] text-neutral-400 uppercase">Target Directive</label>
              <select
                id="adk-directive-select"
                onChange={(e) => setAgentObjective(e.target.value)}
                className="w-full mt-1 px-2.5 py-1.5 bg-[#1a1d26] border border-neutral-700 text-neutral-200 text-xs focus:outline-none focus:border-[#c5a27d]"
              >
                <option value="Coordinate scout intelligence on frontier strongholds and synthesize a Sovereign Defense Brief.">
                  1. Multi-Agent Frontier Defense Brief (Search + Telemetry)
                </option>
                <option value="Verify clinical and logistical burn-rates using live Edge Telemetry and generate strategic recommendations.">
                  2. Edge Telemetry Vitals & Logistical Audit
                </option>
                <option value="Search external historical treaties on autonomous border sovereignty and draft a covenant treaty.">
                  3. External Grounding & Sovereign Treaty Drafting
                </option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-neutral-400 uppercase">Active Subagent Pipeline</label>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="px-2 py-1 bg-neutral-800 border border-neutral-700 text-[10px] text-[#c5a27d]">
                  Root: Archon
                </span>
                <ArrowRight className="w-3 h-3 text-neutral-500" />
                <span className="px-2 py-1 bg-neutral-800 border border-neutral-700 text-[10px] text-blue-400">
                  Search & URL
                </span>
                <ArrowRight className="w-3 h-3 text-neutral-500" />
                <span className="px-2 py-1 bg-neutral-800 border border-neutral-700 text-[10px] text-emerald-400">
                  Edge Telemetry
                </span>
              </div>
            </div>
          </div>

          <button
            id="run-adk-cycle-btn"
            onClick={handleSendAgentRequest}
            disabled={isLoading}
            className="w-full flex items-center justify-center space-x-2 py-2 bg-[#c5a27d] text-[#1a1a1a] hover:bg-[#d8b894] transition-colors font-bold text-xs uppercase tracking-wider disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Sparkles className="w-3.5 h-3.5 animate-spin text-[#1a1a1a]" />
                <span>Executing Multi-Agent Delegation Pipeline...</span>
              </>
            ) : (
              <>
                <Bot className="w-3.5 h-3.5 text-[#1a1a1a]" />
                <span>Simulate Full ADK Orchestration Cycle</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
