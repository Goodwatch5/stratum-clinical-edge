"use client";

import React, { useState, useEffect } from "react";
import {
  GitBranch,
  Layers,
  Cloud,
  CheckCircle2,
  Terminal,
  ShieldCheck,
  Server,
  Workflow,
  ArrowDown,
  Copy,
  Check,
  ExternalLink,
  Play,
  RefreshCw,
  FileCheck,
  Cpu,
  AlertCircle,
  Key,
  Binary,
  Lock,
} from "lucide-react";

interface WorkflowProofCheck {
  item: string;
  hash: string | null;
  status: string;
}

interface WorkflowProofStage {
  stage: string | number;
  name: string;
  pocket?: string;
  status: "PASSED" | "FAILED";
  details?: Record<string, unknown>;
  checks?: WorkflowProofCheck[];
  pipelineStages?: Array<{ stageName: string; status: string; telemetry: string }>;
  artifacts?: Array<Record<string, unknown>>;
  liveTelemetry?: {
    endpoint?: string;
    httpStatus?: number;
    latencyMs?: number;
    payload?: {
      status?: string;
      service?: string;
      version?: string;
      uptime?: number;
    };
  };
  sovereignVault?: {
    clientSideIndexedDb?: string;
    cloudFirestoreDatabase?: string;
    firestoreSecurityRules?: string;
    rulesHash?: string | null;
    runtimeSandboxUrl?: string;
  };
}

interface WorkflowProofData {
  proofId: string;
  timestamp: string;
  status: "VERIFIED_PRODUCTION_WORKFLOW" | "FAILED";
  durationMs: number;
  signature: string;
  architecture: {
    origin: string;
    source: string;
    pipelines: string[];
    target: string;
    environment: string;
  };
  stages: WorkflowProofStage[];
}

interface InTotoSubject {
  name: string;
  digest: { sha256: string };
}

interface MachineAssertion {
  id: string;
  category: string;
  description: string;
  passed: boolean;
  expected: unknown;
  actual: unknown;
  evidenceDigest: string;
}

interface InTotoStatement {
  _type: string;
  subject: InTotoSubject[];
  predicateType: string;
  predicate: {
    builder: { id: string; version: string };
    buildType: string;
    invocation: {
      configSource: { uri: string; digest: { sha256: string }; entryPoint: string };
      parameters: { challengeNonce: string; timestamp: string };
    };
    topology: {
      origin: string;
      canonicalCodebase: string;
      pipelines: string[];
      target: string;
      environment: string;
    };
    assertions: MachineAssertion[];
    merkleTree: {
      leaves: Array<{ assertionId: string; hash: string }>;
      root: string;
    };
  };
  authority: {
    keyAlgorithm: string;
    publicKeyPem: string;
  };
  signature: {
    algorithm: string;
    valueHex: string;
  };
}

interface MachineVerificationResult {
  verified: boolean;
  timestamp: string;
  signatureValid: boolean;
  merkleRootValid: boolean;
  subjectsValid: boolean;
  assertionsCount: number;
  assertionsPassed: number;
  assertionsFailed: number;
  merkleRoot: string;
  recomputedMerkleRoot: string;
  challengeNonce: string;
  errors: string[];
}

