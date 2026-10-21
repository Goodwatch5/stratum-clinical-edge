"use client";

import React, { useState } from "react";
import {
  Shield,
  Crown,
  Sparkles,
  Download,
  ExternalLink,
  Check,
  Copy,
  Layers,
  HeartPulse,
  Maximize2,
  Minimize2,
  Info,
  Award,
  Play,
  Film,
} from "lucide-react";
import VideoHoverCard from "./VideoHoverCard";
import VideoTheaterModal, { VideoData } from "./VideoTheaterModal";
import { ECOSYSTEM_VIDEOS, ALL_PLAYLIST_VIDEOS } from "@/lib/videoRegistry";

interface BrandShowcaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToHumanReality?: () => void;
  onNavigateToSolarNexus?: () => void;
}

export default function BrandShowcaseModal({
  isOpen,
  onClose,
  onNavigateToHumanReality,
  onNavigateToSolarNexus,
}: BrandShowcaseModalProps) {
  const [activePhoto, setActivePhoto] = useState<"showcase" | "logo" | "card" | "velvet">("showcase");
  const [isZoomed, setIsZoomed] = useState(false);
  const [copiedNote, setCopiedNote] = useState<string | null>(null);
  const [selectedCinemaVideo, setSelectedCinemaVideo] = useState<VideoData | null>(null);
  const [showCinemaModal, setShowCinemaModal] = useState<boolean>(false);

  const photoVideoMap: Record<string, VideoData> = {
    showcase: ECOSYSTEM_VIDEOS["hardware-showcase"],
    logo: ECOSYSTEM_VIDEOS["keynote-sovereign-ai"],
    card: ECOSYSTEM_VIDEOS["sync-pulse"],
    velvet: ECOSYSTEM_VIDEOS["hardware-showcase"],
  };

  if (!isOpen) return null;

  const images = {
    logo: {
      src: "/src/assets/images/odlc_brand_logo_1791603956565.jpg",
      alt: "ODLC and Seventeen Pockets Brand Inc Official Insignia Logo",
      title: "ODLC Official Brand Logo",
      subtitle: "Seventeen Pockets Brand Inc. • Sovereign Insignia Emblem",
      desc: "Embossed gold-foil monogram insignia on fine warm cream archival paper, featuring intertwining geometric ODLC crest with 17-pocket faceted heraldry.",
      tag: "BRAND EMBLEM",
    },
    showcase: {
      src: "/src/assets/images/seventeen_pockets_showcase_1791603966885.jpg",
      alt: "Program Project Photograph: Stratum Clinical Edge by Seventeen Pockets Brand Inc",
      title: "Program Project Field Deployment",
      subtitle: "Stratum Clinical Edge • Safe Seventeen-Pockets Edge Container",
      desc: "Cinematic photograph of the flagship rugged clinical edge tablet running decentralized healthcare telemetry, alongside the ODLC embossed leather folio, Sovereign Patient Pocket Care Card, and clinical acoustics.",
      tag: "PROGRAM PROJECT PHOTO",
    },
    card: {
      src: "/src/assets/images/odlc_project_card_1791603977022.jpg",
      alt: "Physical Sovereign Patient Pocket Care Card & ODLC Official Credential Card",
      title: "Sovereign Care Card & ODLC Credential",
      subtitle: "Seventeen Pockets Brand Inc. • Tactile Physical Human Artifact",
      desc: "Macro photograph of the physical Sovereign Patient Care Card with golden microchip, encrypted QR matrix, and ODLC authorized clinical credential crest.",
      tag: "TACTILE HARDWARE ARTIFACT",
    },
    velvet: {
      src: "/assets/images/pink_fluffy_vault.jpg",
      alt: "The Velvet Enclave: Compassionate Cryptography & Soft Armor",
      title: "The Velvet Enclave: Soft Armor",
      subtitle: "Seventeen Pockets Brand Inc. • Compassionate Cryptography",
      desc: "Original visual masterpiece subverting the cold IBM-style cybersecurity trope: an ultra-soft pink plush padlock resting on a rose-gold silicon motherboard, symbolizing gentle, human-first protection over fragile clinical health data.",
      tag: "ORIGINAL CONCEPTUAL ARTWORK",
    },
  };

  const handleCopySpec = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedNote(label);
    setTimeout(() => setCopiedNote(null), 2200);
  };

  const current = images[activePhoto];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-2 sm:p-4 animate-fade-in overflow-y-auto">
      <div className="bg-[#FAF7F2] border-2 border-[#1a1a1a] shadow-2xl max-w-5xl w-full my-auto overflow-hidden text-[#1a1a1a] flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="bg-[#1a1a1a] text-[#FAF7F2] px-5 py-4 border-b border-[#c5a27d]/40 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded border border-[#c5a27d] bg-black/40 overflow-hidden flex items-center justify-center shrink-0">
              <img
                src={images.logo.src}
                alt="ODLC Mini Logo"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono tracking-widest text-[#c5a27d] uppercase font-bold">
                  OFFICIAL BRAND & PROGRAM ASSETS
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 bg-[#c5a27d]/20 text-[#c5a27d] border border-[#c5a27d]/40">
                  SEVENTEEN POCKETS BRAND INC.
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-serif font-bold text-white tracking-tight">
                Program Project & ODLC Brand Identity
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsZoomed(!isZoomed)}
              className="p-1.5 text-neutral-300 hover:text-white border border-white/20 hover:border-[#c5a27d] text-xs font-mono transition-colors"
              title={isZoomed ? "Standard View" : "Maximize Image"}
            >
              {isZoomed ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-300 hover:text-white border border-white/20 hover:border-red-400 text-xs font-mono transition-colors"
              title="Close Gallery"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Gallery Selector Tabs */}
        <div className="bg-white border-b border-[#1a1a1a]/15 px-4 py-2 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                setActivePhoto("showcase");
                setIsZoomed(false);
              }}
              className={`px-3 py-1.5 text-xs font-mono font-semibold transition-all flex items-center space-x-1.5 border ${
                activePhoto === "showcase"
                  ? "bg-[#1a1a1a] text-[#FAF7F2] border-[#c5a27d]"
                  : "bg-[#FAF7F2] text-neutral-700 border-neutral-300 hover:bg-neutral-100"
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-[#c5a27d]" />
              <span>1. Program Project Photo</span>
            </button>

            <button
              onClick={() => {
                setActivePhoto("logo");
                setIsZoomed(false);
              }}
              className={`px-3 py-1.5 text-xs font-mono font-semibold transition-all flex items-center space-x-1.5 border ${
                activePhoto === "logo"
                  ? "bg-[#1a1a1a] text-[#FAF7F2] border-[#c5a27d]"
                  : "bg-[#FAF7F2] text-neutral-700 border-neutral-300 hover:bg-neutral-100"
              }`}
            >
              <Crown className="w-3.5 h-3.5 text-[#c5a27d]" />
              <span>2. ODLC Brand Logo</span>
            </button>

            <button
              onClick={() => {
                setActivePhoto("card");
                setIsZoomed(false);
              }}
              className={`px-3 py-1.5 text-xs font-mono font-semibold transition-all flex items-center space-x-1.5 border ${
                activePhoto === "card"
                  ? "bg-[#1a1a1a] text-[#FAF7F2] border-[#c5a27d]"
                  : "bg-[#FAF7F2] text-neutral-700 border-neutral-300 hover:bg-neutral-100"
              }`}
            >
              <Award className="w-3.5 h-3.5 text-[#c5a27d]" />
              <span>3. Sovereign Pocket Card & Credential</span>
            </button>

            <button
              onClick={() => {
                setActivePhoto("velvet");
                setIsZoomed(false);
              }}
              className={`px-3 py-1.5 text-xs font-mono font-semibold transition-all flex items-center space-x-1.5 border ${
                activePhoto === "velvet"
                  ? "bg-[#1a1a1a] text-[#FAF7F2] border-pink-400"
                  : "bg-[#FAF7F2] text-neutral-700 border-neutral-300 hover:bg-neutral-100"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              <span>4. The Velvet Enclave (Original)</span>
            </button>
          </div>

          <div className="text-[10px] font-mono text-neutral-500">
            Lead: <strong className="text-[#1a1a1a]">Dr. Odell Anderson Jr. & Dee Gone</strong>
          </div>
        </div>

        {/* Modal Body / Image Viewport */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Main Visual Display */}
          <div className="relative bg-[#111216] border-2 border-[#1a1a1a] rounded overflow-hidden shadow-xl flex items-center justify-center group">
            <div className="w-full flex items-center justify-center p-1 sm:p-2">
              <img
                src={current.src}
                alt={current.alt}
                referrerPolicy="no-referrer"
                className={`w-full max-h-[58vh] object-contain transition-all duration-300 ${
                  isZoomed ? "scale-105" : "scale-100"
                }`}
              />
            </div>

            {/* Tag Badge */}
            <div className="absolute top-3 left-3 bg-[#1a1a1a]/90 backdrop-blur-md text-[#FAF7F2] px-2.5 py-1 border border-[#c5a27d]/60 text-[10px] font-mono tracking-wider flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-[#c5a27d] animate-pulse"></span>
              <span>{current.tag}</span>
            </div>

            {/* Action Overlay */}
            <div className="absolute top-3 right-3 flex items-center space-x-2">
              <VideoHoverCard
                video={photoVideoMap[activePhoto]}
                onExpand={(v) => {
                  setSelectedCinemaVideo(v);
                  setShowCinemaModal(true);
                }}
                position="bottom"
                align="end"
                cardWidth={330}
              >
                <button
                  onClick={() => {
                    setSelectedCinemaVideo(photoVideoMap[activePhoto]);
                    setShowCinemaModal(true);
                  }}
                  className="px-2.5 py-1 bg-[#c5a27d] hover:bg-white text-[#1a1a1a] text-[10px] font-mono font-bold border border-[#1a1a1a] transition-all flex items-center space-x-1 shadow-sm"
                  title="Hover for video preview • Click for 4K Cinema Theater"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Video Preview</span>
                </button>
              </VideoHoverCard>

              <a
                href={current.src}
                download={`${activePhoto}_seventeen_pockets_odlc.jpg`}
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1 bg-[#1a1a1a]/80 hover:bg-[#1a1a1a] text-white text-[10px] font-mono border border-white/20 hover:border-[#c5a27d] transition-all flex items-center space-x-1"
                title="Download full quality image"
              >
                <Download className="w-3 h-3 text-[#c5a27d]" />
                <span className="hidden sm:inline">Download</span>
              </a>
            </div>
          </div>

          {/* Details & Metadata Card */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-8 bg-white border border-[#1a1a1a]/15 p-4 space-y-2.5">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                <div>
                  <h3 className="text-base sm:text-lg font-serif font-bold text-[#1a1a1a]">
                    {current.title}
                  </h3>
                  <div className="text-xs text-[#c5a27d] font-mono font-medium">
                    {current.subtitle}
                  </div>
                </div>
                <button
                  onClick={() =>
                    handleCopySpec(
                      `${current.title} - Seventeen Pockets Brand Inc / ODLC Logo: ${current.desc}`,
                      activePhoto
                    )
                  }
                  className="px-2.5 py-1 border border-neutral-300 hover:border-[#c5a27d] text-[10px] font-mono flex items-center space-x-1 text-neutral-700"
                >
                  {copiedNote === activePhoto ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-700">Copied Spec</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-neutral-500" />
                      <span>Copy Spec</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-xs text-neutral-700 leading-relaxed font-sans">
                {current.desc}
              </p>

              {activePhoto === "showcase" && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-neutral-100 text-[11px] font-mono">
                  <div className="p-2 bg-[#FAF7F2] border border-neutral-200">
                    <span className="text-[9px] text-neutral-500 block">HARDWARE NODE</span>
                    <strong className="text-[#1a1a1a]">Rugged Field Tablet</strong>
                  </div>
                  <div className="p-2 bg-[#FAF7F2] border border-neutral-200">
                    <span className="text-[9px] text-neutral-500 block">ENCRYPTION VAULT</span>
                    <strong className="text-[#1a1a1a]">17-Pocket Container</strong>
                  </div>
                  <div className="p-2 bg-[#FAF7F2] border border-neutral-200">
                    <span className="text-[9px] text-neutral-500 block">HUMAN ARTIFACT</span>
                    <strong className="text-[#1a1a1a]">Gold Pocket Care Card</strong>
                  </div>
                  <div className="p-2 bg-[#FAF7F2] border border-neutral-200">
                    <span className="text-[9px] text-neutral-500 block">CLINICAL DIRECTORS</span>
                    <strong className="text-[#1a1a1a]">Dr. Odell & Dee Gone</strong>
                  </div>
                </div>
              )}

              {activePhoto === "logo" && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-neutral-100 text-[11px] font-mono">
                  <div className="p-2 bg-[#FAF7F2] border border-neutral-200">
                    <span className="text-[9px] text-neutral-500 block">BRAND ENTITY</span>
                    <strong className="text-[#1a1a1a]">Seventeen Pockets Brand Inc.</strong>
                  </div>
                  <div className="p-2 bg-[#FAF7F2] border border-neutral-200">
                    <span className="text-[9px] text-neutral-500 block">MONOGRAM</span>
                    <strong className="text-[#1a1a1a]">ODLC Intertwined Crest</strong>
                  </div>
                  <div className="p-2 bg-[#FAF7F2] border border-neutral-200">
                    <span className="text-[9px] text-neutral-500 block">FINISH & COLOR</span>
                    <strong className="text-[#1a1a1a]">Brushed Gold & Obsidian Slate</strong>
                  </div>
                </div>
              )}

              {activePhoto === "card" && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-neutral-100 text-[11px] font-mono">
                  <div className="p-2 bg-[#FAF7F2] border border-neutral-200">
                    <span className="text-[9px] text-neutral-500 block">CHIP TECHNOLOGY</span>
                    <strong className="text-[#1a1a1a]">Secure Microchip Contact</strong>
                  </div>
                  <div className="p-2 bg-[#FAF7F2] border border-neutral-200">
                    <span className="text-[9px] text-neutral-500 block">OFFLINE MATRIX</span>
                    <strong className="text-[#1a1a1a]">Encrypted Field QR Code</strong>
                  </div>
                  <div className="p-2 bg-[#FAF7F2] border border-neutral-200">
                    <span className="text-[9px] text-neutral-500 block">SECURITY HERALDRY</span>
                    <strong className="text-[#1a1a1a]">Embossed Gold Seal</strong>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions / Jump to Movement */}
            <div className="md:col-span-4 bg-white border border-[#1a1a1a]/15 p-4 flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="text-[10px] font-mono uppercase text-[#c5a27d] font-bold">
                  TACTILE HUMAN INTEGRATION
                </div>
                <h4 className="font-serif font-bold text-sm text-[#1a1a1a]">
                  From Visual Identity to Living Care
                </h4>
                <p className="text-[11px] text-neutral-600 leading-relaxed font-sans">
                  The program project links this physical hardware kit and the ODLC sovereign identity directly into field outreach, bedside scribing, and printable pocket cards.
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-neutral-100">
                {onNavigateToHumanReality && (
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateToHumanReality();
                    }}
                    className="w-full py-2 px-3 bg-[#1a1a1a] hover:bg-[#c5a27d] hover:text-[#1a1a1a] text-white transition-colors text-xs font-mono font-bold flex items-center justify-center space-x-2 shadow-sm"
                  >
                    <HeartPulse className="w-3.5 h-3.5" />
                    <span>Open Human Reality Deck</span>
                  </button>
                )}

                {onNavigateToSolarNexus && (
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateToSolarNexus();
                    }}
                    className="w-full py-2 px-3 bg-[#c5a27d] hover:bg-[#d4b38e] text-[#1a1a1a] transition-colors text-xs font-mono font-bold flex items-center justify-center space-x-2 shadow-sm"
                  >
                    <span>Launch Solar Nexus (GitBook Addition) →</span>
                  </button>
                )}

                <div className="text-[9px] font-mono text-neutral-500 text-center">
                  Protected under safe seventeen-pockets edge containers
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-[#FAF7F2] border-t border-[#1a1a1a]/15 px-5 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0">
          <div className="text-[10px] font-mono text-neutral-600 flex items-center space-x-2">
            <Shield className="w-3.5 h-3.5 text-[#c5a27d]" />
            <span>
              <strong>Seventeen Pockets Brand Inc.</strong> • ODLC Sovereign Clinical Edge • Dr. Odell Anderson Jr. & Dee Gone
            </span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#1a1a1a] text-[#FAF7F2] hover:bg-[#2b2b2b] text-xs font-mono transition-colors"
          >
            Close Showcase
          </button>
        </div>
      </div>

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
