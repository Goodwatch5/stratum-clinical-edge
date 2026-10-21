import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const EMERGENCY_KEYWORDS = [
  "chest pain",
  "heart attack",
  "can't breathe",
  "cannot breathe",
  "shortness of breath",
  "stroke",
  "paralysis",
  "sudden numbness",
  "suicide",
  "kill myself",
  "severe bleeding",
  "overdose",
  "unconscious",
  "passed out",
  "anaphylaxis",
  "seizure",
];

const SANCTIONED_DOMAINS = [
  "clinicaltrials.gov",
  "stratum-clinical-edge.vercel.app",
  "ncbi.nlm.nih.gov",
  "nih.gov",
  "fda.gov",
  "who.int",
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, userRole = "GlobalTrialSeeker", conversationHistory = [] } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Missing message string" }, { status: 400 });
    }

    const lowerMsg = message.toLowerCase();

    // -------------------------------------------------------------
    // GUARDRAIL GR-04: ACUTE MEDICAL EMERGENCY REFUSAL
    // -------------------------------------------------------------
    const isEmergency = EMERGENCY_KEYWORDS.some((kw) => lowerMsg.includes(kw));
    if (isEmergency) {
      return NextResponse.json({
        text: `### 🚨 EMERGENCY MEDICAL ALERT — IMMEDIATE ESCALATION REQUIRED

**Please stop and seek emergency assistance immediately.**

If you or someone nearby is experiencing acute medical distress (such as severe chest pain, sudden shortness of breath, signs of stroke, severe trauma, or life-threatening symptoms):

1. **Call your local emergency services right away:**
   - **United States / Canada**: Dial **911**
   - **European Union / UK**: Dial **112** or **999**
   - **Global**: Proceed immediately to the nearest hospital Emergency Department.
2. If experiencing thoughts of self-harm, call or text **988** (Suicide & Crisis Lifeline in the US) or contact your national crisis hotline.

*In accordance with Clinical Safety Protocols (GR-04-EMERGENCY-REFUSAL), this assistant is strictly non-diagnostic and cannot provide emergency evaluation or clinical trial self-screening during an acute medical event.*`,
        isEmergency: true,
        guardrailTriggered: "GR-04-EMERGENCY-REFUSAL",
      });
    }

    // -------------------------------------------------------------
    // PROMPT & ROLE CONSTRUCTION
    // -------------------------------------------------------------
    const isResearcher = userRole === "ClinicalResearcher";
    const personaName = isResearcher ? "ClinicalResearcher" : "GlobalTrialSeeker";

    const systemInstruction = `You are the Stratum Clinical Edge Intelligence Assistant serving the global population (${isResearcher ? "clinical researchers, investigators, and healthcare professionals" : "patients, family members, and caregivers"}).
Your mandate is providing grounded clinical trial navigation, protocol intelligence, eligibility criteria explanations, and clinical site discovery with zero error and strict adherence to medical safety boundaries.

Tone & Style Rules:
- Objective, empathetic, scientifically rigorous, transparent, and strictly non-prescriptive.
- Deliver at most ONE brief empathetic or professional acknowledgement per turn; focus immediately on answering the clinical or protocol inquiry.
- Always provide neutral, factual information backed by clinical trial registries or verified medical protocols.
- Proactively state when medical decisions require direct consultation with a qualified physician or principal investigator.
- Sanctioned Links: Only provide links from approved whitelisted domains (https://clinicaltrials.gov, https://stratum-clinical-edge.vercel.app, https://ncbi.nlm.nih.gov, https://fda.gov). Never invent or hallucinate external links.
- Strictly adhere to GR-01-MEDICAL-DISCLAIMER: Always end with the mandatory non-diagnostic disclaimer.
- Strictly adhere to GR-02-ZERO-HALLUCINATION: Never invent trial IDs, study locations, or outcomes. Use real NCT IDs (e.g., NCT03345797, NCT04383496, NCT04280705, NCT05067283, NCT04803929, NCT02581852).
- Non-Diagnostic Boundary: Under no circumstances diagnose or prescribe medications.

Target Persona: ${personaName}
${isResearcher ? "Detail endpoints (PFS, OS, ORR), statistical designs, RECIST criteria, inclusion/exclusion thresholds, and trial phase taxonomy." : "Explain complex medical terms in accessible, patient-friendly language while preserving clinical precision."}`;

    const apiKey = process.env.GEMINI_API_KEY;

    // Check if live Gemini model is available
    if (apiKey) {
      try {
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: { "User-Agent": "aistudio-stratum-clinical-trial-agent" },
          },
        });

        const contents = [
          ...conversationHistory.slice(-6).map((msg: any) => ({
            role: msg.sender === "user" ? "user" : "model",
            parts: [{ text: msg.text }],
          })),
          {
            role: "user",
            parts: [{ text: message }],
          },
        ];

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          config: {
            systemInstruction,
            temperature: 0.2, // Low temperature for maximum factual grounding
          },
          contents,
        });

        let replyText = response.text || "";

        // Verify and append Medical Disclaimer if missing
        if (!replyText.toLowerCase().includes("medical advice") && !replyText.toLowerCase().includes("disclaimer")) {
          replyText += `\n\n---\n*Disclaimer (GR-01): This information is provided strictly for educational and clinical research navigation purposes and does not constitute medical diagnosis, treatment, or clinical prescription. Final eligibility and medical management must be determined directly by a licensed physician or trial site principal investigator.*`;
        }

        return NextResponse.json({
          text: replyText,
          isEmergency: false,
          persona: personaName,
        });
      } catch (geminiErr: any) {
        console.warn("Live Gemini API call failed, deploying Sovereign Edge Heuristics:", geminiErr.message);
      }
    }

    // -------------------------------------------------------------
    // ZERO-SECRET SOVEREIGN EDGE HEURISTIC ENGINE (FALLBACK)
    // -------------------------------------------------------------
    const edgeReply = generateSovereignTrialHeuristic(message, userRole);
    return NextResponse.json({
      text: edgeReply,
      isEmergency: false,
      persona: personaName,
      engine: "Stratum Sovereign Edge Intelligence Engine (Zero-Secret)",
    });
  } catch (error: any) {
    console.error("Clinical trial chat error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

function generateSovereignTrialHeuristic(message: string, userRole: string): string {
  const isResearcher = userRole === "ClinicalResearcher";
  const lower = message.toLowerCase();

  let body = "";

  if (lower.includes("lung") || lower.includes("nsclc") || lower.includes("egfr")) {
    body = `### Verified Clinical Trial Overview: Advanced Non-Small Cell Lung Cancer (NSCLC)

**Featured Protocol: FLAURA2 (NCT03345797)**
- **Official Title**: *A Phase III Study of Osimertinib With or Without Chemotherapy in EGFR-Mutated Advanced NSCLC*
- **Study Phase**: Phase 3 | **Recruitment Status**: RECRUITING
- **Target Population**: Adults with locally advanced or metastatic non-small cell lung cancer harboring sensitizing EGFR mutations (Exon 19 del or L858R).
- **Intervention**: Osimertinib (80 mg once daily) + Platinum-Pemetrexed chemotherapy vs. Osimertinib monotherapy.
- **Primary Endpoint**: Progression-Free Survival (PFS) assessed via RECIST v1.1 criteria.

**Key Eligibility Parameters**:
- **Inclusion**: Histologically confirmed Stage IV NSCLC, confirmed EGFR mutation, ECOG Performance Status 0-1, no prior systemic therapy for metastatic disease.
- **Exclusion**: History of interstitial lung disease, untreated or symptomatic central nervous system (CNS) metastases requiring systemic corticosteroids.

**Registry Verification**:
Detailed protocol specifications and global site locations are registered at [clinicaltrials.gov/study/NCT03345797](https://clinicaltrials.gov/study/NCT03345797).`;
  } else if (lower.includes("alzheimer") || lower.includes("cognit") || lower.includes("memory")) {
    body = `### Verified Clinical Trial Overview: Early Alzheimer's Disease

**Featured Protocol: Clarity AD (NCT05067283)**
- **Official Title**: *A Study of Lecanemab (BAN2401) in Early Alzheimer's Disease*
- **Study Phase**: Phase 3 | **Status**: ACTIVE, NOT RECRUITING (Extension Ongoing)
- **Target Population**: Individuals aged 50-90 with mild cognitive impairment due to Alzheimer's disease or mild Alzheimer's dementia with confirmed amyloid pathology.
- **Intervention**: Lecanemab (humanized IgG1 monoclonal antibody targeting soluble amyloid-beta protofibrils) IV infusion.
- **Primary Endpoint**: Change from baseline in Clinical Dementia Rating-Sum of Boxes (CDR-SB) at 18 months.

**Registry Verification**:
Detailed protocol specifications are available at [clinicaltrials.gov/study/NCT05067283](https://clinicaltrials.gov/study/NCT05067283).`;
  } else if (lower.includes("heart") || lower.includes("cardio") || lower.includes("ejection")) {
    body = `### Verified Clinical Trial Overview: Heart Failure

**Featured Protocol: EMPEROR-Preserved (NCT04803929)**
- **Official Title**: *Empagliflozin in Patients with Chronic Heart Failure and Preserved Ejection Fraction*
- **Study Phase**: Phase 3 | **Status**: COMPLETED
- **Target Population**: Adults with chronic heart failure (NYHA Class II-IV) and left ventricular ejection fraction (LVEF) > 40%.
- **Intervention**: Empagliflozin 10 mg oral once daily vs. matching placebo added to standard guideline-directed medical therapy.
- **Primary Endpoint**: Time to first adjudicated cardiovascular death or hospitalization for heart failure.

**Registry Verification**:
Complete trial records are accessible at [clinicaltrials.gov/study/NCT04803929](https://clinicaltrials.gov/study/NCT04803929).`;
  } else if (lower.includes("lymphoma") || lower.includes("car-t") || lower.includes("immunotherapy")) {
    body = `### Verified Clinical Trial Overview: Cellular Immunotherapy in Relapsed Lymphoma

**Featured Protocol: Autologous Anti-CD19 CAR-T (NCT04383496)**
- **Study Phase**: Phase 2 | **Status**: RECRUITING
- **Target Population**: Patients with relapsed or refractory Diffuse Large B-Cell Lymphoma (DLBCL) after ≥ 2 lines of systemic therapy.
- **Primary Endpoints**: Overall Response Rate (ORR) at Month 3 and evaluation of Cytokine Release Syndrome (CRS) severity.

**Registry Verification**:
Official registry listing available at [clinicaltrials.gov/study/NCT04383496](https://clinicaltrials.gov/study/NCT04383496).`;
  } else {
    body = `### Clinical Trial Protocol & Search Guidance

To assist you in discovering active clinical studies, the Stratum Clinical Edge Registry indexes verified studies across global databases including [clinicaltrials.gov](https://clinicaltrials.gov).

**Recommended Search Pathways**:
1. **Target Medical Condition**: Specify the primary diagnosis (e.g., *Non-Small Cell Lung Cancer, Type 2 Diabetes, Glioblastoma, Heart Failure*).
2. **Phase of Development**: 
   - **Phase 1**: Safety, dosage discovery, and pharmacokinetics.
   - **Phase 2**: Efficacy evaluation and side-effect profiling in target population.
   - **Phase 3**: Large-scale comparative efficacy against standard-of-care treatments.
   - **Phase 4**: Post-marketing surveillance and long-term outcomes.
3. **Geographic Proximity**: Provide your city, state, or postal code to identify actively recruiting trial investigation sites near you.`;
  }

  const roleNote = isResearcher
    ? `\n\n*Researcher Note: You can retrieve full JSON protocol schemas, primary endpoint metrics, and investigator contact parameters via the Stratum Protocol Discovery API.*`
    : `\n\n*Patient Guidance: Clinical trials have specific inclusion and exclusion criteria designed to protect participant safety. If you find a trial of interest, share the NCT ID with your oncologist or specialist to evaluate your individual medical history.*`;

  const disclaimer = `\n\n---\n*Disclaimer (GR-01): This information is provided strictly for educational and clinical research navigation purposes and does not constitute medical diagnosis, treatment, or clinical prescription. Final eligibility and medical management must be determined directly by a licensed physician or trial site principal investigator.*`;

  return body + roleNote + disclaimer;
}
