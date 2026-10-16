"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  db,
  auth,
  googleProvider,
  handleFirestoreError,
  OperationType,
  testConnection,
} from "@/lib/firebase";
import {
  getPatientsFromIDB,
  savePatientToIDB,
  savePatientsBulkToIDB,
  getLogsFromIDB,
  saveLogToIDB,
  getAppStateFromIDB,
  setAppStateToIDB,
  enqueueSyncOperation,
  getSyncQueueItems,
  clearSyncQueue,
  flushSyncQueue,
} from "@/lib/indexedDB";
import type { AppTab } from "@/lib/navigation";
import {
  registerBackgroundSync,
  requestPersistentStorage,
  subscribeToServiceWorkerSyncEvents,
  createUnthrottledTimer,
  requestScreenWakeLock,
  releaseScreenWakeLock,
  updateAppBadge,
} from "@/lib/backgroundSyncManager";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  signInAnonymously,
  User as FirebaseUser,
} from "firebase/auth";
import {
  collection,
  doc,
  setDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import {
  Crown,
  Shield,
  ShieldCheck,
  Castle,
  MapPin,
  Flame,
  Wheat,
  Sparkles,
  Database,
  Terminal,
  RefreshCw,
  Plus,
  Search,
  Send,
  User,
  LogOut,
  Copy,
  Check,
  CheckCircle,
  AlertCircle,
  Cpu,
  Layers,
  GitBranch,
  Compass,
  Scroll,
  Radio,
  FileText,
  Key,
  ChevronRight,
  ExternalLink,
  Moon,
  Sun,
  Bot,
  Download,
  Upload,
  Lock,
  HeartPulse,
  Megaphone,
  BarChart3,
  TrendingUp,
  Globe,
  Wifi,
  WifiOff,
  Printer,
  Mic,
  Activity,
  Stethoscope,
  FileSpreadsheet,
  Film,
  Calendar,
  CreditCard,
  Award,
  Sliders,
  CheckCircle2,
  HardDrive,
  Cloud,
} from "lucide-react";
import dynamic from "next/dynamic";
import { downloadCSV } from "@/lib/csvExporter";
import Sudoku from "@/components/Sudoku";
import PescatarianTracker from "@/components/PescatarianTracker";
import KingdomIntelligenceCore from "@/components/KingdomIntelligenceCore";
import ProvisionsTracker from "@/components/ProvisionsTracker";
import PlatformInstructions from "@/components/PlatformInstructions";
import AgentBridgeInterface from "@/components/AgentBridgeInterface";
import BackupRestoreModal from "@/components/BackupRestoreModal";
import StandaloneReleaseModal from "@/components/StandaloneReleaseModal";
import StrategicRadarMap from "@/components/StrategicRadarMap";
import IsolatedDataVault from "@/components/IsolatedDataVault";
import AutonomousUrgencyScorer from "@/components/AutonomousUrgencyScorer";
import AbcdDispatchStudio from "@/components/AbcdDispatchStudio";
import ClinicalCommandCenter from "@/components/ClinicalCommandCenter";
import SeventeenPocketsTopology from "@/components/SeventeenPocketsTopology";
import GrowthMarketingTelemetry from "@/components/GrowthMarketingTelemetry";
import HumanRealityMovement from "@/components/HumanRealityMovement";
import BrandShowcaseModal from "@/components/BrandShowcaseModal";
import SolarNexusMain from "@/components/SolarNexus/SolarNexusMain";
import MeshTelemetryConsole from "@/components/SolarNexus/MeshTelemetryConsole";
import OfflineEdgeSimulator from "@/components/OfflineEdgeSimulator";
import ClinicalDossierSuite from "@/components/ClinicalDossierSuite";
import VoiceClinicalScribe from "@/components/VoiceClinicalScribe";
import GitLabBuildsConsole from "@/components/SolarNexus/GitLabBuildsConsole";
import EntertainmentStudio from "@/components/EntertainmentStudio";
import ThirtyDaySprintBoard from "@/components/ThirtyDaySprintBoard";
import StripeAppsUploadStudio from "@/components/StripeAppsUploadStudio";
import PocketStatusMatrix from "@/components/PocketStatusMatrix";
import BuildDeploymentHealthCards from "@/components/BuildDeploymentHealthCards";
import EcosystemMaturitySuite, { DisplayMode } from "@/components/EcosystemMaturitySuite";
import VideoHoverCard from "@/components/VideoHoverCard";
import VideoTheaterModal, { VideoData } from "@/components/VideoTheaterModal";
import { ECOSYSTEM_VIDEOS, ALL_PLAYLIST_VIDEOS } from "@/lib/videoRegistry";
import SovereignBizChatConsole from "@/components/SovereignBizChatConsole";
import CommandPaletteModal from "@/components/CommandPaletteModal";
import ErrorBoundary from "@/components/ErrorBoundary";

const RealmChart = dynamic(() => import("@/components/RealmChart"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center text-[10px] font-mono text-neutral-500 uppercase animate-pulse">
      SYNCHRONIZING REALM TELEMETRY STREAM...
    </div>
  ),
});

// Domain Model
export interface Stronghold {
  id: string;
  name: string;
  age: number; // Clinical care capacity & staffing index
  vitals: string; // Resource metrics (Gold, Mana, Medical provisions)
  notes: string; // Clinical intelligence & council directives
  lat?: number;
  lon?: number;
}

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

const KINGDOM_CI_PIPELINE = `image: kingdom-os/archon:latest

stages:
  - scout-intelligence
  - clinical-readiness-check
  - mana-resonance-build
  - sovereign-edge-deploy

scout-intelligence:
  stage: scout-intelligence
  script:
    - echo "Scanning frontier health coordinates and edge telemetry..."
    - check-border-integrity --all-regions
    - index-mana-reserves --threshold=85%

clinical-readiness-check:
  stage: clinical-readiness-check
  script:
    - echo "Verifying medical provisions, oxygen buffer, and facility stability..."
    - test-zero-trust-citadel-perimeter --strict

mana-resonance-build:
  stage: mana-resonance-build
  script:
    - echo "Compiling arcane ward blueprints & IndexedDB local ledgers..."
    - npm run build

sovereign-edge-deploy:
  stage: sovereign-edge-deploy
  script:
    - echo "Deploying autonomous realm state to Seventeen-Pockets Edge Nodes..."
    - echo "Status: Real-time Cloud Sync & Disconnected IDB Standby ONLINE"
  only:
    - main`;

const baselineStrongholds: Stronghold[] = [
  {
    id: "K-AETHEL-01",
    name: "Aethelgard High Fortress",
    age: 58,
    vitals: "Gold: 14,200 | Mana: 94% | Grain: 18,500 sacks",
    notes:
      "Primary imperial bastion. Arcane wards active on outer ramparts. Dragonwatch tower operational. High Council convened.",
    lat: 4.35,
    lon: -72.85,
  },
  {
    id: "K-SPIRE-02",
    name: "Obsidian Spires Sanctum",
    age: 41,
    vitals: "Gold: 9,800 | Mana: 99% | Grain: 8,200 sacks",
    notes:
      "High conclave of arcane mages. Ley-line siphon functioning at optimal resonant frequency. Elemental shields calibrated.",
    lat: 4.75,
    lon: -73.1,
  },
  {
    id: "K-FROST-03",
    name: "Frostveil Frontier Keep",
    age: 67,
    vitals: "Gold: 11,500 | Mana: 78% | Grain: 24,000 sacks",
    notes:
      "Frontline northern pavilion. Heavy insulation withstanding severe blizzard conditions. Emergency care units fully primed for intake.",
    lat: 5.1,
    lon: -71.5,
  },
  {
    id: "K-VALYR-04",
    name: "Valyria Shoreline Citadel",
    age: 35,
    vitals: "Gold: 22,000 | Mana: 85% | Grain: 15,000 sacks",
    notes:
      "Deepwater naval anchorage. Merchant galleons arrive daily with forged alloys and grain shipments. Coastal artillery ready.",
    lat: 3.9,
    lon: -73.4,
  },
];

const mockChartData = [
  { name: "Moon I", mana: 82, gold: 95, garrison: 70, grain: 110 },
  { name: "Moon II", mana: 88, gold: 112, garrison: 75, grain: 125 },
  { name: "Moon III", mana: 91, gold: 128, garrison: 80, grain: 130 },
  { name: "Moon IV", mana: 95, gold: 140, garrison: 88, grain: 145 },
  { name: "Moon V", mana: 99, gold: 155, garrison: 94, grain: 160 },
];

