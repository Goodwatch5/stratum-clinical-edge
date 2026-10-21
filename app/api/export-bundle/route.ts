import { NextResponse, NextRequest } from "next/server";
import { execSync } from "child_process";

export async function GET(request: NextRequest) {
  try {
    const format = request.nextUrl.searchParams.get("format") || "zip";
    const isZip = format === "zip";
    const archiveFormat = isZip ? "zip" : "tar.gz";
    const filename = isZip ? "stratum-clinical-edge.zip" : "stratum-clinical-edge.tar.gz";
    const contentType = isZip ? "application/zip" : "application/gzip";

    const buffer = execSync(`git archive --format=${archiveFormat} --prefix=stratum-clinical-edge/ HEAD`, {
      maxBuffer: 50 * 1024 * 1024,
    });

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
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
