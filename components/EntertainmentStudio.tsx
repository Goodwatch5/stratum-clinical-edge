"use client";

import React, { useState } from "react";
import {
  Trophy,
  Sparkles,
  Zap,
  Flame,
  Award,
  Crown,
  Play,
  Tv,
  Film,
  Music,
  Share2,
  Gamepad2,
  CheckCircle2,
  TrendingUp,
  Users,
  Star,
  Layers,
  ExternalLink,
  Code2,
  Maximize2,
  ChevronRight,
} from "lucide-react";
import VideoHoverCard from "./VideoHoverCard";
import VideoTheaterModal, { VideoData } from "./VideoTheaterModal";
import { ECOSYSTEM_VIDEOS, ALL_PLAYLIST_VIDEOS } from "@/lib/videoRegistry";

interface Achievement {
  id: string;
  userId: string;
  type: string;
  timestamp: string;
  points: number;
  badge: string;
  metadata?: Record<string, any>;
}

interface LeaderboardEntry {
  rank: number;
  userId: string;
  handle: string;
  totalPoints: number;
  level: number;
  badges: string[];
  streak: number;
}

export default function EntertainmentStudio() {
  const [activeSubTab, setActiveSubTab] = useState<"platform" | "engine" | "challenges" | "code">("platform");

  // State simulating Pocket 11: EntertainmentEngine
  const [playerPoints, setPlayerPoints] = useState<number>(385);
  const [currentStreak, setCurrentStreak] = useState<number>(6);
  const [longestStreak, setLongestStreak] = useState<number>(14);
  const [achievements, setAchievements] = useState<Achievement[]>([
    { id: "ach-1", userId: "odell_anderson", type: "taskCompletion", timestamp: "10m ago", points: 10, badge: "Task Master", metadata: { task: "Synchronize Pocket 11" } },
    { id: "ach-2", userId: "odell_anderson", type: "sprintCompletion", timestamp: "2h ago", points: 50, badge: "Sprint Champion", metadata: { sprint: "Week 1 Kickoff" } },
    { id: "ach-3", userId: "odell_anderson", type: "weeklyStreak", timestamp: "Yesterday", points: 25, badge: "On Fire", metadata: { days: 6 } },
    { id: "ach-4", userId: "dee_gone", type: "collaboration", timestamp: "3h ago", points: 15, badge: "Team Player", metadata: { partner: "Goodwatch5" } },
  ]);

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([
    { rank: 1, userId: "odell_anderson", handle: "Archon Odell Anderson Jr.", totalPoints: 580, level: 6, badges: ["Sprint Champion", "Task Master", "Legend"], streak: 8 },
    { rank: 2, userId: "dee_gone", handle: "Dee Gone (Lead Architect)", totalPoints: 460, level: 5, badges: ["Team Player", "On Fire"], streak: 6 },
    { rank: 3, userId: "goodwatch5", handle: "@Goodwatch5 (GitLab Cadre)", totalPoints: 385, level: 4, badges: ["Task Master", "On Fire"], streak: 6 },
    { rank: 4, userId: "stratum_clinical", handle: "Stratum Care Cadre Node", totalPoints: 240, level: 3, badges: ["Perfect Day"], streak: 4 },
  ]);

  const [activeChallenge, setActiveChallenge] = useState<{
    id: string;
    name: string;
    points: number;
    duration: string;
    difficulty: "easy" | "medium" | "hard";
    status: "active" | "completed";
  }>({
    id: "ch-101",
    name: "Sub-Second Telemetry Broadcast",
    points: 25,
    duration: "1 day",
    difficulty: "medium",
    status: "active",
  });

  const [broadcastState, setBroadcastState] = useState<"idle" | "streaming" | "rendering">("idle");
  const [liveStreamTitle, setLiveStreamTitle] = useState<string>("Clinical Cadre Keynote: Sovereign Edge & 20-Pocket Mesh");
  const [selectedCinemaVideo, setSelectedCinemaVideo] = useState<VideoData | null>(null);
  const [showCinemaModal, setShowCinemaModal] = useState<boolean>(false);

  const playerLevel = Math.floor(playerPoints / 100) + 1;

  // Actions from entertainmentEngine.js
  const handleCompleteChallenge = () => {
    const pointsGained = activeChallenge.points;
    const newPoints = playerPoints + pointsGained;
    setPlayerPoints(newPoints);
    setActiveChallenge((prev) => ({ ...prev, status: "completed" }));

    const newAch: Achievement = {
      id: `ach_${Date.now()}`,
      userId: "goodwatch5",
      type: "taskCompletion",
      timestamp: "Just now",
      points: pointsGained,
      badge: "Challenge Victor",
      metadata: { challenge: activeChallenge.name }
    };
    setAchievements((prev) => [newAch, ...prev]);

    // Update leaderboard
    setLeaderboard((prev) =>
      prev.map((e) =>
        e.userId === "goodwatch5" ? { ...e, totalPoints: e.totalPoints + pointsGained } : e
      ).sort((a, b) => b.totalPoints - a.totalPoints).map((e, idx) => ({ ...e, rank: idx + 1 }))
    );
  };

  const handleTriggerLiveBroadcast = () => {
    setBroadcastState("streaming");
    setTimeout(() => {
      setBroadcastState("idle");
    }, 4000);
  };

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <div className="bg-[#10081e] text-white border-2 border-[#7c3aed]/40 p-6 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-64 h-64 bg-radial from-[#7c3aed]/30 to-transparent rounded-full pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-[10px] font-mono tracking-widest text-[#a78bfa] uppercase mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[#c5a27d]" />
              <span>Pocket 11 • GitLab Source Engine: <code>backend/src/pockets/pocket11/entertainmentEngine.js</code></span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-white flex items-center gap-2">
              <span>Entertainment &amp; Creator Platform</span>
              <span className="text-xs font-mono font-normal px-2 py-0.5 bg-[#7c3aed]/30 border border-[#7c3aed] text-[#c4b5fd]">
                LIVE POCKET 11
              </span>
            </h2>
            <p className="text-xs text-neutral-300 max-w-2xl mt-1 font-sans">
              AI-powered creator entertainment suite, live gamification engine, and interactive broadcast studio designed by
              <strong> Odell Anderson Jr. / Dee Gone / @Goodwatch5</strong>.
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-black/40 border border-[#7c3aed]/40 p-3">
            <div className="text-right">
              <div className="text-[10px] font-mono text-[#a78bfa] uppercase">Player Level</div>
              <div className="text-xl font-bold font-serif text-[#c5a27d]">Lvl {playerLevel}</div>
            </div>
            <div className="h-8 w-px bg-neutral-700" />
            <div className="text-right">
              <div className="text-[10px] font-mono text-[#a78bfa] uppercase">Total Points</div>
              <div className="text-xl font-bold font-mono text-emerald-400">{playerPoints} XP</div>
            </div>
            <div className="h-8 w-px bg-neutral-700" />
            <div className="flex items-center space-x-1 text-amber-400">
              <Flame className="w-5 h-5 fill-amber-400 text-amber-500 animate-bounce" />
              <div className="font-mono text-base font-bold">{currentStreak}d</div>
            </div>
          </div>
        </div>

        {/* SUB NAVIGATION TABS */}
        <div className="flex items-center space-x-2 mt-5 border-t border-[#7c3aed]/30 pt-3 text-xs font-mono">
          <button
            onClick={() => setActiveSubTab("platform")}
            className={`px-3 py-1.5 flex items-center space-x-1.5 border transition-colors ${
              activeSubTab === "platform"
                ? "bg-[#7c3aed] text-white border-[#a78bfa] font-bold"
                : "bg-black/30 text-neutral-300 border-neutral-700 hover:bg-neutral-800"
            }`}
          >
            <Tv className="w-3.5 h-3.5" />
            <span>Creator Platform UI</span>
          </button>
          <button
            onClick={() => setActiveSubTab("engine")}
            className={`px-3 py-1.5 flex items-center space-x-1.5 border transition-colors ${
              activeSubTab === "engine"
                ? "bg-[#7c3aed] text-white border-[#a78bfa] font-bold"
                : "bg-black/30 text-neutral-300 border-neutral-700 hover:bg-neutral-800"
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Gamification &amp; Leaderboard</span>
          </button>
          <button
            onClick={() => setActiveSubTab("challenges")}
            className={`px-3 py-1.5 flex items-center space-x-1.5 border transition-colors ${
              activeSubTab === "challenges"
                ? "bg-[#7c3aed] text-white border-[#a78bfa] font-bold"
                : "bg-black/30 text-neutral-300 border-neutral-700 hover:bg-neutral-800"
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>Active Quests &amp; Streaks</span>
          </button>
          <button
            onClick={() => setActiveSubTab("code")}
            className={`px-3 py-1.5 flex items-center space-x-1.5 border transition-colors ${
              activeSubTab === "code"
                ? "bg-[#7c3aed] text-white border-[#a78bfa] font-bold"
                : "bg-black/30 text-neutral-300 border-neutral-700 hover:bg-neutral-800"
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>GitLab Backend Code</span>
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: CREATOR PLATFORM UI (FROM frontend/src/pages/Entertainment.jsx) */}
      {activeSubTab === "platform" && (
        <div className="space-y-6">
          {/* Creator Broadcast Console */}
          <div className="bg-white border border-[#1a1a1a]/15 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <div className="flex items-center space-x-2">
                <Film className="w-5 h-5 text-[#7c3aed]" />
                <h3 className="font-serif font-bold text-base text-[#1a1a1a]">
                  Creator Broadcast &amp; Media Studio (Interactive)
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-purple-50 text-purple-700 border border-purple-200 font-bold">
                ENTERTAINMENT POCKET 11
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Virtual Stage Player */}
              <div className="lg:col-span-2 bg-[#0a0514] border border-[#4c1d95] p-4 text-white relative rounded-xs">
                <div className="aspect-video bg-black/70 border border-purple-900/60 relative flex flex-col justify-between p-4 overflow-hidden">
                  <div className="flex items-center justify-between z-10">
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-red-600/90 text-white font-bold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                      LIVE TRANSMISSION
                    </span>
                    <span className="text-[10px] font-mono text-neutral-400">
                      1080p60 • Spatial Audio • RTMP/HLS
                    </span>
                  </div>

                  <div className="text-center my-auto z-10 py-6">
                    <Tv className="w-12 h-12 text-[#a78bfa] mx-auto mb-2 opacity-80" />
                    <h4 className="font-serif text-lg font-bold text-white max-w-md mx-auto">
                      {liveStreamTitle}
                    </h4>
                    <p className="text-xs text-neutral-400 mt-1">
                      Hosted by Dr. Odell Anderson Jr. &amp; Dee Gone on the Seventeen Pockets Media Grid
                    </p>
                  </div>

                  <div className="flex items-center justify-between z-10 pt-2 border-t border-purple-900/40 text-[10px] font-mono text-neutral-400">
                    <div className="flex items-center space-x-3">
                      <span>👁️ 1,420 Viewers</span>
                      <span>⚡ 42.5 MWh Flow</span>
                      <VideoHoverCard
                        video={ECOSYSTEM_VIDEOS["keynote-sovereign-ai"]}
                        onExpand={(vid) => {
                          setSelectedCinemaVideo(vid);
                          setShowCinemaModal(true);
                        }}
                        position="top"
                      >
                        <span className="text-[#a78bfa] underline cursor-pointer hover:text-white flex items-center gap-1">
                          <span>🛰️ 17 Edge Relays</span>
                          <span className="text-[8px] bg-purple-900 px-1 text-purple-200">📹 Preview</span>
                        </span>
                      </VideoHoverCard>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedCinemaVideo(ECOSYSTEM_VIDEOS["keynote-sovereign-ai"]);
                          setShowCinemaModal(true);
                        }}
                        className="px-2.5 py-1 bg-neutral-800 hover:bg-[#c5a27d] hover:text-[#1a1a1a] text-[#c5a27d] font-mono text-[10px] font-bold uppercase transition-colors flex items-center gap-1 border border-neutral-700"
                        title="Watch Keynote in 4K Cinema Mode"
                      >
                        <Maximize2 className="w-3 h-3" />
                        <span>Watch 4K Cinema</span>
                      </button>
                      <button
                        onClick={handleTriggerLiveBroadcast}
                        className="px-3 py-1 bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-mono text-[10px] font-bold uppercase transition-colors"
                      >
                        {broadcastState === "streaming" ? "Transmitting Stream..." : "Broadcast Keyframe"}
                      </button>
                    </div>
                  </div>

                  {/* Ambient backdrop glow */}
                  <div className="absolute inset-0 bg-radial from-purple-900/20 via-transparent to-black pointer-events-none" />
                </div>

                <div className="mt-3 flex items-center justify-between text-xs">
                  <div className="text-neutral-400 text-[11px]">
                    Channel: <span className="text-purple-300 font-mono">odell-anderson/entertainment-pocket</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono text-neutral-400">Audio Codec: OPUS 128k</span>
                  </div>
                </div>
              </div>

              {/* Creator Controls & AI Tools */}
              <div className="space-y-3">
                <div className="bg-[#FAF7F2] border border-[#1a1a1a]/15 p-3.5 space-y-3">
                  <h4 className="font-serif font-bold text-xs text-[#1a1a1a] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#c5a27d]" />
                    AI Creator Studio Suite
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div>
                      <label className="text-[10px] font-mono uppercase text-neutral-500">Keynote Topic / Broadcast</label>
                      <input
                        type="text"
                        value={liveStreamTitle}
                        onChange={(e) => setLiveStreamTitle(e.target.value)}
                        className="w-full mt-1 px-2.5 py-1 text-xs font-mono border border-neutral-300 bg-white focus:outline-none focus:border-[#7c3aed]"
                      />
                    </div>
                    <div className="p-2.5 bg-white border border-neutral-200 text-[11px] text-neutral-600 space-y-1">
                      <div className="font-bold text-[#1a1a1a] flex items-center justify-between">
                        <span>DeepAgent Content Engine</span>
                        <span className="text-[9px] font-mono text-emerald-700 bg-emerald-50 px-1 border border-emerald-200">READY</span>
                      </div>
                      <p>Automatically synthesizes sprint notes, clinical summaries, and architectural logs into ready-to-air creator clips.</p>
                    </div>
                    <button
                      onClick={() => {
                        const newTitle = "Sovereign AI: Why 17 Edge Pockets Outperform Monolithic Clouds";
                        setLiveStreamTitle(newTitle);
                      }}
                      className="w-full py-1.5 bg-[#1a1a1a] hover:bg-neutral-800 text-white font-mono text-[10px] uppercase font-bold transition-colors"
                    >
                      Generate AI Creator Hook
                    </button>
                  </div>
                </div>

                {/* Monetization / Revenue Snapshot */}
                <div className="bg-white border border-[#1a1a1a]/15 p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase text-neutral-500">Creator Revenue &amp; Vault</span>
                    <span className="text-[9px] font-mono text-emerald-600 font-bold">$12,480.00 ARR</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-center text-xs">
                    <div className="bg-neutral-50 border border-neutral-200 p-2">
                      <div className="text-[10px] text-neutral-500">Subscribers</div>
                      <div className="font-bold font-mono text-neutral-900">3,490</div>
                    </div>
                    <div className="bg-neutral-50 border border-neutral-200 p-2">
                      <div className="text-[10px] text-neutral-500">Direct Sponsorship</div>
                      <div className="font-bold font-mono text-[#c5a27d]">$4,200</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Pillars Grid (Direct from GitLab Entertainment.jsx) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                title: "Creator API",
                desc: "Authentication and creator management backend living in automated-nodejs-api.",
                icon: Code2,
                color: "text-purple-600",
                badge: "REST / JWT"
              },
              {
                title: "Creator Dashboard",
                desc: "Full-featured creator-facing UI with telemetry and media encoding tools.",
                icon: Tv,
                color: "text-blue-600",
                badge: "REACT 19"
              },
              {
                title: "AI Tools",
                desc: "DeepAgent-powered content intelligence for script writing and clinical edicts.",
                icon: Sparkles,
                color: "text-amber-600",
                badge: "DEEPAGENT"
              },
              {
                title: "Monetization",
                desc: "Built-in creator revenue infrastructure, patron pledges, and token micro-grants.",
                icon: Trophy,
                color: "text-emerald-600",
                badge: "STRIPE / VAULT"
              },
            ].map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="bg-white border border-[#1a1a1a]/15 p-4 space-y-2 hover:border-[#7c3aed] transition-colors shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className={`p-2 bg-neutral-50 border border-neutral-200 ${pillar.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[9px] font-mono text-neutral-500 bg-neutral-100 px-1.5 py-0.5 border border-neutral-200">
                      {pillar.badge}
                    </span>
                  </div>
                  <h4 className="font-serif font-bold text-sm text-[#1a1a1a]">{pillar.title}</h4>
                  <p className="text-xs text-neutral-600 leading-relaxed">{pillar.desc}</p>
                </div>
              );
            })}
          </div>

          {/* VIDEO DISPLAY OVER HOVERCARDS: DECENTRALIZED VIDEO LIBRARY & PREVIEWS */}
          <div className="bg-white border border-[#1a1a1a]/15 p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-neutral-200 gap-2">
              <div className="flex items-center space-x-2">
                <Film className="w-5 h-5 text-[#7c3aed]" />
                <div>
                  <h4 className="font-serif font-bold text-base text-[#1a1a1a]">
                    Pocket 11 Video Library &amp; Hovercard Previews
                  </h4>
                  <p className="text-xs text-neutral-500">
                    Hover over any video card for instant animated video preview, scrubbing &amp; audio telemetry.
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 shrink-0">
                <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  HOVER TO PREVIEW
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-purple-50 text-purple-700 border border-purple-200 font-bold">
                  {ALL_PLAYLIST_VIDEOS.length} 4K FEEDS
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ALL_PLAYLIST_VIDEOS.map((vid) => (
                <VideoHoverCard
                  key={vid.id}
                  video={vid}
                  onExpand={(v) => {
                    setSelectedCinemaVideo(v);
                    setShowCinemaModal(true);
                  }}
                  position="auto"
                  align="center"
                  cardWidth={350}
                >
                  <div
                    onClick={() => {
                      setSelectedCinemaVideo(vid);
                      setShowCinemaModal(true);
                    }}
                    className="p-3.5 bg-[#FAF7F2] border border-[#1a1a1a]/15 hover:border-[#7c3aed] transition-all cursor-pointer rounded-xs space-y-2 group shadow-2xs hover:shadow-md"
                  >
                    {/* Simulated Thumbnail Header */}
                    <div className="relative aspect-video bg-[#0d0f17] border border-neutral-300 overflow-hidden flex items-center justify-center rounded-xs">
                      {/* Ambient Grid */}
                      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#7c3aed_1px,transparent_1px)] [background-size:12px_12px]" />

                      <div className="text-center z-10 p-3">
                        <div className="w-10 h-10 rounded-full bg-black/60 border border-[#c5a27d] text-[#c5a27d] flex items-center justify-center mx-auto mb-1.5 group-hover:scale-110 group-hover:bg-[#c5a27d] group-hover:text-[#1a1a1a] transition-all">
                          <Play className="w-5 h-5 ml-0.5 fill-current" />
                        </div>
                        <span className="text-[9px] font-mono text-neutral-300 block">
                          Hover for Live Video Preview
                        </span>
                      </div>

                      {/* Top Badges */}
                      <div className="absolute top-2 left-2 flex items-center space-x-1 z-10">
                        <span className="text-[8px] font-mono px-1.5 py-0.5 bg-black/80 text-[#c5a27d] border border-[#c5a27d]/60 font-bold">
                          {vid.badge}
                        </span>
                      </div>

                      <div className="absolute bottom-2 right-2 bg-black/85 text-[8px] font-mono text-neutral-300 px-1.5 py-0.5 border border-neutral-700 z-10">
                        {vid.duration}
                      </div>
                    </div>

                    {/* Metadata & Title */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[9px] font-mono text-neutral-500">
                        <span className="text-[#7c3aed] font-bold">{vid.category}</span>
                        <span>{vid.resolution}</span>
                      </div>
                      <h5 className="font-serif font-bold text-xs text-[#1a1a1a] group-hover:text-[#7c3aed] transition-colors line-clamp-1">
                        {vid.title}
                      </h5>
                      <p className="text-[11px] text-neutral-600 line-clamp-2 leading-relaxed">
                        {vid.description}
                      </p>
                    </div>

                    {/* Action Bar */}
                    <div className="pt-2 border-t border-neutral-200 flex items-center justify-between text-[10px] font-mono text-neutral-500">
                      <span className="truncate max-w-[170px]">{vid.presenter}</span>
                      <span className="text-[#c5a27d] font-bold group-hover:underline flex items-center gap-0.5 shrink-0">
                        <span>Preview / Play</span>
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </VideoHoverCard>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: GAMIFICATION & LEADERBOARD (FROM pocket11/entertainmentEngine.js) */}
      {activeSubTab === "engine" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Global Leaderboard */}
          <div className="lg:col-span-2 bg-white border border-[#1a1a1a]/15 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <div className="flex items-center space-x-2">
                <Crown className="w-5 h-5 text-amber-500" />
                <h3 className="font-serif font-bold text-base text-[#1a1a1a]">
                  Seventeen Pockets Global Leaderboard
                </h3>
              </div>
              <span className="text-[10px] font-mono text-neutral-500">
                Rule Engine: <code>getLeaderboard(10)</code>
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50 text-[10px] uppercase text-neutral-500">
                    <th className="p-2.5">Rank</th>
                    <th className="p-2.5">Contributor / Node</th>
                    <th className="p-2.5">Level</th>
                    <th className="p-2.5">Streak</th>
                    <th className="p-2.5">Badges</th>
                    <th className="p-2.5 text-right">Points (XP)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {leaderboard.map((entry) => (
                    <tr
                      key={entry.userId}
                      className={`hover:bg-neutral-50 ${entry.userId === "goodwatch5" ? "bg-amber-50/60 font-bold" : ""}`}
                    >
                      <td className="p-2.5">
                        {entry.rank === 1 ? (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-400 text-[#1a1a1a] font-bold text-[10px]">
                            1
                          </span>
                        ) : entry.rank === 2 ? (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-neutral-300 text-[#1a1a1a] font-bold text-[10px]">
                            2
                          </span>
                        ) : entry.rank === 3 ? (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-700 text-white font-bold text-[10px]">
                            3
                          </span>
                        ) : (
                          <span className="text-neutral-400 px-1.5">#{entry.rank}</span>
                        )}
                      </td>
                      <td className="p-2.5 text-neutral-900 font-serif">
                        <div className="font-bold">{entry.handle}</div>
                        <div className="text-[10px] font-mono text-neutral-400">@{entry.userId}</div>
                      </td>
                      <td className="p-2.5 font-bold text-neutral-700">Lvl {entry.level}</td>
                      <td className="p-2.5 text-amber-600 font-bold flex items-center gap-1 mt-2">
                        <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <span>{entry.streak}d</span>
                      </td>
                      <td className="p-2.5">
                        <div className="flex flex-wrap gap-1">
                          {entry.badges.map((b) => (
                            <span
                              key={b}
                              className="text-[9px] bg-neutral-100 border border-neutral-300 px-1 py-0.5 text-neutral-700"
                            >
                              {b}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-2.5 text-right font-bold text-emerald-700">
                        {entry.totalPoints} XP
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Gamification Rulebook & Recent Achievements */}
          <div className="space-y-4">
            <div className="bg-white border border-[#1a1a1a]/15 p-4 space-y-3 shadow-xs">
              <h4 className="font-serif font-bold text-xs text-[#1a1a1a] flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#7c3aed]" />
                Gamification Rules Matrix
              </h4>
              <p className="text-[11px] text-neutral-500">
                Extracted verbatim from <code>entertainmentEngine.js#initializeRules</code>:
              </p>
              <div className="space-y-1.5 text-xs font-mono">
                {[
                  { action: "Task Completion", points: "+10 XP", badge: "Task Master" },
                  { action: "Sprint Completion", points: "+50 XP", badge: "Sprint Champion" },
                  { action: "Weekly Streak", points: "+25 XP", badge: "On Fire" },
                  { action: "Monthly Goal", points: "+100 XP", badge: "Legend" },
                  { action: "Perfect Day", points: "+30 XP", badge: "Perfect Day" },
                  { action: "Collaboration", points: "+15 XP", badge: "Team Player" },
                ].map((rule) => (
                  <div
                    key={rule.action}
                    className="flex items-center justify-between p-2 bg-neutral-50 border border-neutral-200 text-[11px]"
                  >
                    <div>
                      <span className="font-bold text-neutral-900">{rule.action}</span>
                      <span className="text-[10px] text-[#7c3aed] ml-2">[{rule.badge}]</span>
                    </div>
                    <span className="font-bold text-emerald-700">{rule.points}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Achievement Stream */}
            <div className="bg-[#FAF7F2] border border-[#1a1a1a]/15 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-neutral-500">Live Achievement Stream</span>
                <span className="text-[9px] font-mono text-emerald-600 font-bold">ONLINE</span>
              </div>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {achievements.map((ach) => (
                  <div key={ach.id} className="p-2 bg-white border border-neutral-200 text-[11px] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-neutral-900 flex items-center gap-1">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                        {ach.badge}
                      </span>
                      <span className="text-[10px] font-mono text-emerald-600 font-bold">+{ach.points} XP</span>
                    </div>
                    <div className="text-[10px] text-neutral-500 flex justify-between">
                      <span>@{ach.userId}</span>
                      <span>{ach.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: ACTIVE QUESTS & CHALLENGES (FROM entertainmentEngine.js#generateChallenge) */}
      {activeSubTab === "challenges" && (
        <div className="space-y-4">
          <div className="bg-white border border-[#1a1a1a]/15 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <div className="flex items-center space-x-2">
                <Gamepad2 className="w-5 h-5 text-[#c5a27d]" />
                <h3 className="font-serif font-bold text-base text-[#1a1a1a]">
                  Dynamic Challenges &amp; Quest Generation
                </h3>
              </div>
              <span className="text-[10px] font-mono text-neutral-500">
                Engine Method: <code>generateChallenge(&apos;medium&apos;)</code>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Quick Win Challenge */}
              <div className="bg-[#FAF7F2] border border-neutral-300 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono px-1.5 py-0.5 bg-blue-100 text-blue-800 font-bold">
                    EASY QUEST
                  </span>
                  <span className="text-[11px] font-mono text-emerald-700 font-bold">+10 XP</span>
                </div>
                <h4 className="font-serif font-bold text-sm text-[#1a1a1a]">Quick Win: Verify Pulse</h4>
                <p className="text-xs text-neutral-600">
                  Verify sub-second response across Pocket 04 (Sub-Second Sync Engine) on local mesh.
                </p>
                <div className="text-[10px] font-mono text-neutral-500">Duration: 1 hour</div>
                <button
                  onClick={() => {
                    const newAch: Achievement = {
                      id: `ach_${Date.now()}`,
                      userId: "goodwatch5",
                      type: "taskCompletion",
                      timestamp: "Just now",
                      points: 10,
                      badge: "Task Master",
                      metadata: { quest: "Quick Win" }
                    };
                    setAchievements((prev) => [newAch, ...prev]);
                    setPlayerPoints((p) => p + 10);
                  }}
                  className="w-full py-1.5 bg-[#1a1a1a] hover:bg-neutral-800 text-white font-mono text-[10px] uppercase font-bold"
                >
                  Claim +10 XP
                </button>
              </div>

              {/* Daily Grind Challenge */}
              <div className="bg-white border-2 border-[#7c3aed] p-4 space-y-3 relative shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono px-1.5 py-0.5 bg-purple-100 text-purple-800 font-bold">
                    ACTIVE DAILY GRIND
                  </span>
                  <span className="text-[11px] font-mono text-emerald-700 font-bold">+{activeChallenge.points} XP</span>
                </div>
                <h4 className="font-serif font-bold text-sm text-[#1a1a1a]">{activeChallenge.name}</h4>
                <p className="text-xs text-neutral-600">
                  Broadcast live telemetry feed through the Entertainment creator pocket to all 17 nodes.
                </p>
                <div className="text-[10px] font-mono text-neutral-500">Duration: {activeChallenge.duration}</div>
                {activeChallenge.status === "active" ? (
                  <button
                    onClick={handleCompleteChallenge}
                    className="w-full py-1.5 bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-mono text-[10px] uppercase font-bold"
                  >
                    Complete Quest &amp; Claim +25 XP
                  </button>
                ) : (
                  <div className="p-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-center text-xs font-mono font-bold">
                    ✓ Quest Completed! XP Awarded.
                  </div>
                )}
              </div>

              {/* Epic Quest Challenge */}
              <div className="bg-[#FAF7F2] border border-neutral-300 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono px-1.5 py-0.5 bg-amber-100 text-amber-800 font-bold">
                    EPIC QUEST
                  </span>
                  <span className="text-[11px] font-mono text-emerald-700 font-bold">+50 XP</span>
                </div>
                <h4 className="font-serif font-bold text-sm text-[#1a1a1a]">Epic Quest: 30-Day Sprint Milestone</h4>
                <p className="text-xs text-neutral-600">
                  Deliver Week 1 Central Command Hub with live WebSocket status grid across 17 pockets.
                </p>
                <div className="text-[10px] font-mono text-neutral-500">Duration: 1 week</div>
                <button
                  onClick={() => {
                    const newAch: Achievement = {
                      id: `ach_${Date.now()}`,
                      userId: "goodwatch5",
                      type: "sprintCompletion",
                      timestamp: "Just now",
                      points: 50,
                      badge: "Sprint Champion",
                      metadata: { quest: "Epic Quest" }
                    };
                    setAchievements((prev) => [newAch, ...prev]);
                    setPlayerPoints((p) => p + 50);
                  }}
                  className="w-full py-1.5 bg-[#1a1a1a] hover:bg-neutral-800 text-white font-mono text-[10px] uppercase font-bold"
                >
                  Claim Sprint Champion (+50 XP)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: RAW GITLAB ENGINE CODE VIEW */}
      {activeSubTab === "code" && (
        <div className="bg-[#0f172a] text-neutral-200 p-4 border border-neutral-700 font-mono text-xs space-y-3">
          <div className="flex items-center justify-between border-b border-neutral-700 pb-2 text-[11px]">
            <span className="text-neutral-400">
              Source file: <code>backend/src/pockets/pocket11/entertainmentEngine.js</code> (Goodwatch5/seventeen-pockets)
            </span>
            <span className="text-emerald-400 font-bold">RAW AUTHORITATIVE CODE</span>
          </div>
          <pre className="overflow-x-auto text-[11px] leading-relaxed text-neutral-300 bg-black/40 p-3 border border-neutral-800">
{`class EntertainmentEngine {
  constructor() {
    this.achievements = [];
    this.badges = [];
    this.leaderboard = [];
    this.streaks = {};
    this.gamificationRules = this.initializeRules();
  }

  initializeRules() {
    return {
      taskCompletion: { points: 10, badge: 'Task Master' },
      sprintCompletion: { points: 50, badge: 'Sprint Champion' },
      weeklyStreak: { points: 25, badge: 'On Fire' },
      monthlyGoal: { points: 100, badge: 'Legend' },
      perfectDay: { points: 30, badge: 'Perfect Day' },
      collaboration: { points: 15, badge: 'Team Player' }
    };
  }

  recordAchievement(userId, type, metadata = {}) {
    const achievement = {
      id: \`ach_\${Date.now()}\`,
      userId,
      type,
      timestamp: new Date(),
      points: this.gamificationRules[type]?.points || 0,
      badge: this.gamificationRules[type]?.badge || null,
      metadata
    };
    this.achievements.push(achievement);
    this.updateLeaderboard(userId, achievement.points);
    return achievement;
  }

  updateLeaderboard(userId, points) {
    let entry = this.leaderboard.find(e => e.userId === userId);
    if (!entry) {
      entry = { userId, totalPoints: 0, rank: 0, badges: [] };
      this.leaderboard.push(entry);
    }
    entry.totalPoints += points;
    this.leaderboard.sort((a, b) => b.totalPoints - a.totalPoints);
    this.leaderboard.forEach((e, i) => e.rank = i + 1);
  }

  trackStreak(userId, activity) {
    if (!this.streaks[userId]) {
      this.streaks[userId] = { current: 0, longest: 0, lastDate: null };
    }
    // calculates consecutive days...
  }

  generateChallenge(difficulty = 'medium') {
    const challenges = {
      easy: { name: 'Quick Win', points: 10, duration: '1 hour' },
      medium: { name: 'Daily Grind', points: 25, duration: '1 day' },
      hard: { name: 'Epic Quest', points: 50, duration: '1 week' }
    };
    return {
      id: \`challenge_\${Date.now()}\`,
      ...challenges[difficulty],
      createdAt: new Date()
    };
  }
}

module.exports = EntertainmentEngine;`}
          </pre>
        </div>
      )}

      {/* 4K CINEMA THEATER MODAL */}
      <VideoTheaterModal
        video={selectedCinemaVideo}
        isOpen={showCinemaModal}
        onClose={() => setShowCinemaModal(false)}
        playlist={ALL_PLAYLIST_VIDEOS}
        onSelectVideo={(v) => setSelectedCinemaVideo(v)}
      />
    </div>
  );
}
