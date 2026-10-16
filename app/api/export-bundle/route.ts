import { NextResponse } from "next/server";
import { execSync } from "child_process";

export async function GET() {
  try {
    // Generate clean archive stream directly from git HEAD with dedicated folder wrapper
    const buffer = execSync("git archive --format=tar.gz --prefix=stratum-clinical-edge/ HEAD", {
      maxBuffer: 50 * 1024 * 1024,
    });

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/gzip",
        "Content-Disposition": 'attachment; filename="stratum-clinical-edge.tar.gz"',
        "Content-Length": buffer.length.toString(),
        "Cache-Control": "no-cache",
      },
    });
  } catch (error: any) {
    console.error("Export bundle stream error:", error);
    return NextResponse.json(
      { error: "Failed to generate release bundle archive", details: error.message },
      { status: 500 }
    );
  }
}