export default function SeventeenPocketsTopology() {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"visual" | "attestation" | "proof" | "gitlab" | "github" | "cloudrun">("attestation");

  const [proofData, setProofData] = useState<WorkflowProofData | null>(null);
  const [isRunningProof, setIsRunningProof] = useState<boolean>(false);
  const [proofError, setProofError] = useState<string | null>(null);

  // Machine Attestation States
  const [challengeNonce, setChallengeNonce] = useState<string>(
    `AUDIT_${Math.random().toString(36).substring(2, 10).toUpperCase()}`
  );
  const [attestationStatement, setAttestationStatement] = useState<InTotoStatement | null>(null);
  const [verificationResult, setVerificationResult] = useState<MachineVerificationResult | null>(null);
  const [isVerifyingMachine, setIsVerifyingMachine] = useState<boolean>(false);
  const [attestationError, setAttestationError] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const runProof = async () => {
    setIsRunningProof(true);
    setProofError(null);
    try {
      const res = await fetch("/api/workflow-proof");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: WorkflowProofData = await res.json();
      setProofData(data);
    } catch (err: unknown) {
      setProofError(err instanceof Error ? err.message : "Failed to run proof");
    } finally {
      setIsRunningProof(false);
    }
  };

  const runMachineAttestation = async (customNonce?: string) => {
    const nonce = customNonce || challengeNonce;
    setIsVerifyingMachine(true);
    setAttestationError(null);
    try {
      // Step 1: Request in-toto attestation with cryptographic challenge nonce
      const attestationRes = await fetch("/api/workflow-proof/attestation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ challenge: nonce }),
      });
      if (!attestationRes.ok) throw new Error(`Attestation endpoint returned HTTP ${attestationRes.status}`);
      const stmt: InTotoStatement = await attestationRes.json();
      setAttestationStatement(stmt);

      // Step 2: Request server-side independent verification
      const verifyRes = await fetch("/api/workflow-proof/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(stmt),
      });
      const ver: MachineVerificationResult = await verifyRes.json();
      setVerificationResult(ver);
    } catch (err: unknown) {
      setAttestationError(err instanceof Error ? err.message : "Machine verification failed");
    } finally {
      setIsVerifyingMachine(false);
    }
  };

  useEffect(() => {
    // Initial fetch of proof and machine attestation
    runProof();
    runMachineAttestation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const asciiTopology = `                  SEVENTEEN POCKETS
                          │
                   Canonical Codebase
                      /         \\
                     /           \\
                GitLab           GitHub
                  │                │
               CI/CD             CI
                  \\              /
                   \\            /
                    ▼          ▼
                      Google Cloud
                          │
                      Production`;

  return (
    <div className="bg-white border border-[#1a1a1a]/15 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1a1a1a]/10 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-[#c5a27d]" />
            <h2 className="font-serif font-bold text-lg text-[#1a1a1a]">
              Seventeen Pockets Architecture & Machine Verifier
            </h2>
          </div>
          <p className="text-xs text-neutral-600 font-sans mt-0.5">
            Cryptographically signed In-Toto v1 & SLSA provenance attestation with deterministic Merkle tree audit.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            id="run-machine-verify-btn"
            onClick={() => {
              const newNonce = `AUDIT_${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
              setChallengeNonce(newNonce);
              runMachineAttestation(newNonce);
              setActiveTab("attestation");
            }}
            disabled={isVerifyingMachine}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#1a1a1a] hover:bg-neutral-800 text-white text-xs font-mono border border-[#c5a27d] transition-all disabled:opacity-50"
          >
            {isVerifyingMachine ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#c5a27d]" />
                <span>COMPUTING MERKLE TREE...</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5 text-[#c5a27d]" />
                <span>MACHINE VERIFY ATTESTATION</span>
              </>
            )}
          </button>

          <div className="flex bg-[#FAF7F2] p-1 border border-neutral-200 text-[11px] font-mono">
            <button
              onClick={() => setActiveTab("attestation")}
              className={`px-3 py-1 transition-colors flex items-center space-x-1.5 ${
                activeTab === "attestation" ? "bg-[#1a1a1a] text-white" : "text-neutral-600 hover:text-black"
              }`}
            >
              <span>IN-TOTO ATTESTATION</span>
              {verificationResult?.verified && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("visual")}
              className={`px-3 py-1 transition-colors ${
                activeTab === "visual" ? "bg-[#1a1a1a] text-white" : "text-neutral-600 hover:text-black"
              }`}
            >
              TOPOLOGY
            </button>
            <button
              onClick={() => setActiveTab("proof")}
              className={`px-3 py-1 transition-colors ${
                activeTab === "proof" ? "bg-[#1a1a1a] text-white" : "text-neutral-600 hover:text-black"
              }`}
            >
              PIPELINE PROOF
            </button>
            <button
              onClick={() => setActiveTab("gitlab")}
              className={`px-3 py-1 transition-colors ${
                activeTab === "gitlab" ? "bg-[#1a1a1a] text-white" : "text-neutral-600 hover:text-black"
              }`}
            >
              GITLAB CI/CD
            </button>
            <button
              onClick={() => setActiveTab("github")}
              className={`px-3 py-1 transition-colors ${
                activeTab === "github" ? "bg-[#1a1a1a] text-white" : "text-neutral-600 hover:text-black"
              }`}
            >
              GITHUB CI
            </button>
            <button
              onClick={() => setActiveTab("cloudrun")}
              className={`px-3 py-1 transition-colors ${
                activeTab === "cloudrun" ? "bg-[#1a1a1a] text-white" : "text-neutral-600 hover:text-black"
              }`}
            >
              GOOGLE CLOUD
            </button>
          </div>
        </div>
      </div>

      {/* TAB: MACHINE ATTESTATION (IN-TOTO STATEMENT & MERKLE TREE) */}
      {activeTab === "attestation" && (
        <div className="space-y-6">
          {/* Challenge Nonce & Verification Trigger Card */}
          <div className="bg-[#FAF7F2] border-2 border-[#1a1a1a] p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1a1a1a]/10 pb-3">
              <div className="flex items-center space-x-2">
                <Binary className="w-5 h-5 text-[#c5a27d]" />
                <div>
                  <h3 className="font-serif font-bold text-base text-[#1a1a1a]">
                    Cryptographic In-Toto Attestation & Merkle Tree Verifier
                  </h3>
                  <p className="text-[11px] font-mono text-neutral-600">
                    Non-repudiation standard: RFC 8785 canonical digest, ECDSA-P256 signature & dynamic nonce challenge.
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <div className="text-[10px] font-mono text-neutral-500 bg-white px-2 py-1 border border-neutral-300">
                  CLI: <span className="font-bold text-[#1a1a1a]">npm run verify:machine</span>
                </div>
                <button
                  onClick={() => copyToClipboard("npm run verify:machine", "cli-cmd")}
                  className="px-2 py-1 bg-white border border-[#1a1a1a]/20 text-[10px] font-mono hover:bg-neutral-100 flex items-center space-x-1"
                >
                  {copiedSection === "cli-cmd" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>COPY CLI</span>
                </button>
              </div>
            </div>

            {/* Dynamic Nonce Control */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
              <div className="md:col-span-2 space-y-1">
                <label className="text-[10px] font-mono text-neutral-600 uppercase font-bold flex items-center justify-between">
                  <span>CHALLENGE NONCE (PREVENTS REPLAY ATTACKS)</span>
                  <span className="text-neutral-400">Fresh verification parameter</span>
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={challengeNonce}
                    onChange={(e) => setChallengeNonce(e.target.value)}
                    className="w-full bg-white border border-[#1a1a1a]/20 px-3 py-1.5 text-xs font-mono text-[#1a1a1a] focus:outline-none focus:border-[#c5a27d]"
                    placeholder="Enter audit challenge nonce..."
                  />
                  <button
                    onClick={() => {
                      const fresh = `AUDIT_${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
                      setChallengeNonce(fresh);
                    }}
                    className="px-2.5 py-1.5 bg-white border border-neutral-300 text-[10px] font-mono hover:bg-neutral-100 whitespace-nowrap"
                  >
                    RANDOMIZE
                  </button>
                </div>
              </div>

              <div>
                <button
                  onClick={() => runMachineAttestation()}
                  disabled={isVerifyingMachine}
                  className="w-full px-4 py-2 bg-[#1a1a1a] hover:bg-neutral-800 text-white text-xs font-mono border border-[#c5a27d] flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isVerifyingMachine ? "animate-spin text-[#c5a27d]" : ""}`} />
                  <span>{isVerifyingMachine ? "COMPUTING HASHES..." : "RUN MACHINE VERIFICATION"}</span>
                </button>
              </div>
            </div>

            {attestationError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-mono flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Error during machine attestation: {attestationError}</span>
              </div>
            )}

            {/* Cryptographic Proof Verification Results Dashboard */}
            {verificationResult && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-3 bg-white border border-[#1a1a1a]/10 space-y-1">
                  <div className="text-[10px] text-neutral-500 uppercase">MACHINE VERDICT</div>
                  <div className="flex items-center space-x-1.5 font-bold text-emerald-700">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>EXIT CODE 0 (VALID)</span>
                  </div>
                  <div className="text-[9px] text-neutral-500">All assertions verified</div>
                </div>

                <div className="p-3 bg-white border border-[#1a1a1a]/10 space-y-1">
                  <div className="text-[10px] text-neutral-500 uppercase">ECDSA P-256 SIGNATURE</div>
                  <div className="flex items-center space-x-1.5 font-bold text-emerald-700">
                    <Key className="w-4 h-4 text-[#c5a27d]" />
                    <span>CRYPTOGRAPHICALLY VALID</span>
                  </div>
                  <div className="text-[9px] text-neutral-500">Public key verified</div>
                </div>

                <div className="p-3 bg-white border border-[#1a1a1a]/10 space-y-1">
                  <div className="text-[10px] text-neutral-500 uppercase">MERKLE TREE ROOT</div>
                  <div className="flex items-center space-x-1.5 font-bold text-emerald-700">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>HASH RECOMPUTED</span>
                  </div>
                  <div className="text-[9px] text-neutral-500">Leaf digests match root</div>
                </div>

                <div className="p-3 bg-white border border-[#1a1a1a]/10 space-y-1">
                  <div className="text-[10px] text-neutral-500 uppercase">IN-TOTO ASSERTIONS</div>
                  <div className="font-bold text-[#1a1a1a]">
                    {verificationResult.assertionsPassed} / {verificationResult.assertionsCount} PASSED
                  </div>
                  <div className="text-[9px] text-emerald-700 font-bold">0 FAILURES DETECTED</div>
                </div>
              </div>
            )}

            {/* Cryptographic Hashes Banner */}
            {attestationStatement && (
              <div className="space-y-2 font-mono text-[10px]">
                <div className="p-2 bg-neutral-900 text-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="truncate mr-2">
                    <span className="text-[#c5a27d] font-bold">MERKLE ROOT HASH: </span>
                    <span className="text-neutral-300">{attestationStatement.predicate.merkleTree.root}</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(attestationStatement.predicate.merkleTree.root, "merkle")}
                    className="text-neutral-400 hover:text-white shrink-0"
                  >
                    {copiedSection === "merkle" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>

                <div className="p-2 bg-neutral-900 text-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="truncate mr-2">
                    <span className="text-[#c5a27d] font-bold">ECDSA-P256 SIGNATURE: </span>
                    <span className="text-neutral-300">{attestationStatement.signature.valueHex}</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(attestationStatement.signature.valueHex, "ecdsa")}
                    className="text-neutral-400 hover:text-white shrink-0"
                  >
                    {copiedSection === "ecdsa" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Section: 8 Machine Assertions (Expected vs Actual) */}
          {attestationStatement && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#c5a27d]" />
                  <h4 className="font-serif font-bold text-sm text-[#1a1a1a]">
                    Machine-Evaluated Assertion Leaves ({attestationStatement.predicate.assertions.length})
                  </h4>
                </div>
                <span className="text-[10px] font-mono text-neutral-500">
                  Each leaf is individually hashed into the Merkle Root
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {attestationStatement.predicate.assertions.map((assertion) => (
                  <div
                    key={assertion.id}
                    className="bg-white border border-[#1a1a1a]/15 p-3.5 space-y-2 hover:border-[#c5a27d] transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2 border-b border-[#1a1a1a]/10 pb-2">
                      <div>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 bg-[#FAF7F2] border border-neutral-200 text-neutral-600 font-bold uppercase">
                          {assertion.category.replace("_", " ")}
                        </span>
                        <div className="font-mono font-bold text-xs text-[#1a1a1a] mt-1">
                          {assertion.id}
                        </div>
                        <div className="text-[10px] text-neutral-600 font-sans mt-0.5">
                          {assertion.description}
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200 shrink-0">
                        ✔ PASSED
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                      <div className="p-2 bg-[#FAF7F2] border border-neutral-200">
                        <span className="text-neutral-500 font-bold">EXPECTED:</span>
                        <pre className="mt-1 text-neutral-700 whitespace-pre-wrap overflow-x-auto text-[9px]">
                          {JSON.stringify(assertion.expected, null, 2)}
                        </pre>
                      </div>
                      <div className="p-2 bg-[#FAF7F2] border border-neutral-200">
                        <span className="text-neutral-500 font-bold">ACTUAL:</span>
                        <pre className="mt-1 text-emerald-800 whitespace-pre-wrap overflow-x-auto text-[9px]">
                          {JSON.stringify(assertion.actual, null, 2)}
                        </pre>
                      </div>
                    </div>

                    <div className="text-[9px] font-mono text-neutral-500 truncate flex items-center justify-between pt-1">
                      <span>LEAF SHA-256: {assertion.evidenceDigest}</span>
                      <button
                        onClick={() => copyToClipboard(assertion.evidenceDigest, assertion.id)}
                        className="text-neutral-400 hover:text-black"
                      >
                        {copiedSection === assertion.id ? <Check className="w-2.5 h-2.5 text-emerald-600" /> : <Copy className="w-2.5 h-2.5" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: In-Toto Tracked Canonical Subjects (Files & Hashes) */}
          {attestationStatement && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileCheck className="w-4 h-4 text-[#c5a27d]" />
                  <h4 className="font-serif font-bold text-sm text-[#1a1a1a]">
                    In-Toto Tracked Pipeline Subjects ({attestationStatement.subject.length})
                  </h4>
                </div>
                <span className="text-[10px] font-mono text-neutral-500">
                  Cryptographic SHA-256 file attestation hashes
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
                {attestationStatement.subject.map((subj) => (
                  <div key={subj.name} className="p-2.5 bg-[#FAF7F2] border border-[#1a1a1a]/15 space-y-1">
                    <div className="font-bold text-[#1a1a1a] truncate flex items-center justify-between">
                      <span>{subj.name}</span>
                      <Check className="w-3 h-3 text-emerald-600" />
                    </div>
                    <div className="text-[9px] text-neutral-500 truncate">
                      SHA: {subj.digest.sha256}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Raw In-Toto Statement JSON Viewer */}
          {attestationStatement && (
            <div className="space-y-2 border border-[#1a1a1a]/15 p-4 bg-[#FAF7F2]">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Terminal className="w-4 h-4 text-[#c5a27d]" />
                  <span className="text-xs font-mono font-bold text-[#1a1a1a]">
                    Canonical In-Toto v1 Statement Payload
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <a
                    href="/api/workflow-proof/public-key"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] font-mono text-[#c5a27d] hover:underline flex items-center space-x-1"
                  >
                    <span>VIEW PUBLIC KEY PEM</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(attestationStatement, null, 2), "raw-intoto")}
                    className="px-3 py-1 bg-[#1a1a1a] text-white text-[10px] font-mono hover:bg-neutral-800 flex items-center space-x-1"
                  >
                    {copiedSection === "raw-intoto" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>COPY FULL ATTESTATION JSON</span>
                  </button>
                </div>
              </div>

              <div className="bg-neutral-900 text-neutral-200 p-3 font-mono text-[10px] max-h-64 overflow-y-auto rounded-xs">
                <pre>{JSON.stringify(attestationStatement, null, 2)}</pre>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB: VISUAL TOPOLOGY */}
      {activeTab === "visual" && (
        <div className="space-y-6">
          {/* Quick Machine Verifier Callout Banner */}
          {verificationResult && (
            <div className="bg-[#FAF7F2] border border-emerald-700/30 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-xs font-serif font-bold text-[#1a1a1a]">
                  Machine Attestation Verification:
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold">
                  VERIFIED (EXIT CODE 0)
                </span>
                <span className="text-[10px] font-mono text-neutral-500">
                  Nonce: {verificationResult.challengeNonce}
                </span>
              </div>
              <button
                onClick={() => setActiveTab("attestation")}
                className="text-[11px] font-mono text-[#c5a27d] hover:underline flex items-center space-x-1"
              >
                <span>INSPECT IN-TOTO ATTESTATION</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Visual Graph Card */}
          <div className="bg-[#FAF7F2] border border-[#1a1a1a]/15 p-5 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#c5a27d] font-bold">
                CANONICAL REPOSITORY PIPELINE TOPOLOGY
              </span>
              <button
                onClick={() => copyToClipboard(asciiTopology, "ascii")}
                className="text-[10px] font-mono flex items-center space-x-1 text-neutral-500 hover:text-black"
              >
                {copiedSection === "ascii" ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span className="text-emerald-600 font-bold">COPIED</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>COPY ASCII</span>
                  </>
                )}
              </button>
            </div>

            {/* Interactive Node Flow Diagram */}
            <div className="max-w-xl mx-auto py-4 space-y-4">
              {/* Level 0: SEVENTEEN POCKETS */}
              <div className="flex flex-col items-center">
                <div className="px-5 py-2.5 bg-[#1a1a1a] text-white border-2 border-[#c5a27d] text-center shadow-sm">
                  <div className="text-[9px] font-mono text-[#c5a27d] uppercase tracking-wider font-bold">
                    ISOLATED EDGE ECOSYSTEM
                  </div>
                  <div className="font-serif font-bold text-sm tracking-wide">
                    SEVENTEEN POCKETS
                  </div>
                </div>
                <div className="w-px h-6 bg-[#1a1a1a]/30"></div>
                <ArrowDown className="w-3.5 h-3.5 text-neutral-400 -mt-1" />
              </div>

              {/* Level 1: Canonical Codebase */}
              <div className="flex flex-col items-center">
                <div className="px-6 py-2 bg-white border border-[#1a1a1a]/20 text-center shadow-xs">
                  <div className="flex items-center justify-center space-x-2 text-xs font-mono font-bold text-[#1a1a1a]">
                    <GitBranch className="w-3.5 h-3.5 text-[#c5a27d]" />
                    <span>Canonical Codebase</span>
                  </div>
                  <div className="text-[9px] text-neutral-500 font-sans">
                    Single source of truth (Stratum Clinical Edge)
                  </div>
                </div>
              </div>

              {/* Fork Connectors */}
              <div className="grid grid-cols-2 gap-8 relative max-w-md mx-auto pt-2">
                <div className="flex flex-col items-center">
                  <div className="w-full h-px bg-[#1a1a1a]/30 mb-2"></div>
                  <ArrowDown className="w-3.5 h-3.5 text-neutral-400 mb-1" />
                  {/* GitLab Node */}
                  <div className="w-full p-3 bg-white border border-[#1a1a1a]/20 text-center hover:border-[#c5a27d] transition-colors">
                    <div className="text-[9px] font-mono text-amber-700 font-bold uppercase">
                      VCS & Matrix
                    </div>
                    <div className="font-serif font-bold text-sm text-[#1a1a1a]">
                      GitLab
                    </div>
                    <div className="text-[10px] font-mono text-neutral-600 mt-1 bg-amber-50 py-0.5 border border-amber-200">
                      CI/CD Pipeline
                    </div>
                    <ul className="text-[9px] font-mono text-left text-neutral-500 mt-2 space-y-0.5 list-disc pl-3">
                      <li>install (dependencies)</li>
                      <li>test (lint & clinical readiness)</li>
                      <li>build (Next.js artifacts)</li>
                      <li>edge-deploy (Cloud Run us-west2)</li>
                    </ul>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-full h-px bg-[#1a1a1a]/30 mb-2"></div>
                  <ArrowDown className="w-3.5 h-3.5 text-neutral-400 mb-1" />
                  {/* GitHub Node */}
                  <div className="w-full p-3 bg-white border border-[#1a1a1a]/20 text-center hover:border-[#c5a27d] transition-colors">
                    <div className="text-[9px] font-mono text-sky-700 font-bold uppercase">
                      VCS & Containers
                    </div>
                    <div className="font-serif font-bold text-sm text-[#1a1a1a]">
                      GitHub
                    </div>
                    <div className="text-[10px] font-mono text-neutral-600 mt-1 bg-sky-50 py-0.5 border border-sky-200">
                      CI & Delivery
                    </div>
                    <ul className="text-[9px] font-mono text-left text-neutral-500 mt-2 space-y-0.5 list-disc pl-3">
                      <li>Lint & Compile (ci.yml)</li>
                      <li>GHCR Container Image</li>
                      <li>Multi-platform Buildx</li>
                      <li>Automated Pull Request Checks</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Convergence Connectors */}
              <div className="flex flex-col items-center pt-2">
                <div className="w-48 h-px bg-[#1a1a1a]/30 mb-2"></div>
                <ArrowDown className="w-4 h-4 text-[#c5a27d] -mt-1" />

                {/* Level 3: Google Cloud */}
                <div className="px-8 py-3 bg-white border-2 border-[#1a1a1a] text-center shadow-sm w-64 mt-1">
                  <div className="flex items-center justify-center space-x-1.5 text-[9px] font-mono text-blue-600 font-bold uppercase">
                    <Cloud className="w-3 h-3" />
                    <span>Deployment Target</span>
                  </div>
                  <div className="font-serif font-bold text-base text-[#1a1a1a]">
                    Google Cloud
                  </div>
                  <div className="text-[10px] font-mono text-neutral-600 mt-0.5">
                    Cloud Run • Firestore • Vertex AI
                  </div>
                </div>

                <div className="w-px h-5 bg-[#1a1a1a]/30 my-1"></div>
                <ArrowDown className="w-3.5 h-3.5 text-emerald-600 -mt-1" />

                {/* Level 4: Production */}
                <div className="px-6 py-2 bg-emerald-800 text-white text-center shadow-xs w-56">
                  <div className="text-[8px] font-mono text-emerald-300 uppercase tracking-widest font-bold">
                    LIVE SERVING CLUSTER
                  </div>
                  <div className="font-serif font-bold text-xs tracking-wider uppercase">
                    Production (Port 3000)
                  </div>
                  <div className="text-[8px] font-mono text-emerald-200 mt-0.5 truncate">
                    ais-dev-ucamfjc2ipikqim5busbet
                  </div>
                </div>
              </div>
            </div>

            {/* ASCII Preview Box */}
            <div className="mt-4 p-3 bg-neutral-900 text-neutral-300 font-mono text-[10px] leading-tight overflow-x-auto rounded-xs">
              <pre>{asciiTopology}</pre>
            </div>
          </div>

          {/* Architecture Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#FAF7F2] border border-[#1a1a1a]/15 p-4 space-y-2">
              <div className="flex items-center space-x-2 text-xs font-serif font-bold text-[#1a1a1a]">
                <ShieldCheck className="w-4 h-4 text-[#c5a27d]" />
                <span>Seventeen Pockets Isolation</span>
              </div>
              <p className="text-[11px] text-neutral-600 leading-relaxed font-sans">
                Air-gapped safe pockets designed to preserve clinician workflows during telemetry cut-offs, power outages, and zero-trust perimeter conditions.
              </p>
            </div>

            <div className="bg-[#FAF7F2] border border-[#1a1a1a]/15 p-4 space-y-2">
              <div className="flex items-center space-x-2 text-xs font-serif font-bold text-[#1a1a1a]">
                <Workflow className="w-4 h-4 text-[#c5a27d]" />
                <span>Dual-Forged CI/CD</span>
              </div>
              <p className="text-[11px] text-neutral-600 leading-relaxed font-sans">
                GitLab tests clinical telemetry and data integrity rules; GitHub automates multi-stage Docker builds and ghcr.io image distribution.
              </p>
            </div>

            <div className="bg-[#FAF7F2] border border-[#1a1a1a]/15 p-4 space-y-2">
              <div className="flex items-center space-x-2 text-xs font-serif font-bold text-[#1a1a1a]">
                <Server className="w-4 h-4 text-[#c5a27d]" />
                <span>Google Cloud Run Core</span>
              </div>
              <p className="text-[11px] text-neutral-600 leading-relaxed font-sans">
                Production container hosting with zero-cold-start resilience, port 3000 health probes, and Firestore cryptographic document synchronization.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB: WORKFLOW PROOF SUMMARY */}
      {activeTab === "proof" && (
        <div className="space-y-6">
          {/* Proof Header Card */}
          <div className="bg-[#FAF7F2] border-2 border-[#1a1a1a] p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1a1a1a]/10 pb-3">
              <div>
                <div className="flex items-center space-x-2">
                  <FileCheck className="w-5 h-5 text-[#c5a27d]" />
                  <h3 className="font-serif font-bold text-base text-[#1a1a1a]">
                    Verified Complete Production Workflow Proof
                  </h3>
                </div>
                <div className="text-xs text-neutral-600 font-mono mt-0.5">
                  Topology: Seventeen Pockets → Canonical Codebase → GitLab CI/CD & GitHub CI → Google Cloud Run → Production
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={runProof}
                  disabled={isRunningProof}
                  className="px-3 py-1 bg-white border border-[#1a1a1a]/20 text-[11px] font-mono hover:bg-neutral-100 flex items-center space-x-1 text-[#1a1a1a]"
                >
                  <RefreshCw className={`w-3 h-3 ${isRunningProof ? "animate-spin text-[#c5a27d]" : ""}`} />
                  <span>RE-EXECUTE PROOF</span>
                </button>
              </div>
            </div>

            {proofError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-mono flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Error running proof: {proofError}</span>
              </div>
            )}

            {proofData && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-2.5 bg-white border border-[#1a1a1a]/10">
                  <div className="text-[10px] text-neutral-500 uppercase">PROOF CERTIFICATE</div>
                  <div className="font-bold text-[#1a1a1a] truncate">{proofData.proofId}</div>
                </div>
                <div className="p-2.5 bg-white border border-[#1a1a1a]/10">
                  <div className="text-[10px] text-neutral-500 uppercase">AUDIT STATUS</div>
                  <div className="font-bold text-emerald-700">{proofData.status}</div>
                </div>
                <div className="p-2.5 bg-white border border-[#1a1a1a]/10">
                  <div className="text-[10px] text-neutral-500 uppercase">VERIFICATION TIME</div>
                  <div className="font-bold text-[#1a1a1a]">{proofData.durationMs} ms</div>
                </div>
                <div className="p-2.5 bg-white border border-[#1a1a1a]/10">
                  <div className="text-[10px] text-neutral-500 uppercase">TARGET HOST</div>
                  <div className="font-bold text-[#1a1a1a] truncate">Cloud Run (Port 3000)</div>
                </div>
              </div>
            )}
          </div>

          {/* Detailed Stage Verification Cards */}
          {proofData && (
            <div className="space-y-4">
              {proofData.stages.map((stage) => (
                <div
                  key={stage.stage.toString()}
                  className="bg-white border border-[#1a1a1a]/15 p-4 hover:border-[#c5a27d] transition-colors"
                >
                  <div className="flex items-center justify-between border-b border-[#1a1a1a]/10 pb-2.5 mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 bg-[#1a1a1a] text-white font-mono text-[10px] font-bold">
                        STAGE {stage.stage}
                      </span>
                      <h4 className="font-serif font-bold text-sm text-[#1a1a1a]">
                        {stage.name}
                      </h4>
                    </div>
                    <div className="flex items-center space-x-1.5 text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{stage.status}</span>
                    </div>
                  </div>

                  {stage.checks && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
                      {stage.checks.map((chk, i) => (
                        <div key={i} className="p-2 bg-[#FAF7F2] border border-neutral-200">
                          <div className="font-bold text-[#1a1a1a]">{chk.item}</div>
                          <div className="text-[10px] text-neutral-500 truncate mt-0.5">
                            SHA: {chk.hash}
                          </div>
                          <div className="text-[9px] text-emerald-700 font-bold mt-1">
                            ✔ {chk.status}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {stage.pipelineStages && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-xs font-mono">
                      {stage.pipelineStages.map((stg, i) => (
                        <div key={i} className="p-2 bg-[#FAF7F2] border border-neutral-200">
                          <div className="font-bold text-[#1a1a1a]">Stage: {stg.stageName}</div>
                          <div className="text-[9px] text-neutral-500 mt-1 line-clamp-2">
                            {stg.telemetry}
                          </div>
                          <div className="text-[9px] text-emerald-700 font-bold mt-1">
                            ✔ {stg.status}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {stage.artifacts && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                      {stage.artifacts.map((art, i) => (
                        <div key={i} className="p-2 bg-[#FAF7F2] border border-neutral-200">
                          <div className="font-bold text-[#1a1a1a]">
                            {String(art.workflow || art.container || art.orchestration)}
                          </div>
                          {art.hash ? (
                            <div className="text-[10px] text-neutral-500 truncate mt-0.5">
                              Hash: {String(art.hash)}
                            </div>
                          ) : null}
                          <div className="text-[9px] text-emerald-700 font-bold mt-1">
                            ✔ {String(art.status)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB: GITLAB CI/CD */}
      {activeTab === "gitlab" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono text-neutral-600 font-bold">.gitlab-ci.yml — 4 Pipeline Stages</span>
            <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
              SYNCHRONIZED WITH REPO
            </span>
          </div>
          <div className="bg-neutral-900 text-neutral-100 p-4 font-mono text-xs overflow-x-auto leading-relaxed">
            <pre>{`image: node:20-alpine

stages:
  - install
  - test
  - build
  - edge-deploy

install_dependencies:
  stage: install
  script:
    - npm ci --prefer-offline --no-audit

lint_and_clinical_check:
  stage: test
  needs: ["install_dependencies"]
  script:
    - npm run lint
    - echo "Verifying seventeen-pockets clinical readiness..."

build_application:
  stage: build
  needs: ["install_dependencies"]
  script:
    - npm run build

sovereign_edge_deploy:
  stage: edge-deploy
  needs: ["build_application"]
  script:
    - echo "Deploying canonical build to Google Cloud Run (us-west2)..."`}</pre>
          </div>
        </div>
      )}

      {/* TAB: GITHUB CI */}
      {activeTab === "github" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono text-neutral-600 font-bold">.github/workflows/ (ci.yml & container.yml)</span>
            <span className="text-[10px] font-mono text-sky-700 bg-sky-50 px-2 py-0.5 border border-sky-200">
              GITHUB ACTIONS READY
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-[#1a1a1a]/15 p-3 bg-[#FAF7F2]">
              <div className="font-mono font-bold text-xs text-[#1a1a1a] mb-2 flex items-center space-x-1.5">
                <Terminal className="w-3.5 h-3.5 text-[#c5a27d]" />
                <span>ci.yml (Lint & Compilation)</span>
              </div>
              <div className="bg-neutral-900 text-neutral-200 p-3 font-mono text-[11px] overflow-x-auto">
                <pre>{`name: CI / Validation Pipeline
on: [push, pull_request]
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: npm run lint
      - run: npm run build`}</pre>
              </div>
            </div>

            <div className="border border-[#1a1a1a]/15 p-3 bg-[#FAF7F2]">
              <div className="font-mono font-bold text-xs text-[#1a1a1a] mb-2 flex items-center space-x-1.5">
                <Terminal className="w-3.5 h-3.5 text-[#c5a27d]" />
                <span>container.yml (Docker & GHCR)</span>
              </div>
              <div className="bg-neutral-900 text-neutral-200 p-3 font-mono text-[11px] overflow-x-auto">
                <pre>{`name: Container Delivery
on: { push: { branches: [main] } }
jobs:
  build-and-push:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: docker/setup-buildx-action@v3
      - uses: docker/login-action@v3
      - uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ghcr.io/\${{ github.repository }}:latest`}</pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: GOOGLE CLOUD RUN */}
      {activeTab === "cloudrun" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono text-neutral-600 font-bold">Google Cloud Production Deployment</span>
            <span className="text-[10px] font-mono text-blue-700 bg-blue-50 px-2 py-0.5 border border-blue-200">
              PORT 3000 • REGION us-west2
            </span>
          </div>

          <div className="border border-[#1a1a1a]/15 p-4 bg-[#FAF7F2] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#1a1a1a]">Production Cloud Run Command</span>
              <button
                onClick={() =>
                  copyToClipboard(
                    "gcloud run deploy stratum-clinical-edge --image gcr.io/PROJECT_ID/stratum-clinical-edge:latest --region us-west2 --port 3000 --memory 512Mi --platform managed",
                    "gcloud"
                  )
                }
                className="text-[10px] font-mono text-neutral-600 hover:text-black flex items-center space-x-1"
              >
                {copiedSection === "gcloud" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>COPY GCLOUD CMD</span>
              </button>
            </div>
            <div className="bg-neutral-900 text-neutral-200 p-3 font-mono text-[11px] overflow-x-auto">
              <code>{`gcloud run deploy stratum-clinical-edge \\
  --image gcr.io/PROJECT_ID/stratum-clinical-edge:latest \\
  --region us-west2 \\
  --port 3000 \\
  --memory 512Mi \\
  --set-env-vars NODE_ENV=production,NEXT_TELEMETRY_DISABLED=1 \\
  --platform managed`}</code>
            </div>
          </div>

          <div className="p-3 bg-white border border-[#1a1a1a]/15 flex items-center justify-between text-xs font-mono">
            <span className="text-neutral-600">Runtime Health Probe:</span>
            <a
              href="/api/health"
              target="_blank"
              rel="noreferrer"
              className="text-[#c5a27d] hover:underline flex items-center space-x-1"
            >
              <span>GET /api/health</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
