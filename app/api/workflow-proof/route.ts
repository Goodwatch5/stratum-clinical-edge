import { NextResponse } from "next/server";
import { runCompleteProductionWorkflowProof } from "@/lib/workflow-proof";

export async function GET() {
  try {
    const proof = await runCompleteProductionWorkflowProof();
    return NextResponse.json(proof, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json(
      { status: "ERROR", message },
      { status: 500 }
    );
  }
}
