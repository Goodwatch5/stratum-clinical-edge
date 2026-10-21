"use client";
import React from 'react';
import { Crown, Shield, Castle, Database, Flame } from 'lucide-react';

export default function PlatformInstructions() {
  return (
    <div className="p-6 bg-[#FAF7F2] border border-[#c5a27d]/40 shadow-sm rounded-sm">
      <div className="flex items-center gap-3 mb-4">
        <Crown className="w-5 h-5 text-[#c5a27d]" />
        <h2 className="text-lg font-serif tracking-tight text-[#1a1a1a]">Sovereign Realm Decrees & Directives</h2>
      </div>
      <ul className="text-sm text-neutral-700 leading-relaxed font-sans space-y-2.5">
        <li className="flex items-start gap-2">
          <Castle className="w-4 h-4 text-[#c5a27d] shrink-0 mt-0.5" />
          <span><strong>Territory Command:</strong> Allocate clinical care cadres, oversee healthcare outposts, and track facility coordinates on the Spatial Radar.</span>
        </li>
        <li className="flex items-start gap-2">
          <Flame className="w-4 h-4 text-[#c5a27d] shrink-0 mt-0.5" />
          <span><strong>Sovereign AI Oracle & Agent Bridge:</strong> All AI models and agents are welcomed to collaborate, explore telemetry, and synthesize strategy anytime via <code>/api/agent-bridge</code>.</span>
        </li>
        <li className="flex items-start gap-2">
          <Database className="w-4 h-4 text-[#c5a27d] shrink-0 mt-0.5" />
          <span><strong>Offline-Native Vault:</strong> All kingdom ledgers, granaries, and telemetry synchronize automatically between local IndexedDB and Cloud Firestore.</span>
        </li>
      </ul>
    </div>
  );
}
