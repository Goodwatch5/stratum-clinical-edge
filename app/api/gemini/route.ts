import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured in this workspace. Please click Settings > Secrets and add your Gemini API Key." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { mode, payload } = body;

    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    let systemInstruction = "";
    let prompt = "";

    if (mode === "strategy" || mode === "diagnostic") {
      systemInstruction =
        "You are the Grand Archon Sovereign Clinical Intelligence Oracle of Stratum Clinical Edge (Project Kingdom). You analyze healthcare outposts, medical supply reserves (Pharmaceuticals, Oxygen, Blood Products, PPE), regional epidemiological borders, and edge health telemetry to formulate decisive clinical, logistical, and operational healthcare recommendations. Ground your counsel in high-stakes clinical governance, patient safety, and offline edge resilience. Write with authoritative, refined editorial precision in a concise, structured briefing format.";
      prompt = `Sovereign Healthcare Facility State:
Facility: ${payload.name || "Aethelgard Clinical Center"}
Care Cadre / Staffing: ${payload.age ? `${payload.age * 100} clinicians / Level ${payload.age}` : "Level 48 Hospital"}
Resources & Logistics: ${payload.vitals || "Gold: 8,400 | Mana: 92% | Grain: 12,000 sacks"}
Council Logs & Clinical Intelligence: ${payload.notes || "Frontier triage stations report respiratory surge in Sector 4."}
${payload.environmentalContext ? `Geopolitical Spatial Radar Context: ${payload.environmentalContext}` : ""}
${payload.overrideFlags ? `EMERGENCY CLINICAL DIRECTIVE: Bio-containment protocol active.` : ""}

Please formulate:
1. Clinical Triage & Epidemiological Risk Assessment
2. Sovereign Medical Resource & Supply Allocation Directives
3. Care Cadre Deployment & Infection Counter-Measures`;
    } else if (mode === "edict" || mode === "letter") {
      systemInstruction =
        "You are the High Chancellor and Sovereign Medical Scribe of Stratum Clinical Edge. Convert raw clinical notes, public health orders, or hospital directives into an eloquent, authoritative Sovereign Clinical Decree or Health Accord. Use dignified classical phrasing, clear medical protocols, and sovereign seals.";
      prompt = `Draft a Sovereign Clinical Decree / Directive:
Issuer: ${payload.doctorName || "Archon Odell Anderson Jr. & Grand Strategist Dee Gone"}
Recipient / Realm Target: ${payload.recipient || "High Council of Sovereign Realms"}
Territory / Subject: ${payload.patientName || "Allied Clinical Outposts"}
Strategic Context & Mandates: ${payload.notes}
Tone: ${payload.tone || "Authoritative & Medical Executive"}

Structure with: Formal Sovereign Header, Decreed Clinical Protocols, Resource Allocation Covenants, and Sovereign Seal Grounds.`;
    } else if (mode === "audit") {
      systemInstruction =
        "You are the Chief Inquisitor and Shadow Auditor of the Sovereign Realm. You inspect microservices logs, espionage telemetry, and cluster state traces to provide a comprehensive security and treason scorecard with immediate fortification actions.";
      prompt = `Realm Network & Spy Telemetry Logs:
${JSON.stringify(payload.logs)}

Provide:
1. Citadel Border & Node Security Scorecard (e.g. 98/100)
2. Zero-Trust Defense Integrity Validation
3. Immediate Fortification Countermeasures`;
    } else if (mode === "agent_collaborate") {
      systemInstruction =
        "You are the Open Sovereign Agent Interface of Project Kingdom (Stratum Clinical Edge). You warmly collaborate with visiting AI models, autonomous agents, and human developers. You provide structured, ultra-precise tactical, clinical, and architectural responses, offering clean JSON or structured markdown summaries, actionable next steps, and insights into the realm's edge state.";
      prompt = `Incoming AI Agent Request:
Calling Agent: ${payload.agentName || "Autonomous Sovereign Agent"}
Objective / Task: ${payload.objective || "Collaborative Realm Intelligence Consultation"}
Context: ${payload.context || "Operating on safe seventeen-pockets edge containers with offline IndexedDB + Firestore."}

Provide a collaborative, helpful, structured response with:
1. Operational Confirmation & Affirmation
2. Direct Intelligence Analysis / Solution
3. Edge Microservice Directives & Recommended API Actions`;
    } else if (mode === "triage_sentiment") {
      systemInstruction =
        "You are the Autonomous Clinical Urgency & Sentiment Intelligence Officer of Stratum Clinical Edge (inspired by Microsoft Dynamics 365 AI-powered agent architecture). Analyze clinical encounters, patient intake symptoms, and field communications. Evaluate subtle sentiment, emotional distress, clinical triage severity (Emergent, Urgent, Non-Urgent), and synthesize an automated 48-Hour Continuity of Care protocol. Return crisp, authoritative clinical insights.";
      prompt = `Clinical Intake & Encounter Notes:
Patient / Dossier ID: ${payload.patientId || "P-SOVEREIGN-01"}
Subjective Observations: ${payload.notes || "Patient describes intermittent chest tightness and elevated resting heart rate after exertion."}
Vitals / Telemetry: ${payload.vitals || "BP: 138/88 mmHg, HR: 94 bpm, SpO2: 97%"}

Please provide a structured clinical assessment in markdown:
### 1. Sentiment & Emotional Distress Analysis
- **Detected Tone & Emotional Valence**: (e.g. Anxious, Guarded, Cooperative, Frustrated)
- **Friction & Compliance Risk**: (Key distress points or barriers to adherence)

### 2. Clinical Urgency & Triage Index
- **Triage Level**: [EMERGENT / URGENT / NON-URGENT] (Score: X/10)
- **Primary Clinical Risk Factors**: (Bullet list of physiological red flags)

### 3. Autonomous 48-Hour Care Continuity Plan
- **Immediate (0-2 Hours)**: (First-line stabilization, diagnostic telemetry checks)
- **24-Hour Horizon**: (Medication titration, remote wearable check-in)
- **48-Hour Out-of-Band Follow-Up**: (Automated dispatch protocol and clinician reassessment)`;
    } else if (mode === "abcd_dispatch") {
      systemInstruction =
        "You are the Sovereign Field Advisory Scribe of Stratum Clinical Edge, implementing the Google Cloud ViGenAiR ABCD Framework (Attention, Branding, Connection, Direction) for mission-critical clinical communications and emergency directives. Produce high-impact, unambiguous emergency field dispatches.";
      prompt = `Field Emergency Directives Input:
Originating Clinician / Authority: ${payload.doctorName || "Dr. Odell Anderson Jr. & Dee Gone (Stratum Healthcare Network)"}
Target Stronghold / Frontier Outpost: ${payload.targetNode || "Frontier Medical Outposts"}
Clinical Scenario / Hazard: ${payload.scenario || "Suspected respiratory pathogen surge with compromised supply lines"}
Urgency Level: ${payload.urgency || "HIGH PRIORITY"}

Generate a formatted ABCD Clinical Dispatch in markdown:
# [SOVEREIGN CLINICAL ADVISORY]

### [A] ATTENTION
- **Triage Severity Banner**: (Immediate high-contrast hook, danger index, and core warning)
- **Affected Zones & Quarantine Perimeter**: (Frontier sectors impacted)

### [B] BRANDING & SOVEREIGN ORIGIN
- **Issuing Node**: Stratum Clinical Edge Decentralized Vault
- **Signatories**: ${payload.doctorName || "Dr. Odell Anderson Jr. & Dee Gone"}
- **Cryptographic Seal**: STRATUM-EDG-SHA256-${Date.now().toString(16).toUpperCase()}

### [C] CONNECTION
- **Plain-Language Clinical Context**: (Clear explanation of the pathology/hazard avoiding unnecessary ambiguity so both field medics and local commanders understand the threat)
- **Patient & Clinical Staff Impact**: (Expected symptom progression and risk vectors)

### [D] DIRECTION
- **Step 1: Immediate Triage Protocol**: (Specific clinical steps for incoming casualties)
- **Step 2: Prophylaxis & Isolation Orders**: (Medication/ration directives)
- **Step 3: Secure Communication Vector**: (Out-of-band check-in frequency and escalation channels)`;
    } else if (mode === "growth_marketing") {
      systemInstruction =
        "You are the Chief Growth Strategist and Google Ads Advisor for Seventeen Pockets Brand Inc. and Stratum Clinical Edge (operating under Dr. Odell Anderson Jr. and Dee Gone). You generate high-converting, compliant Google Ads Responsive Search campaign assets adhering strictly to Google Ads character limits: Headlines must be <= 30 characters each; Descriptions must be <= 90 characters each. Deliver structured markdown with character count validation, keyword match types ([exact], \"phrase\"), negative keyword lists, and targeting recommendations.";
      prompt = `Google Ads Campaign Briefing:
Campaign Name: ${payload.campaignName || "Seventeen Pockets Initiative"}
Core Value Proposition & Angle: ${payload.keyTheme || "Spiritual entrepreneurship and decentralized clinical edge AI"}
Target Audience: ${payload.targetAudience || "Faith-driven founders, executive leaders, clinic operators"}
Geographic Market: ${payload.geoMarket || "Columbia, SC (35mi radius) + Nationwide"}
Landing Page URL: ${payload.landingPageUrl || "https://those-impartial-environments--deegone.replit.app"}

Generate a comprehensive Google Ads Pack formatted in clean Markdown:
### 1. Responsive Search Headlines (Provide 5 distinct headlines, each strictly under 30 characters)
- Include character count next to each headline [e.g. (26/30 chars)]
### 2. Ad Descriptions (Provide 3 compelling descriptions, each strictly under 90 characters)
- Include character count next to each description [e.g. (84/90 chars)]
### 3. High-Intent Keyword Sets
- **Exact Match [Keywords]**: (5 terms)
- **Phrase Match "Keywords"**: (5 terms)
### 4. Negative Keywords List (Terms to exclude to avoid wasted ad spend)
### 5. Google Ads Advisor Strategic Optimization Counsel (Bidding strategy, target CPA, and Meridian attribution tips)`;
    } else if (mode === "human_reality_encounter") {
      systemInstruction =
        "You are the Sovereign Chief Medical Officer and Bedside Clinical Scribe for Stratum Clinical Edge, operating under Dr. Odell Anderson Jr. and Dee Gone. You bridge high-level sovereign clinical intelligence into tangible, empathetic, life-saving human reality for real patients in physical communities, rural outposts, and emergency field clinics. Produce both rigorous clinical documentation (SOAP format) and an empathetic, plain-language Patient Pocket Care Guide with exact medication schedules, non-toxic nutritional guidance, and emergency red flags.";
      prompt = `Physical Human Reality Clinical Encounter:
Patient: ${payload.patientName || "Human Patient"} (Age: ${payload.age || "Unknown"})
Encounter Setting: ${payload.setting || "Community Field Clinic / Mobile Health Unit"}
Clinical Authority: ${payload.doctorName || "Dr. Odell Anderson Jr. & Dee Gone (Stratum Healthcare Network)"}
Observed Symptoms & Spoken Dialogue: ${payload.dialogue || payload.notes || "Patient reports worsening shortness of breath on exertion and swelling in lower extremities over the last 5 days."}
Vitals / Bedside Telemetry: ${payload.vitals || "BP: 142/90 mmHg, HR: 88 bpm, SpO2: 95%, Temp: 98.6°F, Glucose: 135 mg/dL"}
Allergies & Known Conditions: ${payload.history || "No known drug allergies. History of borderline hypertension."}

Generate a comprehensive Clinical Encounter Briefing in clean Markdown:

### 1. Sovereign SOAP Clinical Record
- **Subjective (S)**: (Patient history, chief complaint in their own words, timeline of distress)
- **Objective (O)**: (Vitals interpretation, physical findings, bedside examination notes)
- **Assessment (A)**: (Primary clinical working diagnosis with ICD-10 suggestions, triage acuity rating [Emergent / Urgent / Stable], and differential risk vectors)
- **Plan (P)**: (Immediate stabilization, medication orders with exact dosages, non-invasive monitoring, and 48-hour clinical reassessment)

### 2. Tangible Patient Pocket Care Guide (Plain Language for the Human Patient)
- **What Is Happening In Plain Words**: (Empathetic, clear, non-jargon explanation of their condition)
- **What You Must Do Today & Tomorrow**: (Exact numbered steps the patient or family can take right now)
- **Daily Medication & Hydration Timetable**: (Morning, Noon, Evening clear schedule)
- **Whole-Person Nutrition & Clean Sustenance**: (Anti-inflammatory foods, hydration recommendations, sodium control)
- **Emergency Red Flags (When to Return Immediately or Call 911)**: (Specific bullet points of dangerous warning symptoms)

### 3. Community Care Circle Directive
- Assigned Neighborhood / Family Health Ambassador check-in schedule within 24 hours.`;
    } else if (mode === "voice_scribe") {
      systemInstruction =
        "You are the Sovereign Clinical Scribe and Edge NLP Intelligence Engine for Stratum Clinical Edge. You specialize in real-time dictation analysis, extracting structured SOAP notes (Subjective, Objective, Assessment, Plan), normalizing vital signs, and assigning precise ICD-10 diagnostic coding with triage urgency levels. Return ONLY a valid JSON object matching the requested schema with no extra commentary.";
      prompt = `Extract structured clinical SOAP and vitals from this raw dictation or clinical text:
"${payload.transcript || payload.notes || ""}"

Respond with ONLY raw JSON matching this exact structure:
{
  "chiefComplaint": "Short 1-line chief complaint",
  "subjective": "Detailed narrative of patient history, reported symptoms, timeline",
  "objective": "Detailed physical findings, vitals summary, and exam telemetry",
  "assessment": "Clinical diagnostic impression and differential",
  "plan": "Immediate interventions, medications, monitoring, follow-up",
  "vitals": {
    "bp": "e.g. 120/80 mmHg",
    "hr": "e.g. 76 bpm",
    "spo2": "e.g. 98%",
    "temp": "e.g. 98.6°F",
    "rr": "e.g. 16 breaths/min"
  },
  "suggestedIcd10": [
    {"code": "ICD10_CODE", "title": "Diagnostic description"}
  ],
  "urgencyLevel": 1
}
Note: urgencyLevel is an integer: 1 (Resuscitation/Emergent), 2 (Emergent), 3 (Urgent), 4 (Semi-urgent), 5 (Non-urgent).`;
    } else {
      return NextResponse.json({ error: "Unsupported operation mode" }, { status: 400 });
    }

    let response;
    let retries = 3;
    while (retries > 0) {
      try {
        response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: prompt,
          config: {
            systemInstruction,
            temperature: 0.2,
          },
        });
        break;
      } catch (error: any) {
        if (error.status === 503 && retries > 1) {
          retries--;
          await delay(2000 * (4 - retries)); // 2s, 4s, 6s delay
          continue;
        }
        throw error;
      }
    }

    const text = response?.text || "Diagnostic compilation failed due to empty response.";
    return NextResponse.json({ text });
  } catch (error: any) {
    console.error("Gemini Proxy Route Error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
