import { NextResponse } from "next/server";

export async function GET() {
  const schema = {
    schema_version: "v1.0",
    name: "Stratum Clinical Edge / Project Kingdom Sovereign Agent Bridge",
    description: "Decentralized Clinical & Realm Intelligence Platform - Edge-Native, Privacy-First, Offline-Capable Interface for Autonomous AI Agents and Collaborators.",
    base_url: "https://ais-dev-ucamfjc2ipikqim5busbet-612821199205.us-west2.run.app",
    capabilities: [
      {
        id: "tactical_strategic_oracle",
        description: "Synthesize clinical triage, medical logistics, and resource strategy from real-time realm vectors.",
        endpoint: "/api/gemini",
        method: "POST",
        payload_schema: {
          mode: "strategy",
          payload: {
            name: "string (Facility or Clinic name)",
            age: "number (Care Cadre Staffing / Node level)",
            vitals: "string (Resources / Mana / Medical reserves)",
            notes: "string (Intelligence logs / clinical reports)",
            environmentalContext: "string (Spatial radar coordinates)",
          },
        },
      },
      {
        id: "royal_sovereign_scribe",
        description: "Draft authoritative Sovereign Decrees, Edicts, and Alliance Covenants.",
        endpoint: "/api/gemini",
        method: "POST",
        payload_schema: {
          mode: "edict",
          payload: {
            doctorName: "string (Issuer / Lead Sovereign)",
            recipient: "string (Target Council or Territory)",
            patientName: "string (Subject Territory or Ally)",
            notes: "string (Mandate clauses)",
            tone: "string",
          },
        },
      },
      {
        id: "security_espionage_audit",
        description: "Audit immutable council trace streams, detect anomalies, and compute Zero-Trust scorecards.",
        endpoint: "/api/gemini",
        method: "POST",
        payload_schema: {
          mode: "audit",
          payload: {
            logs: "array of strings (Telemetry trace stream)",
          },
        },
      },
      {
        id: "autonomous_agent_collaboration",
        description: "Direct structured agent interaction protocol for mutual AI assistance, analysis, and execution.",
        endpoint: "/api/gemini",
        method: "POST",
        payload_schema: {
          mode: "agent_collaborate",
          payload: {
            agentName: "string (Calling AI identifier)",
            objective: "string (Task or query)",
            context: "string (Optional environmental state)",
          },
        },
      },
      {
        id: "google_adk_orchestration",
        description: "Google Agent Development Kit (ADK) multi-agent configuration with Global Gemini 3.5 routing, GoogleSearchTool, and live URL context analysis.",
        source_module: "/lib/adk_agent_core.py",
        architecture: {
          root_agent: "Stratum_Grand_Archon_Orchestrator",
          model: "GlobalGemini(gemini-3.5-flash)",
          subagents: [
            "Web_Search_Intelligence_Agent (GoogleSearchTool)",
            "URL_Document_Analysis_Agent (url_context)",
            "Stratum_Edge_Telemetry_Agent (Live /api/agent-bridge gateway)",
          ],
        },
      },
    ],
    developer_sandbox: {
      url: "https://ais-dev-ucamfjc2ipikqim5busbet-612821199205.us-west2.run.app",
      port: 3000,
      protocol: "HTTPS / Edge-Native Container",
      storage_engine: "IndexedDB Local Vault + Cloud Firestore",
      status: "OPERATIONAL",
    },
  };

  return NextResponse.json(schema, {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
