"use client";

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import {
  GitBranch,
  GitFork,
  Star,
  Clock,
  Layers,
  Search,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Sliders,
  Filter,
  Activity,
  CheckCircle2,
  Terminal,
  FileCode
} from "lucide-react";

export interface GitLabProjectNode extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  path: string;
  group: string;
  description: string;
  stars: number;
  forks: number;
  openIssues: number;
  commitsCount: number;
  lastActivity: string; // ISO or relative
  activityStatus: "active" | "recent" | "dormant";
  pipelineStatus: "success" | "running" | "failed";
  language: string;
  pocketId?: number;
  url: string;
  isRoot?: boolean;
}

export interface GitLabProjectLink extends d3.SimulationLinkDatum<GitLabProjectNode> {
  source: string | GitLabProjectNode;
  target: string | GitLabProjectNode;
  type: "dependency" | "fork" | "pipeline" | "submodule";
  strength?: number;
}

const INITIAL_GITLAB_PROJECTS: GitLabProjectNode[] = [
  {
    id: "solar-connect",
    name: "solar-connect",
    path: "intelligence-dev-for-seventeen-pockets/solar-connect",
    group: "intelligence-dev-for-seventeen-pockets",
    description: "Core Solar Nexus visualization tool & 3D orbital mesh connecting all seventeen pockets.",
    stars: 34,
    forks: 8,
    openIssues: 0,
    commitsCount: 184,
    lastActivity: "12m ago",
    activityStatus: "active",
    pipelineStatus: "success",
    language: "TypeScript / Python",
    pocketId: 1,
    url: "https://gitlab.com/intelligence-dev-for-seventeen-pockets/solar-connect",
    isRoot: true,
  },
  {
    id: "nexus-core",
    name: "nexus-core",
    path: "intelligence-dev-for-seventeen-pockets/nexus-core",
    group: "intelligence-dev-for-seventeen-pockets",
    description: "Central registry hub, real-time WebSocket broker, and telemetry aggregator.",
    stars: 28,
    forks: 4,
    openIssues: 1,
    commitsCount: 220,
    lastActivity: "2h ago",
    activityStatus: "active",
    pipelineStatus: "success",
    language: "Rust / Node.js",
    pocketId: 1,
    url: "https://gitlab.com/intelligence-dev-for-seventeen-pockets/nexus-core",
  },
  {
    id: "sparse-circuits-engine",
    name: "sparse-circuits-engine",
    path: "intelligence-dev-for-seventeen-pockets/sparse-circuits-engine",
    group: "intelligence-dev-for-seventeen-pockets",
    description: "Weight-sparse transformer circuit extraction with 1000x sparsity (0.1% nonzero weights).",
    stars: 42,
    forks: 11,
    openIssues: 0,
    commitsCount: 310,
    lastActivity: "4h ago",
    activityStatus: "active",
    pipelineStatus: "success",
    language: "Python / PyTorch",
    pocketId: 13,
    url: "https://gitlab.com/intelligence-dev-for-seventeen-pockets/sparse-circuits-engine",
  },
  {
    id: "t5gemma-multimodal-bridge",
    name: "t5gemma-multimodal-bridge",
    path: "intelligence-dev-for-seventeen-pockets/t5gemma-multimodal-bridge",
    group: "intelligence-dev-for-seventeen-pockets",
    description: "T5Gemma 2 (1B-1B variant) with SigLIP vision encoder across 140+ languages.",
    stars: 19,
    forks: 3,
    openIssues: 0,
    commitsCount: 95,
    lastActivity: "1d ago",
    activityStatus: "recent",
    pipelineStatus: "success",
    language: "Python",
    pocketId: 14,
    url: "https://gitlab.com/intelligence-dev-for-seventeen-pockets/t5gemma-multimodal-bridge",
  },
  {
    id: "pocket-alert-system",
    name: "pocket-alert-system",
    path: "intelligence-dev-for-seventeen-pockets/pocket-alert-system",
    group: "intelligence-dev-for-seventeen-pockets",
    description: "Pocket 10 multi-channel alert delivery via Discord webhooks, Telegram bot, and SMTP.",
    stars: 15,
    forks: 2,
    openIssues: 0,
    commitsCount: 68,
    lastActivity: "3d ago",
    activityStatus: "recent",
    pipelineStatus: "success",
    language: "TypeScript",
    pocketId: 10,
    url: "https://gitlab.com/intelligence-dev-for-seventeen-pockets/pocket-alert-system",
  },
  {
    id: "autofix-pipeline",
    name: "autofix-pipeline",
    path: "intelligence-dev-for-seventeen-pockets/autofix-pipeline",
    group: "intelligence-dev-for-seventeen-pockets",
    description: "Zero-downtime automated issue detection, auto-patch synthesis, and GitLab CI deployment.",
    stars: 27,
    forks: 5,
    openIssues: 0,
    commitsCount: 142,
    lastActivity: "5h ago",
    activityStatus: "active",
    pipelineStatus: "success",
    language: "YAML / Bash",
    pocketId: 8,
    url: "https://gitlab.com/intelligence-dev-for-seventeen-pockets/autofix-pipeline",
  },
  {
    id: "neon-postgres-vault",
    name: "neon-postgres-vault",
    path: "intelligence-dev-for-seventeen-pockets/neon-postgres-vault",
    group: "intelligence-dev-for-seventeen-pockets",
    description: "Pocket 03 PostgreSQL database on Neon with auto-snapshots & zero-latency sync.",
    stars: 18,
    forks: 2,
    openIssues: 0,
    commitsCount: 88,
    lastActivity: "2d ago",
    activityStatus: "recent",
    pipelineStatus: "success",
    language: "SQL / Drizzle",
    pocketId: 3,
    url: "https://gitlab.com/intelligence-dev-for-seventeen-pockets/neon-postgres-vault",
  },
  {
    id: "subsecond-sync-engine",
    name: "subsecond-sync-engine",
    path: "intelligence-dev-for-seventeen-pockets/subsecond-sync-engine",
    group: "intelligence-dev-for-seventeen-pockets",
    description: "Pocket 04 real-time replication fabric maintaining state consistency across edge nodes.",
    stars: 21,
    forks: 4,
    openIssues: 0,
    commitsCount: 112,
    lastActivity: "1d ago",
    activityStatus: "recent",
    pipelineStatus: "success",
    language: "Go / WebSocket",
    pocketId: 4,
    url: "https://gitlab.com/intelligence-dev-for-seventeen-pockets/subsecond-sync-engine",
  },
  {
    id: "gitbook-docs-matrix",
    name: "gitbook-docs-matrix",
    path: "Goodwatch5/gitbook-docs-matrix",
    group: "goodwatch5",
    description: "The complete Seventeen Pockets documentation repository hosted on GitBook.",
    stars: 39,
    forks: 12,
    openIssues: 0,
    commitsCount: 260,
    lastActivity: "30m ago",
    activityStatus: "active",
    pipelineStatus: "success",
    language: "Markdown",
    pocketId: 12,
    url: "https://gitlab.com/Goodwatch5/gitbook-docs-matrix",
  },
  {
    id: "course-001-training",
    name: "course-001-training",
    path: "intelligence-dev-for-seventeen-pockets/course-001-training",
    group: "intelligence-dev-for-seventeen-pockets",
    description: "Training platform syllabus: Merge Requests, Code Reviews, and CI/CD pipelines.",
    stars: 14,
    forks: 1,
    openIssues: 0,
    commitsCount: 54,
    lastActivity: "4d ago",
    activityStatus: "recent",
    pipelineStatus: "success",
    language: "TypeScript / MDX",
    pocketId: 12,
    url: "https://gitlab.com/intelligence-dev-for-seventeen-pockets/course-001-training",
  },
  {
    id: "atlas-stream-analytics",
    name: "atlas-stream-analytics",
    path: "intelligence-dev-for-seventeen-pockets/atlas-stream-analytics",
    group: "intelligence-dev-for-seventeen-pockets",
    description: "Pocket 11 MongoDB Atlas Stream Processing for GDPR privacy-preserving analytics.",
    stars: 16,
    forks: 3,
    openIssues: 0,
    commitsCount: 76,
    lastActivity: "2d ago",
    activityStatus: "recent",
    pipelineStatus: "success",
    language: "Python / Kafka",
    pocketId: 11,
    url: "https://gitlab.com/intelligence-dev-for-seventeen-pockets/atlas-stream-analytics",
  },
  {
    id: "monorepo-workspace",
    name: "monorepo-workspace",
    path: "Goodwatch5/monorepo-workspace",
    group: "goodwatch5",
    description: "Consolidated development workspace and pnpm package orchestrator for ODell ecosystem.",
    stars: 22,
    forks: 6,
    openIssues: 0,
    commitsCount: 198,
    lastActivity: "1d ago",
    activityStatus: "recent",
    pipelineStatus: "success",
    language: "TypeScript",
    pocketId: 1,
    url: "https://gitlab.com/Goodwatch5/monorepo-workspace",
  },
];

