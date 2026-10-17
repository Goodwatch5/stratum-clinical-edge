"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Film,
  Sparkles,
  Layers,
  ChevronRight,
  Tv,
} from "lucide-react";
import { VideoData } from "./VideoTheaterModal";

export interface VideoHoverCardProps {
  children: React.ReactNode;
  video: VideoData;
  onExpand?: (video: VideoData) => void;
  position?: "top" | "bottom" | "left" | "right" | "auto";
  align?: "start" | "center" | "end";
  cardWidth?: number; // default 340
  disabled?: boolean;
}

export default function VideoHoverCard({
  children,
  video,
  onExpand,
  position = "auto",
  align = "center",
  cardWidth = 340,
  disabled = false,
}: VideoHoverCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [computedPos, setComputedPos] = useState<"top" | "bottom" | "left" | "right">("bottom");
  const [cardCoords, setCardCoords] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  const triggerRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const enterTimerRef = useRef<NodeJS.Timeout | null>(null);
  const leaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Position calculation
  const updatePosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const estimatedHeight = 270;

    let targetSide = position;
    if (position === "auto") {
      // Default to top if bottom has no room, or bottom if room
      const spaceBelow = vh - rect.bottom;
      const spaceAbove = rect.top;
      targetSide = spaceBelow >= estimatedHeight ? "bottom" : spaceAbove >= estimatedHeight ? "top" : "bottom";
    }

    let top = 0;
    let left = 0;

    if (targetSide === "bottom") {
      top = rect.bottom + 8;
      if (align === "start") left = rect.left;
      else if (align === "end") left = rect.right - cardWidth;
      else left = rect.left + rect.width / 2 - cardWidth / 2;
    } else if (targetSide === "top") {
      top = rect.top - estimatedHeight - 8;
      if (align === "start") left = rect.left;
      else if (align === "end") left = rect.right - cardWidth;
      else left = rect.left + rect.width / 2 - cardWidth / 2;
    } else if (targetSide === "right") {
      left = rect.right + 8;
      top = rect.top + rect.height / 2 - estimatedHeight / 2;
    } else {
      left = rect.left - cardWidth - 8;
      top = rect.top + rect.height / 2 - estimatedHeight / 2;
    }

    // Keep within viewport boundaries
    left = Math.max(12, Math.min(vw - cardWidth - 12, left));
    top = Math.max(12, Math.min(vh - estimatedHeight - 12, top));

    setCardCoords({ top, left });
    setComputedPos(targetSide as "top" | "bottom" | "left" | "right");
  };

  const handleMouseEnter = () => {
    if (disabled) return;
    if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
    enterTimerRef.current = setTimeout(() => {
      updatePosition();
      setIsOpen(true);
      setIsPlaying(true);
    }, 120);
  };

  const handleMouseLeave = () => {
    if (disabled) return;
    if (enterTimerRef.current) clearTimeout(enterTimerRef.current);
    leaveTimerRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 220);
  };

  // Video ticker
  useEffect(() => {
    if (!isOpen || !isPlaying) return;
    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        const next = prev + 0.15;
        if (next >= video.durationSeconds) return 0;
        return next;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [isOpen, isPlaying, video.durationSeconds]);

  // Canvas visualizer loop
  useEffect(() => {
    if (!isOpen) return;
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

      if (video.videoType === "hardware-showcase") {
        renderMiniHardware(ctx, w, h, frame);
      } else if (video.videoType === "clinical-telemetry") {
        renderMiniTelemetry(ctx, w, h, frame);
      } else if (video.videoType === "spatial-radar") {
        renderMiniRadar(ctx, w, h, frame);
      } else if (video.videoType === "orbital-globe") {
        renderMiniGlobe(ctx, w, h, frame);
      } else if (video.videoType === "sync-pulse") {
        renderMiniSyncPulse(ctx, w, h, frame);
      } else {
        renderMiniKeynote(ctx, w, h, frame, video.title);
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isOpen, video.videoType, video.title]);

  const progressPercent = Math.min(100, (currentTime / (video.durationSeconds || 1)) * 100);
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <>
      {/* Trigger element */}
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="inline-block relative cursor-pointer"
      >
        {children}
      </div>

      {/* Floating HoverCard Overlay */}
      {isOpen && (
        <div
          ref={cardRef}
          onMouseEnter={() => {
            if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
          }}
          onMouseLeave={handleMouseLeave}
          style={{
            position: "fixed",
            top: `${cardCoords.top}px`,
            left: `${cardCoords.left}px`,
            width: `${cardWidth}px`,
            zIndex: 9999,
          }}
          className="bg-[#111216] border-2 border-[#c5a27d] text-white shadow-2xl rounded-xs overflow-hidden animate-in fade-in zoom-in-95 duration-150 select-none"
        >
          {/* Header Bar */}
          <div className="bg-[#1a1b22] px-3 py-1.5 border-b border-[#c5a27d]/40 flex items-center justify-between">
            <div className="flex items-center space-x-1.5 truncate">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
              <span className="text-[9px] font-mono font-bold text-[#c5a27d] uppercase tracking-wider truncate">
                {video.badge}
              </span>
              <span className="text-[9px] font-mono text-neutral-400">• {video.resolution}</span>
            </div>
            <span className="text-[9px] font-mono text-neutral-400">{video.duration}</span>
          </div>

          {/* Video Preview Surface */}
          <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden group">
            <canvas
              ref={canvasRef}
              width={480}
              height={270}
              className="w-full h-full object-cover"
              onClick={() => setIsPlaying(!isPlaying)}
            />

            {/* Live watermark badge */}
            <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-xs px-1.5 py-0.5 border border-neutral-700 text-[8px] font-mono text-neutral-300 flex items-center space-x-1 pointer-events-none">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>PREVIEW STREAM</span>
            </div>

            {/* Quick Play/Pause overlay button */}
            <div className="absolute inset-0 bg-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <div className="w-9 h-9 rounded-full bg-black/70 border border-[#c5a27d] text-[#c5a27d] flex items-center justify-center shadow-md">
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 ml-0.5 fill-current" />}
              </div>
            </div>

            {/* Expand / Theater Mode button */}
            {onExpand && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onExpand(video);
                }}
                className="absolute top-2 right-2 p-1 bg-black/80 hover:bg-[#c5a27d] hover:text-[#1a1a1a] text-[#c5a27d] border border-[#c5a27d]/60 rounded-xs transition-colors"
                title="Expand in Theater Mode"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Timecode overlay */}
            <div className="absolute bottom-2 right-2 bg-black/80 px-1.5 py-0.5 text-[8px] font-mono text-neutral-300 border border-neutral-800 pointer-events-none">
              {formatTime(currentTime)} / {video.duration}
            </div>
          </div>

          {/* Interactive Scrubbing Bar */}
          <div
            className="h-1.5 bg-neutral-800 hover:h-2.5 transition-all cursor-pointer relative"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const pos = (e.clientX - rect.left) / rect.width;
              setCurrentTime(pos * video.durationSeconds);
            }}
          >
            <div
              className="h-full bg-gradient-to-r from-[#c5a27d] to-amber-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Metadata & Controls Footer */}
          <div className="p-2.5 bg-[#14151b] space-y-1.5 text-xs">
            <div className="flex items-start justify-between gap-2">
              <div className="truncate">
                <h4 className="font-serif font-bold text-xs text-white truncate leading-tight">
                  {video.title}
                </h4>
                <div className="text-[10px] font-mono text-neutral-400 truncate">
                  {video.subtitle}
                </div>
              </div>
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-1 text-neutral-400 hover:text-white shrink-0"
                title={isMuted ? "Unmute preview" : "Mute preview"}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5 text-neutral-500" /> : <Volume2 className="w-3.5 h-3.5 text-[#c5a27d]" />}
              </button>
            </div>

            {/* Quick Specs Chips */}
            <div className="flex flex-wrap items-center gap-1 text-[8px] font-mono text-neutral-400 pt-0.5 border-t border-neutral-800">
              <span className="bg-neutral-900 px-1.5 py-0.5 border border-neutral-800 text-neutral-300">
                {video.specs["Codec"] || "H.265 / HEVC"}
              </span>
              <span className="bg-neutral-900 px-1.5 py-0.5 border border-neutral-800 text-neutral-300">
                {video.specs["Bitrate"] || "18 Mbps"}
              </span>
              <span className="bg-neutral-900 px-1.5 py-0.5 border border-neutral-800 text-emerald-400">
                LIVE BUFFER
              </span>
            </div>

            {/* Action Buttons */}
            {onExpand && (
              <button
                onClick={() => onExpand(video)}
                className="w-full py-1.5 bg-[#c5a27d] hover:bg-white text-[#1a1a1a] text-[10px] font-mono font-bold uppercase tracking-wider flex items-center justify-center space-x-1 transition-all mt-1"
              >
                <span>Launch Cinema Player</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}

// Mini Canvas Visualizers for HoverCards
function renderMiniHardware(ctx: CanvasRenderingContext2D, w: number, h: number, frame: number) {
  ctx.fillStyle = "#0c0d12";
  ctx.fillRect(0, 0, w, h);

  const cx = w / 2;
  const cy = h / 2;
  const rw = 140;
  const rh = 88;

  // Tablet frame
  ctx.fillStyle = "#1e2029";
  ctx.strokeStyle = "#c5a27d";
  ctx.lineWidth = 2;
  ctx.strokeRect(cx - rw / 2, cy - rh / 2, rw, rh);
  ctx.fillRect(cx - rw / 2, cy - rh / 2, rw, rh);

  // Screen
  const sw = rw - 14;
  const sh = rh - 14;
  ctx.fillStyle = "#050811";
  ctx.fillRect(cx - sw / 2, cy - sh / 2, sw, sh);

  // Oscilloscope wave
  ctx.strokeStyle = "#10b981";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (let i = 0; i < sw; i += 3) {
    const wave = Math.sin((i + frame * 3) * 0.1) * 8;
    const spike = i % 25 === 0 ? -14 : 0;
    const yVal = cy + wave + spike;
    if (i === 0) ctx.moveTo(cx - sw / 2 + i, yVal);
    else ctx.lineTo(cx - sw / 2 + i, yVal);
  }
  ctx.stroke();

  // Scanline
  const scanY = (frame * 2.5) % h;
  ctx.strokeStyle = "rgba(197, 162, 125, 0.4)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, scanY);
  ctx.lineTo(w, scanY);
  ctx.stroke();
}

function renderMiniTelemetry(ctx: CanvasRenderingContext2D, w: number, h: number, frame: number) {
  ctx.fillStyle = "#030712";
  ctx.fillRect(0, 0, w, h);

  // ECG Line
  ctx.strokeStyle = "#22c55e";
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  for (let x = 0; x < w; x += 3) {
    const sweep = (x + frame * 4) % w;
    const isQRS = sweep > 90 && sweep < 105;
    const yVal = h * 0.4 + (isQRS ? (sweep === 97 ? -32 : 12) : Math.sin(sweep * 0.1) * 4);
    if (x === 0) ctx.moveTo(x, yVal);
    else ctx.lineTo(x, yVal);
  }
  ctx.stroke();

  // Cyan Pleth line
  ctx.strokeStyle = "#06b6d4";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (let x = 0; x < w; x += 3) {
    const sweep = (x + frame * 3) % w;
    const yVal = h * 0.72 + Math.sin(sweep * 0.08) * 12;
    if (x === 0) ctx.moveTo(x, yVal);
    else ctx.lineTo(x, yVal);
  }
  ctx.stroke();

  // Mini HUD numbers
  ctx.fillStyle = "#22c55e";
  ctx.font = "bold 13px monospace";
  ctx.fillText("HR: 72 BPM", 12, 22);

  ctx.fillStyle = "#06b6d4";
  ctx.font = "bold 13px monospace";
  ctx.fillText("SpO2: 98%", w - 85, 22);
}

function renderMiniRadar(ctx: CanvasRenderingContext2D, w: number, h: number, frame: number) {
  ctx.fillStyle = "#07110e";
  ctx.fillRect(0, 0, w, h);

  const cx = w / 2;
  const cy = h / 2;
  const radius = h * 0.42;

  ctx.strokeStyle = "rgba(34, 197, 94, 0.3)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.arc(cx, cy, radius * 0.5, 0, Math.PI * 2);
  ctx.stroke();

  // Beam
  const angle = (frame * 0.05) % (Math.PI * 2);
  const grad = ctx.createConicGradient(angle, cx, cy);
  grad.addColorStop(0, "rgba(34, 197, 94, 0.45)");
  grad.addColorStop(0.18, "transparent");
  grad.addColorStop(1, "transparent");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();

  // Blip
  const bx = cx + Math.cos(1.2) * radius * 0.6;
  const by = cy + Math.sin(1.2) * radius * 0.6;
  ctx.fillStyle = "#22c55e";
  ctx.beginPath();
  ctx.arc(bx, by, 3, 0, Math.PI * 2);
  ctx.fill();
}

function renderMiniGlobe(ctx: CanvasRenderingContext2D, w: number, h: number, frame: number) {
  ctx.fillStyle = "#05070f";
  ctx.fillRect(0, 0, w, h);

  const cx = w / 2;
  const cy = h / 2;
  const radius = h * 0.38;

  ctx.strokeStyle = "rgba(197, 162, 125, 0.4)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.stroke();

  // Satellites
  for (let i = 0; i < 8; i++) {
    const angle = (i * ((Math.PI * 2) / 8) + frame * 0.03) % (Math.PI * 2);
    const sx = cx + Math.cos(angle) * (radius + 14);
    const sy = cy + Math.sin(angle) * ((radius + 14) * 0.45);
    ctx.fillStyle = "#c5a27d";
    ctx.beginPath();
    ctx.arc(sx, sy, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }
}

function renderMiniSyncPulse(ctx: CanvasRenderingContext2D, w: number, h: number, frame: number) {
  ctx.fillStyle = "#0a0715";
  ctx.fillRect(0, 0, w, h);

  const lines = 4;
  for (let l = 0; l < lines; l++) {
    const y = (h / (lines + 1)) * (l + 1);
    ctx.strokeStyle = "rgba(168, 85, 247, 0.25)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(15, y);
    ctx.lineTo(w - 15, y);
    ctx.stroke();

    const px = ((frame * (5 + l * 2)) % (w - 30)) + 15;
    ctx.fillStyle = "#c084fc";
    ctx.beginPath();
    ctx.arc(px, y, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }
}

function renderMiniKeynote(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  frame: number,
  title: string
) {
  ctx.fillStyle = "#0c0a14";
  ctx.fillRect(0, 0, w, h);

  // Equalizer
  const barCount = 24;
  const barW = 4;
  const barSpace = 3;
  const startX = (w - barCount * (barW + barSpace)) / 2;

  for (let i = 0; i < barCount; i++) {
    const val = Math.sin(frame * 0.2 + i * 0.4) * 0.5 + 0.5;
    const barH = Math.max(3, val * 24);
    const bx = startX + i * (barW + barSpace);
    const by = h - 25 - barH;
    ctx.fillStyle = "#c5a27d";
    ctx.fillRect(bx, by, barW, barH);
  }

  // Mini label
  ctx.fillStyle = "#FAF7F2";
  ctx.font = "bold 9px serif";
  ctx.textAlign = "center";
  ctx.fillText("KEYNOTE PRESENTATION", w / 2, 24);
  ctx.textAlign = "start";
}
