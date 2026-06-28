import { NextResponse } from "next/server";
import { performMedicalResearch } from "@/lib/anakin/research";

export async function POST(request: Request) {
  try {
    const { query, medicalField, targetDemographic } = await request.json();

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const researchResult = await performMedicalResearch({
      query,
      medicalField,
      targetDemographic,
    });

    return NextResponse.json({ success: true, result: researchResult });
  } catch (error: any) {
    console.error("Research API error:", error);
    return NextResponse.json({ error: "Research lookup failed", details: error.message }, { status: 500 });
  }
}
