import { NextResponse } from "next/server";
import { orchestrator } from "@/lib/ai/orchestrator";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      action, // "risk" | "safety"
      conditions, 
      labs, 
      pregnancyWeeks,
      proposedTreatment,
      currentMeds,
      allergies 
    } = body;

    if (action === "safety") {
      const safetyResult = await orchestrator.checkTreatmentSafety(
        conditions?.[0] || "General Consultation",
        proposedTreatment,
        currentMeds || [],
        allergies || []
      );
      return NextResponse.json({ success: true, result: safetyResult });
    }

    // Default to risk evaluation
    const riskResult = orchestrator.evaluateRisk(
      conditions || [],
      labs || [],
      pregnancyWeeks
    );

    return NextResponse.json({ success: true, result: riskResult });
  } catch (error: any) {
    console.error("Analyze API error:", error);
    return NextResponse.json({ error: "Analysis failed", details: error.message }, { status: 500 });
  }
}
