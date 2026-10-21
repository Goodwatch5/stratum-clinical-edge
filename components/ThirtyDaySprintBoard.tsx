"use client";

import React, { useState } from "react";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Target,
  Flag,
  Flame,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  FolderGit2,
  ExternalLink,
  Code2,
  CheckSquare,
  Play,
  RotateCcw,
  Sparkles
} from "lucide-react";

interface TaskItem {
  id: string;
  title: string;
  points: number;
  completed: boolean;
  category: "week1" | "week2" | "week3" | "week4";
  assignee: string;
  date: string;
}

const INITIAL_SPRINT_TASKS: TaskItem[] = [
  // Week 1: Central Command Hub (Feb 20-27)
  { id: "w1-1", title: "Build unified status grid (React + WebSocket) for 17 pockets", points: 15, completed: true, category: "week1", assignee: "Odell Anderson", date: "Feb 21" },
  { id: "w1-2", title: "Wire health endpoints from automated-nodejs-api", points: 10, completed: true, category: "week1", assignee: "Dee Gone", date: "Feb 22" },
  { id: "w1-3", title: "Integrate Pocket 10 Sprint Tracker & Pocket 11 Entertainment Engine", points: 20, completed: true, category: "week1", assignee: "Goodwatch5", date: "Feb 23" },
  { id: "w1-4", title: "Demo: Live dashboard URL showing all pocket statuses", points: 25, completed: true, category: "week1", assignee: "Odell Anderson", date: "Feb 27" },

  // Week 2: Unified API Gateway (Feb 27 - Mar 6)
  { id: "w2-1", title: "Build Express gateway with intelligent multi-pocket routing", points: 20, completed: true, category: "week2", assignee: "Dee Gone", date: "Mar 1" },
  { id: "w2-2", title: "Add failover logic (Netlify → Vercel → Fallback)", points: 15, completed: true, category: "week2", assignee: "Goodwatch5", date: "Mar 3" },
  { id: "w2-3", title: "Enforce JWT authentication & rate limiting on /api/gateway", points: 15, completed: false, category: "week2", assignee: "Odell Anderson", date: "Mar 5" },
  { id: "w2-4", title: "Demo: api.seventeen-pockets.com responding sub-100ms", points: 25, completed: false, category: "week2", assignee: "Goodwatch5", date: "Mar 6" },

  // Week 3: Cross-Project Event Bus (Mar 6-13)
  { id: "w3-1", title: "Event broker deployment (Redis Streams / RabbitMQ pub-sub)", points: 20, completed: false, category: "week3", assignee: "Dee Gone", date: "Mar 8" },
  { id: "w3-2", title: "Wire publish/subscribe telemetry from each of 17 projects", points: 25, completed: false, category: "week3", assignee: "Goodwatch5", date: "Mar 10" },
  { id: "w3-3", title: "Event replay & tamper-evident audit trail synchronization", points: 20, completed: false, category: "week3", assignee: "Odell Anderson", date: "Mar 12" },
  { id: "w3-4", title: "Demo: Trigger event in one project, inspect real-time in dashboard", points: 25, completed: false, category: "week3", assignee: "Dee Gone", date: "Mar 13" },

  // Week 4: Investor-Ready Portfolio & Launch (Mar 13-22)
  { id: "w4-1", title: "Live demo environment with guided clinical walkthrough", points: 20, completed: false, category: "week4", assignee: "Odell Anderson", date: "Mar 15" },
  { id: "w4-2", title: "Performance dashboard with verifiable MWh & sub-second latency", points: 15, completed: false, category: "week4", assignee: "Goodwatch5", date: "Mar 17" },
  { id: "w4-3", title: "Executive summary + pitch deck finalized per SPRINT.md spec", points: 20, completed: false, category: "week4", assignee: "Dee Gone", date: "Mar 19" },
  { id: "w4-4", title: "Series A demo: Complete investor presentation with live system", points: 30, completed: false, category: "week4", assignee: "Archon Odell Anderson Jr.", date: "Mar 22" },
];

