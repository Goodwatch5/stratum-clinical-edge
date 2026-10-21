import { NextRequest, NextResponse } from "next/server";
import { generateMachineAttestation } from "@/lib/attestation-engine";

export async function GET() {
  try {
    const statement = await generateMachineAttestation();
    return NextResponse.json(statement, { status: 200 });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Attestation generation failed" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    let challenge = "";
    try {
      const body = await req.json();
      challenge = typeof body?.challenge === "string" ? body.challenge : "";
    } catch {
      challenge = "";
    }

    const statement = await generateMachineAttestation(challenge || undefined);
    return NextResponse.json(statement, { status: 200 });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Attestation generation failed" },
      { status: 500 }
    );
  }
}
