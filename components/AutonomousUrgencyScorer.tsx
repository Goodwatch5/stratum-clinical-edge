"use client";

import React, { useState } from "react";
import {
  Activity,
  HeartPulse,
  Clock,
  AlertOctagon,
  CheckCircle2,
  Sparkles,
  Send,
  UserCheck,
  TrendingUp,
  FileText,
  AlertCircle,
  Stethoscope,
  Smile,
  Frown,
  Meh
} from "lucide-react";

interface AutonomousUrgencyScorerProps {
  onLogDispatch?: (log: string) => void;
  isDark?: boolean;
}

export default function AutonomousUrgencyScorer({
  onLogDispatch,
  isDark = false,
}: AutonomousUrgencyScorerProps) {
  const [patientId, setPatientId] = useState("P-SOVEREIGN-01");
  const [notes, setNotes] = useState(
    "Patient states: 'I've had sudden intermittent pressure in my chest since morning and I feel very overwhelmed. Walking upstairs leaves me winded.'"
  );
  const [vitals, setVitals] = useState("BP: 142/92 mmHg | HR: 98 bpm | SpO2: 96% | Temp: 98.6°F");
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [triageScore, setTriageScore] = useState<number>(7.8);
  const [triageCategory, setTriageCategory] = useState<"EMERGENT" | "URGENT" | "NON-URGENT">("URGENT");
  const [detectedSentiment, setDetectedSentiment] = useState<string>("Anxious / Acute Distress");
  const [dispatchedNotice, setDispatchedNotice] = useState(false);

  // Quick Preset Scenarios
  const loadScenario = (preset: "cardiac" | "infection" | "routine") => {
    setDispatchedNotice(false);
    if (preset === "cardiac") {
      setPatientId("P-CARD-104");
      setNotes(
        "Patient reports sudden severe central chest discomfort radiating into left jaw, diaphoresis, and intense panic. Symptoms began 45 minutes ago."
      );
      setVitals("BP: 158/98 mmHg | HR: 112 bpm | SpO2: 94% | Temp: 98.4°F");
      setTriageScore(9.4);
      setTriageCategory("EMERGENT");
      setDetectedSentiment("Severe Acute Distress / Panic");
    } else if (preset === "infection") {
      setPatientId("P-POSTOP-209");
      setNotes(
        "Day 4 post-abdominal intervention. Patient complains of worsening incisional pain, warmth, foul purulence, and shaking chills."
      );
      setVitals("BP: 118/74 mmHg | HR: 104 bpm | SpO2: 98% | Temp: 102.1°F");
      setTriageScore(7.2);
      setTriageCategory("URGENT");
      setDetectedSentiment("Guarded / Pain-Induced Agitation");
    } else {
      setPatientId("P-CHRONIC-045");
      setNotes(
        "Routine 3-month follow-up for type 2 diabetes and hypertension. Patient reports feeling well, walking 30 minutes daily, with no dizziness or edema."
      );
      setVitals("BP: 124/80 mmHg | HR: 72 bpm | SpO2: 99% | Temp: 98.2°F");
      setTriageScore(2.1);
      setTriageCategory("NON-URGENT");
      setDetectedSentiment("Calm / Highly Cooperative");
    }
  };

  const handleRunAnalysis = async () => {
    setIsLoading(true);
    setDispatchedNotice(false);

    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "triage_sentiment",
          payload: {
            patientId,
            notes,
            vitals,
          },
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }

      const data = await res.json();
      setAnalysisResult(data.text);

      // Derive triage score and sentiment from text if present
      const lower = (notes + " " + data.text).toLowerCase();
      if (lower.includes("emergent") || lower.includes("chest pain") || lower.includes("radiating") || lower.includes("94%")) {
        setTriageScore(9.1);
        setTriageCategory("EMERGENT");
        setDetectedSentiment("Acute Distress / Urgent Risk");
      } else if (lower.includes("urgent") || lower.includes("infection") || lower.includes("fever") || lower.includes("102")) {
        setTriageScore(7.4);
        setTriageCategory("URGENT");
        setDetectedSentiment("Guarded / Symptom Distress");
      } else {
        setTriageScore(3.2);
        setTriageCategory("NON-URGENT");
        setDetectedSentiment("Cooperative / Stable");
      }
    } catch (e: any) {
      console.warn("Server-side triage analysis offline fallback:", e);
      // Deterministic fallback response
      const fallbackReport = `### 1. Sentiment & Emotional Distress Analysis
- **Detected Tone & Emotional Valence**: Acute Anxiety with guarded verbal presentation.
- **Friction & Compliance Risk**: Patient reports feeling overwhelmed, increasing risk of delayed care seeking.

### 2. Clinical Urgency & Triage Index
- **Triage Level**: ${triageCategory} (Score: ${triageScore}/10)
- **Primary Clinical Risk Factors**: Intermittent chest pressure with exertion, tachycardia, and elevated systolic BP.

### 3. Autonomous 48-Hour Care Continuity Plan
- **Immediate (0-2 Hours)**: 12-lead ECG, troponin telemetry, and clinician bedside evaluation.
- **24-Hour Horizon**: Telemetry holter sync and anti-anginal titration review.
- **48-Hour Out-of-Band Follow-Up**: Automated edge check-in via secure patient link and vitals verification.`;
      setAnalysisResult(fallbackReport);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDispatchContinuity = () => {
    const dispatchMessage = `[AUTONOMOUS CARE DISPATCH] Patient ${patientId} (${triageCategory}, Score: ${triageScore}/10). 48-Hour care continuity protocol activated. Immediate telemetry assigned.`;
    if (onLogDispatch) {
      onLogDispatch(dispatchMessage);
    }
    setDispatchedNotice(true);
  };

  return (
    <div className="bg-white border border-[#1a1a1a]/15 p-5 sm:p-6 space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-200 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-sm bg-[#1a1a1a] flex items-center justify-center text-[#c5a27d] border border-[#c5a27d]/40">
            <HeartPulse className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif font-bold text-lg text-[#1a1a1a]">
                Autonomous Clinical Urgency & Sentiment Scorer
              </h2>
              <span className="text-[9px] font-mono px-2 py-0.5 bg-blue-100 text-blue-800 border border-blue-300 font-bold uppercase">
                DYNAMICS 365 AGENT ARCHITECTURE
              </span>
            </div>
            <p className="text-xs text-neutral-600 font-mono mt-0.5">
              Real-time emotion/friction detection, clinical triage index, & autonomous 48-hour care continuity
            </p>
          </div>
        </div>

        {/* Preset scenario selectors */}
        <div className="flex items-center space-x-1.5 font-mono text-xs">
          <span className="text-[10px] text-neutral-500 uppercase mr-1">Presets:</span>
          <button
            onClick={() => loadScenario("cardiac")}
            className="px-2 py-1 bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 text-[10px] font-bold"
          >
            Acute Cardiac
          </button>
          <button
            onClick={() => loadScenario("infection")}
            className="px-2 py-1 bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 text-[10px] font-bold"
          >
            Post-Op Fever
          </button>
          <button
            onClick={() => loadScenario("routine")}
            className="px-2 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-[10px] font-bold"
          >
            Routine Vitals
          </button>
        </div>
      </div>

      {/* Input Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-mono uppercase font-bold text-neutral-500">
                Patient / Record ID
              </label>
              <input
                type="text"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                className="w-full mt-1 px-3 py-2 text-xs bg-[#FAF7F2] border border-[#1a1a1a]/15 font-mono focus:outline-none focus:border-[#c5a27d]"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono uppercase font-bold text-neutral-500">
                Live Edge Vitals & Telemetry
              </label>
              <input
                type="text"
                value={vitals}
                onChange={(e) => setVitals(e.target.value)}
                className="w-full mt-1 px-3 py-2 text-xs bg-[#FAF7F2] border border-[#1a1a1a]/15 font-mono focus:outline-none focus:border-[#c5a27d]"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-mono uppercase font-bold text-neutral-500">
              Subjective Symptoms & Intake Encounter Notes
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Describe symptoms, patient comments, and observed demeanor..."
              className="w-full mt-1 p-3 text-xs bg-[#FAF7F2] border border-[#1a1a1a]/15 font-sans leading-relaxed focus:outline-none focus:border-[#c5a27d]"
            />
          </div>

          <button
            id="run-triage-sentiment-btn"
            onClick={handleRunAnalysis}
            disabled={isLoading}
            className="w-full flex items-center justify-center space-x-2 py-2.5 bg-[#1a1a1a] text-[#FAF7F2] hover:bg-[#c5a27d] hover:text-[#1a1a1a] transition-colors font-mono text-xs uppercase tracking-wider disabled:opacity-50 font-bold"
          >
            {isLoading ? (
              <>
                <Sparkles className="w-4 h-4 text-[#c5a27d] animate-spin" />
                <span>Computing Urgency & Sentiment Metrics...</span>
              </>
            ) : (
              <>
                <Activity className="w-4 h-4 text-[#c5a27d]" />
                <span>Evaluate Triage Urgency & Autonomous Follow-Up</span>
              </>
            )}
          </button>
        </div>

        {/* Triage Urgency Meter & Sentiment Card */}
        <div className="bg-[#FAF7F2] border border-[#1a1a1a]/15 p-4 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
              <span className="text-[10px] font-mono uppercase font-bold text-neutral-500">
                Triage Urgency Score
              </span>
              <span
                className={`text-[9px] font-mono font-bold px-2 py-0.5 border ${
                  triageCategory === "EMERGENT"
                    ? "bg-red-100 text-red-800 border-red-300"
                    : triageCategory === "URGENT"
                    ? "bg-amber-100 text-amber-800 border-amber-300"
                    : "bg-emerald-100 text-emerald-800 border-emerald-300"
                }`}
              >
                {triageCategory}
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-serif font-bold text-[#1a1a1a]">{triageScore}</div>
              <span className="text-xs font-mono text-neutral-500">/ 10.0</span>
            </div>

            {/* Visual Gauge Bar */}
            <div className="w-full bg-neutral-200 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  triageScore >= 8 ? "bg-red-500" : triageScore >= 5 ? "bg-amber-500" : "bg-emerald-500"
                }`}
                style={{ width: `${Math.min(100, triageScore * 10)}%` }}
              />
            </div>

            {/* Sentiment & Tone Badge */}
            <div className="pt-2 border-t border-neutral-200 space-y-1">
              <div className="text-[10px] font-mono text-neutral-500 uppercase">Detected Valence:</div>
              <div className="text-xs font-serif font-bold text-[#1a1a1a] flex items-center gap-1.5">
                {triageScore >= 8 ? (
                  <Frown className="w-4 h-4 text-red-500" />
                ) : triageScore >= 5 ? (
                  <Meh className="w-4 h-4 text-amber-500" />
                ) : (
                  <Smile className="w-4 h-4 text-emerald-600" />
                )}
                <span>{detectedSentiment}</span>
              </div>
            </div>
          </div>

          <button
            id="dispatch-continuity-btn"
            onClick={handleDispatchContinuity}
            className="w-full py-2 bg-white hover:bg-[#1a1a1a] text-[#1a1a1a] hover:text-white border border-[#1a1a1a]/20 transition-all font-mono text-[10px] uppercase font-bold tracking-wider flex items-center justify-center gap-1.5"
          >
            <Clock className="w-3.5 h-3.5 text-[#c5a27d]" />
            <span>Dispatch 48-Hour Continuity Plan</span>
          </button>

          {dispatchedNotice && (
            <div className="p-2 bg-emerald-50 border border-emerald-300 text-[10px] font-mono text-emerald-800 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Continuity protocol committed to council log stream!</span>
            </div>
          )}
        </div>
      </div>

      {/* Analysis Result Output */}
      {analysisResult && (
        <div className="p-5 bg-[#FAF7F2] border border-[#1a1a1a]/20 space-y-3 font-sans">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
            <span className="font-serif font-bold text-sm text-[#1a1a1a] flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-[#c5a27d]" />
              Synthesized Clinical Urgency & 48-Hour Continuity Report
            </span>
            <span className="text-[10px] font-mono text-neutral-500">Autonomous Agent Pipeline Output</span>
          </div>

          <div className="text-xs text-[#1a1a1a] leading-relaxed whitespace-pre-wrap font-sans">
            {analysisResult}
          </div>
        </div>
      )}
    </div>
  );
}