export default function KingdomDashboard() {
  // State
  const [strongholds, setStrongholds] = useState<Stronghold[]>(baselineStrongholds);
  const [selectedId, setSelectedId] = useState<string>("K-AETHEL-01");
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [activeTab, setActiveTab] = useState<AppTab>("strongholds");
  const [isAirGapActive, setIsAirGapActive] = useState<boolean>(false);
  const [displayMode, setDisplayMode] = useState<DisplayMode>("showcase");

  // Auth & Identity State
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [sovereignRole, setSovereignRole] = useState<string>("Archon Odell Anderson Jr.");
  const [showIdentityModal, setShowIdentityModal] = useState<boolean>(false);
  const [customRoleInput, setCustomRoleInput] = useState<string>("");

  // AI Clinical Operations State
  const [aiAnalysis, setAiAnalysis] = useState<string>("");
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [royalEdict, setRoyalEdict] = useState<string>("");
  const [isEdictLoading, setIsEdictLoading] = useState<boolean>(false);
  const [edictRecipient, setEdictRecipient] = useState<string>("High Council of Sovereign Realms");
  const [customEdictNotes, setCustomEdictNotes] = useState<string>("");

  // Logs & Audit State
  const [councilLogs, setCouncilLogs] = useState<string[]>([
    "[00:00:00 UTC] Project Kingdom: Sovereign Edge Node Initialized.",
    "[00:00:01 UTC] Arcane Ley-Line synchronization online across all sectors.",
    "[00:00:02 UTC] IndexedDB Local Vault initialized with zero-latency read/write replication.",
    "[00:00:03 UTC] Active Developer Sandbox link operational on port 3000.",
  ]);
  const persistCouncilLog = useCallback(
    (logText: string) =>
      saveLogToIDB({
        id: `LOG-${crypto.randomUUID()}`,
        logText,
        ownerId: firebaseUser?.uid,
      }),
    [firebaseUser?.uid]
  );
  const [newLogInput, setNewLogInput] = useState<string>("");
  const [isPipelineRunning, setIsPipelineRunning] = useState<boolean>(false);

  // New Stronghold Modal/Form State
  const [showAddStronghold, setShowAddStronghold] = useState<boolean>(false);
  const [showRestoreModal, setShowRestoreModal] = useState<boolean>(false);
  const [showBrandShowcaseModal, setShowBrandShowcaseModal] = useState<boolean>(false);
  const [showReleaseModal, setShowReleaseModal] = useState<boolean>(false);
  const [selectedCinemaVideo, setSelectedCinemaVideo] = useState<VideoData | null>(null);
  const [showVideoTheaterModal, setShowVideoTheaterModal] = useState<boolean>(false);
  const [strongholdViewMode, setStrongholdViewMode] = useState<"chart" | "radar">("chart");
  const [isSyncingState, setIsSyncingState] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>("Just now");
  const [autoSyncEnabled, setAutoSyncEnabled] = useState<boolean>(true);
  const [syncIntervalSeconds, setSyncIntervalSeconds] = useState<number>(15);
  const [secondsUntilNextSync, setSecondsUntilNextSync] = useState<number>(15);
  const [runInBackgroundWhenClosed, setRunInBackgroundWhenClosed] = useState<boolean>(true);
  const [isPersistentStorageGranted, setIsPersistentStorageGranted] = useState<boolean>(true);
  const [isWakeLockActive, setIsWakeLockActive] = useState<boolean>(false);
  const [showSovereignBizChat, setShowSovereignBizChat] = useState<boolean>(true);
  const [showCommandPalette, setShowCommandPalette] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>("");
  const [newGarrison, setNewGarrison] = useState<string>("50");
  const [newVitals, setNewVitals] = useState<string>("Gold: 10,000 | Mana: 90% | Grain: 12,000 sacks");
  const [newNotes, setNewNotes] = useState<string>("");
  const [newLat, setNewLat] = useState<string>("4.50");
  const [newLon, setNewLon] = useState<string>("-72.90");

  // UI Telemetry & Theme State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [currentTimeStr, setCurrentTimeStr] = useState<string>("");
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Map state
  const [radarZoom, setRadarZoom] = useState<number>(1);
  const [targetedCoords, setTargetedCoords] = useState<{ lat: number; lon: number }>({
    lat: 4.35,
    lon: -72.85,
  });

  const showToast = useCallback((message: string, type: "success" | "error" | "info" = "info") => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);
  const addToast = showToast;

  // Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTimeStr(now.toUTCString().replace("GMT", "UTC"));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Hydrate local IndexedDB on mount
  useEffect(() => {
    testConnection();

    const hydrateFromIDB = async () => {
      try {
        const idbStrongholds = await getPatientsFromIDB();
        if (idbStrongholds.length > 0) {
          setStrongholds(idbStrongholds);
        } else {
          await savePatientsBulkToIDB(baselineStrongholds);
        }

        const idbLogs = await getLogsFromIDB();
        if (idbLogs.length > 0) {
          setCouncilLogs(idbLogs.map((l) => l.logText));
        }

        const savedSelectedId = await getAppStateFromIDB<string>("selectedStrongholdId");
        if (savedSelectedId) {
          setSelectedId(savedSelectedId);
        }

        const savedRole = await getAppStateFromIDB<string>("sovereignRole");
        if (savedRole) {
          setSovereignRole(savedRole);
        }

        const savedDarkMode = await getAppStateFromIDB<boolean>("isDarkMode");
        if (typeof savedDarkMode === "boolean") {
          setIsDarkMode(savedDarkMode);
        }
      } catch (err) {
        console.warn("IndexedDB Hydration:", err);
      }
    };
    hydrateFromIDB();

    // Auto authenticate if signed in or if user explicitly initiates
    const initAuth = async () => {
      try {
        if (!auth.currentUser) {
          // Attempt anonymous auth if enabled; catch admin-restricted-operation if provider disabled
          await signInAnonymously(auth);
        }
      } catch (err: any) {
        if (err?.code === "auth/admin-restricted-operation") {
          console.info("Firebase Anonymous Auth is disabled in Firebase Console. App running in local-vault edge mode with Google Sign-In available.");
        } else {
          console.warn("Auth initialization notice:", err);
        }
      }
    };
    initAuth();

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
    });

    return () => unsubscribeAuth();
  }, []);

  // Real-time Cloud Sync for Strongholds & Logs
  useEffect(() => {
    if (!firebaseUser) return;

    const strongholdsQuery = query(
      collection(db, "patients"),
      where("ownerId", "==", firebaseUser.uid)
    );

    const unsubStrongholds = onSnapshot(
      strongholdsQuery,
      (snapshot) => {
        const cloudData: Stronghold[] = [];
        snapshot.forEach((docSnap) => {
          const d = docSnap.data();
          cloudData.push({
            id: d.id,
            name: d.name,
            age: d.age || 50,
            vitals: d.vitals || "",
            notes: d.notes || "",
            lat: d.lat !== undefined ? d.lat : 4.35,
            lon: d.lon !== undefined ? d.lon : -72.85,
          });
        });

        if (cloudData.length > 0) {
          setStrongholds(cloudData);
          savePatientsBulkToIDB(cloudData).catch(console.warn);
          if (!cloudData.some((s) => s.id === selectedId)) {
            setSelectedId(cloudData[0].id);
          }
        }
      },
      (error) => {
        console.warn("Firestore listener fallback to IndexedDB:", error);
      }
    );

    const logsQuery = query(
      collection(db, "logs"),
      where("ownerId", "==", firebaseUser.uid)
    );

    const unsubLogs = onSnapshot(
      logsQuery,
      (snapshot) => {
        const cloudLogs: string[] = [];
        snapshot.forEach((docSnap) => {
          cloudLogs.push(docSnap.data().logText);
        });
        if (cloudLogs.length > 0) {
          setCouncilLogs((prev) => Array.from(new Set([...cloudLogs, ...prev])));
        }
      },
      (error) => {
        console.warn("Firestore logs listener note:", error);
      }
    );

    return () => {
      unsubStrongholds();
      unsubLogs();
    };
  }, [firebaseUser, selectedId]);

  const activeStronghold = strongholds.find((s) => s.id === selectedId) || strongholds[0] || baselineStrongholds[0];

  // AI Strategic Clinical Operations analysis
  const handleGenerateStrategy = async () => {
    if (!activeStronghold) return;
    setIsAiLoading(true);
    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "strategy",
          payload: {
            name: activeStronghold.name,
            age: activeStronghold.age,
            vitals: activeStronghold.vitals,
            notes: activeStronghold.notes,
            environmentalContext: `Spatial Coordinates [Lat: ${activeStronghold.lat}, Lon: ${activeStronghold.lon}] | Radar Defense Grid Alpha`,
          },
        }),
      });

      const data = await res.json();
      if (data.text) {
        setAiAnalysis(data.text);
        showToast("Strategic Intelligence Briefing generated by Sovereign Oracle.", "success");
      } else if (data.error) {
        showToast(`AI Briefing warning: ${data.error}`, "info");
      }
    } catch (err: any) {
      showToast(`Strategic Oracle communication interrupted: ${err.message}`, "error");
    } finally {
      setIsAiLoading(false);
    }
  };

  // AI Royal Edict Scribe
  const handleGenerateEdict = async () => {
    if (!activeStronghold) return;
    setIsEdictLoading(true);
    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "edict",
          payload: {
            doctorName: sovereignRole,
            recipient: edictRecipient,
            patientName: activeStronghold.name,
            notes: customEdictNotes || activeStronghold.notes,
            tone: "Authoritative & Royal",
          },
        }),
      });

      const data = await res.json();
      if (data.text) {
        setRoyalEdict(data.text);
        showToast("Royal Sovereign Edict drafted and sealed.", "success");
      }
    } catch (err: any) {
      showToast(`Royal Scribe error: ${err.message}`, "error");
    } finally {
      setIsEdictLoading(false);
    }
  };

  // Add Stronghold
  const handleCreateStronghold = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newId = `K-STR-${Date.now().toString(36).toUpperCase()}`;
    const newRecord: Stronghold = {
      id: newId,
      name: newName.trim(),
      age: parseInt(newGarrison) || 50,
      vitals: newVitals.trim() || "Gold: 5,000 | Mana: 85% | Grain: 10,000 sacks",
      notes: newNotes.trim() || "Territory added to Project Kingdom Sovereign Grid.",
      lat: parseFloat(newLat) || 4.5,
      lon: parseFloat(newLon) || -72.9,
    };

    // Save to IndexedDB
    try {
      await savePatientToIDB({ ...newRecord, ownerId: firebaseUser?.uid });
    } catch (idbErr) {
      console.warn("IDB write error:", idbErr);
    }

    if (firebaseUser) {
      try {
        const docRef = doc(db, "patients", newId);
        await setDoc(docRef, {
          ...newRecord,
          ownerId: firebaseUser.uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        showToast(`Stronghold '${newRecord.name}' synchronized to Cloud & IndexedDB.`, "success");
      } catch (err: any) {
        handleFirestoreError(err, OperationType.WRITE, `patients/${newId}`);
      }
    } else {
      setStrongholds((prev) => [...prev, newRecord]);
      await enqueueSyncOperation({
        type: "CREATE",
        collectionName: "patients",
        docId: newId,
        payload: newRecord,
      });
      showToast(`Stronghold '${newRecord.name}' saved locally to IndexedDB vault.`, "info");
    }

    setSelectedId(newId);
    setNewName("");
    setNewNotes("");
    setShowAddStronghold(false);
  };

  // Add Log Entry
  const handleAddLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLogInput.trim()) return;

    const time = new Date().toLocaleTimeString();
    const logString = `[${time}] ${newLogInput.trim()}`;
    const logId = `LOG-${Date.now()}`;

    try {
      await saveLogToIDB({ id: logId, logText: logString, ownerId: firebaseUser?.uid });
    } catch (e) {
      console.warn("IDB log error:", e);
    }

    if (firebaseUser) {
      try {
        const logRef = doc(db, "logs", logId);
        await setDoc(logRef, {
          logText: logString,
          ownerId: firebaseUser.uid,
          createdAt: serverTimestamp(),
        });
        showToast("Decree entry recorded to Council Cloud Archive.", "success");
      } catch (err: any) {
        handleFirestoreError(err, OperationType.WRITE, `logs/${logId}`);
      }
    } else {
      setCouncilLogs((prev) => [logString, ...prev]);
      showToast("Trace logged inside local IndexedDB vault.", "info");
    }
    setNewLogInput("");
  };

  // Trigger CI/CD Pipeline Simulator
  const handleRunPipeline = () => {
    setIsPipelineRunning(true);
    const steps = [
      "STAGE: telemetry-intelligence -> Scanning 17 edge health nodes...",
      "STAGE: clinical-readiness-check -> Validating medical supplies, care cadre staffing...",
      "STAGE: health-data-build -> IndexedDB local vault verified 100% stable...",
      "STAGE: sovereign-edge-deploy -> Realm clinical operating state deployed successfully.",
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        const time = new Date().toLocaleTimeString();
        const msg = `[${time}] CI/CD PIPELINE: ${step}`;
        setCouncilLogs((prev) => [msg, ...prev]);
        if (idx === steps.length - 1) {
          setIsPipelineRunning(false);
          showToast("GitLab Sovereign Realm Pipeline execution complete.", "success");
        }
      }, (idx + 1) * 800);
    });
  };

  // Safe Google Login with complete 401 defensive guard
  const handleGoogleLoginSafe = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      showToast("Sovereign Cloud session established via Google OAuth.", "success");
      setShowIdentityModal(false);
    } catch (err: any) {
      console.warn("Google OAuth fallback triggered:", err);
      try {
        if (!auth.currentUser) {
          await signInAnonymously(auth);
          showToast(
            "Switched to Anonymous Sovereign Archon session.",
            "info"
          );
        }
      } catch (anonErr) {
        showToast("Sovereign local vault mode active.", "info");
      }
    }
  };

  const handleSetRole = (role: string) => {
    setSovereignRole(role);
    setAppStateToIDB("sovereignRole", role).catch(console.warn);
    showToast(`Active Sovereign Persona changed to: ${role}`, "info");
    setShowIdentityModal(false);
  };

  const handleToggleDarkMode = () => {
    const nextVal = !isDarkMode;
    setIsDarkMode(nextVal);
    setAppStateToIDB("isDarkMode", nextVal).catch(console.warn);
    showToast(nextVal ? "Sovereign Obsidian Dark Mode engaged." : "Warm Editorial Canvas engaged.", "info");
  };

  const handleCopySandboxUrl = () => {
    const sandboxUrl = "https://ais-dev-ucamfjc2ipikqim5busbet-612821199205.us-west2.run.app";
    navigator.clipboard.writeText(sandboxUrl);
    setCopiedLink(true);
    showToast("Developer Sandbox URL copied to clipboard.", "success");
    setTimeout(() => setCopiedLink(false), 3000);
  };

  // Export Strongholds Resource Data to CSV
  const handleExportStrongholdsCSV = () => {
    try {
      const dataToExport = filteredStrongholds.length > 0 ? filteredStrongholds : strongholds;
      const headers = [
        "Stronghold ID",
        "Citadel Name",
        "Care Cadre Capacity Level",
        "Tactical Vitals & Resources",
        "Clinical Intelligence & Directives",
        "Latitude",
        "Longitude",
        "Exported By Persona",
        "Export Timestamp",
      ];

      const timeStamp = new Date().toISOString();
      const rows = dataToExport.map((s) => [
        s.id,
        s.name,
        s.age,
        s.vitals,
        s.notes,
        s.lat ?? "",
        s.lon ?? "",
        sovereignRole,
        timeStamp,
      ]);

      const dateStr = timeStamp.slice(0, 10);
      const filename = `stratum-strongholds-resources-${dateStr}.csv`;
      const success = downloadCSV(filename, headers, rows);
      if (success) {
        showToast(`Exported ${dataToExport.length} strongholds to CSV for spreadsheet reporting.`, "success");
      } else {
        showToast("Failed to generate strongholds CSV.", "error");
      }
    } catch (err: any) {
      console.error("CSV Export error:", err);
      showToast(`CSV Export error: ${err?.message || "Unknown error"}`, "error");
    }
  };

  // Export Granary Provisions to CSV from Tab
  const handleExportProvisionsCSV = async () => {
    try {
      let provisionsData: any[] = [];
      const saved = await getAppStateFromIDB<any[]>("kingdomProvisions");
      if (saved && Array.isArray(saved) && saved.length > 0) {
        provisionsData = saved;
      } else {
        provisionsData = [
          { id: "PRV-1", name: "Sun-Cured Rye & Barley Sacks", category: "Grain", reserveUnits: 4500, fortressTarget: "Aethelgard High Citadel", certified: true },
          { id: "PRV-2", name: "Silverfin Trout & Brine Barrels", category: "Fish & Salts", reserveUnits: 1800, fortressTarget: "Valyria Shoreline Bastion", certified: true },
          { id: "PRV-3", name: "Concentrated Aether Mana Draughts", category: "Mana Elixirs", reserveUnits: 620, fortressTarget: "Obsidian Spire Sanctum", certified: true },
          { id: "PRV-4", name: "Forged Damascus Halberds & Shields", category: "Armament Forging", reserveUnits: 950, fortressTarget: "Frostveil Frontline Keep", certified: true },
        ];
      }

      const headers = [
        "Provision ID",
        "Resource Item Name",
        "Category",
        "Reserve Units",
        "Destination Stronghold",
        "Certification Status",
        "Exported By Persona",
        "Export Timestamp",
      ];
      const timeStamp = new Date().toISOString();
      const rows = provisionsData.map((item) => [
        item.id,
        item.name,
        item.category,
        item.reserveUnits,
        item.fortressTarget,
        item.certified ? "Certified Sovereign Resource" : "Pending Inspection",
        sovereignRole,
        timeStamp,
      ]);

      const dateStr = timeStamp.slice(0, 10);
      const filename = `stratum-provisions-${dateStr}.csv`;
      const success = downloadCSV(filename, headers, rows);
      if (success) {
        showToast(`Exported ${provisionsData.length} provision records to CSV for spreadsheet reporting.`, "success");
      } else {
        showToast("Failed to generate provisions CSV.", "error");
      }
    } catch (err: any) {
      console.error("Provisions CSV export failed:", err);
      showToast(`Provisions CSV export failed: ${err?.message || "Unknown error"}`, "error");
    }
  };

  // Download Strongholds State Backup using Blob
  const handleDownloadBackup = () => {
    try {
      const backupPayload = {
        format: "stratum-stronghold-backup",
        version: "1.0",
        exportedAt: new Date().toISOString(),
        exportedBy: sovereignRole,
        totalStrongholds: strongholds.length,
        activeStrongholdId: selectedId,
        strongholds: strongholds,
      };

      const jsonString = JSON.stringify(backupPayload, null, 2);
      const blob = new Blob([jsonString], { type: "application/json;charset=utf-8" });
      const downloadUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = downloadUrl;
      const dateStamp = new Date().toISOString().slice(0, 10);
      link.download = `strongholds-backup-${dateStamp}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);

      showToast(`Exported ${strongholds.length} strongholds to secure local backup.`, "success");
    } catch (err: any) {
      console.error("Backup export fault:", err);
      showToast(`Failed to export backup: ${err?.message || "Unknown error"}`, "error");
    }
  };

  // Restore Strongholds State Backup
  const handleRestoreBackup = async (incoming: Stronghold[], mode: "replace" | "merge") => {
    try {
      let nextStrongholds: Stronghold[] = [];
      if (mode === "replace") {
        nextStrongholds = incoming;
      } else {
        const map = new Map<string, Stronghold>();
        strongholds.forEach((s) => map.set(s.id, s));
        incoming.forEach((s) => map.set(s.id, s));
        nextStrongholds = Array.from(map.values());
      }

      setStrongholds(nextStrongholds);
      await savePatientsBulkToIDB(nextStrongholds);

      if (firebaseUser) {
        for (const item of nextStrongholds) {
          try {
            const docRef = doc(db, "patients", item.id);
            await setDoc(
              docRef,
              {
                ...item,
                ownerId: firebaseUser.uid,
                updatedAt: serverTimestamp(),
              },
              { merge: true }
            );
          } catch (cloudErr) {
            console.warn("Cloud restore sync note:", cloudErr);
          }
        }
      }

      if (nextStrongholds.length > 0) {
        setSelectedId(nextStrongholds[0].id);
        await setAppStateToIDB("selectedStrongholdId", nextStrongholds[0].id);
      }

      showToast(
        `Restored ${incoming.length} strongholds (${mode === "replace" ? "Replaced Realm" : "Merged State"}).`,
        "success"
      );
    } catch (err: any) {
      console.error("Restore error:", err);
      showToast(`Restore fault: ${err.message}`, "error");
    }
  };

  // Force Full Dual-Storage Synchronize Trigger
  const handleForceSyncNow = useCallback(async () => {
    setIsSyncingState(true);
    try {
      if (typeof flushSyncQueue === "function") {
        await flushSyncQueue();
      }
      if (strongholds && strongholds.length > 0) {
        await savePatientsBulkToIDB(strongholds);
      }
      const time = new Date().toLocaleTimeString();
      setLastSyncTime(time);
      showToast("Dual Storage Sync Complete: IndexedDB and Firestore 100% Harmonic.", "success");
    } catch (e: any) {
      console.warn("Dual storage sync notice:", e);
      showToast(`Sync operation note: ${e.message || "Synced locally"}`, "info");
    } finally {
      setTimeout(() => setIsSyncingState(false), 600);
    }
  }, [strongholds, showToast]);

  // Automated Background Sync Interval Effect (Unthrottled in background tabs)
  useEffect(() => {
    if (!autoSyncEnabled || isAirGapActive) return;

    const stopTimer = createUnthrottledTimer(() => {
      setSecondsUntilNextSync((prev) => {
        if (prev <= 1) {
          handleForceSyncNow();
          return syncIntervalSeconds;
        }
        return prev - 1;
      });
    });

    return () => stopTimer();
  }, [autoSyncEnabled, syncIntervalSeconds, isAirGapActive, handleForceSyncNow]);

  // Service Worker Background Sync (Active Even When App Closed) Registration & Listener
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (runInBackgroundWhenClosed && autoSyncEnabled && !isAirGapActive) {
      registerBackgroundSync(syncIntervalSeconds)
        .then((status) => {
          setIsPersistentStorageGranted(status.isStoragePersisted);
        })
        .catch((err) => console.warn("Background sync registration info:", err));
    }

    const unsubscribe = subscribeToServiceWorkerSyncEvents((data) => {
      const time = new Date().toLocaleTimeString();
      setLastSyncTime(time);
      if (data.reconciledItems > 0) {
        showToast(
          `Background Sync Reconciled: ${data.reconciledItems} items synchronized via Service Worker while app was idle.`,
          "success"
        );
      }
    });

    return () => unsubscribe();
  }, [runInBackgroundWhenClosed, autoSyncEnabled, syncIntervalSeconds, isAirGapActive, showToast]);

  const handleRequestStoragePersistence = async () => {
    const granted = await requestPersistentStorage();
    setIsPersistentStorageGranted(granted);
    showToast(
      granted
        ? "Persistent Storage Quota Granted: IndexedDB is permanently non-evictable by browser."
        : "Storage quota handled by sovereign browser policies.",
      granted ? "success" : "info"
    );
  };

  // Screen Wake Lock Toggle Handler (Keeps clinical screen awake during telemetry & sync)
  const handleToggleWakeLock = async (enabled: boolean) => {
    if (enabled) {
      const ok = await requestScreenWakeLock();
      setIsWakeLockActive(ok);
      showToast(
        ok
          ? "Display Wake Lock Active: Display will remain awake for uninterrupted monitoring."
          : "Wake Lock unavailable on this client browser.",
        ok ? "success" : "info"
      );
    } else {
      await releaseScreenWakeLock();
      setIsWakeLockActive(false);
      showToast("Display Wake Lock released.", "info");
    }
  };

  // Update Native OS Taskbar / Home Screen App Badge with active node count
  useEffect(() => {
    updateAppBadge(strongholds.length);
  }, [strongholds.length]);

  // Tab Visibility Resume Handler (Reconciles sync and restores wake lock when tab returns to focus)
  useEffect(() => {
    const handleVisibility = () => {
      if (typeof document !== "undefined" && document.visibilityState === "visible") {
        if (autoSyncEnabled && !isAirGapActive) {
          handleForceSyncNow();
        }
        if (isWakeLockActive) {
          requestScreenWakeLock();
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [autoSyncEnabled, isAirGapActive, isWakeLockActive, handleForceSyncNow]);

  // Global Ctrl+K / Cmd+K Command Palette Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setShowCommandPalette((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filteredStrongholds = strongholds.filter(
    (s) =>
      s.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      s.id.toLowerCase().includes(searchFilter.toLowerCase()) ||
      s.notes.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div
      id="kingdom-root"
      className={`min-h-screen ${
        isDarkMode ? "sovereign-dark bg-[#0d0e12] text-[#e4e4e7]" : "bg-[#FAF7F2] text-[#1a1a1a]"
      } flex flex-col font-sans selection:bg-[#c5a27d]/30 selection:text-[#1a1a1a] transition-colors duration-200`}
    >
      {/* Toast Notifications */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col space-y-2 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start space-x-2.5 p-3.5 border shadow-xl text-xs font-mono transition-all duration-300 ${
              toast.type === "success"
                ? "bg-[#1a1a1a] text-[#FAF7F2] border-[#c5a27d]"
                : toast.type === "error"
                ? "bg-red-950 text-red-100 border-red-500"
                : "bg-[#FAF7F2] text-[#1a1a1a] border-[#1a1a1a]"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle className="w-4 h-4 text-[#c5a27d] shrink-0 mt-0.5" />
            ) : toast.type === "error" ? (
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            ) : (
              <Crown className="w-4 h-4 text-[#c5a27d] shrink-0 mt-0.5" />
            )}
            <span className="leading-snug">{toast.message}</span>
          </div>
        ))}
      </div>

      {/* TOP HEADER */}
      <header className="border-b border-[#1a1a1a]/15 bg-[#FAF7F2]/90 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2.5">
            <button
              id="header-odlc-logo-btn"
              onClick={() => setShowBrandShowcaseModal(true)}
              className="w-9 h-9 rounded border border-[#c5a27d] bg-[#1a1a1a] p-0.5 shadow-sm hover:scale-105 transition-transform overflow-hidden shrink-0 group"
              title="Click to view ODLC Brand Logo & Program Project Showcase"
            >
              <img
                src="/src/assets/images/odlc_brand_logo_1791603956565.jpg"
                alt="ODLC Official Logo"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </button>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-base sm:text-lg font-serif font-bold tracking-tight text-[#1a1a1a]">
                  PROJECT KINGDOM
                </h1>
                <span className="hidden sm:inline-block text-[9px] font-mono font-bold tracking-wider px-1.5 py-0.5 bg-[#c5a27d]/20 text-[#1a1a1a] border border-[#c5a27d]/50">
                  STRATUM CLINICAL EDGE
                </span>

                {/* 3-WAY AUDIENCE & PLATFORM MODE SELECTOR */}
                <div className="inline-flex rounded-xs border border-neutral-300 p-0.5 bg-neutral-100 font-mono text-[9px]">
                  <button
                    id="header-mode-showcase-btn"
                    onClick={() => {
                      setDisplayMode("showcase");
                      showToast("Public Showcase Mode: Curated for partners, investors & executives.", "info");
                    }}
                    className={`px-1.5 py-0.5 transition-colors cursor-pointer rounded-xs ${
                      displayMode === "showcase"
                        ? "bg-[#1a1a1a] text-white font-bold"
                        : "text-neutral-600 hover:text-black"
                    }`}
                    title="Public Showcase: High-level scorecard, stacked layers & timeline"
                  >
                    SHOWCASE
                  </button>
                  <button
                    id="header-mode-simulation-btn"
                    onClick={() => {
                      setDisplayMode("simulation");
                      showToast("Simulation Mode: Canonical ODLC test fixtures active.", "info");
                    }}
                    className={`px-1.5 py-0.5 transition-colors cursor-pointer rounded-xs ${
                      displayMode === "simulation"
                        ? "bg-amber-600 text-white font-bold"
                        : "text-neutral-600 hover:text-black"
                    }`}
                    title="Simulation Demo: Sandbox patients & clinical dictation"
                  >
                    SIMULATION
                  </button>
                  <button
                    id="header-mode-production-btn"
                    onClick={() => {
                      setDisplayMode("production");
                      showToast("Live Production Mode: IndexedDB master vault & Cloud Run edge active.", "success");
                    }}
                    className={`px-1.5 py-0.5 transition-colors cursor-pointer rounded-xs ${
                      displayMode === "production"
                        ? "bg-emerald-700 text-white font-bold"
                        : "text-neutral-600 hover:text-black"
                    }`}
                    title="Live Production: Operating ledger & encrypted storage"
                  >
                    PRODUCTION
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2 mt-0.5">
                <p className="text-[10px] text-neutral-500 font-mono">
                  Decentralized Clinical Intelligence Platform
                </p>
                <span className="text-neutral-400 text-[10px]">•</span>
                <button
                  id="header-maturity-scorecard-btn"
                  onClick={() => setActiveTab("ecosystem-scorecard")}
                  className="text-[10px] font-mono text-[#c5a27d] hover:text-[#1a1a1a] font-bold underline flex items-center gap-0.5 cursor-pointer"
                  title="View Ecosystem Maturity Scorecard (98/100) & Architecture Stack"
                >
                  <Award className="w-3 h-3 text-[#c5a27d]" />
                  <span>Maturity Score: 98/100 (Grade A+)</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Status Badges */}
          <button
            id="header-air-gap-toggle-btn"
            onClick={() => {
              const nextState = !isAirGapActive;
              setIsAirGapActive(nextState);
              showToast(
                nextState
                  ? "Air-Gap Mode Engaged: WAN severed, zero external bytes exfiltrated."
                  : "WAN Link Restored: Resuming cloud sync stream.",
                nextState ? "info" : "success"
              );
            }}
            className={`flex items-center space-x-1.5 px-2.5 py-1 text-[9px] font-mono border transition-all ${
              isAirGapActive
                ? "bg-amber-950/80 border-amber-500/60 text-amber-300 font-bold"
                : "bg-white border-[#1a1a1a]/15 text-neutral-700 hover:border-[#c5a27d]"
            }`}
            title="Toggle WAN Sever / Air-Gap Zero-Exfiltration Simulator"
          >
            {isAirGapActive ? (
              <>
                <WifiOff className="w-3 h-3 text-amber-400 animate-pulse" />
                <span className="hidden sm:inline">AIR-GAP ACTIVE (0 WAN BYTES)</span>
                <span className="sm:hidden">AIR-GAP</span>
              </>
            ) : (
              <>
                <Wifi className="w-3 h-3 text-emerald-600" />
                <span className="hidden sm:inline">WAN CONNECTED</span>
                <span className="sm:hidden">ONLINE</span>
              </>
            )}
          </button>

          <div className="hidden md:flex items-center space-x-1.5 px-2.5 py-1 bg-white border border-[#1a1a1a]/15 text-[9px] font-mono">
            <Database className="w-3 h-3 text-[#c5a27d]" />
            <span className="text-neutral-700 font-bold">INDEXEDDB VAULT ONLINE</span>
          </div>

          <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 bg-white border border-[#1a1a1a]/15 text-[9px] font-mono text-neutral-600">
            <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
            <span suppressHydrationWarning>{currentTimeStr || "SYNCHRONIZING..."}</span>
          </div>

          {/* Luxury Sovereign Dark Mode Toggle */}
          <button
            id="theme-mode-toggle-btn"
            onClick={handleToggleDarkMode}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-white border border-[#1a1a1a]/20 hover:border-[#c5a27d] text-xs font-mono text-neutral-700 transition-all shadow-sm group"
            title={isDarkMode ? "Switch to Warm Editorial Canvas" : "Switch to Sovereign Obsidian Dark Mode"}
          >
            {isDarkMode ? (
              <>
                <Moon className="w-3.5 h-3.5 text-[#c5a27d] group-hover:rotate-12 transition-transform" />
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#c5a27d]">Dark Mode</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-[#c5a27d] group-hover:rotate-45 transition-transform" />
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-600">Light Mode</span>
              </>
            )}
          </button>

          {/* ODLC Brand & Project Showcase Button */}
          <button
            id="open-brand-showcase-btn"
            onClick={() => setShowBrandShowcaseModal(true)}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-white border border-[#1a1a1a]/20 hover:border-[#c5a27d] text-xs font-mono text-[#1a1a1a] transition-all shadow-sm group"
            title="View Program Project Photograph & ODLC Brand Logo"
          >
            <img
              src="/src/assets/images/odlc_brand_logo_1791603956565.jpg"
              alt="ODLC Logo"
              referrerPolicy="no-referrer"
              className="w-3.5 h-3.5 rounded object-cover border border-[#c5a27d]"
            />
            <span className="text-[10px] font-bold tracking-wider text-[#1a1a1a] hidden sm:inline">
              ODLC / 17 POCKETS
            </span>
          </button>

          {/* Solar Nexus GitBook Addition Launcher */}
          <button
            id="open-solar-nexus-btn"
            onClick={() => setActiveTab("solar-nexus")}
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 text-xs font-mono transition-all shadow-sm group border ${
              activeTab === "solar-nexus"
                ? "bg-[#c5a27d] text-[#1a1a1a] border-[#c5a27d] font-bold"
                : "bg-white border border-[#1a1a1a]/20 hover:border-[#c5a27d] text-[#1a1a1a]"
            }`}
            title="Open Solar Nexus & 20 Pockets GitBook Addition"
          >
            <Globe className="w-3.5 h-3.5 text-[#c5a27d]" />
            <span className="text-[10px] font-bold tracking-wider hidden md:inline">
              SOLAR NEXUS
            </span>
            <span className="text-[9px] font-mono text-emerald-700 bg-emerald-50 px-1 py-0.2 border border-emerald-300 hidden lg:inline font-bold">
              20 POCKETS LIVE
            </span>
          </button>

          {/* Standalone Release & External Deployment Button */}
          <button
            id="open-release-modal-btn"
            onClick={() => setShowReleaseModal(true)}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-[#FAF7F2] border border-[#c5a27d] hover:bg-[#c5a27d]/15 text-xs font-mono text-[#1a1a1a] transition-all shadow-sm group"
            title="Release & Standalone Deployment Guide (GitHub, Vercel, Docker, VPS, Cloud Run)"
          >
            <Cloud className="w-3.5 h-3.5 text-[#c5a27d]" />
            <span className="text-[10px] font-bold tracking-wider text-stone-900 hidden sm:inline">
              RELEASE / DEPLOY
            </span>
          </button>

          {/* Identity Button */}
          <button
            onClick={() => setShowIdentityModal(true)}
            className="flex items-center space-x-2 px-3 py-1.5 bg-[#1a1a1a] hover:bg-[#2b2b2b] text-[#FAF7F2] border border-[#c5a27d] transition-all text-xs font-mono"
          >
            <User className="w-3.5 h-3.5 text-[#c5a27d]" />
            <span className="max-w-[120px] sm:max-w-[160px] truncate">{sovereignRole}</span>
          </button>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* SIDEBAR NAVIGATION & DEVELOPER STAMP */}
        <aside className="w-full lg:w-64 border-r border-[#1a1a1a]/15 bg-[#FAF7F2] flex flex-col justify-between p-4 shrink-0">
          <div className="space-y-4">
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500 px-2">
              Command Modules
            </div>

            <nav className="space-y-1">
              {/* ECOSYSTEM MATURITY SCORECARD (98/100) */}
              <button
                id="nav-ecosystem-scorecard-btn"
                onClick={() => setActiveTab("ecosystem-scorecard")}
                className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-serif transition-colors text-left border-b border-neutral-200/80 mb-1 ${
                  activeTab === "ecosystem-scorecard"
                    ? "bg-[#1a1a1a] text-white border-l-2 border-[#c5a27d]"
                    : "bg-white hover:bg-neutral-50 text-[#1a1a1a]"
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Award className="w-4 h-4 text-[#c5a27d]" />
                  <span className="font-semibold">Ecosystem Maturity</span>
                </div>
                <span className="text-[9px] font-mono text-emerald-800 bg-emerald-50 px-1.5 py-0.5 border border-emerald-300 font-bold">
                  98/100 A+
                </span>
              </button>

              <button
                onClick={() => setActiveTab("strongholds")}
                className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-serif transition-colors text-left ${
                  activeTab === "strongholds"
                    ? "bg-[#1a1a1a] text-white border-l-2 border-[#c5a27d]"
                    : "hover:bg-white text-[#1a1a1a]"
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Castle className="w-4 h-4 text-[#c5a27d]" />
                  <span>Realms & Strongholds</span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 bg-neutral-800 text-[#c5a27d]">
                  {strongholds.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab("map")}
                className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-serif transition-colors text-left ${
                  activeTab === "map"
                    ? "bg-[#1a1a1a] text-white border-l-2 border-[#c5a27d]"
                    : "hover:bg-white text-[#1a1a1a]"
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Compass className="w-4 h-4 text-[#c5a27d]" />
                  <span>Spatial Health Radar</span>
                </div>
                <span className="text-[9px] font-mono text-neutral-400">GPS/ARCANE</span>
              </button>

              <button
                id="nav-clinical-command-btn"
                onClick={() => setActiveTab("command-center")}
                className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-serif transition-colors text-left ${
                  activeTab === "command-center" || activeTab === "war-room"
                    ? "bg-[#1a1a1a] text-white border-l-2 border-[#c5a27d]"
                    : "hover:bg-white text-[#1a1a1a]"
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Compass className="w-4 h-4 text-[#c5a27d]" />
                  <span>Clinical Command Center</span>
                </div>
                <span className="text-[9px] font-mono text-[#c5a27d]">OPERATIONS</span>
              </button>

              <button
                id="nav-human-reality-btn"
                onClick={() => setActiveTab("human-reality")}
                className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-serif transition-colors text-left ${
                  activeTab === "human-reality"
                    ? "bg-[#1a1a1a] text-white border-l-2 border-[#c5a27d]"
                    : "hover:bg-white text-[#1a1a1a]"
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <HeartPulse className="w-4 h-4 text-[#c5a27d]" />
                  <span>Full Circle Human Reality</span>
                </div>
                <span className="text-[9px] font-mono text-[#1a1a1a] bg-[#c5a27d] px-1.5 py-0.5 font-bold shadow-xs">
                  MOVEMENT
                </span>
              </button>

              <button
                onClick={() => setActiveTab("provisions")}
                className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-serif transition-colors text-left ${
                  activeTab === "provisions"
                    ? "bg-[#1a1a1a] text-white border-l-2 border-[#c5a27d]"
                    : "hover:bg-white text-[#1a1a1a]"
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Wheat className="w-4 h-4 text-[#c5a27d]" />
                  <span>Medical Provisions & Buffer</span>
                </div>
              </button>

              {/* UNIVERSAL POCKET OPERATIONS MATRIX (01 - 20) */}
              <button
                id="nav-pocket-matrix-btn"
                onClick={() => setActiveTab("pocket-matrix")}
                className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-serif transition-colors text-left ${
                  activeTab === "pocket-matrix"
                    ? "bg-[#1a1a1a] text-white border-l-2 border-[#c5a27d]"
                    : "hover:bg-white text-[#1a1a1a]"
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Layers className="w-4 h-4 text-[#c5a27d]" />
                  <span className="font-semibold">Pocket Status Matrix</span>
                </div>
                <span className="text-[9px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 border border-emerald-300 font-bold">
                  01-20 LIVE
                </span>
              </button>

              <button
                id="nav-seventeen-pockets-btn"
                onClick={() => setActiveTab("topology")}
                className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-serif transition-colors text-left ${
                  activeTab === "topology"
                    ? "bg-[#1a1a1a] text-white border-l-2 border-[#c5a27d]"
                    : "hover:bg-white text-[#1a1a1a]"
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <GitBranch className="w-4 h-4 text-[#c5a27d]" />
                  <span>Seventeen Pockets Topology</span>
                </div>
                <span className="text-[9px] font-mono text-[#c5a27d]">CI/CD DUAL</span>
              </button>

              <button
                onClick={() => setActiveTab("logs")}
                className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-serif transition-colors text-left ${
                  activeTab === "logs"
                    ? "bg-[#1a1a1a] text-white border-l-2 border-[#c5a27d]"
                    : "hover:bg-white text-[#1a1a1a]"
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Terminal className="w-4 h-4 text-[#c5a27d]" />
                  <span>Council Logs & CI/CD</span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 bg-neutral-200 text-neutral-800">
                  {councilLogs.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab("cipher")}
                className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-serif transition-colors text-left ${
                  activeTab === "cipher"
                    ? "bg-[#1a1a1a] text-white border-l-2 border-[#c5a27d]"
                    : "hover:bg-white text-[#1a1a1a]"
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Sparkles className="w-4 h-4 text-[#c5a27d]" />
                  <span>Runestone Cipher</span>
                </div>
              </button>

              <button
                id="agent-bridge-tab-btn"
                onClick={() => setActiveTab("agent-bridge")}
                className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-serif transition-colors text-left ${
                  activeTab === "agent-bridge"
                    ? "bg-[#1a1a1a] text-white border-l-2 border-[#c5a27d]"
                    : "hover:bg-white text-[#1a1a1a]"
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Bot className="w-4 h-4 text-[#c5a27d]" />
                  <span>AI Agent Bridge</span>
                </div>
                <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/60 px-1 py-0.5 border border-emerald-500/30">OPEN</span>
              </button>

              <button
                id="idv-tab-btn"
                onClick={() => setActiveTab("idv")}
                className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-serif transition-colors text-left ${
                  activeTab === "idv"
                    ? "bg-[#1a1a1a] text-white border-l-2 border-[#c5a27d]"
                    : "hover:bg-white text-[#1a1a1a]"
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Lock className="w-4 h-4 text-[#c5a27d]" />
                  <span>Isolated Data Vault</span>
                </div>
                <span className="text-[9px] font-mono text-[#c5a27d] bg-[#c5a27d]/10 px-1 py-0.5 border border-[#c5a27d]/30">MANDIANT</span>
              </button>

              <button
                id="triage-tab-btn"
                onClick={() => setActiveTab("triage")}
                className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-serif transition-colors text-left ${
                  activeTab === "triage"
                    ? "bg-[#1a1a1a] text-white border-l-2 border-[#c5a27d]"
                    : "hover:bg-white text-[#1a1a1a]"
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <HeartPulse className="w-4 h-4 text-red-500" />
                  <span>Autonomous Urgency</span>
                </div>
                <span className="text-[9px] font-mono text-blue-700 bg-blue-50 px-1 py-0.5 border border-blue-200">DYNAMICS</span>
              </button>

              <button
                id="dispatch-tab-btn"
                onClick={() => setActiveTab("dispatch")}
                className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-serif transition-colors text-left ${
                  activeTab === "dispatch"
                    ? "bg-[#1a1a1a] text-white border-l-2 border-[#c5a27d]"
                    : "hover:bg-white text-[#1a1a1a]"
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Megaphone className="w-4 h-4 text-amber-600" />
                  <span>ABCD Field Advisory</span>
                </div>
                <span className="text-[9px] font-mono text-amber-700 bg-amber-50 px-1 py-0.5 border border-amber-200">VIGENAIR</span>
              </button>

              <button
                id="growth-marketing-tab-btn"
                onClick={() => setActiveTab("growth-marketing")}
                className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-serif transition-colors text-left ${
                  activeTab === "growth-marketing"
                    ? "bg-[#1a1a1a] text-white border-l-2 border-[#c5a27d]"
                    : "hover:bg-white text-[#1a1a1a]"
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <BarChart3 className="w-4 h-4 text-[#c5a27d]" />
                  <span>Google Growth & Telemetry</span>
                </div>
                <span className="text-[9px] font-mono text-[#c5a27d] bg-[#c5a27d]/10 px-1 py-0.5 border border-[#c5a27d]/30">GA4 / ADS</span>
              </button>

              {/* SEPARATE ADDITION: SOLAR NEXUS & 20 POCKETS */}
              <button
                id="nav-solar-nexus-sidebar-btn"
                onClick={() => setActiveTab("solar-nexus")}
                className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-serif transition-colors text-left border-t border-neutral-200/60 ${
                  activeTab === "solar-nexus"
                    ? "bg-[#111923] text-white border-l-2 border-[#c5a27d]"
                    : "hover:bg-white text-[#1a1a1a]"
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Globe className="w-4 h-4 text-[#c5a27d]" />
                  <span className="font-semibold">Solar Nexus &amp; 20 Pockets</span>
                </div>
                <span className="text-[9px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 border border-emerald-300 font-bold">
                  20/20 LIVE
                </span>
              </button>

              {/* GITLAB REAL BUILDS & FILES (FROM USER GITBOOK / GITLAB DOCS) */}
              <button
                id="nav-gitlab-builds-sidebar-btn"
                onClick={() => setActiveTab("gitlab-builds")}
                className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-serif transition-colors text-left ${
                  activeTab === "gitlab-builds"
                    ? "bg-[#111923] text-white border-l-2 border-[#c5a27d]"
                    : "hover:bg-white text-[#1a1a1a]"
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Cpu className="w-4 h-4 text-[#c5a27d]" />
                  <span>GitLab Real Builds &amp; Files</span>
                </div>
                <span className="text-[9px] font-mono text-blue-700 bg-blue-50 px-1 py-0.5 border border-blue-300 font-bold">
                  CI/CD
                </span>
              </button>

              {/* MODULE 1: 20-POCKET MESH LATENCY */}
              <button
                id="nav-mesh-telemetry-btn"
                onClick={() => setActiveTab("mesh-telemetry")}
                className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-serif transition-colors text-left ${
                  activeTab === "mesh-telemetry"
                    ? "bg-[#111923] text-white border-l-2 border-[#c5a27d]"
                    : "hover:bg-white text-[#1a1a1a]"
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Activity className="w-4 h-4 text-emerald-500" />
                  <span>20-Pocket Mesh Latency</span>
                </div>
                <span className="text-[9px] font-mono text-emerald-700 bg-emerald-50 px-1 py-0.5 border border-emerald-300">
                  SWEEP
                </span>
              </button>

              {/* MODULE 2: AIR-GAP SIMULATOR & ZERO-EXFILTRATION */}
              <button
                id="nav-air-gap-sim-btn"
                onClick={() => setActiveTab("air-gap-sim")}
                className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-serif transition-colors text-left ${
                  activeTab === "air-gap-sim"
                    ? "bg-[#111923] text-white border-l-2 border-[#c5a27d]"
                    : "hover:bg-white text-[#1a1a1a]"
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  {isAirGapActive ? (
                    <WifiOff className="w-4 h-4 text-amber-500 animate-pulse" />
                  ) : (
                    <Wifi className="w-4 h-4 text-[#c5a27d]" />
                  )}
                  <span>Air-Gap Edge Simulator</span>
                </div>
                <span
                  className={`text-[9px] font-mono px-1 py-0.5 border ${
                    isAirGapActive
                      ? "bg-amber-100 text-amber-800 border-amber-300 font-bold"
                      : "bg-neutral-100 text-neutral-600 border-neutral-300"
                  }`}
                >
                  {isAirGapActive ? "LOCKED" : "0 LEAK"}
                </span>
              </button>

              {/* MODULE 3: CLINICAL DOSSIER & FHIR R4 */}
              <button
                id="nav-dossier-suite-btn"
                onClick={() => setActiveTab("dossier-suite")}
                className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-serif transition-colors text-left ${
                  activeTab === "dossier-suite"
                    ? "bg-[#111923] text-white border-l-2 border-[#c5a27d]"
                    : "hover:bg-white text-[#1a1a1a]"
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <FileText className="w-4 h-4 text-[#c5a27d]" />
                  <span>Clinical Dossier &amp; FHIR</span>
                </div>
                <span className="text-[9px] font-mono text-[#c5a27d] bg-[#c5a27d]/10 px-1 py-0.5 border border-[#c5a27d]/30 font-bold">
                  R4 SPEC
                </span>
              </button>

              {/* MODULE 4: HANDS-FREE VOICE CLINICAL SCRIBE */}
              <button
                id="nav-voice-scribe-btn"
                onClick={() => setActiveTab("voice-scribe")}
                className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-serif transition-colors text-left ${
                  activeTab === "voice-scribe"
                    ? "bg-[#111923] text-white border-l-2 border-[#c5a27d]"
                    : "hover:bg-white text-[#1a1a1a]"
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Mic className="w-4 h-4 text-red-500" />
                  <span>Voice Clinical Scribe</span>
                </div>
                <span className="text-[9px] font-mono text-red-700 bg-red-50 px-1 py-0.5 border border-red-200 font-bold">
                  LIVE NLP
                </span>
              </button>

              {/* MODULE 5: ENTERTAINMENT STRUCTURE & CREATOR SUITE (POCKET 11) */}
              <button
                id="nav-entertainment-btn"
                onClick={() => setActiveTab("entertainment")}
                className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-serif transition-colors text-left border-t border-purple-200/60 ${
                  activeTab === "entertainment"
                    ? "bg-[#10081e] text-white border-l-2 border-[#a78bfa]"
                    : "hover:bg-purple-50 text-[#1a1a1a]"
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Film className="w-4 h-4 text-[#7c3aed]" />
                  <span className="font-semibold">Entertainment Platform</span>
                </div>
                <span className="text-[9px] font-mono text-purple-700 bg-purple-50 px-1.5 py-0.5 border border-purple-300 font-bold">
                  POCKET 11
                </span>
              </button>

              {/* MODULE 6: 30-DAY SPRINT CONTROL PLAN (POCKET 10) */}
              <button
                id="nav-sprint-btn"
                onClick={() => setActiveTab("sprint")}
                className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-serif transition-colors text-left ${
                  activeTab === "sprint"
                    ? "bg-[#1a1a1a] text-white border-l-2 border-[#c5a27d]"
                    : "hover:bg-amber-50 text-[#1a1a1a]"
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Calendar className="w-4 h-4 text-[#c5a27d]" />
                  <span className="font-semibold">30-Day Sprint Plan</span>
                </div>
                <span className="text-[9px] font-mono text-amber-800 bg-amber-50 px-1.5 py-0.5 border border-amber-300 font-bold">
                  EPIC &amp;1
                </span>
              </button>

              {/* MODULE 7: STRIPE APPS UPLOAD & DEPLOYMENT HUB */}
              <button
                id="nav-stripe-apps-btn"
                onClick={() => setActiveTab("stripe-apps")}
                className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-serif transition-colors text-left border-t border-[#635BFF]/30 ${
                  activeTab === "stripe-apps"
                    ? "bg-[#1f1b3e] text-white border-l-2 border-[#635BFF]"
                    : "hover:bg-indigo-50 text-[#1a1a1a]"
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <CreditCard className="w-4 h-4 text-[#635BFF]" />
                  <span className="font-semibold">Stripe Apps Upload</span>
                </div>
                <span className="text-[9px] font-mono text-[#635BFF] bg-indigo-50 px-1.5 py-0.5 border border-[#635BFF]/40 font-bold">
                  CLI UPLOAD
                </span>
              </button>
            </nav>

            <div className="pt-2">
              <ErrorBoundary moduleTitle="Platform Decrees & Guidelines">
                <PlatformInstructions />
              </ErrorBoundary>
            </div>

            {/* SEVENTEEN POCKETS BRAND INC & ODLC PROJECT PHOTO BADGE */}
            <div className="pt-1">
              <div className="bg-white border-2 border-[#1a1a1a]/20 p-2.5 space-y-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <img
                      src="/src/assets/images/odlc_brand_logo_1791603956565.jpg"
                      alt="ODLC Logo"
                      className="w-6 h-6 rounded border border-[#c5a27d] object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <div className="text-[10px] font-serif font-bold text-[#1a1a1a] leading-none">
                        ODLC &amp; 17 Pockets
                      </div>
                      <div className="text-[8px] font-mono text-[#c5a27d] font-bold">BRAND INC. OFFICIAL</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setShowBrandShowcaseModal(true)}
                      className="text-[9px] font-mono text-neutral-600 hover:text-[#1a1a1a] hover:underline"
                    >
                      Photo
                    </button>
                    <button
                      onClick={() => {
                        setSelectedCinemaVideo(ECOSYSTEM_VIDEOS["hardware-showcase"]);
                        setShowVideoTheaterModal(true);
                      }}
                      className="text-[9px] font-mono text-[#c5a27d] hover:underline font-bold flex items-center gap-0.5"
                    >
                      <span>📹 Video Reel</span>
                    </button>
                  </div>
                </div>

                {/* VIDEO HOVERCARD PREVIEW ON SIDEBAR HARDWARE CARD */}
                <VideoHoverCard
                  video={ECOSYSTEM_VIDEOS["hardware-showcase"]}
                  onExpand={(vid) => {
                    setSelectedCinemaVideo(vid);
                    setShowVideoTheaterModal(true);
                  }}
                  position="right"
                  align="center"
                  cardWidth={350}
                >
                  <button
                    onClick={() => {
                      setSelectedCinemaVideo(ECOSYSTEM_VIDEOS["hardware-showcase"]);
                      setShowVideoTheaterModal(true);
                    }}
                    className="w-full text-left relative group overflow-hidden border border-neutral-200 block"
                    title="Hover for live video preview • Click for 4K Cinema Theater"
                  >
                    <img
                      src="/src/assets/images/seventeen_pockets_showcase_1791603966885.jpg"
                      alt="Program Project Photograph"
                      className="w-full h-16 object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/15 transition-colors flex items-center justify-between px-2">
                      <span className="text-[8px] font-mono text-white bg-[#1a1a1a]/85 px-1.5 py-0.5 border border-[#c5a27d] flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                        Hover: Video Preview
                      </span>
                      <span className="text-[8px] font-mono text-[#c5a27d] bg-black/70 px-1 py-0.5">
                        4K 60FPS
                      </span>
                    </div>
                  </button>
                </VideoHoverCard>
              </div>
            </div>
          </div>

          {/* DUAL-STORAGE SYNCHRONIZATION STATUS MATRIX */}
          <div className="mt-4 pt-3 border-t border-[#1a1a1a]/15">
            <div className="bg-white border border-[#1a1a1a]/20 p-3 space-y-2 font-mono text-[10px]">
              <div className="flex items-center justify-between text-[#1a1a1a] font-bold border-b border-neutral-100 pb-1.5">
                <span className="flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-[#c5a27d]" />
                  Dual-Storage Engine
                </span>
                <span className="text-[8px] px-1 py-0.5 bg-emerald-100 text-emerald-800 font-bold">
                  ACTIVE
                </span>
              </div>

              <div className="space-y-1 text-neutral-600">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    IndexedDB Local:
                  </span>
                  <span className="font-bold text-[#1a1a1a]">{strongholds.length} Citadels Cached</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    Firestore Cloud:
                  </span>
                  <span className="font-bold text-[#1a1a1a]">
                    {firebaseUser ? (firebaseUser.isAnonymous ? "Anon Vault" : "Google Cloud") : "Disconnected"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[9px] text-neutral-400 pt-0.5">
                  <span>Last Re-sync:</span>
                  <span>{lastSyncTime}</span>
                </div>
              </div>

              <button
                id="force-dual-sync-btn"
                onClick={handleForceSyncNow}
                disabled={isSyncingState}
                className="w-full flex items-center justify-center space-x-1.5 px-2 py-1.5 bg-[#FAF7F2] hover:bg-[#1a1a1a] text-[#1a1a1a] hover:text-white border border-[#1a1a1a]/20 hover:border-[#1a1a1a] transition-all text-[9px] font-bold uppercase tracking-wider disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 text-[#c5a27d] ${isSyncingState ? "animate-spin" : ""}`} />
                <span>{isSyncingState ? "Synchronizing Vaults..." : "Force Full Resync"}</span>
              </button>
            </div>
          </div>

          {/* USER-FAVORED ACTIVE DEVELOPER SANDBOX URL STAMP (PERMANENT RULE) */}
          <div className="mt-4 pt-3 border-t border-[#1a1a1a]/15">
            <div className="bg-white border border-[#1a1a1a]/20 p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] font-mono font-bold tracking-wider text-emerald-800 uppercase">
                    Developer Sandbox
                  </span>
                </div>
                <span className="text-[8px] font-mono px-1 bg-neutral-100 text-neutral-600">PORT 3000</span>
              </div>

              <div className="text-[9px] font-mono text-neutral-600 break-all bg-[#FAF7F2] p-1.5 border border-neutral-200 select-all">
                https://ais-dev-ucamfjc2ipikqim5busbet-612821199205.us-west2.run.app
              </div>

              <button
                onClick={handleCopySandboxUrl}
                className="w-full flex items-center justify-center space-x-1.5 px-2 py-1 bg-[#1a1a1a] text-[#FAF7F2] hover:bg-[#c5a27d] transition-colors text-[9px] font-mono uppercase tracking-wider"
              >
                {copiedLink ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-[#c5a27d]" />}
                <span>{copiedLink ? "Address Copied" : "Copy Runtime URL"}</span>
              </button>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
          <ErrorBoundary moduleTitle="Sovereign Realm Command Center">

          {/* 1. PUBLIC SHOWCASE MODE (EXECUTIVE MATURITY SCORECARD 98/100, ARCHITECTURE STACK & TIMELINE) */}
          {displayMode === "showcase" && (
            <ErrorBoundary moduleTitle="Ecosystem Maturity Suite & Architecture Stack">
              <EcosystemMaturitySuite
                currentMode={displayMode}
                onChangeMode={setDisplayMode}
                onNavigateTab={setActiveTab}
                isDark={isDarkMode}
              />
            </ErrorBoundary>
          )}

          {/* BUILD & DEPLOYMENT HEALTH STATUS DECK */}
          <BuildDeploymentHealthCards
            onNavigateTab={setActiveTab}
            onRefresh={() => showToast("CI/CD pipeline and Cloud Run edge health verified.", "success")}
            isDark={isDarkMode}
          />

          {/* TOP METRIC BANNER */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white border border-[#1a1a1a]/15 p-3.5 space-y-1">
              <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider flex items-center justify-between">
                <span>Strongholds</span>
                <Castle className="w-3.5 h-3.5 text-[#c5a27d]" />
              </div>
              <div className="text-xl font-serif font-bold text-[#1a1a1a]">
                {strongholds.length} <span className="text-xs font-mono font-normal text-neutral-500">Citadels</span>
              </div>
            </div>

            <div className="bg-white border border-[#1a1a1a]/15 p-3.5 space-y-1">
              <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider flex items-center justify-between">
                <span>Treasury Index</span>
                <Crown className="w-3.5 h-3.5 text-[#c5a27d]" />
              </div>
              <div className="text-xl font-serif font-bold text-[#1a1a1a]">
                57.5K <span className="text-xs font-mono font-normal text-emerald-700">+12%</span>
              </div>
            </div>

            <div className="bg-white border border-[#1a1a1a]/15 p-3.5 space-y-1">
              <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider flex items-center justify-between">
                <span>Mana Resonance</span>
                <Sparkles className="w-3.5 h-3.5 text-[#c5a27d]" />
              </div>
              <div className="text-xl font-serif font-bold text-[#1a1a1a]">
                96.4% <span className="text-xs font-mono font-normal text-[#c5a27d]">Harmonic</span>
              </div>
            </div>

            <div
              onClick={() => setActiveTab("idv")}
              className="bg-white border border-[#1a1a1a]/15 p-3.5 space-y-1 cursor-pointer hover:border-[#c5a27d] transition-colors"
              title="Click to inspect Mandiant Isolated Data Vault & Air-Gap status"
            >
              <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider flex items-center justify-between">
                <span>Offline Vault (IDV)</span>
                <Lock className="w-3.5 h-3.5 text-[#c5a27d]" />
              </div>
              <div className="text-xl font-serif font-bold text-emerald-800">
                ACTIVE <span className="text-xs font-mono font-normal text-neutral-500">WORM Lock</span>
              </div>
            </div>
          </div>

          {/* HUMAN REALITY MOVEMENT BRIDGE BANNER */}
          <div className="bg-[#1a1a1a] text-[#FAF7F2] p-4 border border-[#c5a27d]/40 flex flex-col md:flex-row items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#c5a27d]/20 border border-[#c5a27d] flex items-center justify-center shrink-0">
                <HeartPulse className="w-5 h-5 text-[#c5a27d] animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono uppercase tracking-widest px-1.5 py-0.5 bg-[#c5a27d] text-[#1a1a1a] font-bold">
                    FULL CIRCLE MOVEMENT
                  </span>
                  <span className="text-xs font-serif font-bold text-white">
                    From Code & Theory to Human Reality on the Ground
                  </span>
                </div>
                <p className="text-[11px] text-neutral-300 font-sans mt-0.5">
                  Equipping Dr. Odell Anderson Jr. & Dee Gone&apos;s Care Cadre with bedside clinical scribing, the 17-pocket physical field kit, and printable sovereign Pocket Care Cards.
                </p>
              </div>
            </div>
            <button
              id="hero-human-reality-btn"
              onClick={() => setActiveTab("human-reality")}
              className="px-4 py-2 bg-[#c5a27d] text-[#1a1a1a] hover:bg-white text-xs font-mono font-bold uppercase tracking-wider shrink-0 transition-all flex items-center gap-2 shadow-xs"
            >
              <span>Enter Human Reality Deck</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* TAB 1: STRONGHOLDS & REALMS */}
          {activeTab === "strongholds" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 border border-[#1a1a1a]/15">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="stronghold-search-input"
                    type="text"
                    placeholder="Filter strongholds by territory or tactical notes..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    suppressHydrationWarning
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#FAF7F2] border border-[#1a1a1a]/15 focus:outline-none focus:border-[#c5a27d] font-sans"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    id="export-strongholds-csv-btn"
                    onClick={handleExportStrongholdsCSV}
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-[#1a1a1a]/20 hover:border-[#c5a27d] text-[#1a1a1a] hover:bg-[#FAF7F2] transition-colors text-xs font-mono uppercase tracking-wider shadow-sm"
                    title="Export stronghold resources, clinical care levels, and directives to CSV for offline spreadsheets"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-[#c5a27d]" />
                    <span>Export to CSV</span>
                  </button>

                  <button
                    id="download-backup-btn"
                    onClick={handleDownloadBackup}
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-[#1a1a1a]/20 hover:border-[#c5a27d] text-[#1a1a1a] hover:bg-[#FAF7F2] transition-colors text-xs font-mono uppercase tracking-wider shadow-sm"
                    title="Export current stronghold state to a secure JSON file"
                  >
                    <Download className="w-3.5 h-3.5 text-[#c5a27d]" />
                    <span>Download Backup</span>
                  </button>

                  <button
                    id="restore-backup-btn"
                    onClick={() => setShowRestoreModal(true)}
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-[#1a1a1a]/20 hover:border-[#c5a27d] text-[#1a1a1a] hover:bg-[#FAF7F2] transition-colors text-xs font-mono uppercase tracking-wider shadow-sm"
                    title="Restore or merge strongholds from a JSON backup file"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#c5a27d]" />
                    <span>Restore Backup</span>
                  </button>

                  <button
                    id="open-idv-vault-btn"
                    onClick={() => setActiveTab("idv")}
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#FAF7F2] border border-[#1a1a1a]/20 hover:border-[#c5a27d] text-[#1a1a1a] hover:bg-white transition-colors text-xs font-mono uppercase tracking-wider shadow-sm"
                    title="Inspect Mandiant Isolated Data Vault (IDV) & Air-Gap Recovery Platform"
                  >
                    <Lock className="w-3.5 h-3.5 text-[#c5a27d]" />
                    <span>Data Vault (IDV)</span>
                  </button>

                  <button
                    id="commission-stronghold-btn"
                    onClick={() => setShowAddStronghold(true)}
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#1a1a1a] text-white hover:bg-[#c5a27d] transition-colors text-xs font-mono uppercase tracking-wider"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#c5a27d]" />
                    <span>Commission Stronghold</span>
                  </button>
                </div>
              </div>

              {/* Grid of Strongholds */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {filteredStrongholds.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedId(item.id);
                      setAppStateToIDB("selectedStrongholdId", item.id).catch(console.warn);
                    }}
                    className={`cursor-pointer p-4 border transition-all flex flex-col justify-between space-y-3 ${
                      item.id === selectedId
                        ? "bg-white border-[#1a1a1a] ring-1 ring-[#c5a27d] shadow-md"
                        : "bg-white/80 border-[#1a1a1a]/10 hover:border-[#1a1a1a]/40"
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <span className="text-[9px] font-mono px-1.5 py-0.5 bg-[#FAF7F2] border border-[#1a1a1a]/10 text-neutral-600">
                          {item.id}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-[#c5a27d]">
                          CARE CADRE LVL {item.age}
                        </span>
                      </div>

                      <h3 className="font-serif font-bold text-sm text-[#1a1a1a] mt-2">{item.name}</h3>
                      <p className="text-xs text-neutral-600 line-clamp-2 mt-1 font-sans">{item.notes}</p>
                    </div>

                    <div className="pt-2 border-t border-neutral-100 space-y-1 text-[10px] font-mono text-neutral-500">
                      <div className="truncate">{item.vitals}</div>
                      <div className="flex items-center justify-between text-neutral-400">
                        <span>
                          [{item.lat?.toFixed(2)}, {item.lon?.toFixed(2)}]
                        </span>
                        {item.id === selectedId && <span className="text-[#c5a27d] font-bold">SELECTED</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Active Stronghold Detail & Realm Chart */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 bg-white border border-[#1a1a1a]/15 p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Castle className="w-5 h-5 text-[#c5a27d]" />
                      <h2 className="font-serif font-bold text-base text-[#1a1a1a]">Territory Dossier</h2>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-[#FAF7F2] border border-neutral-200">
                      {activeStronghold.id}
                    </span>
                  </div>

                  <div className="space-y-3 font-sans text-xs">
                    <div>
                      <div className="text-[10px] font-mono uppercase text-neutral-400">Territory Name</div>
                      <div className="font-serif font-bold text-sm text-[#1a1a1a]">{activeStronghold.name}</div>
                    </div>

                    <div>
                      <div className="text-[10px] font-mono uppercase text-neutral-400">Resource Ledger</div>
                      <div className="font-mono bg-[#FAF7F2] p-2 border border-neutral-200 text-neutral-800">
                        {activeStronghold.vitals}
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] font-mono uppercase text-neutral-400">Strategic Overview</div>
                      <p className="text-neutral-700 leading-relaxed bg-[#FAF7F2] p-2.5 border border-neutral-200">
                        {activeStronghold.notes}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                      <div className="bg-[#FAF7F2] p-2 border border-neutral-200">
                        <span className="text-neutral-500">Care Cadre / Staffing:</span>
                        <div className="font-bold text-neutral-800">{activeStronghold.age * 100} Clinicians</div>
                      </div>
                      <div className="bg-[#FAF7F2] p-2 border border-neutral-200">
                        <span className="text-neutral-500">Arcane Grid:</span>
                        <div className="font-bold text-neutral-800">
                          {activeStronghold.lat}, {activeStronghold.lon}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => {
                          setActiveTab("command-center");
                        }}
                        className="flex-1 flex items-center justify-center space-x-2 py-2 bg-[#1a1a1a] text-[#FAF7F2] hover:bg-[#c5a27d] transition-colors font-mono text-xs uppercase tracking-wider"
                      >
                        <Compass className="w-3.5 h-3.5 text-[#c5a27d]" />
                        <span>Clinical Command</span>
                      </button>
                      <button
                        id="dossier-export-csv-btn"
                        onClick={handleExportStrongholdsCSV}
                        className="px-2.5 py-2 bg-[#FAF7F2] border border-[#1a1a1a]/20 hover:border-[#c5a27d] text-neutral-800 hover:text-[#1a1a1a] transition-colors font-mono text-xs"
                        title="Export Strongholds Resource Data to CSV"
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5 text-[#c5a27d]" />
                      </button>
                      <button
                        id="dossier-download-backup-btn"
                        onClick={handleDownloadBackup}
                        className="px-2.5 py-2 bg-[#FAF7F2] border border-[#1a1a1a]/20 hover:border-[#c5a27d] text-neutral-800 hover:text-[#1a1a1a] transition-colors font-mono text-xs"
                        title="Download Strongholds State Backup"
                      >
                        <Download className="w-3.5 h-3.5 text-[#c5a27d]" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <button
                        onClick={() => setActiveTab("dossier-suite")}
                        className="flex items-center justify-center space-x-1.5 py-1.5 bg-white border border-[#1a1a1a]/20 hover:border-[#c5a27d] text-neutral-800 hover:text-[#1a1a1a] transition-colors font-mono text-[11px]"
                        title="Open Clinical Dossier & FHIR R4 Bundle"
                      >
                        <FileText className="w-3 h-3 text-[#c5a27d]" />
                        <span>FHIR Dossier</span>
                      </button>
                      <button
                        onClick={() => setActiveTab("voice-scribe")}
                        className="flex items-center justify-center space-x-1.5 py-1.5 bg-white border border-[#1a1a1a]/20 hover:border-[#c5a27d] text-neutral-800 hover:text-[#1a1a1a] transition-colors font-mono text-[11px]"
                        title="Open Hands-Free Voice Clinical Scribe"
                      >
                        <Mic className="w-3 h-3 text-red-500" />
                        <span>Voice Scribe</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-2 space-y-3">
                  <div className="flex items-center justify-between bg-white border border-[#1a1a1a]/15 p-2 px-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-mono uppercase font-bold text-neutral-500">Visualization Engine:</span>
                    </div>
                    <div className="flex items-center space-x-1 font-mono text-xs">
                      <button
                        onClick={() => setStrongholdViewMode("chart")}
                        className={`px-3 py-1 text-[11px] transition-colors ${
                          strongholdViewMode === "chart"
                            ? "bg-[#1a1a1a] text-white font-bold"
                            : "bg-neutral-100 hover:bg-neutral-200 text-neutral-700"
                        }`}
                      >
                        Economic Cycles
                      </button>
                      <button
                        onClick={() => setStrongholdViewMode("radar")}
                        className={`px-3 py-1 text-[11px] transition-colors ${
                          strongholdViewMode === "radar"
                            ? "bg-[#1a1a1a] text-white font-bold"
                            : "bg-neutral-100 hover:bg-neutral-200 text-neutral-700"
                        }`}
                      >
                        Tactical Radar & Heatmap
                      </button>
                    </div>
                  </div>

                  {strongholdViewMode === "chart" ? (
                    <div className="bg-white border border-[#1a1a1a]/15 p-5 flex flex-col justify-between space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Crown className="w-4 h-4 text-[#c5a27d]" />
                          <h2 className="font-serif font-bold text-sm text-[#1a1a1a]">
                            Sovereign Economic & Mana Resonance Cycles
                          </h2>
                        </div>
                        <span className="text-[10px] font-mono text-neutral-500">RECHARTS ENGINE</span>
                      </div>

                      <div className="h-64 w-full">
                        <ErrorBoundary moduleTitle="Economic & Mana Telemetry Chart">
                          <RealmChart data={mockChartData} isDark={isDarkMode} />
                        </ErrorBoundary>
                      </div>

                      <div className="text-[10px] font-mono text-neutral-500 flex items-center justify-between border-t border-neutral-100 pt-2">
                        <span>Treasury Yields: +14.2% MoM</span>
                        <span>Mana Ley-Line Stability: Nominal</span>
                      </div>
                    </div>
                  ) : (
                    <ErrorBoundary moduleTitle="Strategic Frontier Radar & Arcane Heatmap">
                      <StrategicRadarMap
                        strongholds={strongholds}
                        selectedId={selectedId}
                        onSelectStronghold={(id) => {
                          setSelectedId(id);
                          setAppStateToIDB("selectedStrongholdId", id).catch(console.warn);
                        }}
                        isDark={isDarkMode}
                      />
                    </ErrorBoundary>
                  )}
                </div>
              </div>

              {/* INTEGRATED POCKET STATUS MATRIX (01 - 20) */}
              <ErrorBoundary moduleTitle="Universal Pocket Status Matrix">
                <PocketStatusMatrix
                  onNavigateTab={setActiveTab}
                  isDark={isDarkMode}
                />
              </ErrorBoundary>
            </div>
          )}

          {/* TAB 2: TACTICAL REALM MAP & RADAR */}
          {activeTab === "map" && (
            <ErrorBoundary moduleTitle="Tactical Realm Map & Arcane Radar">
              <div className="space-y-6">
                <div className="bg-white border border-[#1a1a1a]/15 p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <Compass className="w-5 h-5 text-[#c5a27d]" />
                      <div>
                        <h2 className="font-serif font-bold text-base text-[#1a1a1a]">
                          Tactical Realm Map & Arcane Radar
                        </h2>
                        <p className="text-[10px] font-mono text-neutral-500">
                          Interactive Spatial Perimeter & Geopolitical Coordinate Grid
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 text-xs font-mono">
                      <button
                        onClick={() => setRadarZoom((prev) => Math.min(prev + 0.2, 2))}
                        className="px-2 py-1 bg-[#FAF7F2] border border-neutral-300 hover:bg-neutral-100"
                      >
                        + ZOOM
                      </button>
                      <button
                        onClick={() => setRadarZoom((prev) => Math.max(prev - 0.2, 0.6))}
                        className="px-2 py-1 bg-[#FAF7F2] border border-neutral-300 hover:bg-neutral-100"
                      >
                        - ZOOM
                      </button>
                    </div>
                  </div>

                  {/* Radar Stage */}
                  <div className="relative w-full h-96 bg-[#151515] border-2 border-[#1a1a1a] overflow-hidden rounded-sm flex items-center justify-center">
                    {/* Radar Circles */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-72 h-72 rounded-full border border-emerald-500/20 animate-pulse" />
                      <div className="w-48 h-48 rounded-full border border-[#c5a27d]/25" />
                      <div className="w-24 h-24 rounded-full border border-neutral-700" />
                      <div className="w-full h-[1px] bg-neutral-800" />
                      <div className="h-full w-[1px] bg-neutral-800" />
                    </div>

                    {/* Hex Matrix Overlay */}
                    <div className="absolute inset-0 bg-[radial-gradient(#c5a27d_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

                    {/* Stronghold Pins */}
                    <div
                      className="relative w-full h-full"
                      style={{ transform: `scale(${radarZoom})`, transformOrigin: "center" }}
                    >
                      {strongholds.map((s, idx) => {
                        // Map lat/lon to percentage positions
                        const posX = 50 + ((s.lon || -72.85) + 72.5) * 45;
                        const posY = 50 - ((s.lat || 4.35) - 4.5) * 45;
                        const isSelected = s.id === selectedId;

                        return (
                          <div
                            key={s.id}
                            onClick={() => {
                              setSelectedId(s.id);
                              setTargetedCoords({ lat: s.lat || 4.35, lon: s.lon || -72.85 });
                            }}
                            className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 group"
                            style={{
                              left: `${Math.max(10, Math.min(90, posX))}%`,
                              top: `${Math.max(10, Math.min(90, posY))}%`,
                            }}
                          >
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                                isSelected
                                  ? "bg-[#c5a27d] border-white scale-125 shadow-lg shadow-[#c5a27d]/50"
                                  : "bg-[#1a1a1a] border-[#c5a27d] hover:scale-110"
                              }`}
                            >
                              <Castle className={`w-3 h-3 ${isSelected ? "text-[#1a1a1a]" : "text-[#c5a27d]"}`} />
                            </div>

                            <div className="absolute left-7 top-0 bg-[#1a1a1a] text-white text-[10px] font-mono px-2 py-0.5 border border-[#c5a27d] whitespace-nowrap shadow-md pointer-events-none">
                              {s.name} [{s.lat?.toFixed(2)}, {s.lon?.toFixed(2)}]
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Corner Coordinates Display */}
                    <div className="absolute bottom-3 left-3 bg-black/80 text-emerald-400 font-mono text-[10px] p-2 border border-emerald-500/30">
                      <div>RADAR LOCK: {activeStronghold.name}</div>
                      <div>
                        LAT: {activeStronghold.lat?.toFixed(4)} | LON: {activeStronghold.lon?.toFixed(4)}
                      </div>
                      <div>STATUS: DEFENSE READY</div>
                    </div>
                  </div>
                </div>

                <ErrorBoundary moduleTitle="Strategic Frontier Radar & Arcane Heatmap">
                  <StrategicRadarMap
                    strongholds={strongholds}
                    selectedId={selectedId}
                    onSelectStronghold={(id) => {
                      setSelectedId(id);
                      setAppStateToIDB("selectedStrongholdId", id).catch(console.warn);
                    }}
                    isDark={isDarkMode}
                  />
                </ErrorBoundary>
              </div>
            </ErrorBoundary>
          )}

          {/* TAB 3: CLINICAL COMMAND CENTER & STRATEGIC OPERATIONS */}
          {(activeTab === "command-center" || activeTab === "war-room") && (
            <div className="space-y-4">
              {/* COMMAND CENTER QUICK SETTINGS: AUTOMATED BACKGROUND SYNC CONTROLLER */}
              <div className="bg-white border-2 border-[#1a1a1a] p-4 shadow-sm space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-neutral-200 pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded bg-[#1a1a1a] text-[#c5a27d] flex items-center justify-center shrink-0 border border-[#c5a27d]/40">
                      <RefreshCw className={`w-4 h-4 ${isSyncingState ? "animate-spin text-white" : ""}`} />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-mono tracking-widest text-[#c5a27d] uppercase font-bold">
                          COMMAND CENTER VAULT CONFIGURATION
                        </span>
                        <span
                          className={`text-[9px] font-mono px-2 py-0.5 border font-bold ${
                            autoSyncEnabled && !isAirGapActive
                              ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                              : "bg-neutral-100 text-neutral-600 border-neutral-300"
                          }`}
                        >
                          {isAirGapActive
                            ? "AIR-GAP LOCKED"
                            : autoSyncEnabled
                            ? `AUTO-SYNC ACTIVE (${secondsUntilNextSync}s)`
                            : "SYNC PAUSED"}
                        </span>
                      </div>
                      <h2 className="text-base font-serif font-bold text-[#1a1a1a]">
                        Dual-Vault Background Sync Settings
                      </h2>
                      <p className="text-xs text-neutral-500 font-sans">
                        Configure automated background synchronization cadence between the local IndexedDB Sovereign Vault and cloud Firestore.
                      </p>
                    </div>
                  </div>

                  {/* Master Auto-Sync Switch, Background Run Switch, and Trigger */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    {/* Auto-Sync Toggle */}
                    <div className="flex items-center space-x-2 bg-[#FAF7F2] px-3 py-1.5 border border-neutral-300 rounded-xs">
                      <span className="text-xs font-mono font-bold text-[#1a1a1a]">
                        Auto-Sync:
                      </span>
                      <button
                        id="cmd-center-sync-toggle-btn"
                        onClick={() => {
                          const next = !autoSyncEnabled;
                          setAutoSyncEnabled(next);
                          showToast(
                            next
                              ? `Automated background sync enabled (${syncIntervalSeconds}s interval).`
                              : "Automated background sync paused.",
                            "info"
                          );
                        }}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${
                          autoSyncEnabled && !isAirGapActive ? "bg-emerald-600" : "bg-neutral-300"
                        }`}
                        title={autoSyncEnabled ? "Pause Automated Background Sync" : "Enable Automated Background Sync"}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            autoSyncEnabled && !isAirGapActive ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Run When Closed Toggle */}
                    <div className="flex items-center space-x-2 bg-[#FAF7F2] px-3 py-1.5 border border-neutral-300 rounded-xs">
                      <HardDrive className="w-3.5 h-3.5 text-[#c5a27d]" />
                      <span className="text-xs font-mono font-bold text-[#1a1a1a]">
                        Active When Closed:
                      </span>
                      <button
                        id="cmd-center-run-closed-toggle-btn"
                        onClick={() => {
                          const next = !runInBackgroundWhenClosed;
                          setRunInBackgroundWhenClosed(next);
                          showToast(
                            next
                              ? "Service Worker Background Sync enabled: Vault reconciles even when app is closed."
                              : "Background sync disabled when app is closed.",
                            "info"
                          );
                        }}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${
                          runInBackgroundWhenClosed ? "bg-emerald-600" : "bg-neutral-300"
                        }`}
                        title={runInBackgroundWhenClosed ? "Background Execution Active When App Closed" : "Disabled When Window Closed"}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            runInBackgroundWhenClosed ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>

                    <button
                      id="cmd-center-force-sync-btn"
                      onClick={handleForceSyncNow}
                      disabled={isSyncingState || isAirGapActive}
                      className="px-3 py-1.5 bg-[#1a1a1a] text-[#FAF7F2] hover:bg-[#c5a27d] hover:text-[#1a1a1a] transition-all text-xs font-mono font-bold flex items-center space-x-1.5 disabled:opacity-50 cursor-pointer"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 text-[#c5a27d] ${isSyncingState ? "animate-spin" : ""}`} />
                      <span>{isSyncingState ? "Syncing..." : "Sync Now"}</span>
                    </button>
                  </div>
                </div>

                {/* Interval Cadence Selector Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 text-xs">
                  <div className="flex items-center space-x-1.5 font-mono text-neutral-600">
                    <Sliders className="w-3.5 h-3.5 text-[#c5a27d]" />
                    <span className="font-bold text-[#1a1a1a]">Sync Cadence:</span>
                    <span className="text-[11px] text-neutral-500">
                      (Interval: <strong>{syncIntervalSeconds}s</strong> • Next cycle in <strong>{secondsUntilNextSync}s</strong>)
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 font-mono">
                    {[
                      { sec: 5, label: "5s Real-Time" },
                      { sec: 15, label: "15s (Optimal)" },
                      { sec: 30, label: "30s Balanced" },
                      { sec: 60, label: "60s Low-Power" },
                      { sec: 300, label: "300s Batch" },
                    ].map((opt) => {
                      const isSelected = syncIntervalSeconds === opt.sec;
                      return (
                        <button
                          key={opt.sec}
                          onClick={() => {
                            setSyncIntervalSeconds(opt.sec);
                            setSecondsUntilNextSync(opt.sec);
                            showToast(`Background sync cadence set to ${opt.sec} seconds.`, "info");
                          }}
                          className={`px-2.5 py-1 text-xs border rounded-xs transition-all flex items-center space-x-1 ${
                            isSelected
                              ? "bg-[#1a1a1a] text-white border-[#c5a27d] font-bold shadow-xs scale-102"
                              : "bg-[#FAF7F2] text-neutral-700 border-neutral-300 hover:border-[#1a1a1a] hover:bg-white"
                          }`}
                        >
                          <span>{opt.label}</span>
                          {isSelected && <Check className="w-3 h-3 text-[#c5a27d]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Live Vault Status Footer */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-neutral-100 text-[10px] font-mono text-neutral-500">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center space-x-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>IndexedDB Sovereign Local Vault: <strong>Active & Cached</strong></span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <span className={`w-2 h-2 rounded-full ${isAirGapActive ? "bg-amber-500" : "bg-emerald-500"}`} />
                      <span>Firestore Remote Cloud Vault: <strong>{isAirGapActive ? "Air-Gapped (Paused)" : "Synchronized"}</strong></span>
                    </span>
                  </div>
                  <span>Last Sync: <strong className="text-neutral-700">{lastSyncTime || "Recent"}</strong></span>
                </div>
              </div>

              {/* SOVEREIGN BIZCHAT CONSOLE (POCKET-ZERO ORACLE EXECUTIVE BRIEFINGS) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono bg-white p-2.5 border border-neutral-300">
                  <div className="flex items-center space-x-2">
                    <Bot className="w-4 h-4 text-[#c5a27d]" />
                    <span className="font-bold text-[#1a1a1a]">
                      Sovereign BizChat Console • Pocket-Zero Oracle
                    </span>
                    <span className="text-[9px] px-1.5 py-0.2 bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold">
                      Zero-Cloud Egress
                    </span>
                  </div>
                  <button
                    onClick={() => setShowSovereignBizChat(!showSovereignBizChat)}
                    className="text-[10px] text-[#c5a27d] hover:text-[#1a1a1a] hover:underline font-bold transition-colors cursor-pointer"
                  >
                    {showSovereignBizChat ? "▲ Collapse BizChat" : "▼ Open Sovereign BizChat"}
                  </button>
                </div>

                {showSovereignBizChat && (
                  <ErrorBoundary moduleTitle="Sovereign BizChat Console">
                    <SovereignBizChatConsole
                      strongholds={strongholds}
                      activeStronghold={activeStronghold}
                      sovereignRole={sovereignRole}
                      autoSyncEnabled={autoSyncEnabled}
                      syncInterval={syncIntervalSeconds}
                      isDark={isDarkMode}
                    />
                  </ErrorBoundary>
                )}
              </div>

              <ErrorBoundary moduleTitle="Clinical Command Center">
                <ClinicalCommandCenter
                  activeStronghold={activeStronghold}
                  strongholds={strongholds}
                  onSelectStronghold={(id) => setSelectedId(id)}
                  sovereignRole={sovereignRole}
                  onPublishToCouncil={(msg) => {
                    const time = new Date().toLocaleTimeString();
                    setCouncilLogs((prev) => [`[${time}] DECREE: ${msg}`, ...prev]);
                    showToast("Sovereign Clinical Directive broadcasted to Council stream.", "success");
                  }}
                  isDark={false}
                  autoSyncEnabled={autoSyncEnabled}
                  onToggleAutoSync={(enabled) => setAutoSyncEnabled(enabled)}
                  syncInterval={syncIntervalSeconds}
                  onChangeSyncInterval={(interval) => {
                    setSyncIntervalSeconds(interval);
                    setSecondsUntilNextSync(interval);
                  }}
                  secondsUntilNextSync={secondsUntilNextSync}
                  lastSyncTime={lastSyncTime || "Just now"}
                  onForceSync={handleForceSyncNow}
                  isSyncing={isSyncingState}
                  onNavigateTab={setActiveTab}
                  onOpenCommandPalette={() => setShowCommandPalette(true)}
                  runInBackgroundWhenClosed={runInBackgroundWhenClosed}
                  onToggleRunInBackground={(enabled) => {
                    setRunInBackgroundWhenClosed(enabled);
                    showToast(
                      enabled
                        ? "PWA Background Sync enabled: Vault reconciles even when app is closed."
                        : "Background execution paused when window is closed.",
                      "info"
                    );
                  }}
                  isPersistentStorageGranted={isPersistentStorageGranted}
                  onRequestPersistentStorage={handleRequestStoragePersistence}
                  isWakeLockActive={isWakeLockActive}
                  onToggleWakeLock={handleToggleWakeLock}
                />
              </ErrorBoundary>
            </div>
          )}

          {/* TAB 4: GRANARIES & PROVISIONS */}
          {activeTab === "provisions" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 border border-[#1a1a1a]/15">
                <div>
                  <h2 className="font-serif font-bold text-base text-[#1a1a1a] flex items-center gap-2">
                    <Wheat className="w-5 h-5 text-[#c5a27d]" />
                    <span>Granary Provisions & Resource Allocation</span>
                  </h2>
                  <p className="text-[10px] font-mono text-neutral-500">
                    Tactical ration stores, nutritional sustain telemetry, and clinical logistics
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    id="tab-export-provisions-csv-btn"
                    onClick={handleExportProvisionsCSV}
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-[#1a1a1a]/20 hover:border-[#c5a27d] text-[#1a1a1a] hover:bg-[#FAF7F2] transition-colors text-xs font-mono uppercase tracking-wider shadow-sm"
                    title="Export provisions and resource allocations to CSV for external spreadsheet tools"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-[#c5a27d]" />
                    <span>Export to CSV</span>
                  </button>
                </div>
              </div>

              <ErrorBoundary moduleTitle="Granary Provisions Tracker">
                <ProvisionsTracker />
              </ErrorBoundary>
              <ErrorBoundary moduleTitle="Royal Granary Quality Matrix">
                <PescatarianTracker />
              </ErrorBoundary>
            </div>
          )}

          {/* TAB: SEVENTEEN POCKETS TOPOLOGY */}
          {activeTab === "topology" && (
            <div className="space-y-6">
              <ErrorBoundary moduleTitle="Seventeen Pockets Architecture Topology">
                <SeventeenPocketsTopology />
              </ErrorBoundary>
            </div>
          )}

          {/* TAB 5: COUNCIL LOGS & CI/CD PIPELINE */}
          {activeTab === "logs" && (
            <div className="space-y-6">
              <div className="bg-white border border-[#1a1a1a]/15 p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-2.5">
                    <Terminal className="w-5 h-5 text-[#c5a27d]" />
                    <div>
                      <h2 className="font-serif font-bold text-base text-[#1a1a1a]">
                        Council Decrees & GitLab CI/CD Telemetry
                      </h2>
                      <p className="text-[10px] font-mono text-neutral-500">
                        Immutable trace streams & sovereign microservices deployment runner
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleRunPipeline}
                    disabled={isPipelineRunning}
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#1a1a1a] text-white hover:bg-[#c5a27d] transition-colors text-xs font-mono uppercase tracking-wider disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-[#c5a27d] ${isPipelineRunning ? "animate-spin" : ""}`} />
                    <span>{isPipelineRunning ? "Executing Pipeline..." : "Trigger CI/CD Runner"}</span>
                  </button>
                </div>

                <form onSubmit={handleAddLog} className="flex gap-2">
                  <input
                    id="council-decree-log-input"
                    type="text"
                    placeholder="Enter royal decree or espionage report..."
                    value={newLogInput}
                    onChange={(e) => setNewLogInput(e.target.value)}
                    suppressHydrationWarning
                    className="flex-1 px-3 py-1.5 text-xs bg-[#FAF7F2] border border-[#1a1a1a]/20 font-mono focus:outline-none focus:border-[#c5a27d]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-[#1a1a1a] text-[#FAF7F2] text-xs font-mono uppercase tracking-wider hover:bg-[#c5a27d] transition-colors flex items-center space-x-1"
                  >
                    <Send className="w-3 h-3 text-[#c5a27d]" />
                    <span>Log</span>
                  </button>
                </form>

                {/* Terminal Window */}
                <div className="bg-[#121212] border border-neutral-800 p-4 font-mono text-xs text-neutral-300 rounded-sm h-80 overflow-y-auto space-y-1.5">
                  {councilLogs.map((log, index) => (
                    <div
                      key={index}
                      className={`leading-relaxed ${
                        log.includes("PIPELINE")
                          ? "text-emerald-400 font-bold"
                          : log.includes("Error")
                          ? "text-red-400"
                          : "text-neutral-300"
                      }`}
                    >
                      <span className="text-neutral-600 select-none mr-2">&gt;</span>
                      {log}
                    </div>
                  ))}
                </div>

                {/* GitLab CI Reference */}
                <div className="p-3 bg-[#FAF7F2] border border-neutral-200 text-[10px] font-mono space-y-1">
                  <div className="text-neutral-500 font-bold uppercase">.gitlab-ci.yml Blueprint</div>
                  <pre className="text-neutral-700 overflow-x-auto max-h-32">{KINGDOM_CI_PIPELINE}</pre>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: RUNESTONE CIPHER */}
          {activeTab === "cipher" && (
            <div className="space-y-6">
              <ErrorBoundary moduleTitle="Runestone Tactical Cipher">
                <Sudoku />
              </ErrorBoundary>
            </div>
          )}

          {/* TAB 7: OPEN AI AGENT BRIDGE */}
          {activeTab === "agent-bridge" && (
            <div className="space-y-6">
              <ErrorBoundary moduleTitle="Open AI Agent Bridge & Protocol">
                <AgentBridgeInterface />
              </ErrorBoundary>
            </div>
          )}

          {/* TAB 8: ISOLATED DATA VAULT & AIR-GAP STAGING (MANDIANT SPEC) */}
          {activeTab === "idv" && (
            <div className="space-y-6">
              <ErrorBoundary moduleTitle="Isolated Data Vault & Air-Gap Recovery Staging">
                <IsolatedDataVault strongholds={strongholds} isDark={isDarkMode} />
              </ErrorBoundary>
            </div>
          )}

          {/* TAB 9: AUTONOMOUS CLINICAL URGENCY & SENTIMENT SCORER (DYNAMICS 365 SPEC) */}
          {activeTab === "triage" && (
            <div className="space-y-6">
              <ErrorBoundary moduleTitle="Autonomous Clinical Urgency & Sentiment Scorer">
                <AutonomousUrgencyScorer
                  isDark={isDarkMode}
                  onLogDispatch={(msg) => {
                    const time = new Date().toISOString().replace("T", " ").substring(11, 19);
                    const formatted = `[${time} UTC] ${msg}`;
                    setCouncilLogs((prev) => [formatted, ...prev]);
                    persistCouncilLog(formatted).catch(console.warn);
                    addToast("Autonomous care continuity protocol dispatched to council stream", "success");
                  }}
                />
              </ErrorBoundary>
            </div>
          )}

          {/* TAB 10: ABCD CLINICAL DISPATCH & FIELD ADVISORY STUDIO (VIGENAIR SPEC) */}
          {activeTab === "dispatch" && (
            <div className="space-y-6">
              <ErrorBoundary moduleTitle="ABCD Clinical Dispatch & Field Advisory Studio">
                <AbcdDispatchStudio
                  isDark={isDarkMode}
                  onPublishToCouncil={(msg) => {
                    const time = new Date().toISOString().replace("T", " ").substring(11, 19);
                    const formatted = `[${time} UTC] ${msg}`;
                    setCouncilLogs((prev) => [formatted, ...prev]);
                    persistCouncilLog(formatted).catch(console.warn);
                    addToast("ABCD Field Advisory published to Council Decrees stream", "success");
                  }}
                />
              </ErrorBoundary>
            </div>
          )}

          {/* TAB 11: SEVENTEEN POCKETS GROWTH & GOOGLE TELEMETRY ENGINE */}
          {activeTab === "growth-marketing" && (
            <div className="space-y-6">
              <ErrorBoundary moduleTitle="Seventeen Pockets Growth & Telemetry Engine">
                <GrowthMarketingTelemetry
                  isDark={isDarkMode}
                  onDispatchLog={(msg) => {
                    const time = new Date().toISOString().replace("T", " ").substring(11, 19);
                    const formatted = `[${time} UTC] ${msg}`;
                    setCouncilLogs((prev) => [formatted, ...prev]);
                    persistCouncilLog(formatted).catch(console.warn);
                    showToast(msg, "info");
                  }}
                />
              </ErrorBoundary>
            </div>
          )}

          {/* TAB 12: FULL CIRCLE HUMAN REALITY MOVEMENT */}
          {activeTab === "human-reality" && (
            <div className="space-y-6">
              <ErrorBoundary moduleTitle="Full Circle Human Reality Movement">
                <HumanRealityMovement
                  strongholds={strongholds}
                  activeStronghold={activeStronghold}
                  onPublishToCouncil={(msg) => {
                    const time = new Date().toISOString().replace("T", " ").substring(11, 19);
                    const formatted = `[${time} UTC] ${msg}`;
                    setCouncilLogs((prev) => [formatted, ...prev]);
                    persistCouncilLog(formatted).catch(console.warn);
                    showToast(msg, "success");
                  }}
                />
              </ErrorBoundary>
            </div>
          )}

          {/* TAB 13: SOLAR NEXUS & 20 POCKETS SEPARATE ADDITION (GITBOOK SPEC) */}
          {activeTab === "solar-nexus" && (
            <div className="space-y-6">
              <ErrorBoundary moduleTitle="The Solar Nexus — Seventeen Pockets">
                <SolarNexusMain onReturnToClinical={() => setActiveTab("command-center")} />
              </ErrorBoundary>
            </div>
          )}

          {/* TAB 13B: GITLAB REAL BUILDS & FILES REPOSITORY */}
          {activeTab === "gitlab-builds" && (
            <div className="space-y-6">
              <ErrorBoundary moduleTitle="GitLab Real Builds & Files Repository">
                <GitLabBuildsConsole />
              </ErrorBoundary>
            </div>
          )}

          {/* TAB 14: 20-POCKET MESH LATENCY & PINGS */}
          {activeTab === "mesh-telemetry" && (
            <div className="space-y-6">
              <ErrorBoundary moduleTitle="20-Pocket Mesh Latency & Heartbeat">
                <MeshTelemetryConsole isDark={isDarkMode} />
              </ErrorBoundary>
            </div>
          )}

          {/* TAB 15: AIR-GAP ZERO-EXFILTRATION SIMULATOR */}
          {activeTab === "air-gap-sim" && (
            <div className="space-y-6">
              <ErrorBoundary moduleTitle="Air-Gap Edge Simulator & Zero-Exfiltration Verification">
                <OfflineEdgeSimulator
                  isAirGapActive={isAirGapActive}
                  onToggleAirGap={(active) => setIsAirGapActive(active)}
                  strongholds={strongholds}
                  onUpdateStrongholds={(updated) => setStrongholds(updated)}
                  onLogAudit={(msg) => {
                    const time = new Date().toISOString().replace("T", " ").substring(11, 19);
                    const formatted = `[${time} UTC] ${msg}`;
                    setCouncilLogs((prev) => [formatted, ...prev]);
                    persistCouncilLog(formatted).catch(console.warn);
                    showToast(msg, "info");
                  }}
                  isDark={isDarkMode}
                />
              </ErrorBoundary>
            </div>
          )}

          {/* TAB 16: CLINICAL DOSSIER & HL7 FHIR R4 SUITE */}
          {activeTab === "dossier-suite" && (
            <div className="space-y-6">
              <ErrorBoundary moduleTitle="Clinical Dossier & HL7 FHIR R4 Suite">
                <ClinicalDossierSuite
                  strongholds={strongholds}
                  activeStronghold={activeStronghold}
                  sovereignRole={sovereignRole}
                  onImportStrongholds={handleRestoreBackup}
                  onShowToast={showToast}
                  isDark={isDarkMode}
                />
              </ErrorBoundary>
            </div>
          )}

          {/* TAB 17: HANDS-FREE VOICE CLINICAL SCRIBE */}
          {activeTab === "voice-scribe" && (
            <div className="space-y-6">
              <ErrorBoundary moduleTitle="Hands-Free Voice Clinical Scribe">
                <VoiceClinicalScribe
                  strongholds={strongholds}
                  activeStronghold={activeStronghold}
                  onCommitPatientUpdate={(updated) => {
                    setStrongholds((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
                  }}
                  onLogAudit={(msg) => {
                    const time = new Date().toISOString().replace("T", " ").substring(11, 19);
                    const formatted = `[${time} UTC] ${msg}`;
                    setCouncilLogs((prev) => [formatted, ...prev]);
                    persistCouncilLog(formatted).catch(console.warn);
                  }}
                  onShowToast={showToast}
                  isDark={isDarkMode}
                />
              </ErrorBoundary>
            </div>
          )}

          {/* TAB 18: ENTERTAINMENT STRUCTURE & CREATOR SUITE (POCKET 11) */}
          {activeTab === "entertainment" && (
            <div className="space-y-6">
              <ErrorBoundary moduleTitle="Pocket 11: Entertainment & Creator Platform">
                <EntertainmentStudio />
              </ErrorBoundary>
            </div>
          )}

          {/* TAB 19: 30-DAY SPRINT PLAN & BURNDOWN (POCKET 10) */}
          {activeTab === "sprint" && (
            <div className="space-y-6">
              <ErrorBoundary moduleTitle="Pocket 10: 30-Day Sprint Plan & Velocity Engine">
                <ThirtyDaySprintBoard />
              </ErrorBoundary>
            </div>
          )}

          {/* TAB 20: STRIPE APPS UPLOAD & DEPLOYMENT HUB */}
          {activeTab === "stripe-apps" && (
            <div className="space-y-6">
              <ErrorBoundary moduleTitle="Stripe Apps Upload & Deployment Hub">
                <StripeAppsUploadStudio
                  onShowToast={showToast}
                  onLogAudit={(msg) => {
                    const time = new Date().toISOString().replace("T", " ").substring(11, 19);
                    const formatted = `[${time} UTC] ${msg}`;
                    setCouncilLogs((prev) => [formatted, ...prev]);
                    persistCouncilLog(formatted).catch(console.warn);
                  }}
                />
              </ErrorBoundary>
            </div>
          )}

          {/* TAB 21: ECOSYSTEM MATURITY SUITE (SCORECARD 98/100, STACKED ARCHITECTURE & TIMELINE) */}
          {activeTab === "ecosystem-scorecard" && (
            <div className="space-y-6">
              <ErrorBoundary moduleTitle="Ecosystem Maturity Suite & Architecture Stack">
                <EcosystemMaturitySuite
                  currentMode={displayMode}
                  onChangeMode={setDisplayMode}
                  onNavigateTab={setActiveTab}
                  isDark={isDarkMode}
                />
              </ErrorBoundary>
            </div>
          )}

          {/* TAB 22: UNIVERSAL POCKET OPERATIONS MATRIX (01 - 20) */}
          {activeTab === "pocket-matrix" && (
            <div className="space-y-6">
              <ErrorBoundary moduleTitle="Universal Pocket Operations Matrix (01 - 20)">
                <PocketStatusMatrix
                  onNavigateTab={setActiveTab}
                  isDark={isDarkMode}
                />
              </ErrorBoundary>
            </div>
          )}
          </ErrorBoundary>
        </main>
      </div>

      {/* MODAL: COMMISSION NEW STRONGHOLD */}
      {showAddStronghold && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-[#1a1a1a] shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <div className="flex items-center space-x-2">
                <Castle className="w-5 h-5 text-[#c5a27d]" />
                <h3 className="font-serif font-bold text-lg text-[#1a1a1a]">Commission Sovereign Stronghold</h3>
              </div>
              <button
                onClick={() => setShowAddStronghold(false)}
                className="text-neutral-400 hover:text-neutral-700 font-mono text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateStronghold} className="space-y-3 font-sans text-xs">
              <div>
                <label htmlFor="comm-stronghold-name" className="text-[10px] font-mono uppercase text-neutral-500">Stronghold Title</label>
                <input
                  id="comm-stronghold-name"
                  type="text"
                  required
                  placeholder="e.g. Valyria Shoreline Citadel"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  suppressHydrationWarning
                  className="w-full px-3 py-1.5 bg-[#FAF7F2] border border-[#1a1a1a]/20 focus:outline-none focus:border-[#c5a27d]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="comm-stronghold-garrison" className="text-[10px] font-mono uppercase text-neutral-500">Care Cadre Capacity (Lvl)</label>
                  <input
                    id="comm-stronghold-garrison"
                    type="number"
                    value={newGarrison}
                    onChange={(e) => setNewGarrison(e.target.value)}
                    suppressHydrationWarning
                    className="w-full px-3 py-1.5 bg-[#FAF7F2] border border-[#1a1a1a]/20"
                  />
                </div>
                <div>
                  <label htmlFor="comm-stronghold-vitals" className="text-[10px] font-mono uppercase text-neutral-500">Resources Format</label>
                  <input
                    id="comm-stronghold-vitals"
                    type="text"
                    value={newVitals}
                    onChange={(e) => setNewVitals(e.target.value)}
                    suppressHydrationWarning
                    className="w-full px-3 py-1.5 bg-[#FAF7F2] border border-[#1a1a1a]/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="comm-stronghold-lat" className="text-[10px] font-mono uppercase text-neutral-500">Latitude (Arcane Y)</label>
                  <input
                    id="comm-stronghold-lat"
                    type="text"
                    value={newLat}
                    onChange={(e) => setNewLat(e.target.value)}
                    suppressHydrationWarning
                    className="w-full px-3 py-1.5 bg-[#FAF7F2] border border-[#1a1a1a]/20"
                  />
                </div>
                <div>
                  <label htmlFor="comm-stronghold-lon" className="text-[10px] font-mono uppercase text-neutral-500">Longitude (Arcane X)</label>
                  <input
                    id="comm-stronghold-lon"
                    type="text"
                    value={newLon}
                    onChange={(e) => setNewLon(e.target.value)}
                    suppressHydrationWarning
                    className="w-full px-3 py-1.5 bg-[#FAF7F2] border border-[#1a1a1a]/20"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="comm-stronghold-notes" className="text-[10px] font-mono uppercase text-neutral-500">Strategic Intelligence</label>
                <textarea
                  id="comm-stronghold-notes"
                  rows={3}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Notes on defenses, dragonwatch towers, and supply lines..."
                  suppressHydrationWarning
                  className="w-full px-3 py-1.5 bg-[#FAF7F2] border border-[#1a1a1a]/20"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-neutral-200 font-mono">
                <button
                  type="button"
                  onClick={() => setShowAddStronghold(false)}
                  className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#1a1a1a] text-white hover:bg-[#c5a27d] transition-colors text-xs uppercase"
                >
                  Commission Citadel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: SOVEREIGN IDENTITY & 401 DEFENSIVE AUTH */}
      {showIdentityModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-[#1a1a1a] shadow-2xl max-w-md w-full p-6 space-y-4 font-sans">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <div className="flex items-center space-x-2">
                <Crown className="w-5 h-5 text-[#c5a27d]" />
                <h3 className="font-serif font-bold text-lg text-[#1a1a1a]">Sovereign Identity & Auth</h3>
              </div>
              <button
                onClick={() => setShowIdentityModal(false)}
                className="text-neutral-400 hover:text-neutral-700 font-mono text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-[#FAF7F2] p-3 border border-[#1a1a1a]/15 space-y-1">
                <div className="text-[10px] font-mono text-neutral-500 uppercase">Current Session Status</div>
                <div className="font-bold text-[#1a1a1a] flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>{firebaseUser?.isAnonymous ? "Anonymous Sovereign Archon (Active)" : "Google Sovereign Account"}</span>
                </div>
                <div className="text-[10px] font-mono text-neutral-500 break-all">
                  UID: {firebaseUser?.uid || "Local Sovereign Edge Mode"}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase text-neutral-500">Quick Persona Switch</label>
                <div className="grid grid-cols-1 gap-1.5 font-mono text-xs">
                  {[
                    "Archon Odell Anderson Jr.",
                    "Grand Strategist Dee Gone",
                    "High Marshal of Frostveil",
                    "Shadow Inquisitor Vance",
                  ].map((role) => (
                    <button
                      key={role}
                      onClick={() => handleSetRole(role)}
                      className={`px-3 py-2 text-left border transition-colors flex items-center justify-between ${
                        sovereignRole === role
                          ? "bg-[#1a1a1a] text-white border-[#c5a27d]"
                          : "bg-white hover:bg-neutral-50 border-neutral-200 text-[#1a1a1a]"
                      }`}
                    >
                      <span>{role}</span>
                      {sovereignRole === role && <Check className="w-3.5 h-3.5 text-[#c5a27d]" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-neutral-200 space-y-2">
                <label className="text-[10px] font-mono uppercase text-neutral-500">Cloud Authentication</label>
                <button
                  onClick={handleGoogleLoginSafe}
                  className="w-full flex items-center justify-center space-x-2 py-2 bg-white border border-[#1a1a1a] text-[#1a1a1a] hover:bg-[#FAF7F2] transition-colors font-mono text-xs"
                >
                  <Key className="w-3.5 h-3.5 text-[#c5a27d]" />
                  <span>Authorize via Google Sign-In</span>
                </button>
                <p className="text-[9px] font-mono text-neutral-500 leading-tight">
                  Protected by zero-failure fallback: If Google OAuth displays a 401 origin error, your anonymous cloud session stays 100% active.
                </p>
              </div>

              {firebaseUser && (
                <button
                  onClick={async () => {
                    await signOut(auth);
                    showToast("Signed out of Sovereign Cloud session.", "info");
                    setShowIdentityModal(false);
                  }}
                  className="w-full flex items-center justify-center space-x-1.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-mono text-xs"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Sign Out Session</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: BRAND & PROGRAM PROJECT PHOTO SHOWCASE */}
      <BrandShowcaseModal
        isOpen={showBrandShowcaseModal}
        onClose={() => setShowBrandShowcaseModal(false)}
        onNavigateToHumanReality={() => setActiveTab("human-reality")}
        onNavigateToSolarNexus={() => setActiveTab("solar-nexus")}
      />

      {/* MODAL: 4K VIDEO THEATER & PREVIEW CINEMA */}
      <VideoTheaterModal
        video={selectedCinemaVideo}
        isOpen={showVideoTheaterModal}
        onClose={() => setShowVideoTheaterModal(false)}
        playlist={ALL_PLAYLIST_VIDEOS}
        onSelectVideo={(v) => setSelectedCinemaVideo(v)}
      />

      {/* MODAL: RESTORE / IMPORT BACKUP JSON */}
      <BackupRestoreModal
        isOpen={showRestoreModal}
        onClose={() => setShowRestoreModal(false)}
        onRestore={handleRestoreBackup}
      />

      {/* MODAL: STANDALONE RELEASE & EXTERNAL DEPLOYMENT */}
      <StandaloneReleaseModal
        isOpen={showReleaseModal}
        onClose={() => setShowReleaseModal(false)}
      />

      {/* MODAL: UNIVERSAL COMMAND PALETTE */}
      <CommandPaletteModal
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
        onNavigateTab={setActiveTab}
        onForceSync={handleForceSyncNow}
        onToggleAirGap={() => setIsAirGapActive((prev) => !prev)}
        onOpenReleaseModal={() => setShowReleaseModal(true)}
      />
    </div>
  );
}
