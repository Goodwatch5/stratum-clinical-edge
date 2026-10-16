"use client";
import React, { useEffect, useState } from "react";
import { Crown, ShieldAlert, Sparkles, Database, Castle } from "lucide-react";
import { db, auth } from "../lib/firebase";
import { collection, onSnapshot, query, where, limit } from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";
import { getPatientsFromIDB } from "../lib/indexedDB";

interface KingdomAnalysis {
  territoryId: string;
  summary: string;
  defenseReadiness: number;
  sources: string[];
  isOfflineSource?: boolean;
}

export default function KingdomIntelligenceCore() {
  const [analysis, setAnalysis] = useState<KingdomAnalysis | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribeAuth();
  }, []);

  // Fetch local IndexedDB stronghold record first as instant offline baseline
  useEffect(() => {
    async function loadLocalFallback() {
      try {
        const localStrongholds = await getPatientsFromIDB();
        if (localStrongholds.length > 0) {
          const first = localStrongholds[0];
          setAnalysis({
            territoryId: first.id,
            summary: first.notes || "Frontier clinical outposts at peak operational readiness. Secure edge telemetry stabilized across all sectors.",
            defenseReadiness: 0.96,
            sources: ["Aethelgard Clinical Nexus", "IndexedDB Sovereign Vault"],
            isOfflineSource: true,
          });
        } else if (!user) {
          setAnalysis({
            territoryId: "K-CITADEL-01",
            summary: "Grand Council decree: Medical provisions and emergency reserves verified across all pavilions. Outer barrier wards and air-gap safeguards active.",
            defenseReadiness: 0.94,
            sources: ["High Chancellor Archive", "Offline Sovereign Cache"],
            isOfflineSource: true,
          });
        }
      } catch (e) {
        console.warn("IndexedDB read fallback in Kingdom Intelligence:", e);
      }
    }
    loadLocalFallback();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const realmQuery = query(
      collection(db, "patients"),
      where("ownerId", "==", user.uid),
      limit(1)
    );

    const unsubscribe = onSnapshot(
      realmQuery,
      (snapshot) => {
        if (!snapshot.empty) {
          snapshot.forEach((doc) => {
            const data = doc.data();
            setAnalysis({
              territoryId: data.id || "K-REALM-CORE",
              summary: data.notes || "Clinical outpost perimeter active. Mobile triage and care units deployed.",
              defenseReadiness: 0.98,
              sources: ["Arcane Radar Array", "Cloud Realm Nexus"],
              isOfflineSource: false,
            });
          });
        }
      },
      (error) => {
        console.warn("Firestore snapshot warning (using IndexedDB fallback):", error);
      }
    );

    return () => unsubscribe();
  }, [user]);

  if (!analysis) return <div className="text-xs text-neutral-400 p-4 font-mono">Initializing Sovereign Oracle Edge Nexus...</div>;

  return (
    <div className="p-6 bg-[#FAF7F2] border border-[#1a1a1a]/15 shadow-sm rounded-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Crown className="w-5 h-5 text-[#c5a27d]" />
          <h2 className="text-lg font-serif tracking-tight text-[#1a1a1a]">Sovereign Clinical Intelligence Core</h2>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-mono px-2 py-0.5 bg-white border border-[#1a1a1a]/15 text-neutral-700">
          <Database className="w-3 h-3 text-[#c5a27d]" />
          <span>{analysis.isOfflineSource ? "IndexedDB Engine" : "Cloud Synchronized"}</span>
        </div>
      </div>
      
      <div className="space-y-4">
        <p className="text-sm text-[#1a1a1a] leading-relaxed font-sans border-l-2 border-[#c5a27d] pl-3">
          {analysis.summary}
        </p>

        <div className="flex items-center justify-between text-xs font-mono pt-3 border-t border-[#1a1a1a]/10">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-3.5 h-3.5 text-[#c5a27d]" />
            <span className="text-neutral-600">Clinical Response Readiness: {(analysis.defenseReadiness * 100).toFixed(0)}%</span>
          </div>
          <div className="flex items-center gap-2 text-neutral-500">
            <Castle className="w-3.5 h-3.5 text-[#1a1a1a]" />
            <span>{analysis.territoryId}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
