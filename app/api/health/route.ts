import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      status: "healthy",
      service: "stratum-clinical-edge",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: "0.1.0",
      environment: process.env.NODE_ENV || "development",
    },
    { status: 200 }
  );
}