const INITIAL_GITLAB_LINKS: GitLabProjectLink[] = [
  { source: "solar-connect", target: "nexus-core", type: "dependency", strength: 1.0 },
  { source: "solar-connect", target: "gitbook-docs-matrix", type: "submodule", strength: 0.8 },
  { source: "solar-connect", target: "sparse-circuits-engine", type: "dependency", strength: 0.9 },
  { source: "solar-connect", target: "autofix-pipeline", type: "pipeline", strength: 0.7 },
  { source: "nexus-core", target: "neon-postgres-vault", type: "dependency", strength: 0.8 },
  { source: "nexus-core", target: "subsecond-sync-engine", type: "dependency", strength: 0.9 },
  { source: "sparse-circuits-engine", target: "t5gemma-multimodal-bridge", type: "dependency", strength: 0.85 },
  { source: "autofix-pipeline", target: "pocket-alert-system", type: "pipeline", strength: 0.75 },
  { source: "nexus-core", target: "atlas-stream-analytics", type: "dependency", strength: 0.6 },
  { source: "gitbook-docs-matrix", target: "course-001-training", type: "submodule", strength: 0.7 },
  { source: "monorepo-workspace", target: "solar-connect", type: "fork", strength: 0.8 },
  { source: "monorepo-workspace", target: "nexus-core", type: "submodule", strength: 0.8 },
];

