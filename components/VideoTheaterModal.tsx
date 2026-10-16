"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Radio,
  Clock,
  Sparkles,
  Download,
  Share2,
  Tv,
  Check,
  Film,
  Layers,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

export interface VideoData {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  duration: string; // e.g. "02:18"
  durationSeconds: number;
  resolution: string; // e.g. "4K 60FPS"
  badge: string;
  badgeColor?: string;
  presenter: string;
  pocketId?: number;
  videoType:
    | "keynote"
    | "clinical-telemetry"
    | "hardware-showcase"
    | "spatial-radar"
    | "orbital-globe"
    | "sync-pulse"
    | "entertainment-stream";
  description: string;
  specs: Record<string, string>;
  chapters: { time: string; title: string; seconds: number }[];
}

interface VideoTheaterModalProps {
  video: VideoData | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectVideo?: (video: VideoData) => void;
  playlist?: VideoData[];
}

export default function VideoTheaterModal({
  video,
  isOpen,
  onClose,
  onSelectVideo,
  playlist = [],
}: VideoTheaterModalProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState<"chapters" | "telemetry" | "playlist">("chapters");
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setIsPlaying(false);
      setCurrentTime(0);
      return;
    }
    setIsPlaying(true);
    setCurrentTime(0);
  }, [isOpen, video?.id]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === " ") {
        e.preventDefault();
        setIsPlaying((p) => !p);
      }
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Playback timer ticker
  useEffect(() => {
    if (!isOpen || !isPlaying || !video) return;

    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        const next = prev + 0.1 * playbackSpeed;
        if (next >= video.durationSeconds) {
          return 0; // loop
        }
        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isOpen, isPlaying, video, playbackSpeed]);

  // Canvas visualizer animation loop
  useEffect(() => {
    if (!isOpen || !video) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frame = 0;

    const render = () => {
      frame++;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Render based on videoType
      if (video.videoType === "hardware-showcase") {
        renderHardwareShowcase(ctx, w, h, frame, currentTime);
      } else if (video.videoType === "clinical-telemetry") {
        renderClinicalTelemetry(ctx, w, h, frame, currentTime);
      } else if (video.videoType === "spatial-radar") {
        renderSpatialRadar(ctx, w, h, frame, currentTime);
      } else if (video.videoType === "orbital-globe") {
        renderOrbitalGlobe(ctx, w, h, frame, currentTime);
      } else if (video.videoType === "sync-pulse") {
        renderSyncPulse(ctx, w, h, frame, currentTime);
      } else {
        renderKeynoteStudio(ctx, w, h, frame, currentTime, video.title);
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isOpen, video, currentTime]);

  if (!isOpen || !video) return null;

  const progressPercent = Math.min(100, (currentTime / (video.durationSeconds || 1)) * 100);

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleCopyShare = () => {
    navigator.clipboard.writeText(`${window.location.origin}?previewVideo=${video.id}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-fade-in">
      <div className="bg-[#111216] border-2 border-[#c5a27d] text-white w-full max-w-6xl max-h-[95vh] flex flex-col shadow-2xl rounded-xs overflow-hidden">
        {/* Top Header */}
        <div className="bg-[#1a1a1a] px-4 sm:px-6 py-3 border-b border-[#c5a27d]/30 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono px-2 py-0.5 bg-[#c5a27d]/20 text-[#c5a27d] border border-[#c5a27d]/40 font-bold uppercase">
                  {video.badge}
                </span>
                <span className="text-[10px] font-mono text-neutral-400">
                  {video.resolution} • {video.category}
                </span>
                {video.pocketId && (
                  <span className="text-[10px] font-mono text-purple-300 bg-purple-900/40 px-1.5 py-0.5 border border-purple-800">
                    Pocket #{video.pocketId.toString().padStart(2, "0")}
                  </span>
                )}
              </div>
              <h2 className="text-sm sm:text-base font-serif font-bold text-white tracking-tight mt-0.5">
                {video.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyShare}
              className="px-2.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-xs font-mono text-neutral-200 border border-neutral-700 flex items-center space-x-1.5 transition-colors"
              title="Copy Video Clip Link"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-[#c5a27d]" />}
              <span className="hidden sm:inline">{copiedLink ? "Copied" : "Share"}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 bg-neutral-800 hover:bg-red-900/60 text-neutral-300 hover:text-white border border-neutral-700 transition-colors"
              title="Close Theater Mode (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Cinema Body */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 overflow-hidden bg-black">
          {/* Main Video Viewport (2 cols on lg) */}
          <div className="lg:col-span-2 flex flex-col justify-between relative bg-black border-b lg:border-b-0 lg:border-r border-neutral-800">
            {/* Canvas Video Surface */}
            <div className="relative w-full aspect-video flex-1 bg-radial from-neutral-900 to-black overflow-hidden flex items-center justify-center">
              <canvas
                ref={canvasRef}
                width={854}
                height={480}
                className="w-full h-full object-contain cursor-pointer"
                onClick={() => setIsPlaying(!isPlaying)}
              />

              {/* Watermark badge */}
              <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-xs px-2.5 py-1 border border-neutral-700 text-[10px] font-mono text-neutral-300 flex items-center space-x-2 pointer-events-none">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>STRATUM CLINICAL EDGE • 60 FPS NATIVE RENDER</span>
              </div>

              {/* Presenter tag */}
              <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-xs px-2.5 py-1 border border-neutral-700 text-[10px] font-mono text-[#c5a27d] pointer-events-none">
                PRESENTER: {video.presenter}
              </div>

              {/* Paused Overlay */}
              {!isPlaying && (
                <div
                  onClick={() => setIsPlaying(true)}
                  className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center cursor-pointer group"
                >
                  <div className="w-16 h-16 rounded-full bg-[#c5a27d] text-[#1a1a1a] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 ml-1 fill-current" />
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Video Controls Bar */}
            <div className="bg-[#15161c] border-t border-neutral-800 p-3 space-y-2 select-none">
              {/* Scrubber Timeline */}
              <div
                className="relative h-2 bg-neutral-800 hover:h-3 transition-all cursor-pointer rounded-xs overflow-hidden"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pos = (e.clientX - rect.left) / rect.width;
                  setCurrentTime(pos * video.durationSeconds);
                }}
              >
                <div
                  className="h-full bg-gradient-to-r from-[#c5a27d] to-amber-300 transition-[width] duration-75"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-between text-xs font-mono text-neutral-300">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-1.5 hover:text-white hover:bg-neutral-800 transition-colors"
                    title={isPlaying ? "Pause (Space)" : "Play (Space)"}
                  >
                    {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                  </button>
                  <button
                    onClick={() => setCurrentTime(0)}
                    className="p-1.5 hover:text-white hover:bg-neutral-800 transition-colors"
                    title="Replay from start"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="p-1.5 hover:text-white hover:bg-neutral-800 transition-colors"
                      title={isMuted ? "Unmute" : "Mute"}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-[#c5a27d]" />}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={isMuted ? 0 : volume}
                      onChange={(e) => {
                        setVolume(parseFloat(e.target.value));
                        setIsMuted(false);
                      }}
                      className="w-16 h-1 accent-[#c5a27d] bg-neutral-700 cursor-pointer"
                    />
                  </div>

                  <span className="text-[11px] text-neutral-400 font-mono">
                    <span className="text-white font-bold">{formatSeconds(currentTime)}</span> / {video.duration}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  {/* Speed Selector */}
                  <div className="flex items-center space-x-1 bg-neutral-800/80 p-0.5 rounded-xs border border-neutral-700 text-[10px]">
                    {[1, 1.25, 1.5, 2].map((speed) => (
                      <button
                        key={speed}
                        onClick={() => setPlaybackSpeed(speed)}
                        className={`px-1.5 py-0.5 rounded-xs transition-colors ${
                          playbackSpeed === speed
                            ? "bg-[#c5a27d] text-[#1a1a1a] font-bold"
                            : "text-neutral-400 hover:text-white"
                        }`}
                      >
                        {speed}x
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      if (!document.fullscreenElement) {
                        canvasRef.current?.requestFullscreen?.();
                      } else {
                        document.exitFullscreen?.();
                      }
                    }}
                    className="p-1.5 hover:text-white hover:bg-neutral-800 transition-colors"
                    title="Fullscreen"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Info & Drawer Panel */}
          <div className="bg-[#14151b] flex flex-col justify-between overflow-y-auto">
            {/* Drawer Tabs */}
            <div className="border-b border-neutral-800 flex items-center bg-[#1a1b22] text-xs font-mono">
              <button
                onClick={() => setActiveTab("chapters")}
                className={`flex-1 py-2.5 px-3 border-b-2 text-center transition-colors ${
                  activeTab === "chapters"
                    ? "border-[#c5a27d] text-[#c5a27d] font-bold bg-[#14151b]"
                    : "border-transparent text-neutral-400 hover:text-neutral-200"
                }`}
              >
                Chapters ({video.chapters.length})
              </button>
              <button
                onClick={() => setActiveTab("telemetry")}
                className={`flex-1 py-2.5 px-3 border-b-2 text-center transition-colors ${
                  activeTab === "telemetry"
                    ? "border-[#c5a27d] text-[#c5a27d] font-bold bg-[#14151b]"
                    : "border-transparent text-neutral-400 hover:text-neutral-200"
                }`}
              >
                Telemetry Specs
              </button>
              {playlist.length > 0 && (
                <button
                  onClick={() => setActiveTab("playlist")}
                  className={`flex-1 py-2.5 px-3 border-b-2 text-center transition-colors ${
                    activeTab === "playlist"
                      ? "border-[#c5a27d] text-[#c5a27d] font-bold bg-[#14151b]"
                      : "border-transparent text-neutral-400 hover:text-neutral-200"
                  }`}
                >
                  Playlist ({playlist.length})
                </button>
              )}
            </div>

            {/* Drawer Content */}
            <div className="p-4 space-y-4 flex-1 overflow-y-auto">
              {/* Description */}
              <div className="space-y-1 text-xs">
                <div className="text-[10px] font-mono text-[#c5a27d] uppercase tracking-wider font-bold">
                  OVERVIEW
                </div>
                <p className="text-neutral-300 leading-relaxed font-sans text-xs">
                  {video.description}
                </p>
              </div>

              {/* Chapters List */}
              {activeTab === "chapters" && (
                <div className="space-y-2">
                  <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                    TIMECODE CHAPTERS
                  </div>
                  <div className="space-y-1.5 font-mono text-xs">
                    {video.chapters.map((ch, idx) => {
                      const isActive =
                        currentTime >= ch.seconds &&
                        (idx === video.chapters.length - 1 ||
                          currentTime < video.chapters[idx + 1].seconds);
                      return (
                        <button
                          key={ch.title}
                          onClick={() => setCurrentTime(ch.seconds)}
                          className={`w-full p-2 flex items-center justify-between text-left border rounded-xs transition-colors ${
                            isActive
                              ? "bg-[#c5a27d]/20 border-[#c5a27d] text-white font-bold"
                              : "bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200"
                          }`}
                        >
                          <div className="flex items-center space-x-2 truncate">
                            <span className="text-[10px] text-[#c5a27d]">{ch.time}</span>
                            <span className="truncate">{ch.title}</span>
                          </div>
                          {isActive && <ChevronRight className="w-3.5 h-3.5 text-[#c5a27d] shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Telemetry Specs */}
              {activeTab === "telemetry" && (
                <div className="space-y-3">
                  <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                    STREAM ENGINE SPECS
                  </div>
                  <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                    {Object.entries(video.specs).map(([key, val]) => (
                      <div key={key} className="bg-neutral-900/80 border border-neutral-800 p-2 space-y-0.5">
                        <div className="text-[9px] text-neutral-500 uppercase">{key}</div>
                        <div className="font-bold text-white text-[11px] truncate">{val}</div>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 bg-neutral-900/90 border border-[#c5a27d]/30 font-mono text-[10px] text-neutral-300 space-y-1">
                    <div className="flex items-center justify-between text-[#c5a27d] font-bold">
                      <span>DECENTRALIZED NODE BUFFER</span>
                      <span>ACTIVE</span>
                    </div>
                    <p className="text-neutral-400 leading-normal">
                      Video stream delivered via sovereign Pocket 11 (Entertainment & Media Engine) edge replication relay with zero centralized cloud telemetry egress.
                    </p>
                  </div>
                </div>
              )}

              {/* Playlist */}
              {activeTab === "playlist" && playlist.length > 0 && (
                <div className="space-y-2">
                  <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                    AVAILABLE VIDEO STREAMS
                  </div>
                  <div className="space-y-2 font-mono text-xs">
                    {playlist.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          if (onSelectVideo) onSelectVideo(item);
                        }}
                        className={`w-full p-2.5 flex items-start space-x-2.5 text-left border rounded-xs transition-colors ${
                          item.id === video.id
                            ? "bg-[#c5a27d]/20 border-[#c5a27d] text-white"
                            : "bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:bg-neutral-800 hover:text-white"
                        }`}
                      >
                        <div className="w-12 h-8 bg-black border border-neutral-700 flex items-center justify-center shrink-0 text-[8px] text-[#c5a27d]">
                          {item.resolution.split(" ")[0]}
                        </div>
                        <div className="truncate flex-1">
                          <div className="font-bold text-white truncate text-[11px]">{item.title}</div>
                          <div className="text-[9px] text-neutral-500 flex items-center justify-between mt-0.5">
                            <span>{item.presenter}</span>
                            <span>{item.duration}</span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Citation & Lead Developer attribution */}
            <div className="p-3 border-t border-neutral-800 bg-[#101116] text-[10px] font-mono text-neutral-400 flex items-center justify-between">
              <span>Stratum Clinical Edge • Safe Seventeen-Pockets</span>
              <span className="text-[#c5a27d]">Dr. Odell Anderson Jr. / Dee Gone</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Procedural visualizers
function renderHardwareShowcase(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  frame: number,
  currentTime: number
) {
  // Background grid
  ctx.fillStyle = "#0c0d12";
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = "rgba(197, 162, 125, 0.08)";
  ctx.lineWidth = 1;
  const gridSize = 30;
  for (let x = 0; x < w; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = 0; y < h; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  // Draw 3D Isometric Rugged Tablet
  const cx = w / 2;
  const cy = h / 2 - 20;
  const angle = (frame * 0.015) % (Math.PI * 2);
  const rotW = 220 + Math.sin(angle) * 20;
  const rotH = 140;

  // Tablet outer casing (deep slate)
  ctx.save();
  ctx.translate(cx, cy);

  // Tablet shadow
  ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
  ctx.beginPath();
  ctx.ellipse(0, rotH / 2 + 50, rotW / 2 + 30, 25, 0, 0, Math.PI * 2);
  ctx.fill();

  // Tablet border
  ctx.fillStyle = "#1e2029";
  ctx.strokeStyle = "#c5a27d";
  ctx.lineWidth = 3;
  ctx.strokeRect(-rotW / 2, -rotH / 2, rotW, rotH);
  ctx.fillRect(-rotW / 2, -rotH / 2, rotW, rotH);

  // Rugged bumper corners
  ctx.fillStyle = "#c5a27d";
  const bSize = 10;
  ctx.fillRect(-rotW / 2 - 2, -rotH / 2 - 2, bSize, bSize);
  ctx.fillRect(rotW / 2 - bSize + 2, -rotH / 2 - 2, bSize, bSize);
  ctx.fillRect(-rotW / 2 - 2, rotH / 2 - bSize + 2, bSize, bSize);
  ctx.fillRect(rotW / 2 - bSize + 2, rotH / 2 - bSize + 2, bSize, bSize);

  // Screen area
  const sw = rotW - 24;
  const sh = rotH - 24;
  ctx.fillStyle = "#050811";
  ctx.fillRect(-sw / 2, -sh / 2, sw, sh);

  // Telemetry graph on screen
  ctx.strokeStyle = "#10b981";
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i < sw; i += 4) {
    const freq = 0.06;
    const wave = Math.sin((i + frame * 3) * freq) * 15;
    const spike = i % 40 === 0 ? -25 : 0;
    const yVal = wave + spike;
    if (i === 0) ctx.moveTo(-sw / 2 + i, yVal);
    else ctx.lineTo(-sw / 2 + i, yVal);
  }
  ctx.stroke();

  // Screen HUD text
  ctx.fillStyle = "#FAF7F2";
  ctx.font = "bold 9px monospace";
  ctx.fillText("STRATUM CLINICAL EDGE • POCKET 01", -sw / 2 + 8, -sh / 2 + 16);
  ctx.fillStyle = "#c5a27d";
  ctx.fillText("OFFLINE VAULT: ENCRYPTED (AES-GCM)", -sw / 2 + 8, sh / 2 - 8);

  ctx.restore();

  // Laser scan line sweep
  const scanY = (frame * 3) % h;
  ctx.strokeStyle = "rgba(197, 162, 125, 0.4)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, scanY);
  ctx.lineTo(w, scanY);
  ctx.stroke();

  // Bottom info banner
  ctx.fillStyle = "rgba(10, 10, 14, 0.85)";
  ctx.fillRect(20, h - 55, w - 40, 38);
  ctx.strokeStyle = "#c5a27d";
  ctx.lineWidth = 1;
  ctx.strokeRect(20, h - 55, w - 40, 38);

  ctx.fillStyle = "#FAF7F2";
  ctx.font = "bold 11px monospace";
  ctx.fillText("TACTILE CLINICAL HARDWARE SUITE • SEVENTEEN POCKETS BRAND INC.", 35, h - 35);
  ctx.fillStyle = "#10b981";
  ctx.font = "9px monospace";
  ctx.fillText("● ARCHIVAL LEATHER FOLIO • PATIENT CARE CARD NFC CHIP • OFFLINE EDGE BUFFER", 35, h - 22);
}

function renderClinicalTelemetry(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  frame: number,
  currentTime: number
) {
  // Hospital bedside telemetry look
  ctx.fillStyle = "#030712";
  ctx.fillRect(0, 0, w, h);

  // Sector scan for ultrasound on left half
  const uX = w * 0.28;
  const uY = h * 0.45;
  const radius = h * 0.38;

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(uX, uY);
  ctx.arc(uX, uY, radius, -Math.PI * 0.25, Math.PI * 0.25);
  ctx.closePath();
  ctx.clip();

  // Sector noise / speckle
  ctx.fillStyle = "#091426";
  ctx.fillRect(0, 0, w * 0.55, h);

  // Doppler color flow
  const grad = ctx.createRadialGradient(uX + 30, uY + 40, 10, uX + 40, uY + 40, 60);
  grad.addColorStop(0, "rgba(239, 68, 68, 0.7)");
  grad.addColorStop(0.5, "rgba(59, 130, 246, 0.7)");
  grad.addColorStop(1, "transparent");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.ellipse(uX + 40 + Math.sin(frame * 0.1) * 8, uY + 40, 45, 30, frame * 0.05, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();

  // Sector boundary lines
  ctx.strokeStyle = "#38bdf8";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(uX, uY);
  ctx.arc(uX, uY, radius, -Math.PI * 0.25, Math.PI * 0.25);
  ctx.closePath();
  ctx.stroke();

  // Right half: Cardiac waveforms
  const rightX = w * 0.58;
  const rightW = w * 0.38;

  // ECG Lead II (Green)
  ctx.strokeStyle = "#22c55e";
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let x = 0; x < rightW; x += 3) {
    const sweep = (x + frame * 4) % rightW;
    const isQRS = sweep > 60 && sweep < 75;
    const yVal = h * 0.25 + (isQRS ? (sweep === 67 ? -45 : 15) : Math.sin(sweep * 0.1) * 6);
    if (x === 0) ctx.moveTo(rightX + x, yVal);
    else ctx.lineTo(rightX + x, yVal);
  }
  ctx.stroke();

  // Pleth (Cyan)
  ctx.strokeStyle = "#06b6d4";
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let x = 0; x < rightW; x += 3) {
    const sweep = (x + frame * 3.5) % rightW;
    const yVal = h * 0.55 + Math.sin(sweep * 0.08) * 18 * (Math.sin(sweep * 0.02) + 1.2);
    if (x === 0) ctx.moveTo(rightX + x, yVal);
    else ctx.lineTo(rightX + x, yVal);
  }
  ctx.stroke();

  // Numeric HUD displays
  ctx.fillStyle = "#22c55e";
  ctx.font = "bold 24px monospace";
  ctx.fillText("HR: 74", rightX, h * 0.18);
  ctx.font = "10px monospace";
  ctx.fillText("BPM • NORMAL SINUS", rightX + 100, h * 0.18);

  ctx.fillStyle = "#06b6d4";
  ctx.font = "bold 24px monospace";
  ctx.fillText("SpO2: 98%", rightX, h * 0.48);
  ctx.font = "10px monospace";
  ctx.fillText("PLETH • PERFUSION 1.8", rightX + 130, h * 0.48);

  ctx.fillStyle = "#f59e0b";
  ctx.font = "bold 24px monospace";
  ctx.fillText("NIBP: 118/76", rightX, h * 0.78);
  ctx.font = "10px monospace";
  ctx.fillText("MAP (90) • mmHg", rightX + 160, h * 0.78);
}

function renderSpatialRadar(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  frame: number,
  currentTime: number
) {
  // Aerial satellite radar sweep
  ctx.fillStyle = "#07110e";
  ctx.fillRect(0, 0, w, h);

  const cx = w / 2;
  const cy = h / 2;
  const maxR = Math.min(w, h) * 0.45;

  // Concentric radar rings
  ctx.strokeStyle = "rgba(34, 197, 94, 0.25)";
  ctx.lineWidth = 1;
  [0.25, 0.5, 0.75, 1].forEach((factor) => {
    ctx.beginPath();
    ctx.arc(cx, cy, maxR * factor, 0, Math.PI * 2);
    ctx.stroke();
  });

  // Crosshairs
  ctx.beginPath();
  ctx.moveTo(cx - maxR, cy);
  ctx.lineTo(cx + maxR, cy);
  ctx.moveTo(cx, cy - maxR);
  ctx.lineTo(cx, cy + maxR);
  ctx.stroke();

  // Sweeping beam
  const angle = (frame * 0.04) % (Math.PI * 2);
  const grad = ctx.createConicGradient(angle, cx, cy);
  grad.addColorStop(0, "rgba(34, 197, 94, 0.4)");
  grad.addColorStop(0.15, "rgba(34, 197, 94, 0.05)");
  grad.addColorStop(0.2, "transparent");
  grad.addColorStop(1, "transparent");

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(cx, cy, maxR, 0, Math.PI * 2);
  ctx.fill();

  // Target Blips (ABCD Mobile clinics / enclaves)
  const blips = [
    { r: 0.35, th: 0.8, label: "CLINIC-ALPHA" },
    { r: 0.65, th: 2.3, label: "ENCLAVE-02" },
    { r: 0.82, th: 4.1, label: "DRONE-DISPATCH" },
    { r: 0.48, th: 5.4, label: "POCKET-08 RADAR" },
  ];

  blips.forEach((b) => {
    const bx = cx + Math.cos(b.th) * maxR * b.r;
    const by = cy + Math.sin(b.th) * maxR * b.r;

    ctx.fillStyle = "#22c55e";
    ctx.beginPath();
    ctx.arc(bx, by, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#86efac";
    ctx.beginPath();
    ctx.arc(bx, by, 7 + Math.sin(frame * 0.1) * 3, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = "#86efac";
    ctx.font = "bold 9px monospace";
    ctx.fillText(b.label, bx + 10, by + 3);
  });

  // Compass markings
  ctx.fillStyle = "#c5a27d";
  ctx.font = "bold 11px monospace";
  ctx.fillText("N (000°)", cx - 22, cy - maxR - 10);
  ctx.fillText("S (180°)", cx - 22, cy + maxR + 18);
  ctx.fillText("E (090°)", cx + maxR + 8, cy + 4);
  ctx.fillText("W (270°)", cx - maxR - 65, cy + 4);
}

function renderOrbitalGlobe(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  frame: number,
  currentTime: number
) {
  ctx.fillStyle = "#05070f";
  ctx.fillRect(0, 0, w, h);

  const cx = w / 2;
  const cy = h / 2;
  const radius = Math.min(w, h) * 0.36;

  // Starfield
  ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
  for (let i = 0; i < 40; i++) {
    const sx = (i * 123) % w;
    const sy = (i * 321) % h;
    ctx.fillRect(sx, sy, 1.5, 1.5);
  }

  // Globe sphere
  ctx.strokeStyle = "rgba(197, 162, 125, 0.4)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.stroke();

  // Longitude and latitude lines
  const rot = (frame * 0.01) % Math.PI;
  for (let i = -3; i <= 3; i++) {
    const latY = cy + (i * radius) / 4;
    const rAtLat = Math.sqrt(Math.max(0, radius * radius - (latY - cy) * (latY - cy)));
    ctx.beginPath();
    ctx.ellipse(cx, latY, rAtLat, rAtLat * 0.3, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Orbiting satellite ring with 20 nodes
  const satCount = 20;
  for (let i = 0; i < satCount; i++) {
    const angle = (i * ((Math.PI * 2) / satCount) + frame * 0.02) % (Math.PI * 2);
    const sx = cx + Math.cos(angle) * (radius + 35);
    const sy = cy + Math.sin(angle) * ((radius + 35) * 0.4);

    const isBehind = Math.sin(angle) < 0;
    ctx.fillStyle = isBehind ? "#6b7280" : "#c5a27d";
    ctx.beginPath();
    ctx.arc(sx, sy, isBehind ? 2 : 4, 0, Math.PI * 2);
    ctx.fill();

    // Data pulses
    if (i % 3 === 0 && !isBehind) {
      ctx.strokeStyle = "rgba(245, 158, 11, 0.6)";
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(cx, cy);
      ctx.stroke();
    }
  }

  // Center node
  ctx.fillStyle = "#c5a27d";
  ctx.font = "bold 11px monospace";
  ctx.fillText("SOLAR NEXUS 20-POCKET MESH", cx - 90, h - 25);
}

function renderSyncPulse(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  frame: number,
  currentTime: number
) {
  ctx.fillStyle = "#0a0715";
  ctx.fillRect(0, 0, w, h);

  const lines = 8;
  for (let l = 0; l < lines; l++) {
    const y = (h / (lines + 1)) * (l + 1);

    ctx.strokeStyle = "rgba(168, 85, 247, 0.2)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(40, y);
    ctx.lineTo(w - 40, y);
    ctx.stroke();

    // Fast moving packets
    for (let p = 0; p < 4; p++) {
      const px = ((frame * (6 + l * 1.5) + p * 180) % (w - 80)) + 40;
      ctx.fillStyle = l % 2 === 0 ? "#a855f7" : "#ec4899";
      ctx.beginPath();
      ctx.arc(px, y, 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Light trail
      const grad = ctx.createLinearGradient(px - 25, y, px, y);
      grad.addColorStop(0, "transparent");
      grad.addColorStop(1, l % 2 === 0 ? "rgba(168, 85, 247, 0.5)" : "rgba(236, 72, 153, 0.5)");
      ctx.strokeStyle = grad;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(px - 25, y);
      ctx.lineTo(px, y);
      ctx.stroke();
    }
  }

  // Telemetry stamp
  ctx.fillStyle = "#c084fc";
  ctx.font = "bold 12px monospace";
  ctx.fillText("POCKET 04: SUB-SECOND SYNC ENGINE (LATENCY: 0.08ms)", 40, 35);
  ctx.fillStyle = "#a855f7";
  ctx.font = "10px monospace";
  ctx.fillText("TRANSMISSION VECTOR: FIBER OPTIC LOCAL MESH • ZERO CLOUD DROP", 40, 52);
}

function renderKeynoteStudio(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  frame: number,
  currentTime: number,
  title: string
) {
  // Dark studio stage with spotlight
  ctx.fillStyle = "#0c0a14";
  ctx.fillRect(0, 0, w, h);

  // Spotlight cone
  const spotGrad = ctx.createRadialGradient(w / 2, 80, 20, w / 2, h / 2, h * 0.7);
  spotGrad.addColorStop(0, "rgba(197, 162, 125, 0.35)");
  spotGrad.addColorStop(0.7, "rgba(76, 29, 149, 0.1)");
  spotGrad.addColorStop(1, "transparent");
  ctx.fillStyle = spotGrad;
  ctx.fillRect(0, 0, w, h);

  // Podium silhouette & presenter
  const cx = w / 2;
  const cy = h * 0.65;

  ctx.fillStyle = "#1e1b2e";
  ctx.fillRect(cx - 30, cy, 60, h - cy - 40);
  ctx.strokeStyle = "#c5a27d";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(cx - 30, cy, 60, h - cy - 40);

  // Presenter silhouette
  ctx.fillStyle = "#2d2a45";
  ctx.beginPath();
  ctx.arc(cx, cy - 35, 14, 0, Math.PI * 2); // head
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(cx, cy - 8, 24, 20, 0, 0, Math.PI * 2); // shoulders
  ctx.fill();

  // Slide projection screen behind presenter
  ctx.fillStyle = "rgba(13, 10, 26, 0.9)";
  ctx.fillRect(cx - 190, cy - 140, 380, 90);
  ctx.strokeStyle = "#7c3aed";
  ctx.lineWidth = 1;
  ctx.strokeRect(cx - 190, cy - 140, 380, 90);

  ctx.fillStyle = "#FAF7F2";
  ctx.font = "bold 13px serif";
  ctx.textAlign = "center";
  ctx.fillText(title, cx, cy - 95);

  ctx.fillStyle = "#c5a27d";
  ctx.font = "10px monospace";
  ctx.fillText("KEYNOTE: DR. ODELL ANDERSON JR. & DEE GONE", cx, cy - 75);
  ctx.textAlign = "start";

  // Audio Equalizer Spectrum bars at bottom
  const barCount = 42;
  const barWidth = 6;
  const barSpacing = 4;
  const eqStartX = (w - barCount * (barWidth + barSpacing)) / 2;

  for (let i = 0; i < barCount; i++) {
    const freq = Math.sin(frame * 0.15 + i * 0.3) * 0.5 + 0.5;
    const barHeight = Math.max(4, freq * 35);
    const bx = eqStartX + i * (barWidth + barSpacing);
    const by = h - 55 - barHeight;

    const barGrad = ctx.createLinearGradient(bx, by, bx, by + barHeight);
    barGrad.addColorStop(0, "#c5a27d");
    barGrad.addColorStop(1, "#7c3aed");

    ctx.fillStyle = barGrad;
    ctx.fillRect(bx, by, barWidth, barHeight);
  }
}
