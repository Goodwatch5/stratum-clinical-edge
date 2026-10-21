"use client";

import React, { useState, useRef } from "react";
import {
  HeartPulse,
  Printer,
  Download,
  Copy,
  Check,
  Sparkles,
  QrCode,
  Shield,
  ShieldCheck,
  Stethoscope,
  Send,
  User,
  Users,
  Compass,
  Package,
  Activity,
  Calendar,
  AlertTriangle,
  FileText,
  Clock,
  MapPin,
  ChevronRight,
  Flame,
  Wheat,
  Share2,
  RefreshCw,
  Award,
  Layers,
  PhoneCall,
  Crown,
  Play,
  Film,
  Maximize2,
  Volume2,
} from "lucide-react";
import { Stronghold } from "@/app/page";
import { generateClinicalResponse } from "@/lib/firebase-ai";
import VideoHoverCard from "./VideoHoverCard";
import VideoTheaterModal, { VideoData } from "./VideoTheaterModal";
import { ECOSYSTEM_VIDEOS, ALL_PLAYLIST_VIDEOS } from "@/lib/videoRegistry";

interface PatientEncounter {
  id: string;
  patientName: string;
  age: number | string;
  setting: string;
  dialogue: string;
  vitals: {
    bp: string;
    hr: string;
    spo2: string;
    temp: string;
    glucose: string;
  };
  history: string;
  timestamp: string;
  status: "draft" | "evaluated" | "dispatched";
  soapNote?: string;
  pocketInstructions?: string;
  triageLevel?: "Emergent" | "Urgent" | "Stable";
  triageColor?: string;
  executionVector?: string;
}

const PRESET_ENCOUNTERS = [
  {
    id: "HR-ENC-001",
    patientName: "Mrs. Eleanor Vance",
    age: 69,
    setting: "Rural Faith Outreach Clinic (Columbia, SC Corridor)",
    dialogue:
      "Dr. Odell, my legs have been swelling up like water balloons for the past four days, and when I lie flat at night to sleep, I feel like I'm drowning and have to prop myself up with three pillows. My blood pressure medicine ran out last Tuesday and the nearest pharmacy is a 45-minute bus ride.",
    vitals: {
      bp: "168/98",
      hr: "92",
      spo2: "94%",
      temp: "98.4°F",
      glucose: "142 mg/dL",
    },
    history: "Congestive heart failure (mild, NYHA II), hypertension for 18 years. Allergic to Sulfa.",
  },
  {
    id: "HR-ENC-002",
    patientName: "Marcus Cole",
    age: 44,
    setting: "Urban Mobile Health Van #2 (Community Health Pop-Up)",
    dialogue:
      "I stepped on a rusty framing nail on the job site about a week ago. I tried cleaning it with rubbing alcohol and peroxide, but now the bottom of my heel is throbbing, hot to the touch, and there's a red streak heading toward my ankle. I can barely bear weight on it today.",
    vitals: {
      bp: "134/86",
      hr: "102",
      spo2: "98%",
      temp: "101.2°F",
      glucose: "218 mg/dL",
    },
    history: "Type 2 Diabetes (uncontrolled, HbA1c 9.4% last recorded 2 years ago). Tetanus shot unknown >10 yrs.",
  },
  {
    id: "HR-ENC-003",
    patientName: "Amara & Baby Liam",
    age: "24 yrs / 9 mos",
    setting: "Frontier Settlement Outpost (Disaster Relief Triage)",
    dialogue:
      "Liam woke up in the middle of the night with a barking cough and wheezing sound every time he takes a breath. He is refusing his bottle and his chest sucks inward under his ribs when he tries to breathe. I'm terrified his airway is going to close up.",
    vitals: {
      bp: "90/60 (Mom)",
      hr: "155 (Infant)",
      spo2: "91% (Infant)",
      temp: "102.8°F",
      glucose: "92 mg/dL",
    },
    history: "Infant born at 36 weeks gestation. No known drug allergies. Mom has untreated postpartum anxiety.",
  },
];

const SEVENTEEN_POCKETS_PHYSICAL_KIT = [
  {
    pocketNum: 1,
    category: "Edge Compute & Power",
    name: "Stratum Rugged Tablet (PWA Offline)",
    desc: "IP68 solar-rechargeable edge node preloaded with IndexedDB clinical vault & offline speech engine.",
    weightOz: 24,
    critical: true,
  },
  {
    pocketNum: 2,
    category: "Edge Compute & Power",
    name: "Foldable Monocrystalline Solar Blanket (45W)",
    desc: "Compact high-efficiency USB-C PD power generator for non-stop field operation.",
    weightOz: 16,
    critical: true,
  },
  {
    pocketNum: 3,
    category: "Edge Compute & Power",
    name: "Dual Infrared Non-Contact & Core Temp Probes",
    desc: "Rapid 0.5s arterial heat mapping with pediatric adapters.",
    weightOz: 4,
    critical: true,
  },
  {
    pocketNum: 4,
    category: "Edge Compute & Power",
    name: "Bluetooth Wireless Pulse Oximeter & Plethysmograph",
    desc: "Continuous SpO2 and perfusion index tracker with low-perfusion accuracy.",
    weightOz: 3,
    critical: true,
  },
  {
    pocketNum: 5,
    category: "Rapid Point-of-Care Diagnostics",
    name: "Multiplex Lateral Flow Strip Cartridges (x50)",
    desc: "Rapid antigen test array: Flu A/B, COVID-19, Strep A, and RSV in 10 minutes.",
    weightOz: 8,
    critical: true,
  },
  {
    pocketNum: 6,
    category: "Rapid Point-of-Care Diagnostics",
    name: "Enzymatic Blood Glucose & Ketone Test Kit",
    desc: "Micro-sample biosensor meter with 100 sterile lancets and test strips.",
    weightOz: 6,
    critical: true,
  },
  {
    pocketNum: 7,
    category: "Rapid Point-of-Care Diagnostics",
    name: "10-Parameter Urinalysis Reagent Strips",
    desc: "Instant colorimetric readout for leukocyte, nitrite, protein, pH, blood, and ketones.",
    weightOz: 4,
    critical: false,
  },
  {
    pocketNum: 8,
    category: "Rapid Point-of-Care Diagnostics",
    name: "Digital Smartphone Otoscope & Ophthalmoscope Head",
    desc: "High-definition tympanic and retinal camera attachment for acoustic & optic exam.",
    weightOz: 5,
    critical: false,
  },
  {
    pocketNum: 9,
    category: "Life-Saving Medical Formulations",
    name: "WHO Essential Oral Rehydration Salts (20 packets)",
    desc: "Balanced glucose-electrolyte oral fluid packets for immediate dehydration reversal.",
    weightOz: 14,
    critical: true,
  },
  {
    pocketNum: 10,
    category: "Life-Saving Medical Formulations",
    name: "Hemostatic Celox Gauze & Pressure Bandages",
    desc: "Kaolin-impregnated rapid clotting gauze for arterial or deep wound hemorrhage control.",
    weightOz: 7,
    critical: true,
  },
  {
    pocketNum: 11,
    category: "Life-Saving Medical Formulations",
    name: "Emergency Epinephrine Auto-Injectors (x2 Adult/Peds)",
    desc: "Instant anaphylaxis and severe bronchospasm life-saving intervention.",
    weightOz: 6,
    critical: true,
  },
  {
    pocketNum: 12,
    category: "Life-Saving Medical Formulations",
    name: "Essential Emergency Rations & Antiseptic Wash",
    desc: "Povidone-iodine swabs, burn hydrogel dressing, and sublingual nitroglycerin sealed ampoules.",
    weightOz: 12,
    critical: true,
  },
  {
    pocketNum: 13,
    category: "Community Outreach & Sovereignty",
    name: "Blank NFC & QR Sovereign Pocket Care Cards (x100)",
    desc: "Waterproof physical card stock handed directly to patients with handwritten or printed clinical directives.",
    weightOz: 10,
    critical: true,
  },
  {
    pocketNum: 14,
    category: "Community Outreach & Sovereignty",
    name: "Thermal Mini-Printer (Bluetooth / Battery-Powered)",
    desc: "Instant 2-inch receipt and care card printer generating offline patient care passports in the field.",
    weightOz: 11,
    critical: true,
  },
  {
    pocketNum: 15,
    category: "Community Outreach & Sovereignty",
    name: "Starlink Mini / Burst Satellite Transceiver Relay",
    desc: "High-priority emergency beacon providing encrypted satellite uplink in cellular deadzones.",
    weightOz: 40,
    critical: false,
  },
  {
    pocketNum: 16,
    category: "Community Outreach & Sovereignty",
    name: "Hand-Crank NOAA Emergency Radio & LED Beacon",
    desc: "Multi-band emergency broadcast receiver, siren, and solar power bank.",
    weightOz: 12,
    critical: true,
  },
  {
    pocketNum: 17,
    category: "Community Outreach & Sovereignty",
    name: "God Knew & goodwayz Community Health & Hope Guides",
    desc: "Faith-driven whole-person health booklets, nutritional pescatarian charts, and village care pledge cards.",
    weightOz: 16,
    critical: false,
  },
];