export default function GitLabNetworkGraph({
  onSelectProject,
}: {
  onSelectProject?: (proj: GitLabProjectNode) => void;
}) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [projects] = useState<GitLabProjectNode[]>(INITIAL_GITLAB_PROJECTS);
  const [links] = useState<GitLabProjectLink[]>(INITIAL_GITLAB_LINKS);
  const [selectedNode, setSelectedNode] = useState<GitLabProjectNode | null>(INITIAL_GITLAB_PROJECTS[0]);
  const [filterQuery, setFilterQuery] = useState<string>("");
  const [filterGroup, setFilterGroup] = useState<string>("all");
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>("Just now");

  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;

    const width = svgEl.clientWidth || 800;
    const height = svgEl.clientHeight || 520;

    const svg = d3.select(svgEl);
    svg.selectAll("*").remove();

    // Container with Zoom
    const g = svg.append("g");

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.4, 2.5])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);

    // Filter nodes if search query or group filter
    const activeNodes = projects.filter((n) => {
      const matchQuery =
        filterQuery === "" ||
        n.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
        n.description.toLowerCase().includes(filterQuery.toLowerCase());
      const matchGroup =
        filterGroup === "all" ||
        (filterGroup === "group" && n.group.includes("intelligence-dev")) ||
        (filterGroup === "user" && n.group.includes("goodwatch5"));
      return matchQuery && matchGroup;
    });

    const activeNodeIds = new Set(activeNodes.map((n) => n.id));
    const activeLinks = links.filter((l) => {
      const s = typeof l.source === "object" ? (l.source as GitLabProjectNode).id : l.source;
      const t = typeof l.target === "object" ? (l.target as GitLabProjectNode).id : l.target;
      return activeNodeIds.has(s) && activeNodeIds.has(t);
    });

    // Color mapper for activity status per GitBook specifications
    const getNodeColor = (d: GitLabProjectNode) => {
      if (d.isRoot) return "#c5a27d"; // Muted Gold for Solar Connect Root
      if (d.activityStatus === "active") return "#10b981"; // Emerald
      if (d.activityStatus === "recent") return "#3b82f6"; // Blue
      return "#94a3b8"; // Slate for dormant
    };

    // Force simulation
    const simulation = d3
      .forceSimulation<GitLabProjectNode>(activeNodes)
      .force(
        "link",
        d3
          .forceLink<GitLabProjectNode, GitLabProjectLink>(activeLinks)
          .id((d) => d.id)
          .distance((d) => 100 / (d.strength || 0.8))
      )
      .force("charge", d3.forceManyBody().strength(-240))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(45));

    // Render Links
    const link = g
      .append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(activeLinks)
      .enter()
      .append("line")
      .attr("stroke", (d) => {
        if (d.type === "dependency") return "#c5a27d";
        if (d.type === "pipeline") return "#10b981";
        if (d.type === "fork") return "#60a5fa";
        return "#cbd5e1";
      })
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", (d) => (d.type === "dependency" ? 2 : 1.5))
      .attr("stroke-dasharray", (d) => (d.type === "pipeline" ? "4,4" : "none"));

    // Render Nodes Group
    const node = g
      .append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(activeNodes)
      .enter()
      .append("g")
      .attr("cursor", "pointer")
      .on("click", (_event, d) => {
        setSelectedNode(d);
        if (onSelectProject) onSelectProject(d);
      });

    // Outer glow ring
    node
      .append("circle")
      .attr("r", (d) => (d.isRoot ? 28 : 22))
      .attr("fill", "none")
      .attr("stroke", (d) => getNodeColor(d))
      .attr("stroke-width", 1.5)
      .attr("stroke-opacity", 0.4);

    // Main Circle Node
    node
      .append("circle")
      .attr("r", (d) => (d.isRoot ? 22 : 16))
      .attr("fill", "#1a1a1a")
      .attr("stroke", (d) => getNodeColor(d))
      .attr("stroke-width", 2.5);

    // Node text initials or pocket #
    node
      .append("text")
      .text((d) => (d.pocketId ? `P${d.pocketId}` : d.name.slice(0, 3).toUpperCase()))
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("font-family", "monospace")
      .attr("font-size", (d) => (d.isRoot ? "11px" : "9px"))
      .attr("font-weight", "bold")
      .attr("fill", (d) => getNodeColor(d));

    // Label underneath
    node
      .append("text")
      .text((d) => d.name)
      .attr("text-anchor", "middle")
      .attr("dy", (d) => (d.isRoot ? 38 : 30))
      .attr("font-family", "serif")
      .attr("font-size", "11px")
      .attr("fill", "#1a1a1a")
      .attr("font-weight", "600");

    // Drag behavior
    const drag = d3
      .drag<SVGGElement, GitLabProjectNode>()
      .on("start", (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on("drag", (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on("end", (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });

    node.call(drag as any);

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node.attr("transform", (d) => `translate(${d.x},${d.y})`);
    });

    return () => {
      simulation.stop();
    };
  }, [projects, links, filterQuery, filterGroup, onSelectProject]);

  const handleTriggerRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastSyncTime(new Date().toLocaleTimeString());
    }, 700);
  };

  return (
    <div className="space-y-4">
      {/* Control Bar */}
      <div className="bg-white border border-[#1a1a1a]/15 p-3 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-[#1a1a1a] flex items-center justify-center text-[#c5a27d] border border-[#c5a27d]">
            <GitBranch className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-sm text-[#1a1a1a]">
              GitLab Project Network Graph
            </h3>
            <p className="text-[10px] font-mono text-neutral-500">
              Group: <span className="text-[#c5a27d] font-bold">intelligence-dev-for-seventeen-pockets</span> • Fallback: <span className="font-bold">Goodwatch5</span>
            </p>
          </div>
        </div>

        {/* Filters and Refresh */}
        <div className="flex items-center space-x-2">
          {/* Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2" />
            <input
              type="text"
              placeholder="Search repositories..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="pl-8 pr-2 py-1 text-xs font-mono border border-neutral-300 focus:outline-none focus:border-[#c5a27d] w-44"
            />
          </div>

          {/* Group dropdown */}
          <select
            value={filterGroup}
            onChange={(e) => setFilterGroup(e.target.value)}
            className="px-2 py-1 text-xs font-mono border border-neutral-300 bg-white"
          >
            <option value="all">All Sources ({projects.length})</option>
            <option value="group">Group Only</option>
            <option value="user">User: Goodwatch5</option>
          </select>

          {/* Refresh button */}
          <button
            onClick={handleTriggerRefresh}
            disabled={isRefreshing}
            className="flex items-center space-x-1.5 px-3 py-1 bg-[#1a1a1a] text-white hover:bg-[#333] text-xs font-mono border border-[#c5a27d] transition-colors"
          >
            <RefreshCw className={`w-3 h-3 text-[#c5a27d] ${isRefreshing ? "animate-spin" : ""}`} />
            <span>{isRefreshing ? "Polling..." : "Sync CI/CD"}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: D3 Network Canvas + Selected Node Inspection Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* D3 Canvas Column (2 Cols) */}
        <div className="lg:col-span-2 bg-[#FAF7F2] border border-[#1a1a1a]/15 relative overflow-hidden h-[540px] flex flex-col justify-between shadow-xs">
          {/* Top Canvas Legend */}
          <div className="absolute top-2 left-2 z-10 bg-white/90 backdrop-blur-xs border border-neutral-300 px-3 py-1.5 text-[10px] font-mono flex items-center space-x-4 shadow-xs">
            <div className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              <span>Active (&lt;24h)</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
              <span>Recent (&lt;7d)</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#c5a27d] inline-block" />
              <span>Root Hub</span>
            </div>
            <div className="text-neutral-400">| Zoom / Drag Node</div>
          </div>

          <svg ref={svgRef} className="w-full h-full" />

          {/* Bottom Footer Info */}
          <div className="bg-white/80 border-t border-neutral-200 px-3 py-1 text-[9px] font-mono text-neutral-500 flex justify-between">
            <span>D3.js Force Simulation v7 • Continuous Topology Balancing</span>
            <span>Last Polled: {lastSyncTime}</span>
          </div>
        </div>

        {/* Selected Project Inspector Panel (1 Col) */}
        <div className="bg-white border border-[#1a1a1a]/15 p-4 flex flex-col justify-between shadow-xs">
          {selectedNode ? (
            <div className="space-y-4">
              {/* Header */}
              <div className="border-b border-neutral-200 pb-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-neutral-100 text-[#1a1a1a] font-bold border border-neutral-300">
                    {selectedNode.group}
                  </span>
                  <span className="flex items-center space-x-1 text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Pipeline 100% Passed</span>
                  </span>
                </div>
                <h4 className="font-serif font-bold text-base text-[#1a1a1a] mt-2">
                  {selectedNode.name}
                </h4>
                <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                  {selectedNode.description}
                </p>
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="bg-[#FAF7F2] p-2.5 border border-neutral-200">
                  <span className="text-[9px] text-neutral-500 block uppercase">Total Commits</span>
                  <div className="text-sm font-bold text-[#1a1a1a] flex items-center space-x-1 mt-0.5">
                    <Activity className="w-3.5 h-3.5 text-[#c5a27d]" />
                    <span>{selectedNode.commitsCount}</span>
                  </div>
                </div>

                <div className="bg-[#FAF7F2] p-2.5 border border-neutral-200">
                  <span className="text-[9px] text-neutral-500 block uppercase">Stars / Forks</span>
                  <div className="text-sm font-bold text-[#1a1a1a] flex items-center space-x-2 mt-0.5">
                    <span className="flex items-center space-x-0.5">
                      <Star className="w-3 h-3 text-amber-500" />
                      <span>{selectedNode.stars}</span>
                    </span>
                    <span className="flex items-center space-x-0.5">
                      <GitFork className="w-3 h-3 text-blue-500" />
                      <span>{selectedNode.forks}</span>
                    </span>
                  </div>
                </div>

                <div className="bg-[#FAF7F2] p-2.5 border border-neutral-200">
                  <span className="text-[9px] text-neutral-500 block uppercase">Last Activity</span>
                  <div className="text-sm font-bold text-emerald-700 flex items-center space-x-1 mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{selectedNode.lastActivity}</span>
                  </div>
                </div>

                <div className="bg-[#FAF7F2] p-2.5 border border-neutral-200">
                  <span className="text-[9px] text-neutral-500 block uppercase">Primary Stack</span>
                  <div className="text-xs font-bold text-[#1a1a1a] flex items-center space-x-1 mt-0.5 truncate">
                    <FileCode className="w-3.5 h-3.5 text-[#c5a27d]" />
                    <span className="truncate">{selectedNode.language}</span>
                  </div>
                </div>
              </div>

              {/* Connected Relationships */}
              <div className="space-y-1.5 pt-2">
                <span className="text-[10px] font-mono text-neutral-500 uppercase block">
                  Network Linkages
                </span>
                <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                  {links
                    .filter((l) => {
                      const s = typeof l.source === "object" ? (l.source as any).id : l.source;
                      const t = typeof l.target === "object" ? (l.target as any).id : l.target;
                      return s === selectedNode.id || t === selectedNode.id;
                    })
                    .map((l, idx) => {
                      const other =
                        (typeof l.source === "object" ? (l.source as any).id : l.source) === selectedNode.id
                          ? typeof l.target === "object"
                            ? (l.target as any).id
                            : l.target
                          : typeof l.source === "object"
                          ? (l.source as any).id
                          : l.source;
                      return (
                        <div
                          key={idx}
                          className="flex items-center justify-between px-2 py-1 bg-neutral-50 border border-neutral-200 text-[10px] font-mono"
                        >
                          <span className="font-semibold text-[#1a1a1a]">{other}</span>
                          <span className="px-1 py-0.2 bg-white text-[#c5a27d] border border-[#c5a27d]/40 uppercase text-[9px]">
                            {l.type}
                          </span>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-neutral-400 font-mono text-xs">
              Select a repository in the graph to inspect metadata.
            </div>
          )}

          {/* External Action Button */}
          {selectedNode && (
            <div className="pt-4 border-t border-neutral-200 space-y-2">
              <a
                href={selectedNode.url}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center space-x-1.5 py-2 bg-[#1a1a1a] hover:bg-[#333] text-white font-mono text-xs border border-[#c5a27d] transition-colors"
              >
                <span>View on GitLab</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#c5a27d]" />
              </a>
              <p className="text-[9px] font-mono text-neutral-500 text-center">
                Sync script: <code>python fetch_gitlab_data.py</code>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
