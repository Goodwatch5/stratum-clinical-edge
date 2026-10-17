import { NextRequest, NextResponse } from "next/server";
import { verifyMachineAttestation, InTotoAttestationStatement } from "@/lib/attestation-engine";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as InTotoAttestationStatement;
    if (!body || body._type !== "https://in-toto.io/Statement/v1") {
      return NextResponse.json(
        { verified: false, error: "Invalid In-Toto Statement schema: missing or invalid _type" },
        { status: 400 }
      );
    }

    const verification = verifyMachineAttestation(body);
    return NextResponse.json(verification, { status: verification.verified ? 200 : 422 });
  } catch (err: unknown) {
    return NextResponse.json(
      { verified: false, error: err instanceof Error ? err.message : "Machine verification failed" },
      { status: 500 }
    );
  }
}