interface HumanRealityMovementProps {
  strongholds: Stronghold[];
  activeStronghold: Stronghold;
  onPublishToCouncil: (text: string) => void;
}

export default function HumanRealityMovement({
  strongholds,
  activeStronghold,
  onPublishToCouncil,
}: HumanRealityMovementProps) {
  const [activeTab, setActiveTab] = useState<
    | "bedside-scribe"
    | "field-kit"
    | "movement-blueprint"
    | "community-dispatcher"
    | "brand-gallery"
  >("bedside-scribe");

  const [selectedCinemaVideo, setSelectedCinemaVideo] = useState<VideoData | null>(null);
  const [showCinemaModal, setShowCinemaModal] = useState<boolean>(false);

  // Live Encounter State
  const [currentEncounter, setCurrentEncounter] = useState<PatientEncounter>({
    id: `ENC-${Date.now().toString(36).toUpperCase()}`,
    patientName: "Mrs. Eleanor Vance",
    age: 69,
    setting: "Rural Faith Outreach Clinic (Columbia, SC Corridor)",
    dialogue:
      "Dr. Odell, my legs have been swelling up like water balloons for the past four days, and when I lie flat at night to sleep, I feel like I'm drowning and have to prop myself up with three pillows. My blood pressure medicine ran out last Tuesday and the nearest pharmacy is a 45-minute bus ride.",
    vitals: {
      bp: "168/98",
      hr: "92",
      spo2: "94%",
      temp: "98.4°F",
      glucose: "142 mg/dL",
    },
    history: "Congestive heart failure (mild, NYHA II), hypertension for 18 years. Allergic to Sulfa.",
    timestamp: new Date().toLocaleTimeString(),
    status: "draft",
  });

  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [checkedPockets, setCheckedPockets] = useState<number[]>([1, 2, 3, 4, 5, 6, 9, 10, 11, 13, 14, 16]);
  const [isSimulatingAudio, setIsSimulatingAudio] = useState(false);
  const [printedStamp, setPrintedStamp] = useState(false);

  const printCardRef = useRef<HTMLDivElement>(null);

  // Copy helper
  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Load Preset Encounter
  const handleSelectPreset = (preset: typeof PRESET_ENCOUNTERS[0]) => {
    setCurrentEncounter({
      id: `ENC-${Date.now().toString(36).toUpperCase()}`,
      patientName: preset.patientName,
      age: preset.age,
      setting: preset.setting,
      dialogue: preset.dialogue,
      vitals: { ...preset.vitals },
      history: preset.history,
      timestamp: new Date().toLocaleTimeString(),
      status: "draft",
      soapNote: undefined,
      pocketInstructions: undefined,
    });
  };

  // Generate Real-World Bedside Clinical AI Analysis
  const handleRunClinicalScribe = async () => {
    setIsLoadingAi(true);
    try {
      const promptPayload = `Physical Human Reality Encounter:
Patient: ${currentEncounter.patientName} (Age: ${currentEncounter.age})
Setting: ${currentEncounter.setting}
Authority: Dr. Odell Anderson Jr. & Dee Gone (Stratum Healthcare Network)
Vitals: BP: ${currentEncounter.vitals.bp}, HR: ${currentEncounter.vitals.hr} bpm, SpO2: ${currentEncounter.vitals.spo2}, Temp: ${currentEncounter.vitals.temp}, Blood Glucose: ${currentEncounter.vitals.glucose}
Medical History & Allergies: ${currentEncounter.history}
Patient's Spoken Words & Observed Symptoms:
"${currentEncounter.dialogue}"`;

      const aiResult = await generateClinicalResponse(promptPayload, {
        mode: "human_reality_encounter",
        timeoutMs: 12000,
      });

      // Parse or format output
      const rawText = aiResult.text;
      let triage: "Emergent" | "Urgent" | "Stable" = "Urgent";
      if (
        rawText.toUpperCase().includes("EMERGENT") ||
        rawText.toUpperCase().includes("CRITICAL") ||
        currentEncounter.vitals.bp.startsWith("17") ||
        currentEncounter.vitals.bp.startsWith("18") ||
        currentEncounter.vitals.spo2.includes("91")
      ) {
        triage = "Emergent";
      } else if (rawText.toUpperCase().includes("STABLE") || rawText.toUpperCase().includes("NON-URGENT")) {
        triage = "Stable";
      }

      setCurrentEncounter((prev) => ({
        ...prev,
        status: "evaluated",
        soapNote: rawText,
        pocketInstructions: rawText,
        triageLevel: triage,
        executionVector: aiResult.executionVector,
      }));

      onPublishToCouncil(
        `[HUMAN REALITY ENCOUNTER LOGGED] Patient: ${currentEncounter.patientName} (${triage.toUpperCase()}) | Setting: ${currentEncounter.setting} | Dr. Odell Anderson Jr. & Dee Gone Care Cadre`
      );
    } catch (err: any) {
      console.error("Clinical scribe evaluation error:", err);
    } finally {
      setIsLoadingAi(false);
    }
  };

  // Trigger Physical Print of the Pocket Care Card
  const handlePrintPocketCard = () => {
    setPrintedStamp(true);
    setTimeout(() => setPrintedStamp(false), 4000);
    window.print();
  };

  // Download Pocket Card as Self-Contained HTML / Offline Document
  const handleDownloadCardHtml = () => {
    const cardContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Stratum Sovereign Pocket Care Card - ${currentEncounter.patientName}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #FAF7F2; padding: 20px; color: #1a1a1a; }
    .card { max-width: 520px; margin: 0 auto; background: white; border: 2px solid #1a1a1a; padding: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    .header { border-bottom: 2px solid #c5a27d; padding-bottom: 12px; margin-bottom: 16px; }
    .title { font-size: 18px; font-weight: bold; text-transform: uppercase; color: #1a1a1a; }
    .sub { font-size: 11px; color: #c5a27d; font-weight: bold; letter-spacing: 1px; }
    .row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px; }
    .bold { font-weight: bold; }
    .vitals-box { background: #f4f1ea; padding: 10px; border-left: 4px solid #1a1a1a; margin: 14px 0; font-family: monospace; font-size: 12px; }
    .directives { background: #fffdfa; border: 1px dashed #c5a27d; padding: 12px; font-size: 13px; line-height: 1.5; margin: 14px 0; }
    .badge { display: inline-block; padding: 3px 8px; font-size: 11px; font-weight: bold; background: #1a1a1a; color: #FAF7F2; }
    .footer { border-top: 1px solid #e0ded8; padding-top: 10px; margin-top: 16px; font-size: 10px; color: #666; text-align: center; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div class="sub">STRATUM CLINICAL EDGE • HUMAN REALITY CARE PASSPORT</div>
      <div class="title">PATIENT POCKET CARE CARD</div>
      <div style="font-size: 11px; color: #666;">Auth: Dr. Odell Anderson Jr. & Dee Gone | Seventeen Pockets Network</div>
    </div>
    
    <div class="row">
      <span><strong>Patient:</strong> ${currentEncounter.patientName}</span>
      <span><strong>Age:</strong> ${currentEncounter.age}</span>
    </div>
    <div class="row">
      <span><strong>Date/Time:</strong> ${new Date().toLocaleDateString()} ${currentEncounter.timestamp}</span>
      <span class="badge">TRIAGE: ${currentEncounter.triageLevel || "URGENT"}</span>
    </div>
    <div class="row">
      <span><strong>Encounter Location:</strong> ${currentEncounter.setting}</span>
    </div>

    <div class="vitals-box">
      <strong>RECORDED BEDSIDE VITALS:</strong><br>
      BP: ${currentEncounter.vitals.bp} mmHg | Pulse: ${currentEncounter.vitals.hr} bpm | SpO2: ${currentEncounter.vitals.spo2} | Temp: ${currentEncounter.vitals.temp} | Glucose: ${currentEncounter.vitals.glucose}
    </div>

    <div class="directives">
      <strong>PHYSICIAN & CARE CADRE DIRECTIVES:</strong><br>
      ${currentEncounter.pocketInstructions ? currentEncounter.pocketInstructions.replace(/\n/g, "<br>") : "Follow standard titration orders. Return if symptoms worsen."}
    </div>

    <div class="footer">
      <strong>STRATUM HEALTHCARE NETWORK & SEVENTEEN POCKETS BRAND INC.</strong><br>
      Offline Encrypted Telemetry Card • God Knew & goodwayz Community Health Initiative<br>
      Emergency 24-Hr Check-in Assigned: Peer Community Ambassador
    </div>
  </div>
</body>
</html>
    `;

    const blob = new Blob([cardContent], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `stratum-pocket-card-${currentEncounter.patientName.toLowerCase().replace(/\s+/g, "-")}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Toggle checklist item
  const handleTogglePocket = (pocketNum: number) => {
    setCheckedPockets((prev) =>
      prev.includes(pocketNum) ? prev.filter((p) => p !== pocketNum) : [...prev, pocketNum]
    );
  };

  // Calculate Field Kit Metrics
  const totalItems = SEVENTEEN_POCKETS_PHYSICAL_KIT.length;
  const packedItems = checkedPockets.length;
  const readinessPercent = Math.round((packedItems / totalItems) * 100);
  const totalWeightOz = checkedPockets.reduce((sum, pNum) => {
    const item = SEVENTEEN_POCKETS_PHYSICAL_KIT.find((i) => i.pocketNum === pNum);
    return sum + (item?.weightOz || 0);
  }, 0);
  const totalWeightLbs = (totalWeightOz / 16).toFixed(1);

  return (
    <div className="space-y-6 font-sans">
      {/* HEADER BANNER: HUMAN REALITY MOVEMENT */}
      <div className="bg-gradient-to-r from-[#1a1a1a] via-[#242424] to-[#1a1a1a] text-[#FAF7F2] p-6 border-b-4 border-[#c5a27d] shadow-lg relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-48 h-48 bg-[#c5a27d]/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-[#c5a27d] text-[#1a1a1a] text-[10px] font-mono font-bold tracking-widest uppercase">
                HUMAN REALITY
              </span>
              <span className="text-[11px] font-mono text-[#c5a27d] tracking-wide flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                LIVING MOVEMENT ENGINE
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
              Bringing The Dream Into Human Reality
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 font-light max-w-2xl leading-relaxed">
              Bridging decentralized sovereign intelligence into tactile, empathetic, life-saving bedside care.
              Directed by <strong className="text-[#c5a27d] font-semibold">Dr. Odell Anderson Jr.</strong> &{" "}
              <strong className="text-[#c5a27d] font-semibold">Dee Gone</strong> through the Seventeen Pockets
              Healthcare Network, God Knew, and goodwayz initiatives.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab("bedside-scribe")}
              className={`px-3 py-2 text-xs font-mono font-semibold transition-all border ${
                activeTab === "bedside-scribe"
                  ? "bg-[#c5a27d] text-[#1a1a1a] border-[#c5a27d] shadow-sm"
                  : "bg-white/5 text-neutral-300 border-white/10 hover:bg-white/10"
              }`}
            >
              1. Bedside Scribe & Pocket Card
            </button>
            <button
              onClick={() => setActiveTab("field-kit")}
              className={`px-3 py-2 text-xs font-mono font-semibold transition-all border ${
                activeTab === "field-kit"
                  ? "bg-[#c5a27d] text-[#1a1a1a] border-[#c5a27d] shadow-sm"
                  : "bg-white/5 text-neutral-300 border-white/10 hover:bg-white/10"
              }`}
            >
              2. 17-Pockets Field Kit
            </button>
            <button
              onClick={() => setActiveTab("movement-blueprint")}
              className={`px-3 py-2 text-xs font-mono font-semibold transition-all border ${
                activeTab === "movement-blueprint"
                  ? "bg-[#c5a27d] text-[#1a1a1a] border-[#c5a27d] shadow-sm"
                  : "bg-white/5 text-neutral-300 border-white/10 hover:bg-white/10"
              }`}
            >
              3. 5-Phase Movement Blueprint
            </button>
            <button
              onClick={() => setActiveTab("community-dispatcher")}
              className={`px-3 py-2 text-xs font-mono font-semibold transition-all border ${
                activeTab === "community-dispatcher"
                  ? "bg-[#c5a27d] text-[#1a1a1a] border-[#c5a27d] shadow-sm"
                  : "bg-white/5 text-neutral-300 border-white/10 hover:bg-white/10"
              }`}
            >
              4. Community Dispatcher
            </button>
            <button
              id="tab-brand-gallery-btn"
              onClick={() => setActiveTab("brand-gallery")}
              className={`px-3 py-2 text-xs font-mono font-semibold transition-all border flex items-center gap-1.5 ${
                activeTab === "brand-gallery"
                  ? "bg-[#c5a27d] text-[#1a1a1a] border-[#c5a27d] shadow-sm"
                  : "bg-white/5 text-neutral-300 border-white/10 hover:bg-white/10"
              }`}
            >
              <Crown className="w-3.5 h-3.5 text-[#c5a27d]" />
              <span>5. Brand & Project Photo Gallery</span>
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: BEDSIDE SCRIBE & PRINTABLE POCKET CARE CARD */}
      {activeTab === "bedside-scribe" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT 6 COLS: LIVE ENCOUNTER FORM & PRESET SELECTOR */}
          <div className="lg:col-span-6 space-y-5">
            {/* Quick Preset Selector */}
            <div className="bg-white border border-[#1a1a1a]/15 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-600 flex items-center gap-1.5">
                  <Stethoscope className="w-3.5 h-3.5 text-[#c5a27d]" />
                  Real-World Clinical Presets
                </span>
                <span className="text-[10px] font-mono text-neutral-400">Street & Rural Outposts</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {PRESET_ENCOUNTERS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset)}
                    className={`p-2.5 text-left border transition-all ${
                      currentEncounter.patientName === preset.patientName
                        ? "border-[#c5a27d] bg-[#FAF7F2] shadow-sm"
                        : "border-neutral-200 hover:border-neutral-300 bg-white"
                    }`}
                  >
                    <div className="text-xs font-serif font-bold text-[#1a1a1a] truncate">
                      {preset.patientName}
                    </div>
                    <div className="text-[10px] font-mono text-neutral-500">Age: {preset.age}</div>
                    <div className="text-[9px] font-mono text-[#c5a27d] truncate mt-1">
                      {preset.setting.split("(")[0]}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Active Encounter Details */}
            <div className="bg-white border border-[#1a1a1a]/15 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <div>
                  <h3 className="text-base font-serif font-bold text-[#1a1a1a]">Bedside Encounter Intake</h3>
                  <p className="text-xs text-neutral-500">
                    Listening to real human words with sovereign clinical empathy
                  </p>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-[#FAF7F2] border border-[#c5a27d]/40 text-[#1a1a1a] font-semibold">
                  ID: {currentEncounter.id}
                </span>
              </div>

              {/* Patient Basic Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-mono uppercase text-neutral-500 block mb-1">
                    Patient Name / ID
                  </label>
                  <input
                    type="text"
                    value={currentEncounter.patientName}
                    onChange={(e) => setCurrentEncounter({ ...currentEncounter, patientName: e.target.value })}
                    className="w-full text-xs font-sans p-2 border border-neutral-300 focus:border-[#c5a27d] outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase text-neutral-500 block mb-1">Age</label>
                  <input
                    type="text"
                    value={currentEncounter.age}
                    onChange={(e) => setCurrentEncounter({ ...currentEncounter, age: e.target.value })}
                    className="w-full text-xs font-sans p-2 border border-neutral-300 focus:border-[#c5a27d] outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase text-neutral-500 block mb-1">
                    Encounter Location
                  </label>
                  <input
                    type="text"
                    value={currentEncounter.setting}
                    onChange={(e) => setCurrentEncounter({ ...currentEncounter, setting: e.target.value })}
                    className="w-full text-xs font-sans p-2 border border-neutral-300 focus:border-[#c5a27d] outline-none"
                  />
                </div>
              </div>

              {/* Vitals Grid */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase text-neutral-500 block">
                  Bedside Physical Vitals & Biomarkers
                </label>
                <div className="grid grid-cols-5 gap-2">
                  <div className="bg-[#FAF7F2] p-2 border border-neutral-200 text-center">
                    <span className="text-[9px] font-mono text-neutral-500 block">BP (mmHg)</span>
                    <input
                      type="text"
                      value={currentEncounter.vitals.bp}
                      onChange={(e) =>
                        setCurrentEncounter({
                          ...currentEncounter,
                          vitals: { ...currentEncounter.vitals, bp: e.target.value },
                        })
                      }
                      className="w-full text-center text-xs font-mono font-bold bg-transparent outline-none"
                    />
                  </div>
                  <div className="bg-[#FAF7F2] p-2 border border-neutral-200 text-center">
                    <span className="text-[9px] font-mono text-neutral-500 block">Pulse (BPM)</span>
                    <input
                      type="text"
                      value={currentEncounter.vitals.hr}
                      onChange={(e) =>
                        setCurrentEncounter({
                          ...currentEncounter,
                          vitals: { ...currentEncounter.vitals, hr: e.target.value },
                        })
                      }
                      className="w-full text-center text-xs font-mono font-bold bg-transparent outline-none"
                    />
                  </div>
                  <div className="bg-[#FAF7F2] p-2 border border-neutral-200 text-center">
                    <span className="text-[9px] font-mono text-neutral-500 block">SpO2 (%)</span>
                    <input
                      type="text"
                      value={currentEncounter.vitals.spo2}
                      onChange={(e) =>
                        setCurrentEncounter({
                          ...currentEncounter,
                          vitals: { ...currentEncounter.vitals, spo2: e.target.value },
                        })
                      }
                      className="w-full text-center text-xs font-mono font-bold bg-transparent outline-none"
                    />
                  </div>
                  <div className="bg-[#FAF7F2] p-2 border border-neutral-200 text-center">
                    <span className="text-[9px] font-mono text-neutral-500 block">Temp (°F)</span>
                    <input
                      type="text"
                      value={currentEncounter.vitals.temp}
                      onChange={(e) =>
                        setCurrentEncounter({
                          ...currentEncounter,
                          vitals: { ...currentEncounter.vitals, temp: e.target.value },
                        })
                      }
                      className="w-full text-center text-xs font-mono font-bold bg-transparent outline-none"
                    />
                  </div>
                  <div className="bg-[#FAF7F2] p-2 border border-neutral-200 text-center">
                    <span className="text-[9px] font-mono text-neutral-500 block">Glucose</span>
                    <input
                      type="text"
                      value={currentEncounter.vitals.glucose}
                      onChange={(e) =>
                        setCurrentEncounter({
                          ...currentEncounter,
                          vitals: { ...currentEncounter.vitals, glucose: e.target.value },
                        })
                      }
                      className="w-full text-center text-xs font-mono font-bold bg-transparent outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Dialogue / Raw Words */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-mono uppercase text-neutral-500">
                    Spoken Dialogue / Patient Chief Complaint
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSimulatingAudio(true);
                      setTimeout(() => setIsSimulatingAudio(false), 2000);
                    }}
                    className="text-[10px] font-mono text-[#c5a27d] hover:underline flex items-center gap-1"
                  >
                    <Volume2 className="w-3 h-3" />
                    {isSimulatingAudio ? "Simulating Audio Stream..." : "Test Bedside Audio Dictation"}
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={currentEncounter.dialogue}
                  onChange={(e) => setCurrentEncounter({ ...currentEncounter, dialogue: e.target.value })}
                  placeholder="Record or transcribe patient's direct words, clinical observations, physical distress notes..."
                  className="w-full text-xs font-sans p-3 border border-neutral-300 focus:border-[#c5a27d] outline-none leading-relaxed"
                />
              </div>

              {/* History & Known Allergies */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-neutral-500">
                  Known History & Allergies
                </label>
                <input
                  type="text"
                  value={currentEncounter.history}
                  onChange={(e) => setCurrentEncounter({ ...currentEncounter, history: e.target.value })}
                  className="w-full text-xs font-sans p-2 border border-neutral-300 focus:border-[#c5a27d] outline-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <div className="text-[10px] font-mono text-neutral-500">
                  Authority: <strong className="text-[#1a1a1a]">Dr. Odell Anderson Jr. & Dee Gone</strong>
                </div>
                <button
                  onClick={handleRunClinicalScribe}
                  disabled={isLoadingAi}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#1a1a1a] text-white hover:bg-[#c5a27d] hover:text-[#1a1a1a] transition-all text-xs font-mono font-bold uppercase tracking-wider shadow-sm disabled:opacity-50"
                >
                  {isLoadingAi ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Synthesizing Care Card...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-[#c5a27d]" />
                      <span>Engage Bedside Scribe & Generate Card</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT 6 COLS: TANGIBLE ARTIFACT - THE POCKET PATIENT CARE CARD */}
          <div className="lg:col-span-6 space-y-5">
            <div className="bg-white border-2 border-[#1a1a1a] p-5 shadow-md relative">
              {/* Top Controls Bar */}
              <div className="flex items-center justify-between border-b border-neutral-200 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#1a1a1a]">
                    Tangible Human Artifact: Pocket Care Card
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownloadCardHtml}
                    className="p-1.5 hover:bg-neutral-100 text-neutral-700 border border-neutral-300 text-[10px] font-mono flex items-center gap-1"
                    title="Download offline HTML card"
                  >
                    <Download className="w-3 h-3 text-[#c5a27d]" />
                    <span>Download</span>
                  </button>
                  <button
                    onClick={handlePrintPocketCard}
                    className="px-3 py-1.5 bg-[#1a1a1a] text-[#FAF7F2] hover:bg-[#c5a27d] hover:text-[#1a1a1a] text-[10px] font-mono font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Pocket Card</span>
                  </button>
                </div>
              </div>

              {printedStamp && (
                <div className="mb-3 p-2 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-mono text-center animate-fade-in">
                  ✓ Print job triggered. Card ready to be placed in patient&apos;s pocket or clinical binder.
                </div>
              )}

              {/* PRINTABLE PHYSICAL CARD VIEWPORT */}
              <div
                ref={printCardRef}
                className="bg-[#FAF7F2] border-2 border-[#1a1a1a] p-5 space-y-4 rounded-sm text-[#1a1a1a] relative overflow-hidden"
              >
                {/* Decorative Gold Header Bar */}
                <div className="h-1.5 w-full bg-[#c5a27d]"></div>

                {/* Card Title & Seal */}
                <div className="flex items-start justify-between border-b border-[#1a1a1a]/20 pb-3">
                  <div>
                    <div className="text-[9px] font-mono uppercase tracking-widest text-[#c5a27d] font-bold">
                      STRATUM CLINICAL EDGE • HEALTHCARE NETWORK
                    </div>
                    <h2 className="text-xl font-serif font-black tracking-tight text-[#1a1a1a]">
                      PATIENT POCKET CARE CARD
                    </h2>
                    <div className="text-[10px] font-sans text-neutral-600">
                      Sovereign Bedside Passport & Plain-Language Care Regimen
                    </div>
                  </div>

                  {/* Sovereign QR / Cryptographic Stamp */}
                  <div className="text-right">
                    <div className="w-14 h-14 border border-[#1a1a1a] bg-white p-1 flex items-center justify-center shadow-inner">
                      <QrCode className="w-12 h-12 text-[#1a1a1a]" />
                    </div>
                    <div className="text-[7px] font-mono text-neutral-500 uppercase mt-0.5">
                      OFFLINE DEPLOYED
                    </div>
                  </div>
                </div>

                {/* Patient Identifier Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-sans bg-white p-2.5 border border-[#1a1a1a]/15">
                  <div>
                    <span className="text-[9px] font-mono text-neutral-500 block uppercase">Patient</span>
                    <strong className="text-sm font-serif text-[#1a1a1a]">{currentEncounter.patientName}</strong>
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-neutral-500 block uppercase">Age / Setting</span>
                    <span className="text-xs font-semibold">{currentEncounter.age} yrs</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-neutral-500 block uppercase">Triage Tier</span>
                    <span
                      className={`inline-block px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase ${
                        currentEncounter.triageLevel === "Emergent"
                          ? "bg-red-600 text-white"
                          : currentEncounter.triageLevel === "Stable"
                          ? "bg-emerald-600 text-white"
                          : "bg-amber-600 text-white"
                      }`}
                    >
                      {currentEncounter.triageLevel || "URGENT"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-neutral-500 block uppercase">Date Recorded</span>
                    <span className="text-xs font-mono">{currentEncounter.timestamp}</span>
                  </div>
                </div>

                {/* Vitals Summary Strip */}
                <div className="bg-white p-2 border border-[#1a1a1a]/15 font-mono text-[10px] flex flex-wrap items-center justify-between text-neutral-700">
                  <span>
                    BP: <strong>{currentEncounter.vitals.bp}</strong>
                  </span>
                  <span>
                    Pulse: <strong>{currentEncounter.vitals.hr}</strong> bpm
                  </span>
                  <span>
                    SpO2: <strong>{currentEncounter.vitals.spo2}</strong>
                  </span>
                  <span>
                    Temp: <strong>{currentEncounter.vitals.temp}</strong>
                  </span>
                  <span>
                    Glucose: <strong>{currentEncounter.vitals.glucose}</strong>
                  </span>
                </div>

                {/* What You Need To Know Today (Human Plain Language) */}
                <div className="bg-white p-3.5 border-l-4 border-[#c5a27d] space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-bold text-[#1a1a1a] flex items-center gap-1.5">
                      <HeartPulse className="w-3.5 h-3.5 text-red-500" />
                      What You Need To Know In Plain Language:
                    </span>
                    <span className="text-[9px] font-mono text-[#c5a27d] uppercase font-bold">Bedside Order</span>
                  </div>

                  {currentEncounter.soapNote ? (
                    <div className="prose prose-xs max-h-56 overflow-y-auto text-neutral-800 leading-relaxed font-sans text-xs space-y-2 whitespace-pre-line border-t border-neutral-100 pt-2">
                      {currentEncounter.soapNote}
                    </div>
                  ) : (
                    <div className="text-neutral-500 italic py-3 text-center space-y-1">
                      <p>Awaiting clinical AI synthesis...</p>
                      <p className="text-[10px] font-mono not-italic text-neutral-400">
                        Click &quot;Engage Bedside Scribe &amp; Generate Card&quot; to produce live clinical instructions.
                      </p>
                    </div>
                  )}
                </div>

                {/* Emergency Red Flags & Signs to Return */}
                <div className="bg-red-50 border border-red-200 p-2.5 text-[11px] text-red-900 space-y-1">
                  <div className="font-bold flex items-center gap-1 uppercase tracking-wide text-[9px] font-mono text-red-700">
                    <AlertTriangle className="w-3 h-3 text-red-600" />
                    Immediate Emergency Red Flags (When to Call 911 or Return):
                  </div>
                  <p className="text-[10px] leading-snug">
                    Sudden chest pressure, inability to catch your breath while resting, lips or fingernails turning
                    blue/gray, sudden weakness or speech slurring.
                  </p>
                </div>

                {/* Card Signature & Seventeen Pockets Seal */}
                <div className="pt-2 border-t border-[#1a1a1a]/20 flex items-center justify-between text-[9px] font-mono text-neutral-600">
                  <div>
                    <span>Authorizing Physicians: </span>
                    <strong className="text-[#1a1a1a]">Dr. Odell Anderson Jr. & Dee Gone</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-[#c5a27d] font-bold">SEVENTEEN POCKETS CARE NETWORK</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions Under Card */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-neutral-100">
                <span className="text-[10px] font-mono text-neutral-500">
                  Vector: <strong>{currentEncounter.executionVector || "client-ready"}</strong>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      handleCopy(
                        currentEncounter.soapNote || "No clinical note synthesized yet.",
                        "copy-soap"
                      )
                    }
                    className="px-2.5 py-1 text-[10px] font-mono border border-neutral-300 hover:bg-neutral-50 flex items-center gap-1"
                  >
                    {copiedKey === "copy-soap" ? (
                      <Check className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <Copy className="w-3 h-3 text-neutral-500" />
                    )}
                    <span>Copy Full Clinical SOAP</span>
                  </button>
                  <button
                    onClick={() => {
                      onPublishToCouncil(
                        `[CARE CARD DISPATCHED] Pocket Card issued to ${currentEncounter.patientName} at ${currentEncounter.setting}`
                      );
                      setCurrentEncounter((prev) => ({ ...prev, status: "dispatched" }));
                    }}
                    className="px-2.5 py-1 text-[10px] font-mono bg-emerald-700 text-white hover:bg-emerald-800 flex items-center gap-1"
                  >
                    <Send className="w-3 h-3" />
                    <span>Confirm Handout to Patient</span>
                  </button>
                </div>
              </div>
            </div>

            {/* TANGIBLE PHYSICAL ARTIFACT: CARD PHOTO */}
            <div className="bg-white border border-[#1a1a1a]/15 p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                <div className="flex items-center space-x-2">
                  <Award className="w-4 h-4 text-[#c5a27d]" />
                  <span className="text-xs font-serif font-bold text-[#1a1a1a]">
                    Physical Sovereign Card &amp; ODLC Credential in Reality
                  </span>
                </div>
                <span className="text-[9px] font-mono text-[#c5a27d] bg-[#1a1a1a] px-2 py-0.5 font-bold">
                  TACTILE HARDWARE
                </span>
              </div>
              <div className="relative group overflow-hidden border border-neutral-200">
                <img
                  src="/src/assets/images/odlc_project_card_1791603977022.jpg"
                  alt="Physical Sovereign Patient Care Card and ODLC Credential"
                  className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-2 left-2 right-2 bg-black/85 backdrop-blur-sm p-2 text-white text-[10px] font-mono flex items-center justify-between">
                  <span>Golden Microchip • Encrypted QR • Embossed ODLC Seal</span>
                  <button
                    onClick={() => setActiveTab("brand-gallery")}
                    className="text-[#c5a27d] hover:underline flex items-center gap-1"
                  >
                    <span>View Brand Gallery</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SEVENTEEN POCKETS PHYSICAL FIELD DEPLOYMENT KIT */}
      {activeTab === "field-kit" && (
        <div className="space-y-6">
          {/* Status Metric Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white border border-[#1a1a1a]/15 p-4 space-y-1">
              <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider flex items-center justify-between">
                <span>Field Bag Readiness</span>
                <Package className="w-3.5 h-3.5 text-[#c5a27d]" />
              </span>
              <div className="text-2xl font-serif font-bold text-[#1a1a1a]">
                {readinessPercent}%{" "}
                <span className="text-xs font-mono font-normal text-emerald-700">
                  ({packedItems} / {totalItems} Pockets)
                </span>
              </div>
              <div className="w-full bg-neutral-100 h-1.5 mt-2 overflow-hidden">
                <div
                  className="bg-[#c5a27d] h-full transition-all duration-300"
                  style={{ width: `${readinessPercent}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-white border border-[#1a1a1a]/15 p-4 space-y-1">
              <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider flex items-center justify-between">
                <span>Total Pack Weight</span>
                <Activity className="w-3.5 h-3.5 text-[#c5a27d]" />
              </span>
              <div className="text-2xl font-serif font-bold text-[#1a1a1a]">
                {totalWeightLbs} <span className="text-xs font-mono font-normal text-neutral-500">lbs</span>
              </div>
              <p className="text-[10px] font-mono text-neutral-500">Ultra-light sovereign tactical pack</p>
            </div>

            <div className="bg-white border border-[#1a1a1a]/15 p-4 space-y-1">
              <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider flex items-center justify-between">
                <span>Air-Gap Independence</span>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              </span>
              <div className="text-2xl font-serif font-bold text-emerald-700">72+ Hours</div>
              <p className="text-[10px] font-mono text-neutral-500">Zero-cloud local compute runtime</p>
            </div>

            <div className="bg-white border border-[#1a1a1a]/15 p-4 space-y-1">
              <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider flex items-center justify-between">
                <span>Field Directives</span>
                <Printer className="w-3.5 h-3.5 text-[#c5a27d]" />
              </span>
              <button
                onClick={() => window.print()}
                className="w-full mt-1 px-3 py-2 bg-[#1a1a1a] text-white hover:bg-[#c5a27d] hover:text-[#1a1a1a] text-xs font-mono font-bold uppercase transition-colors"
              >
                Print Pack Manifest
              </button>
            </div>
          </div>

          {/* Pocket Checklist Grid */}
          <div className="bg-white border border-[#1a1a1a]/15 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div>
                <h3 className="text-lg font-serif font-bold text-[#1a1a1a]">
                  The 17 Pockets: Tangible Outpost Gear Manifest
                </h3>
                <p className="text-xs text-neutral-500">
                  Every pocket corresponds to a physical compartment carried into real human settlements.
                </p>
              </div>
              <button
                onClick={() =>
                  setCheckedPockets(
                    checkedPockets.length === totalItems ? [] : SEVENTEEN_POCKETS_PHYSICAL_KIT.map((p) => p.pocketNum)
                  )
                }
                className="text-xs font-mono text-[#c5a27d] hover:underline"
              >
                {checkedPockets.length === totalItems ? "Clear All" : "Select All 17 Pockets"}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {SEVENTEEN_POCKETS_PHYSICAL_KIT.map((item) => {
                const isChecked = checkedPockets.includes(item.pocketNum);
                return (
                  <div
                    key={item.pocketNum}
                    onClick={() => handleTogglePocket(item.pocketNum)}
                    className={`p-3.5 border cursor-pointer transition-all select-none ${
                      isChecked
                        ? "border-[#c5a27d] bg-[#FAF7F2] shadow-sm"
                        : "border-neutral-200 hover:border-neutral-300 bg-white opacity-60"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
                            isChecked ? "bg-[#1a1a1a] text-[#c5a27d]" : "bg-neutral-200 text-neutral-600"
                          }`}
                        >
                          {item.pocketNum}
                        </div>
                        <span className="text-[10px] font-mono font-semibold uppercase text-neutral-500">
                          {item.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        {item.critical && (
                          <span className="px-1 py-0.2 bg-red-100 text-red-800 text-[8px] font-mono font-bold">
                            CRITICAL
                          </span>
                        )}
                        <span className="text-[9px] font-mono text-neutral-400">{item.weightOz} oz</span>
                      </div>
                    </div>

                    <div className="mt-2">
                      <h4 className="text-xs font-serif font-bold text-[#1a1a1a]">{item.name}</h4>
                      <p className="text-[10px] text-neutral-600 font-sans mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-neutral-200/60 flex items-center justify-between text-[9px] font-mono">
                      <span className={isChecked ? "text-emerald-700 font-bold" : "text-neutral-400"}>
                        {isChecked ? "✓ PACKED & VERIFIED" : "○ UNCHECKED"}
                      </span>
                      <span className="text-neutral-400">Pocket #{item.pocketNum}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: 5-PHASE FULL CIRCLE MOVEMENT BLUEPRINT */}
      {activeTab === "movement-blueprint" && (
        <div className="space-y-6">
          <div className="bg-white border border-[#1a1a1a]/15 p-6 space-y-6">
            <div>
              <span className="text-[10px] font-mono font-bold text-[#c5a27d] uppercase tracking-wider">
                STRATEGIC ROADMAP FOR COMMUNITY REALIZATION
              </span>
              <h3 className="text-xl font-serif font-bold text-[#1a1a1a]">
                The 5-Phase Full Circle Movement: From Dream to Street Reality
              </h3>
              <p className="text-xs text-neutral-600 max-w-3xl mt-1 leading-relaxed">
                How Dr. Odell Anderson Jr., Dee Gone, and the Seventeen Pockets Care Cadre convert code and theology into
                physical health equity on the ground.
              </p>
            </div>

            <div className="space-y-4">
              {/* Phase 1 */}
              <div className="p-4 border-l-4 border-[#c5a27d] bg-[#FAF7F2] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#1a1a1a] flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#1a1a1a] text-[#c5a27d] flex items-center justify-center text-[10px]">
                      1
                    </span>
                    PHASE 1: THE DIVINE MISSION & COMMUNITY FOUNDATION
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold">
                    GROUNDED
                  </span>
                </div>
                <p className="text-xs text-neutral-700 leading-relaxed font-sans pl-7">
                  Rooted in <em>God Knew</em> and <em>goodwayz</em> principles of spiritual entrepreneurship. Establishing
                  physical trust anchors in churches, barber shops, senior centers, and community parks in Columbia, SC
                  and allied regions.
                </p>
              </div>

              {/* Phase 2 */}
              <div className="p-4 border-l-4 border-[#1a1a1a] bg-white space-y-2 border border-neutral-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#1a1a1a] flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#1a1a1a] text-white flex items-center justify-center text-[10px]">
                      2
                    </span>
                    PHASE 2: SOVEREIGN EDGE AIR-GAP DEPLOYMENT
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-blue-100 text-blue-800 font-bold">
                    OPERATIONAL
                  </span>
                </div>
                <p className="text-xs text-neutral-700 leading-relaxed font-sans pl-7">
                  Deploying the 17-pocket physical kit into mobile health vans and rural outpost clinics. Clinicians
                  operate fully independent of internet outages using local IndexedDB caching and lightweight on-device
                  AI models.
                </p>
              </div>

              {/* Phase 3 */}
              <div className="p-4 border-l-4 border-[#c5a27d] bg-[#FAF7F2] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#1a1a1a] flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#1a1a1a] text-[#c5a27d] flex items-center justify-center text-[10px]">
                      3
                    </span>
                    PHASE 3: AMBIENT CLINICAL ENCOUNTER & ACTIVE LISTENING
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-purple-100 text-purple-800 font-bold">
                    ACTIVE SCRIBE
                  </span>
                </div>
                <p className="text-xs text-neutral-700 leading-relaxed font-sans pl-7">
                  Clinicians sit knee-to-knee with real human patients without typing behind a wall of bureaucratic
                  monitors. Ambient AI transcribes distress, validates vitals, and formulates rigorous clinical SOAP
                  guidance in seconds.
                </p>
              </div>

              {/* Phase 4 */}
              <div className="p-4 border-l-4 border-emerald-600 bg-white space-y-2 border border-neutral-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#1a1a1a] flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px]">
                      4
                    </span>
                    PHASE 4: THE TANGIBLE ARTIFACT HANDOVER
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-amber-100 text-amber-800 font-bold">
                    TACTILE HANDOUT
                  </span>
                </div>
                <p className="text-xs text-neutral-700 leading-relaxed font-sans pl-7">
                  Placing the <strong>Printed Sovereign Patient Pocket Card</strong> directly into the patient&apos;s hand.
                  No portals, no lost passwords, no confusing insurance jargon. The card contains their medications,
                  red-flag warnings, and emergency peer contact info.
                </p>
              </div>

              {/* Phase 5 */}
              <div className="p-4 border-l-4 border-[#c5a27d] bg-[#FAF7F2] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#1a1a1a] flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#1a1a1a] text-[#c5a27d] flex items-center justify-center text-[10px]">
                      5
                    </span>
                    PHASE 5: 48-HOUR VILLAGE CARE CONTINUITY
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold">
                    CONTINUOUS
                  </span>
                </div>
                <p className="text-xs text-neutral-700 leading-relaxed font-sans pl-7">
                  Every patient encounter automatically dispatches a peer community ambassador or deacon/health
                  advocate to perform an in-person or phone wellness check within 48 hours, ensuring true whole-person
                  healing.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: COMMUNITY DISPATCHER & COLLATERAL */}
      {activeTab === "community-dispatcher" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Community Health Pop-Up Notice */}
          <div className="bg-white border border-[#1a1a1a]/15 p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
              <h4 className="text-sm font-serif font-bold text-[#1a1a1a] flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#c5a27d]" />
                Community Health Gathering Flyer
              </h4>
              <button
                onClick={() =>
                  handleCopy(
                    `SOVEREIGN COMMUNITY HEALTH CLINIC\nDirected by Dr. Odell Anderson Jr. & Dee Gone\nDate: Every Saturday 9am - 2pm\nFree Blood Pressure, Glucose, Cardiac Telemetry & Free Healthy Meal Provisions.\nNo Insurance Required. Privacy-First.`,
                    "flyer-copy"
                  )
                }
                className="text-[10px] font-mono text-[#c5a27d] hover:underline flex items-center gap-1"
              >
                {copiedKey === "flyer-copy" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                Copy Flyer Text
              </button>
            </div>
            <div className="bg-[#FAF7F2] p-4 border border-dashed border-[#c5a27d] space-y-2 font-serif text-center">
              <div className="text-[10px] font-mono uppercase text-[#c5a27d] font-bold">SEVENTEEN POCKETS OUTREACH</div>
              <h3 className="text-base font-bold text-[#1a1a1a]">SOVEREIGN COMMUNITY CLINIC &amp; HEALTH DAY</h3>
              <p className="text-xs text-neutral-600 italic">
                &ldquo;Where Healthcare Meets Faith, Dignity, and Real Human Brotherhood.&rdquo;
              </p>
              <div className="text-xs font-sans text-neutral-700 text-left space-y-1 bg-white p-3 border border-neutral-200 mt-2">
                <div>• Free Vital Screenings (BP, Blood Sugar, SpO2, Heart Rhythm)</div>
                <div>• Direct consultation with Dr. Odell Anderson Jr. &amp; Dee Gone&apos;s Care Cadre</div>
                <div>• Personalized Patient Pocket Cards printed on the spot</div>
                <div>• Fresh produce and pescatarian meal bags provided for families</div>
              </div>
            </div>
          </div>

          {/* Card 2: 48-Hour Peer Follow-Up SMS Template */}
          <div className="bg-white border border-[#1a1a1a]/15 p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
              <h4 className="text-sm font-serif font-bold text-[#1a1a1a] flex items-center gap-1.5">
                <PhoneCall className="w-4 h-4 text-emerald-600" />
                48-Hour Ambassador SMS Dispatch
              </h4>
              <button
                onClick={() =>
                  handleCopy(
                    `Hello Mrs. Vance, this is your Stratum Community Health Ambassador following up from your visit with Dr. Odell & Dee Gone yesterday. How are your feet feeling today? Have you taken your blood pressure reading this morning? Reply to this text if you need anything at all.`,
                    "sms-copy"
                  )
                }
                className="text-[10px] font-mono text-[#c5a27d] hover:underline flex items-center gap-1"
              >
                {copiedKey === "sms-copy" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                Copy SMS Dispatch
              </button>
            </div>
            <div className="bg-neutral-50 p-4 border border-neutral-200 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between text-[10px] text-neutral-500 border-b border-neutral-200 pb-1">
                <span>TARGET: {currentEncounter.patientName}</span>
                <span>DISPATCH: AUTOMATED VIA TWILIO/WEBHOOK</span>
              </div>
              <div className="bg-white p-3 border border-neutral-300 rounded shadow-sm text-neutral-800 leading-relaxed">
                &ldquo;Hello {currentEncounter.patientName}, this is your Stratum Community Health Ambassador following up
                from your visit with Dr. Odell &amp; Dee Gone yesterday. How are you feeling today? Have you been able to take
                your medications and drink plenty of water as outlined on your Pocket Care Card? We are right here with you.&rdquo;
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-emerald-700 font-bold">✓ Ready for Out-of-Band Dispatch</span>
                <span className="text-neutral-400">142 Characters</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: OFFICIAL BRAND & PROGRAM PROJECT PHOTO GALLERY */}
      {activeTab === "brand-gallery" && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="bg-[#1a1a1a] text-[#FAF7F2] p-6 border-2 border-[#c5a27d] flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
            <div className="flex items-center space-x-4 z-10">
              <div className="w-16 h-16 rounded border-2 border-[#c5a27d] bg-black/60 overflow-hidden shrink-0 shadow-md">
                <img
                  src="/src/assets/images/odlc_brand_logo_1791603956565.jpg"
                  alt="ODLC Official Brand Logo"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono tracking-widest text-[#c5a27d] uppercase font-bold">
                    OFFICIAL ASSETS REPOSITORY
                  </span>
                  <span className="text-[9px] font-mono px-2 py-0.5 bg-[#c5a27d]/20 text-[#c5a27d] border border-[#c5a27d]/40">
                    SEVENTEEN POCKETS BRAND INC.
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
                  Program Project Showcase &amp; ODLC Brand Identity
                </h2>
                <p className="text-xs text-neutral-300 font-light max-w-xl">
                  Official photography and insignia honoring the sovereign clinical vision of{" "}
                  <strong className="text-[#c5a27d]">Dr. Odell Anderson Jr.</strong> &amp;{" "}
                  <strong className="text-[#c5a27d]">Dee Gone</strong>.
                </p>
              </div>
            </div>

            <div className="z-10 flex flex-wrap items-center gap-2">
              <a
                href="/src/assets/images/seventeen_pockets_showcase_1791603966885.jpg"
                download="program_project_seventeen_pockets.jpg"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 bg-[#c5a27d] hover:bg-[#b08d66] text-[#1a1a1a] text-xs font-mono font-bold flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Project Photo</span>
              </a>
              <a
                href="/src/assets/images/odlc_brand_logo_1791603956565.jpg"
                download="odlc_brand_logo.jpg"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-mono border border-white/20 flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-[#c5a27d]" />
                <span>Download ODLC Logo</span>
              </a>
            </div>
          </div>

          {/* MAIN SHOWCASE: PROGRAM PROJECT PHOTOGRAPH */}
          <div className="bg-white border-2 border-[#1a1a1a] p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <div>
                <span className="text-[10px] font-mono text-[#c5a27d] uppercase font-bold tracking-wider">
                  FLAGSHIP PROGRAM HARDWARE &amp; CLINICAL SUITE
                </span>
                <h3 className="text-lg font-serif font-bold text-[#1a1a1a]">
                  Program Project Photograph: Stratum Clinical Edge
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-[#FAF7F2] border border-[#1a1a1a]/20 text-[#1a1a1a] font-semibold">
                8K ULTRA HIGH-RES • STUDIO ARCHIVAL
              </span>
            </div>

            {/* WRAPPED FLAGSHIP PHOTO IN VIDEO HOVERCARD */}
            <VideoHoverCard
              video={ECOSYSTEM_VIDEOS["hardware-showcase"]}
              onExpand={(v) => {
                setSelectedCinemaVideo(v);
                setShowCinemaModal(true);
              }}
              position="bottom"
              align="center"
              cardWidth={420}
            >
              <div
                onClick={() => {
                  setSelectedCinemaVideo(ECOSYSTEM_VIDEOS["hardware-showcase"]);
                  setShowCinemaModal(true);
                }}
                className="relative group overflow-hidden border-2 border-[#1a1a1a] bg-[#111216] rounded-sm cursor-pointer block"
                title="Hover for live video preview • Click for 4K Cinema Theater"
              >
                <img
                  src="/src/assets/images/seventeen_pockets_showcase_1791603966885.jpg"
                  alt="Program Project Photograph: Stratum Clinical Edge by Seventeen Pockets Brand Inc"
                  className="w-full max-h-[550px] object-cover group-hover:scale-[1.01] transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-[#1a1a1a]/90 backdrop-blur-sm px-3 py-1 border border-[#c5a27d] text-[10px] font-mono text-[#FAF7F2] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>STRATUM CLINICAL EDGE • SEVENTEEN POCKETS BRAND INC.</span>
                </div>
                <div className="absolute bottom-3 right-3 flex items-center gap-2 z-10">
                  <span className="px-3 py-1.5 bg-[#c5a27d] text-[#1a1a1a] text-xs font-mono font-bold flex items-center gap-1.5 shadow-md group-hover:bg-white transition-colors">
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Watch 4K Video Reel</span>
                  </span>
                  <span className="px-2 py-1 bg-black/80 text-[10px] font-mono text-neutral-300 border border-neutral-700">
                    Hover for Video Preview
                  </span>
                </div>
              </div>
            </VideoHoverCard>

            {/* Feature Annotations Grid with Video Hovercards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
              <VideoHoverCard
                video={ECOSYSTEM_VIDEOS["hardware-showcase"]}
                onExpand={(v) => {
                  setSelectedCinemaVideo(v);
                  setShowCinemaModal(true);
                }}
                position="top"
                cardWidth={330}
              >
                <div className="p-3 bg-[#FAF7F2] border border-neutral-200 hover:border-[#c5a27d] transition-colors space-y-1 cursor-pointer h-full">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono text-[#c5a27d] font-bold block uppercase">
                      1. RUGGED CLINICAL TABLET
                    </span>
                    <span className="text-[8px] font-mono text-emerald-700 bg-emerald-50 px-1 border border-emerald-200 font-bold">
                      📹 Video
                    </span>
                  </div>
                  <strong className="text-xs font-serif text-[#1a1a1a] block">Stratum Clinical Edge Node</strong>
                  <p className="text-[11px] text-neutral-600 font-sans">
                    IP68 field-ready edge computing terminal running offline PWA and IndexedDB sovereign vault.
                  </p>
                </div>
              </VideoHoverCard>

              <VideoHoverCard
                video={ECOSYSTEM_VIDEOS["hardware-showcase"]}
                onExpand={(v) => {
                  setSelectedCinemaVideo(v);
                  setShowCinemaModal(true);
                }}
                position="top"
                cardWidth={330}
              >
                <div className="p-3 bg-[#FAF7F2] border border-neutral-200 hover:border-[#c5a27d] transition-colors space-y-1 cursor-pointer h-full">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono text-[#c5a27d] font-bold block uppercase">
                      2. ODLC LEATHER FOLIO
                    </span>
                    <span className="text-[8px] font-mono text-amber-700 bg-amber-50 px-1 border border-amber-200 font-bold">
                      📹 Video
                    </span>
                  </div>
                  <strong className="text-xs font-serif text-[#1a1a1a] block">Sovereign Clinical Folio</strong>
                  <p className="text-[11px] text-neutral-600 font-sans">
                    Executive leatherbound binder embossed with the official golden ODLC monogram insignia.
                  </p>
                </div>
              </VideoHoverCard>

              <VideoHoverCard
                video={ECOSYSTEM_VIDEOS["hardware-showcase"]}
                onExpand={(v) => {
                  setSelectedCinemaVideo(v);
                  setShowCinemaModal(true);
                }}
                position="top"
                cardWidth={330}
              >
                <div className="p-3 bg-[#FAF7F2] border border-neutral-200 hover:border-[#c5a27d] transition-colors space-y-1 cursor-pointer h-full">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono text-[#c5a27d] font-bold block uppercase">
                      3. POCKET PATIENT CARE CARD
                    </span>
                    <span className="text-[8px] font-mono text-blue-700 bg-blue-50 px-1 border border-blue-200 font-bold">
                      📹 Video
                    </span>
                  </div>
                  <strong className="text-xs font-serif text-[#1a1a1a] block">Tactile Human Artifact</strong>
                  <p className="text-[11px] text-neutral-600 font-sans">
                    Physical gold-accented passport placed directly in patient pockets with offline encrypted telemetry.
                  </p>
                </div>
              </VideoHoverCard>

              <VideoHoverCard
                video={ECOSYSTEM_VIDEOS["clinical-telemetry"]}
                onExpand={(v) => {
                  setSelectedCinemaVideo(v);
                  setShowCinemaModal(true);
                }}
                position="top"
                cardWidth={330}
              >
                <div className="p-3 bg-[#FAF7F2] border border-neutral-200 hover:border-[#c5a27d] transition-colors space-y-1 cursor-pointer h-full">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono text-[#c5a27d] font-bold block uppercase">
                      4. CLINICAL ACOUSTICS &amp; ENCRYPTION
                    </span>
                    <span className="text-[8px] font-mono text-purple-700 bg-purple-50 px-1 border border-purple-200 font-bold">
                      📹 Video
                    </span>
                  </div>
                  <strong className="text-xs font-serif text-[#1a1a1a] block">Tactical Stethoscope &amp; Vault</strong>
                  <p className="text-[11px] text-neutral-600 font-sans">
                    Littmann acoustic precision and the safe 17-pocket offline encryption hardware module.
                  </p>
                </div>
              </VideoHoverCard>
            </div>
          </div>

          {/* TWO-COLUMN GRID: ODLC LOGO & PHYSICAL CARD STILL LIFE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ODLC OFFICIAL BRAND LOGO CARD */}
            <div className="bg-white border-2 border-[#1a1a1a] p-5 shadow-md space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                  <div>
                    <span className="text-[9px] font-mono text-[#c5a27d] uppercase font-bold tracking-wider">
                      BRAND IDENTITY
                    </span>
                    <h3 className="text-base font-serif font-bold text-[#1a1a1a]">
                      ODLC Official Insignia Logo
                    </h3>
                  </div>
                  <span className="text-[9px] font-mono px-2 py-0.5 bg-neutral-100 text-neutral-700 font-bold">
                    SEVENTEEN POCKETS BRAND INC.
                  </span>
                </div>

                <VideoHoverCard
                  video={ECOSYSTEM_VIDEOS["keynote-sovereign-ai"]}
                  onExpand={(v) => {
                    setSelectedCinemaVideo(v);
                    setShowCinemaModal(true);
                  }}
                  position="top"
                  cardWidth={340}
                >
                  <div
                    onClick={() => {
                      setSelectedCinemaVideo(ECOSYSTEM_VIDEOS["keynote-sovereign-ai"]);
                      setShowCinemaModal(true);
                    }}
                    className="border border-neutral-200 rounded overflow-hidden bg-[#FAF7F2] p-2 flex items-center justify-center cursor-pointer group/logo relative"
                    title="Hover for video preview • Click for 4K Cinema Theater"
                  >
                    <img
                      src="/src/assets/images/odlc_brand_logo_1791603956565.jpg"
                      alt="ODLC Official Brand Logo"
                      className="w-full max-h-72 object-contain rounded group-hover/logo:scale-101 transition-transform"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-[#1a1a1a]/90 text-[9px] font-mono text-[#c5a27d] border border-[#c5a27d]/40 flex items-center gap-1 shadow-xs">
                      <span>📹 Video Preview</span>
                    </div>
                  </div>
                </VideoHoverCard>

                <div className="space-y-1.5 text-xs text-neutral-700 font-sans leading-relaxed">
                  <p>
                    <strong>Typography &amp; Heraldry:</strong> Intertwining geometric letters <em>ODLC</em> rendered in
                    brushed muted gold (#c5a27d) and deep charcoal (#1a1a1a) with seventeen faceted pockets embedded in the central rosette.
                  </p>
                  <p className="text-[11px] text-neutral-500 font-mono">
                    Official Trademark of Seventeen Pockets Brand Inc. • Dr. Odell Anderson Jr.
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                <span className="text-[10px] font-mono text-neutral-500">Vector &amp; Print Ready</span>
                <a
                  href="/src/assets/images/odlc_brand_logo_1791603956565.jpg"
                  download="odlc_brand_logo_official.jpg"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-[#1a1a1a] text-[#FAF7F2] hover:bg-[#c5a27d] hover:text-[#1a1a1a] text-[10px] font-mono font-bold flex items-center gap-1 transition-colors"
                >
                  <Download className="w-3 h-3" />
                  <span>Download Logo Asset</span>
                </a>
              </div>
            </div>

            {/* PHYSICAL CARD MACRO STILL LIFE CARD */}
            <div className="bg-white border-2 border-[#1a1a1a] p-5 shadow-md space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                  <div>
                    <span className="text-[9px] font-mono text-[#c5a27d] uppercase font-bold tracking-wider">
                      TACTILE ARTIFACT
                    </span>
                    <h3 className="text-base font-serif font-bold text-[#1a1a1a]">
                      Sovereign Care Card &amp; ODLC Credential
                    </h3>
                  </div>
                  <span className="text-[9px] font-mono px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                    PHYSICAL HARDWARE
                  </span>
                </div>

                <VideoHoverCard
                  video={ECOSYSTEM_VIDEOS["hardware-showcase"]}
                  onExpand={(v) => {
                    setSelectedCinemaVideo(v);
                    setShowCinemaModal(true);
                  }}
                  position="top"
                  cardWidth={340}
                >
                  <div
                    onClick={() => {
                      setSelectedCinemaVideo(ECOSYSTEM_VIDEOS["hardware-showcase"]);
                      setShowCinemaModal(true);
                    }}
                    className="border border-neutral-200 rounded overflow-hidden bg-[#FAF7F2] p-2 flex items-center justify-center cursor-pointer group/card relative"
                    title="Hover for video preview • Click for 4K Cinema Theater"
                  >
                    <img
                      src="/src/assets/images/odlc_project_card_1791603977022.jpg"
                      alt="Sovereign Patient Care Card & ODLC Credential"
                      className="w-full max-h-72 object-contain rounded group-hover/card:scale-101 transition-transform"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-[#1a1a1a]/90 text-[9px] font-mono text-[#c5a27d] border border-[#c5a27d]/40 flex items-center gap-1 shadow-xs">
                      <span>📹 Video Preview</span>
                    </div>
                  </div>
                </VideoHoverCard>

                <div className="space-y-1.5 text-xs text-neutral-700 font-sans leading-relaxed">
                  <p>
                    <strong>Field Engineering:</strong> Embedded smart microchip, high-contrast encrypted QR matrix, and
                    embossed gold ODLC crest providing instant off-grid verification for bedside clinicians and patients.
                  </p>
                  <p className="text-[11px] text-neutral-500 font-mono">
                    Designed for field durability across rural and urban mobile triage outposts.
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                <button
                  onClick={() => setActiveTab("bedside-scribe")}
                  className="px-3 py-1.5 bg-[#FAF7F2] border border-[#1a1a1a] text-[#1a1a1a] hover:bg-white text-[10px] font-mono font-bold flex items-center gap-1 transition-colors"
                >
                  <Printer className="w-3 h-3 text-[#c5a27d]" />
                  <span>Generate New Card</span>
                </button>
                <a
                  href="/src/assets/images/odlc_project_card_1791603977022.jpg"
                  download="seventeen_pockets_care_card_macro.jpg"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-[#1a1a1a] text-[#FAF7F2] hover:bg-[#c5a27d] hover:text-[#1a1a1a] text-[10px] font-mono font-bold flex items-center gap-1 transition-colors"
                >
                  <Download className="w-3 h-3" />
                  <span>Download Macro Photo</span>
                </a>
              </div>
            </div>
          </div>
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
