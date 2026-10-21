import { NextResponse } from "next/server";
import { getAttestationAuthorityKeys } from "@/lib/attestation-engine";

export async function GET() {
  try {
    const { publicKey } = getAttestationAuthorityKeys();
    return NextResponse.json(
      {
        keyAlgorithm: "ECDSA-P256-SHA256",
        keyFormat: "SPKI-PEM",
        publicKeyPem: publicKey,
        authorityId: "stratum-clinical-edge.authority@0.1.0",
        issuedAt: new Date().toISOString(),
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, max-age=3600",
        },
      }
    );
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to retrieve public key" },
      { status: 500 }
    );
  }
}
