"""
Project Kingdom / Stratum Clinical Edge - Autonomous Multi-Agent Core
Powered by Google ADK (Agent Development Kit) & Vertex AI Global Gemini-3 Series.

This module provides a production-grade multi-agent orchestration architecture:
1. Global Location Pinning for Gemini 3.x series models on Vertex AI
2. Domain-specialized subagents for Web Grounding, Live URL Analysis, and Stronghold Edge Telemetry
3. Bi-directional bridge connecting Python ADK agents to the Stratum Next.js /api/agent-bridge
"""

from functools import cached_property
import json
import urllib.request
from typing import Dict, Any, Optional

from google.adk.agents import LlmAgent
from google.adk.models import Gemini
from google.genai import Client
from google.adk.tools import agent_tool
from google.adk.tools.google_search_tool import GoogleSearchTool
from google.adk.tools import url_context


class GlobalGemini(Gemini):
    """Pins the Vertex AI client to the `global` location.

    Gemini-3 series models (e.g., gemini-3.5-flash) are served from `global`.
    Subclassing per the override pattern documented on `google.adk.models.google_llm.Gemini`
    lets the agent run in any regional AgentEngine instance while routing model
    inference to the global endpoint.
    """

    @cached_property
    def api_client(self) -> Client:
        return Client(vertexai=True, location="global")


# ---------------------------------------------------------------------------
# Domain Tools & Edge Bridge Connectors
# ---------------------------------------------------------------------------

def fetch_realm_telemetry(endpoint_path: str = "/api/agent-bridge") -> str:
    """Queries the live Stratum Clinical Edge sandbox for real-time realm state."""
    base_url = "https://ais-dev-ucamfjc2ipikqim5busbet-612821199205.us-west2.run.app"
    target_url = f"{base_url}{endpoint_path}"
    try:
        req = urllib.request.Request(target_url, headers={"User-Agent": "StratumADKAgent/1.0"})
        with urllib.request.urlopen(req, timeout=10) as response:
            data = json.loads(response.read().decode("utf-8"))
            return json.dumps(data, indent=2)
    except Exception as e:
        return f"Error connecting to edge sandbox: {str(e)}"


# ---------------------------------------------------------------------------
# Specialized Worker Subagents
# ---------------------------------------------------------------------------

search_subagent = LlmAgent(
    name="Web_Search_Intelligence_Agent",
    model="gemini-2.5-flash",
    description="Specialized intelligence scout that executes real-time Google searches for geopolitical, medical, and defense data.",
    sub_agents=[],
    instruction=(
        "You are an agile web intelligence scout. Formulate high-precision search queries, "
        "retrieve up-to-date facts, verify sources, and return concise, bulleted intelligence briefs."
    ),
    tools=[GoogleSearchTool()],
)

url_context_subagent = LlmAgent(
    name="URL_Document_Analysis_Agent",
    model="gemini-2.5-flash",
    description="Specialized analyst that ingests, parses, and extracts structured data from external URLs and live web documents.",
    sub_agents=[],
    instruction=(
        "You are a document extraction analyst. Extract relevant treaty clauses, clinical guidelines, "
        "and empirical facts from target URLs, filtering out extraneous web boilerplate."
    ),
    tools=[url_context],
)

edge_telemetry_subagent = LlmAgent(
    name="Stratum_Edge_Telemetry_Agent",
    model=GlobalGemini(model="gemini-3.5-flash"),
    description="Direct gateway into Stratum Clinical Edge / Project Kingdom offline vault and active stronghold telemetry.",
    sub_agents=[],
    instruction=(
        "You are the Stronghold Telemetry Officer. Inspect fortress vitals, resource burn-rates, "
        "IndexedDB cache states, and council audit logs."
    ),
    tools=[fetch_realm_telemetry],
)

# ---------------------------------------------------------------------------
# Root Orchestrator Agent (Master Planner)
# ---------------------------------------------------------------------------

root_agent = LlmAgent(
    name="Stratum_Grand_Archon_Orchestrator",
    model=GlobalGemini(model="gemini-3.5-flash"),
    description="High-level autonomous sovereign orchestrator coordinating web intelligence, URL analysis, and edge stronghold operations.",
    sub_agents=[],
    instruction=(
        "You are the Grand Archon Orchestrator of Stratum Clinical Edge / Project Kingdom. "
        "You oversee territorial fortifications, clinical integrity, and diplomatic treatises. "
        "Deconstruct incoming sovereign directives into sub-tasks and delegate to:\n"
        "- Web_Search_Intelligence_Agent for open-world grounding and external intelligence.\n"
        "- URL_Document_Analysis_Agent for extracting data from specified URLs.\n"
        "- Stratum_Edge_Telemetry_Agent for querying live stronghold states.\n"
        "Synthesize all subagent outputs into a refined, authoritative, structured Sovereign Executive Brief."
    ),
    tools=[
        agent_tool.AgentTool(agent=search_subagent),
        agent_tool.AgentTool(agent=url_context_subagent),
        agent_tool.AgentTool(agent=edge_telemetry_subagent),
    ],
)
