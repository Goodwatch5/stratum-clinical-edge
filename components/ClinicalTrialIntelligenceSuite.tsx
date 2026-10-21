"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  FileText,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  MapPin,
  Building2,
  Send,
  Loader2,
  ShieldCheck,
  Stethoscope,
  Microscope,
  Info,
  Compass,
  ArrowRight,
  UserCheck,
  PhoneCall,
  Sparkles,
} from "lucide-react";

interface TrialSummary {
  nct_id: string;
  title: string;
  phase: string;
  status: string;
  summary: string;
  locations: string[];
  conditions?: string[];
  sponsor?: string;
  url: string;
}

interface ProtocolDetails {
  nct_id: string;
  official_title: string;
  brief_title?: string;
  study_phase: string;
  status: string;
  summary: string;
  inclusion_criteria: string[];
  exclusion_criteria: string[];
  primary_endpoints: string[];
  sponsor_name: string;
  contact_email: string;
  locations: string[];
  official_url: string;
}

interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
  isEmergency?: boolean;
}

export default function ClinicalTrialIntelligenceSuite() {
  // State: Persona & Active Tab
  const [userRole, setUserRole] = useState<"GlobalTrialSeeker" | "ClinicalResearcher">("GlobalTrialSeeker");
  const [activeView, setActiveView] = useState<"search" | "protocol" | "assistant">("search");

  // Search State
  const [conditionInput, setConditionInput] = useState("Non-Small Cell Lung Cancer");
  const [locationInput, setLocationInput] = useState("");
  const [phaseFilter, setPhaseFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("RECRUITING");
  const [isSearching, setIsSearching] = useState(false);
  const [trials, setTrials] = useState<TrialSummary[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [searchSource, setSearchSource] = useState("");
  const [searchError, setSearchError] = useState<string | null>(null);

  // Selected Trial Protocol State
  const [selectedTrialId, setSelectedTrialId] = useState<string | null>(null);
  const [protocolDetails, setProtocolDetails] = useState<ProtocolDetails | null>(null);
  const [isLoadingProtocol, setIsLoadingProtocol] = useState(false);

  // Eligibility Checklist State
  const [checkedInclusions, setCheckedInclusions] = useState<Record<number, boolean>>({});
  const [checkedExclusions, setCheckedExclusions] = useState<Record<number, boolean>>({});

  // Assistant Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-1",
      sender: "assistant",
      text: `### Welcome to Stratum Clinical Edge Intelligence

I provide grounded clinical trial navigation, protocol explanations, and eligibility criteria guidance backed by verified clinical trial registries (ClinicalTrials.gov, NIH, and peer-reviewed guidelines).

**How I can support your search today:**
- Search actively recruiting clinical trials by medical condition, phase, or geographic location.
- Review and break down complex inclusion and exclusion criteria for specific protocols.
- Explain technical research terminology, clinical endpoints, and study designs.

*Please select your perspective above: **Patient & Family (GlobalTrialSeeker)** for clear, patient-centered explanations, or **Clinical Researcher** for technical endpoints and protocol mechanics.*`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isAssistantSending, setIsAssistantSending] = useState(false);

  // Initial load: run default search
  useEffect(() => {
    handleExecuteSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleExecuteSearch = async (overrideCondition?: string) => {
    const queryCond = overrideCondition !== undefined ? overrideCondition : conditionInput;
    setIsSearching(true);
    setSearchError(null);

    try {
      const res = await fetch("/api/clinical-trials/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          condition: queryCond,
          location: locationInput,
          phase: phaseFilter,
          status: statusFilter,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setTrials(data.trials || []);
        setTotalResults(data.total_results || (data.trials || []).length);
        setSearchSource(data.source || "ClinicalTrials.gov API v2");
      } else {
        setSearchError(data.mitigation_action || data.description || "No trials found matching specified criteria.");
        setTrials([]);
        setTotalResults(0);
      }
    } catch (err: any) {
      setSearchError("Trial registry backend lookup temporarily unavailable. Please retry with a broader condition term.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectTrial = async (nctId: string) => {
    setSelectedTrialId(nctId);
    setActiveView("protocol");
    setIsLoadingProtocol(true);
    setCheckedInclusions({});
    setCheckedExclusions({});

    try {
      const res = await fetch(`/api/clinical-trials/${nctId}`);
      if (res.ok) {
        const details = await res.json();
        setProtocolDetails(details);
      } else {
        setProtocolDetails(null);
      }
    } catch (err) {
      console.error("Failed to load trial protocol:", err);
      setProtocolDetails(null);
    } finally {
      setIsLoadingProtocol(false);
    }
  };

  // Eligibility Evaluation Logic
  const totalInclusionCount = protocolDetails?.inclusion_criteria?.length || 0;
  const totalExclusionCount = protocolDetails?.exclusion_criteria?.length || 0;
  const totalCriteria = totalInclusionCount + totalExclusionCount;

  const inclusionCheckedCount = Object.values(checkedInclusions).filter(Boolean).length;
  const exclusionCheckedCount = Object.values(checkedExclusions).filter(Boolean).length;
  const criteriaEvaluated = inclusionCheckedCount + exclusionCheckedCount;

  let eligibilityStatus: "POTENTIALLY_ELIGIBLE" | "LIKELY_INELIGIBLE" | "REQUIRES_CLINICAL_EVALUATION" =
    "REQUIRES_CLINICAL_EVALUATION";

  if (criteriaEvaluated > 0) {
    if (inclusionCheckedCount === totalInclusionCount && exclusionCheckedCount === totalExclusionCount) {
      eligibilityStatus = "POTENTIALLY_ELIGIBLE";
    } else if (criteriaEvaluated > totalCriteria / 2) {
      eligibilityStatus = "POTENTIALLY_ELIGIBLE";
    } else {
      eligibilityStatus = "REQUIRES_CLINICAL_EVALUATION";
    }
  }

  // Chat message send handler
  const handleSendChatMessage = async (presetText?: string) => {
    const textToSend = presetText || chatInput;
    if (!textToSend.trim() || isAssistantSending) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    if (!presetText) setChatInput("");
    setIsAssistantSending(true);

    try {
      const res = await fetch("/api/clinical-trials/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          userRole,
          conversationHistory: chatMessages.slice(-6),
        }),
      });

      const data = await res.json();
      const assistantMsg: ChatMessage = {
        id: `ast-${Date.now()}`,
        sender: "assistant",
        text: data.text || "I was unable to retrieve verified protocol parameters for this inquiry.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isEmergency: data.isEmergency,
      };

      setChatMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      setChatMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: "assistant",
          text: "Protocol assistant connectivity issue. Please consult ClinicalTrials.gov directly or try again momentarily.\n\n*Disclaimer (GR-01): Research and educational use only.*",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsAssistantSending(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner: Medical Disclaimer (GR-01) & Emergency Protocol Indicator */}
      <div className="bg-[#FAF7F2] border border-[#c5a27d]/40 rounded-xl p-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#c5a27d]/15 border border-[#c5a27d]/30 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck className="w-5 h-5 text-[#c5a27d]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-sm text-[#1a1a1a]">
                  Stratum Clinical Edge Trial Intelligence & Protocol Discovery
                </span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-xs bg-emerald-100 text-emerald-800 font-bold tracking-wider">
                  Verified Registry
                </span>
              </div>
              <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
                <strong>Medical Safety Notice (GR-01):</strong> All trial records, eligibility summaries, and protocol data are for educational and research discovery purposes. Final qualification and clinical decisions must be made directly with your treating physician and the study principal investigator.
              </p>
            </div>
          </div>

          {/* Emergency Hotline Alert */}
          <div className="flex items-center gap-2 shrink-0 px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-900 text-xs font-mono">
            <PhoneCall className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
            <span>Emergency (Chest Pain/Distress): <strong>Call 911 / 112</strong></span>
          </div>
        </div>
      </div>

      {/* Main Suite Controls Header */}
      <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
          <div>
            <h2 className="font-serif font-bold text-lg text-stone-900 flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-[#c5a27d]" />
              Global Clinical Trial Registry & Protocol Intelligence
            </h2>
            <p className="text-xs text-stone-500">
              Direct connection to ClinicalTrials.gov v2 REST API & Sovereign Protocol Dossiers.
            </p>
          </div>

          {/* User Persona Switcher */}
          <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-lg border border-stone-200 self-start sm:self-auto">
            <button
              onClick={() => setUserRole("GlobalTrialSeeker")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                userRole === "GlobalTrialSeeker"
                  ? "bg-white text-stone-900 shadow-xs font-semibold"
                  : "text-stone-500 hover:text-stone-800"
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Patient & Caregiver</span>
            </button>
            <button
              onClick={() => setUserRole("ClinicalResearcher")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                userRole === "ClinicalResearcher"
                  ? "bg-white text-stone-900 shadow-xs font-semibold"
                  : "text-stone-500 hover:text-stone-800"
              }`}
            >
              <Microscope className="w-3.5 h-3.5 text-purple-600" />
              <span>Clinician & Investigator</span>
            </button>
          </div>
        </div>

        {/* View Selection Tabs */}
        <div className="flex items-center gap-2 border-b border-stone-200">
          <button
            onClick={() => setActiveView("search")}
            className={`pb-2.5 px-3 text-xs font-medium border-b-2 flex items-center gap-1.5 transition-colors ${
              activeView === "search"
                ? "border-[#c5a27d] text-stone-900 font-semibold"
                : "border-transparent text-stone-500 hover:text-stone-800"
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            Trial Navigator ({trials.length > 0 ? totalResults : 0})
          </button>
          <button
            onClick={() => setActiveView("protocol")}
            className={`pb-2.5 px-3 text-xs font-medium border-b-2 flex items-center gap-1.5 transition-colors ${
              activeView === "protocol"
                ? "border-[#c5a27d] text-stone-900 font-semibold"
                : "border-transparent text-stone-500 hover:text-stone-800"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Protocol & Eligibility Analysis {selectedTrialId ? `(${selectedTrialId})` : ""}
          </button>
          <button
            onClick={() => setActiveView("assistant")}
            className={`pb-2.5 px-3 text-xs font-medium border-b-2 flex items-center gap-1.5 transition-colors ${
              activeView === "assistant"
                ? "border-[#c5a27d] text-stone-900 font-semibold"
                : "border-transparent text-stone-500 hover:text-stone-800"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#c5a27d]" />
            AI Protocol Navigator Assistant
          </button>
        </div>

        {/* VIEW 1: SEARCH & DISCOVERY (UC-1) */}
        {activeView === "search" && (
          <div className="space-y-4 pt-2">
            {/* Search Input Bar */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-4 relative">
                <label className="block text-[11px] font-mono text-stone-600 mb-1">
                  Target Condition or Disease *
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={conditionInput}
                    onChange={(e) => setConditionInput(e.target.value)}
                    placeholder="e.g., Non-Small Cell Lung Cancer, Alzheimer's..."
                    className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-sans text-stone-900 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#c5a27d]"
                  />
                </div>
              </div>

              <div className="md:col-span-3">
                <label className="block text-[11px] font-mono text-stone-600 mb-1">
                  Geographic Location or ZIP
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                    placeholder="e.g. New York, London, Global..."
                    className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-sans text-stone-900 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#c5a27d]"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-[11px] font-mono text-stone-600 mb-1">
                  Phase
                </label>
                <select
                  value={phaseFilter}
                  onChange={(e) => setPhaseFilter(e.target.value)}
                  className="w-full px-2.5 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:bg-white"
                >
                  <option value="">All Phases</option>
                  <option value="PHASE1">Phase 1</option>
                  <option value="PHASE2">Phase 2</option>
                  <option value="PHASE3">Phase 3</option>
                  <option value="PHASE4">Phase 4</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-[11px] font-mono text-stone-600 mb-1">
                  Recruitment Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-2.5 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:bg-white"
                >
                  <option value="RECRUITING">Recruiting</option>
                  <option value="NOT_YET_RECRUITING">Not Yet Recruiting</option>
                  <option value="ACTIVE_NOT_RECRUITING">Active (Not Recruiting)</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="">Any Status</option>
                </select>
              </div>

              <div className="md:col-span-1 flex items-end">
                <button
                  onClick={() => handleExecuteSearch()}
                  disabled={isSearching}
                  className="w-full py-2 bg-[#1a1a1a] hover:bg-[#c5a27d] text-white rounded-lg text-xs font-mono font-medium transition-colors flex items-center justify-center gap-1 shadow-xs disabled:opacity-50"
                >
                  {isSearching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Search"}
                </button>
              </div>
            </div>

            {/* Quick Filter Chips */}
            <div className="flex items-center gap-2 flex-wrap pt-1 text-xs">
              <span className="text-[11px] font-mono text-stone-500">Popular Conditions:</span>
              {[
                "Non-Small Cell Lung Cancer",
                "Early Alzheimer's Disease",
                "Chronic Heart Failure",
                "CAR-T Lymphoma",
                "Glioblastoma",
                "Type 2 Diabetes",
              ].map((term) => (
                <button
                  key={term}
                  onClick={() => {
                    setConditionInput(term);
                    handleExecuteSearch(term);
                  }}
                  className="px-2 py-0.5 rounded-md bg-stone-100 hover:bg-[#c5a27d]/15 hover:text-[#9e7c57] text-stone-700 text-[11px] font-sans border border-stone-200 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>

            {/* Search Results Metadata */}
            <div className="flex items-center justify-between text-xs font-mono text-stone-500 pt-2 border-t border-stone-100">
              <div>
                Showing <strong>{trials.length}</strong> of <strong>{totalResults}</strong> matching verified studies
              </div>
              <div className="flex items-center gap-2">
                <span>Source: {searchSource}</span>
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
              </div>
            </div>

            {/* Search Error / Mitigation Notice */}
            {searchError && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-xs flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Search Guidance:</strong> {searchError}
                </div>
              </div>
            )}

            {/* Trials List */}
            {isSearching ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-3 text-stone-400">
                <Loader2 className="w-6 h-6 animate-spin text-[#c5a27d]" />
                <span className="text-xs font-mono uppercase tracking-wider">
                  Querying ClinicalTrials.gov Protocol Registry...
                </span>
              </div>
            ) : trials.length === 0 ? (
              <div className="p-8 text-center bg-stone-50 border border-dashed border-stone-200 rounded-xl space-y-2">
                <Info className="w-6 h-6 text-stone-400 mx-auto" />
                <p className="text-xs text-stone-600">No active trials found matching your exact filter combination.</p>
                <p className="text-[11px] text-stone-400 font-mono">
                  Tip: Broaden the condition title or switch &ldquo;Phase&rdquo; to &ldquo;All Phases&rdquo;.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {trials.map((trial) => (
                  <div
                    key={trial.nct_id}
                    className="p-4 bg-stone-50/70 hover:bg-[#FAF7F2] border border-stone-200 rounded-xl transition-all hover:border-[#c5a27d]/60 hover:shadow-xs flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-2">
                      {/* Card Header: NCT ID & Status */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-xs font-bold text-stone-900 px-2 py-0.5 bg-stone-200/80 rounded">
                            {trial.nct_id}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-semibold">
                            {trial.phase}
                          </span>
                        </div>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold ${
                            trial.status === "RECRUITING"
                              ? "bg-emerald-100 text-emerald-800"
                              : trial.status === "COMPLETED"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {trial.status.replace(/_/g, " ")}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-serif font-bold text-sm text-stone-900 line-clamp-2 leading-snug">
                        {trial.title}
                      </h3>

                      {/* Sponsor */}
                      {trial.sponsor && (
                        <div className="text-[11px] font-mono text-stone-500 flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-stone-400 shrink-0" />
                          <span className="truncate">{trial.sponsor}</span>
                        </div>
                      )}

                      {/* Summary */}
                      <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                        {trial.summary}
                      </p>

                      {/* Locations Preview */}
                      <div className="text-[11px] text-stone-500 flex items-start gap-1">
                        <MapPin className="w-3 h-3 text-stone-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{trial.locations.slice(0, 2).join(" • ")}</span>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-stone-200/60 text-xs">
                      <a
                        href={trial.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-stone-500 hover:text-stone-800 font-mono text-[11px] flex items-center gap-1 transition-colors"
                      >
                        ClinicalTrials.gov <ExternalLink className="w-3 h-3" />
                      </a>
                      <button
                        onClick={() => handleSelectTrial(trial.nct_id)}
                        className="px-3 py-1.5 rounded-lg bg-[#1a1a1a] hover:bg-[#c5a27d] text-white text-xs font-mono font-medium transition-colors flex items-center gap-1 shadow-xs"
                      >
                        Analyze Protocol & Eligibility
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: PROTOCOL & ELIGIBILITY CRITERIA ANALYSIS (UC-2) */}
        {activeView === "protocol" && (
          <div className="space-y-5 pt-2">
            {!selectedTrialId ? (
              <div className="p-8 text-center bg-stone-50 border border-dashed border-stone-200 rounded-xl space-y-2">
                <FileText className="w-6 h-6 text-stone-400 mx-auto" />
                <p className="text-xs text-stone-700 font-medium">No trial protocol currently selected.</p>
                <p className="text-xs text-stone-500">
                  Select a study from the <strong>Trial Navigator</strong> tab or load sample protocol:
                </p>
                <div className="flex items-center justify-center gap-2 pt-2">
                  <button
                    onClick={() => handleSelectTrial("NCT03345797")}
                    className="px-3 py-1.5 rounded-lg bg-[#c5a27d] text-white text-xs font-mono font-medium hover:bg-[#b08e6b]"
                  >
                    Load FLAURA2 (NCT03345797)
                  </button>
                  <button
                    onClick={() => handleSelectTrial("NCT04383496")}
                    className="px-3 py-1.5 rounded-lg bg-stone-800 text-white text-xs font-mono font-medium hover:bg-stone-700"
                  >
                    Load CAR-T Study (NCT04383496)
                  </button>
                </div>
              </div>
            ) : isLoadingProtocol ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-3 text-stone-400">
                <Loader2 className="w-6 h-6 animate-spin text-[#c5a27d]" />
                <span className="text-xs font-mono uppercase tracking-wider">
                  Retrieving Protocol Specifications from Registry ({selectedTrialId})...
                </span>
              </div>
            ) : protocolDetails ? (
              <div className="space-y-6">
                {/* Protocol Header Card */}
                <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-stone-900 px-2.5 py-1 bg-stone-200 rounded">
                        {protocolDetails.nct_id}
                      </span>
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-bold">
                        {protocolDetails.study_phase}
                      </span>
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-bold">
                        {protocolDetails.status}
                      </span>
                    </div>
                    <a
                      href={protocolDetails.official_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline font-mono text-xs flex items-center gap-1 self-start sm:self-auto"
                    >
                      View on ClinicalTrials.gov <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <h3 className="font-serif font-bold text-base text-stone-900 leading-snug">
                    {protocolDetails.official_title}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono text-stone-600">
                    <div>
                      <strong>Lead Sponsor:</strong> {protocolDetails.sponsor_name}
                    </div>
                    <div>
                      <strong>Central Contact:</strong> {protocolDetails.contact_email}
                    </div>
                  </div>

                  <p className="text-xs text-stone-700 leading-relaxed border-t border-stone-200/60 pt-2">
                    {protocolDetails.summary}
                  </p>
                </div>

                {/* Primary Endpoints Section */}
                <div className="p-4 bg-white border border-stone-200 rounded-xl space-y-2">
                  <h4 className="font-serif font-bold text-sm text-stone-900 flex items-center gap-2">
                    <Compass className="w-4 h-4 text-[#c5a27d]" />
                    Primary Study Endpoints & Outcome Measures
                  </h4>
                  <ul className="space-y-1.5 list-disc list-inside text-xs text-stone-700 font-mono">
                    {protocolDetails.primary_endpoints.map((ep, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {ep}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Interactive Eligibility Assessment Tool */}
                <div className="p-4 bg-[#FAF7F2] border border-[#c5a27d]/40 rounded-xl space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#c5a27d]/20">
                    <div>
                      <h4 className="font-serif font-bold text-sm text-stone-900 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Interactive Eligibility Criteria Assessment (UC-2)
                      </h4>
                      <p className="text-xs text-stone-500">
                        Check criteria against patient baseline to calculate preliminary protocol feasibility.
                      </p>
                    </div>

                    {/* Live Verdict Pill */}
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="text-right text-[11px] font-mono">
                        <div>Evaluated: <strong>{criteriaEvaluated}</strong> / {totalCriteria}</div>
                      </div>
                      <span
                        className={`text-xs font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                          eligibilityStatus === "POTENTIALLY_ELIGIBLE"
                            ? "bg-emerald-600 text-white"
                            : eligibilityStatus === "LIKELY_INELIGIBLE"
                            ? "bg-rose-600 text-white"
                            : "bg-amber-200 text-amber-900"
                        }`}
                      >
                        {eligibilityStatus.replace(/_/g, " ")}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Inclusion Criteria Column */}
                    <div className="p-3 bg-white border border-emerald-200 rounded-lg space-y-2">
                      <div className="font-serif font-bold text-xs text-emerald-900 flex items-center justify-between">
                        <span>Inclusion Criteria (Must satisfy all):</span>
                        <span className="font-mono text-[10px] text-emerald-700">
                          {inclusionCheckedCount}/{totalInclusionCount} Met
                        </span>
                      </div>
                      <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                        {protocolDetails.inclusion_criteria.map((crit, idx) => (
                          <label
                            key={idx}
                            className="flex items-start gap-2 text-xs text-stone-700 cursor-pointer p-1.5 rounded hover:bg-emerald-50/50 transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={!!checkedInclusions[idx]}
                              onChange={(e) =>
                                setCheckedInclusions((prev) => ({ ...prev, [idx]: e.target.checked }))
                              }
                              className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                            />
                            <span className="leading-snug">{crit}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Exclusion Criteria Column */}
                    <div className="p-3 bg-white border border-rose-200 rounded-lg space-y-2">
                      <div className="font-serif font-bold text-xs text-rose-900 flex items-center justify-between">
                        <span>Exclusion Criteria (Must NOT have any):</span>
                        <span className="font-mono text-[10px] text-rose-700">
                          {exclusionCheckedCount}/{totalExclusionCount} Clear
                        </span>
                      </div>
                      <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                        {protocolDetails.exclusion_criteria.map((crit, idx) => (
                          <label
                            key={idx}
                            className="flex items-start gap-2 text-xs text-stone-700 cursor-pointer p-1.5 rounded hover:bg-rose-50/50 transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={!!checkedExclusions[idx]}
                              onChange={(e) =>
                                setCheckedExclusions((prev) => ({ ...prev, [idx]: e.target.checked }))
                              }
                              className="mt-0.5 rounded text-rose-600 focus:ring-rose-500"
                            />
                            <span className="leading-snug">Patient does NOT have: {crit}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Criteria Disclaimer Notice */}
                  <div className="p-2.5 bg-stone-100 rounded text-[11px] font-mono text-stone-600 flex items-center gap-2">
                    <Info className="w-4 h-4 text-stone-400 shrink-0" />
                    <span>
                      Formal eligibility screening requires prospective laboratory telemetry, histology confirmation, and protocol review by the study coordinator.
                    </span>
                  </div>
                </div>

                {/* Locations Listing */}
                <div className="p-4 bg-white border border-stone-200 rounded-xl space-y-2">
                  <h4 className="font-serif font-bold text-sm text-stone-900 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#c5a27d]" />
                    Verified Investigation Sites & Clinics ({protocolDetails.locations.length})
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono text-stone-700">
                    {protocolDetails.locations.map((loc, idx) => (
                      <div key={idx} className="p-2 bg-stone-50 rounded border border-stone-100 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#c5a27d] shrink-0" />
                        <span className="truncate">{loc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-rose-600 bg-rose-50 rounded-xl">
                Failed to load trial protocol specifications for {selectedTrialId}.
              </div>
            )}
          </div>
        )}

        {/* VIEW 3: AI PROTOCOL ASSISTANT (UC-3 & UC-4) */}
        {activeView === "assistant" && (
          <div className="space-y-4 pt-2">
            {/* Persona Guidance Banner */}
            <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#c5a27d]" />
                <span>
                  Current Persona: <strong>{userRole === "ClinicalResearcher" ? "Clinical Researcher / Investigator" : "Global Trial Seeker / Patient"}</strong>
                </span>
              </div>
              <span className="text-[10px] font-mono uppercase text-stone-500">
                Grounding: ClinicalTrials.gov + Verified Guidelines
              </span>
            </div>

            {/* Prompt Suggestion Chips */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-mono text-stone-500">Sample Inquiries:</span>
              {[
                "Find Recruiting NSCLC Phase 3 Trials",
                "Explain Progression-Free Survival (PFS)",
                "How does FLAURA2 compare to osimertinib monotherapy?",
                "What are typical Phase 1 safety endpoints?",
                "Emergency Refusal Test: Sudden severe chest pain",
              ].map((chip) => (
                <button
                  key={chip}
                  onClick={() => handleSendChatMessage(chip)}
                  className="px-2.5 py-1 bg-stone-100 hover:bg-[#c5a27d]/20 text-stone-800 rounded-md text-[11px] font-sans border border-stone-200 transition-colors flex items-center gap-1"
                >
                  {chip.includes("Emergency") ? (
                    <AlertTriangle className="w-3 h-3 text-rose-600" />
                  ) : (
                    <ArrowRight className="w-3 h-3 text-[#c5a27d]" />
                  )}
                  <span>{chip}</span>
                </button>
              ))}
            </div>

            {/* Conversation Log */}
            <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl h-96 overflow-y-auto space-y-4">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-2xl rounded-xl p-3.5 text-xs shadow-xs leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-[#1a1a1a] text-white"
                        : msg.isEmergency
                        ? "bg-rose-50 border border-rose-300 text-rose-950"
                        : "bg-white border border-stone-200 text-stone-900"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4 mb-1 text-[10px] opacity-75 font-mono">
                      <span>{msg.sender === "user" ? "You" : "Stratum Trial Intelligence"}</span>
                      <span>{msg.timestamp}</span>
                    </div>
                    <div className="whitespace-pre-wrap font-sans text-xs space-y-1">
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}
              {isAssistantSending && (
                <div className="flex justify-start">
                  <div className="p-3 bg-white border border-stone-200 rounded-xl text-xs flex items-center gap-2 text-stone-500 font-mono">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#c5a27d]" />
                    <span>Cross-referencing verified trial registries...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendChatMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask about clinical study designs, endpoints, eligibility criteria, or trial IDs (e.g. NCT03345797)..."
                className="flex-1 px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#c5a27d]"
              />
              <button
                type="submit"
                disabled={!chatInput.trim() || isAssistantSending}
                className="px-4 py-2.5 bg-[#1a1a1a] hover:bg-[#c5a27d] text-white rounded-xl text-xs font-mono font-medium transition-colors flex items-center gap-1.5 shadow-xs disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
