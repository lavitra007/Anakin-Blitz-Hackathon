import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "MedCare Backend",
    version: "0.1.0"
  });
}