export default function ThirtyDaySprintBoard() {
  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_SPRINT_TASKS);
  const [activeWeek, setActiveWeek] = useState<"all" | "week1" | "week2" | "week3" | "week4">("all");
  const [showCode, setShowCode] = useState<boolean>(false);

  // Velocity and completion calculation per sprintTracker.js
  const completedTasks = tasks.filter((t) => t.completed);
  const totalTasks = tasks.length;
  const completionRate = ((completedTasks.length / totalTasks) * 100).toFixed(1);
  const velocity = completedTasks.reduce((acc, t) => acc + t.points, 0);
  const totalPoints = tasks.reduce((acc, t) => acc + t.points, 0);

  // Sprint days (30 days total, e.g. Day 12 / 30)
  const sprintDay = 12;
  const daysRemaining = 30 - sprintDay;
  const onTrack = parseFloat(completionRate) >= (100 - (daysRemaining / 30) * 100);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const filteredTasks = activeWeek === "all" ? tasks : tasks.filter((t) => t.category === activeWeek);

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <div className="bg-[#1a1a1a] text-white border-2 border-[#c5a27d] p-6 shadow-md relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-[10px] font-mono tracking-widest text-[#c5a27d] uppercase mb-1">
              <Target className="w-3.5 h-3.5" />
              <span>Epic &amp;1 • Pocket 10 Engine: <code>backend/src/pockets/pocket10/sprintTracker.js</code></span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-white flex items-center gap-2">
              <span>🎯 30-Day Sprint: Unified Ecosystem → Series A Ready</span>
            </h2>
            <p className="text-xs text-neutral-300 max-w-2xl mt-1 font-sans">
              Live executive sprint board from <strong>30_DAY_SPRINT.md</strong> &amp; <strong>SPRINT.md</strong>.
              Owner: <strong>@Goodwatch5 / Dr. Odell Anderson Jr. / Dee Gone</strong>.
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-white/5 border border-white/10 p-3">
            <div className="text-right">
              <div className="text-[10px] font-mono text-neutral-400 uppercase">Velocity</div>
              <div className="text-xl font-bold font-mono text-emerald-400">{velocity} / {totalPoints} pts</div>
            </div>
            <div className="h-8 w-px bg-neutral-700" />
            <div className="text-right">
              <div className="text-[10px] font-mono text-neutral-400 uppercase">Completion</div>
              <div className="text-xl font-bold font-serif text-[#c5a27d]">{completionRate}%</div>
            </div>
            <div className="h-8 w-px bg-neutral-700" />
            <div className="text-right">
              <div className="text-[10px] font-mono text-neutral-400 uppercase">Sprint Timeline</div>
              <div className="text-sm font-bold font-mono text-white">Day {sprintDay}/30</div>
            </div>
          </div>
        </div>

        {/* SPRINT RULES BAR */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 mt-4 pt-4 border-t border-neutral-800 text-[11px] font-mono">
          <div className="p-2 bg-black/40 border border-neutral-700">
            <span className="text-[#c5a27d] font-bold">Rule 1:</span> No new planning issues — this epic is the plan.
          </div>
          <div className="p-2 bg-black/40 border border-neutral-700">
            <span className="text-[#c5a27d] font-bold">Rule 2:</span> Every task has a date — no date = not real.
          </div>
          <div className="p-2 bg-black/40 border border-neutral-700">
            <span className="text-[#c5a27d] font-bold">Rule 3:</span> Work happens in seventeen-pockets.
          </div>
          <div className="p-2 bg-black/40 border border-neutral-700">
            <span className="text-[#c5a27d] font-bold">Rule 4:</span> Demo or it didn&apos;t happen — end with runnable code.
          </div>
        </div>
      </div>

      {/* METRICS & BURNDOWN ROW */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-[#1a1a1a]/15 p-4 shadow-xs space-y-1">
          <div className="text-[10px] font-mono uppercase text-neutral-500">Tasks Completed</div>
          <div className="text-2xl font-serif font-bold text-[#1a1a1a] flex items-baseline gap-2">
            <span>{completedTasks.length}</span>
            <span className="text-xs font-mono text-neutral-400">/ {totalTasks} deliverables</span>
          </div>
          <div className="w-full bg-neutral-100 h-2 mt-2">
            <div className="bg-emerald-600 h-2 transition-all" style={{ width: `${completionRate}%` }} />
          </div>
        </div>

        <div className="bg-white border border-[#1a1a1a]/15 p-4 shadow-xs space-y-1">
          <div className="text-[10px] font-mono uppercase text-neutral-500">Pace Status</div>
          <div className="text-2xl font-serif font-bold text-[#1a1a1a] flex items-center gap-2">
            {onTrack ? (
              <>
                <span className="text-emerald-700">On Track</span>
                <span className="text-xs font-mono px-1.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold">
                  AHEAD
                </span>
              </>
            ) : (
              <>
                <span className="text-amber-700">Pacing Alert</span>
                <span className="text-xs font-mono px-1.5 py-0.5 bg-amber-50 text-amber-800 border border-amber-300 font-bold">
                  ATTENTION
                </span>
              </>
            )}
          </div>
          <p className="text-[10px] text-neutral-500">Calculated by <code>getSprintMetrics().onTrack</code></p>
        </div>

        <div className="bg-white border border-[#1a1a1a]/15 p-4 shadow-xs space-y-1">
          <div className="text-[10px] font-mono uppercase text-neutral-500">Days Remaining</div>
          <div className="text-2xl font-serif font-bold text-[#1a1a1a] flex items-baseline gap-1">
            <span>{daysRemaining}</span>
            <span className="text-xs font-mono text-neutral-500">days left in cycle</span>
          </div>
          <p className="text-[10px] text-neutral-500">Sprint closes at Day 30 (Mar 22, 2026)</p>
        </div>

        <div className="bg-white border border-[#1a1a1a]/15 p-4 shadow-xs space-y-1">
          <div className="text-[10px] font-mono uppercase text-neutral-500">GitLab Branch Baseline</div>
          <div className="text-base font-serif font-bold text-[#1a1a1a] flex items-center gap-1.5 mt-1">
            <FolderGit2 className="w-4 h-4 text-[#c5a27d]" />
            <code className="text-xs font-mono text-purple-700">kingdom-clean</code>
          </div>
          <p className="text-[10px] text-neutral-500">Fallback gate: <code>Cooler98</code></p>
        </div>
      </div>

      {/* FILTER BUTTONS & CODE TOGGLE */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 border border-[#1a1a1a]/15 shadow-xs">
        <div className="flex items-center space-x-2 text-xs font-mono">
          <button
            onClick={() => setActiveWeek("all")}
            className={`px-3 py-1 border transition-colors ${
              activeWeek === "all"
                ? "bg-[#1a1a1a] text-white border-[#1a1a1a] font-bold"
                : "bg-neutral-50 text-neutral-700 hover:bg-neutral-100 border-neutral-300"
            }`}
          >
            All Tasks ({tasks.length})
          </button>
          <button
            onClick={() => setActiveWeek("week1")}
            className={`px-3 py-1 border transition-colors ${
              activeWeek === "week1"
                ? "bg-[#1a1a1a] text-white border-[#1a1a1a] font-bold"
                : "bg-neutral-50 text-neutral-700 hover:bg-neutral-100 border-neutral-300"
            }`}
          >
            Week 1: Command Hub
          </button>
          <button
            onClick={() => setActiveWeek("week2")}
            className={`px-3 py-1 border transition-colors ${
              activeWeek === "week2"
                ? "bg-[#1a1a1a] text-white border-[#1a1a1a] font-bold"
                : "bg-neutral-50 text-neutral-700 hover:bg-neutral-100 border-neutral-300"
            }`}
          >
            Week 2: API Gateway
          </button>
          <button
            onClick={() => setActiveWeek("week3")}
            className={`px-3 py-1 border transition-colors ${
              activeWeek === "week3"
                ? "bg-[#1a1a1a] text-white border-[#1a1a1a] font-bold"
                : "bg-neutral-50 text-neutral-700 hover:bg-neutral-100 border-neutral-300"
            }`}
          >
            Week 3: Event Bus
          </button>
          <button
            onClick={() => setActiveWeek("week4")}
            className={`px-3 py-1 border transition-colors ${
              activeWeek === "week4"
                ? "bg-[#1a1a1a] text-white border-[#1a1a1a] font-bold"
                : "bg-neutral-50 text-neutral-700 hover:bg-neutral-100 border-neutral-300"
            }`}
          >
            Week 4: Series A Launch
          </button>
        </div>

        <button
          onClick={() => setShowCode(!showCode)}
          className="flex items-center space-x-1.5 px-3 py-1 text-xs font-mono text-neutral-700 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 transition-colors"
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>{showCode ? "Hide SprintTracker Code" : "Inspect sprintTracker.js"}</span>
        </button>
      </div>

      {/* CODE VIEW IF EXPANDED */}
      {showCode && (
        <div className="bg-[#0f172a] text-neutral-200 p-4 border border-neutral-700 font-mono text-xs space-y-3">
          <div className="flex items-center justify-between border-b border-neutral-700 pb-2 text-[11px]">
            <span className="text-neutral-400">
              Source file: <code>backend/src/pockets/pocket10/sprintTracker.js</code> (Goodwatch5/seventeen-pockets)
            </span>
            <span className="text-emerald-400 font-bold">AUTHORITATIVE ENGINE</span>
          </div>
          <pre className="overflow-x-auto text-[11px] leading-relaxed text-neutral-300 bg-black/40 p-3 border border-neutral-800">
{`class SprintTracker {
  constructor(sprintDuration = 30) {
    this.sprints = [];
    this.currentSprint = null;
    this.sprintDuration = sprintDuration;
    this.tasks = [];
    this.achievements = [];
  }

  createSprint(name, goals = []) {
    const sprint = {
      id: \`sprint_\${Date.now()}\`,
      name,
      goals,
      startDate: new Date(),
      endDate: new Date(Date.now() + this.sprintDuration * 24 * 60 * 60 * 1000),
      status: 'active',
      tasks: [],
      completedTasks: 0,
      totalTasks: 0,
      velocity: 0,
      burndown: []
    };
    this.sprints.push(sprint);
    this.currentSprint = sprint;
    return sprint;
  }

  completeTask(sprintId, taskId) {
    // updates velocity and records burndown...
  }

  getSprintMetrics(sprintId) {
    const completionRate = (sprint.completedTasks / sprint.totalTasks) * 100;
    const daysRemaining = Math.ceil((sprint.endDate - new Date()) / (24 * 60 * 60 * 1000));
    return {
      completionRate: completionRate.toFixed(2),
      velocity: sprint.velocity,
      daysRemaining,
      onTrack: completionRate >= (100 - (daysRemaining / this.sprintDuration) * 100)
    };
  }
}

module.exports = SprintTracker;`}
          </pre>
        </div>
      )}

      {/* INTERACTIVE TASK TABLE */}
      <div className="bg-white border border-[#1a1a1a]/15 shadow-xs overflow-hidden">
        <div className="p-4 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckSquare className="w-4 h-4 text-[#c5a27d]" />
            <h3 className="font-serif font-bold text-sm text-[#1a1a1a]">
              Sprint Deliverables Checklist (Click to Toggle Completion Status)
            </h3>
          </div>
          <span className="text-[10px] font-mono text-neutral-500">
            Real-Time State Replicated into Velocity Metric
          </span>
        </div>

        <div className="divide-y divide-neutral-100">
          {filteredTasks.map((t) => (
            <div
              key={t.id}
              onClick={() => toggleTask(t.id)}
              className={`p-3.5 flex items-center justify-between gap-4 cursor-pointer transition-colors ${
                t.completed ? "bg-neutral-50/60 hover:bg-neutral-100/60" : "hover:bg-amber-50/40"
              }`}
            >
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={t.completed}
                  onChange={() => {}}
                  className="w-4 h-4 accent-[#c5a27d] cursor-pointer"
                />
                <div>
                  <div className={`text-xs font-serif ${t.completed ? "line-through text-neutral-400" : "font-bold text-[#1a1a1a]"}`}>
                    {t.title}
                  </div>
                  <div className="text-[10px] font-mono text-neutral-500 flex items-center gap-2 mt-0.5">
                    <span>Target Date: {t.date}</span>
                    <span>•</span>
                    <span>Assignee: {t.assignee}</span>
                    <span>•</span>
                    <span className="uppercase text-[#c5a27d] font-bold">{t.category}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 bg-neutral-100 border border-neutral-200 text-neutral-700">
                  +{t.points} pts
                </span>
                <span
                  className={`text-[9px] font-mono px-1.5 py-0.5 border font-bold ${
                    t.completed
                      ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                      : "bg-amber-50 text-amber-800 border-amber-300"
                  }`}
                >
                  {t.completed ? "DONE" : "IN PROGRESS"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PROJECT MAP SECTION FROM SPRINT.MD */}
      <div className="bg-white border border-[#1a1a1a]/15 p-5 shadow-xs space-y-3">
        <h3 className="font-serif font-bold text-sm text-[#1a1a1a] flex items-center gap-2">
          <FolderGit2 className="w-4 h-4 text-[#c5a27d]" />
          <span>Ecosystem Project Map (SPRINT.md Truth Table)</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs font-mono">
          {[
            { name: "seventeen-pockets", role: "Hub / Orchestrator", status: "Active", link: "https://gitlab.com/Goodwatch5/seventeen-pockets" },
            { name: "automated-nodejs-api", role: "Backend Services", status: "Active", link: "https://gitlab.com/Goodwatch5/automated-nodejs-api" },
            { name: "deepagent", role: "AI Analysis Engine", status: "Integrate", link: "https://gitlab.com/intelligence-dev/deepagent" },
            { name: "nextmyteam", role: "Team Coordination", status: "Integrate", link: "https://gitlab.com/intelligence-dev/nextmyteam" },
            { name: "no-fault-function", role: "Error Handling", status: "Done", link: "https://gitlab.com/intelligence-dev/no-fault-function" },
            { name: "Okaywave", role: "Frontend UI", status: "Done", link: "https://gitlab.com/Goodwatch5/Okaywave" },
            { name: "First-eye", role: "CI/CD Gate", status: "Done", link: "https://gitlab.com/Goodwatch5/First-eye" },
            { name: "Rightway", role: "Brand Assets", status: "Integrate", link: "https://gitlab.com/shippedout/17-pockets-left-brand" },
            { name: "Solar Nexus Connect", role: "Solar Integration", status: "Integrate", link: "https://gitlab.com/intelligence-dev/solar-connect" },
          ].map((proj) => (
            <div key={proj.name} className="p-2.5 bg-neutral-50 border border-neutral-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-neutral-900">{proj.name}</span>
                <span className="text-[9px] px-1 py-0.2 bg-emerald-100 text-emerald-800 font-bold">{proj.status}</span>
              </div>
              <div className="text-[10px] text-neutral-500">Role: {proj.role}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
