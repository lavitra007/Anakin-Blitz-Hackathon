import { NextResponse } from "next/server";
import { orchestrator } from "@/lib/ai/orchestrator";

export async function POST(request: Request) {
  try {
    const { messages, extract = false } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages parameter" }, { status: 400 });
    }

    if (extract) {
      const extractedData = await orchestrator.extractIntake(messages);
      return NextResponse.json({ success: true, data: extractedData });
    }

    const responseText = await orchestrator.intakeChat(messages);
    return NextResponse.json({ success: true, response: responseText });
  } catch (error: any) {
    console.error("Intake chat API error:", error);
    return NextResponse.json({ error: "Failed to generate reply", details: error.message }, { status: 500 });
  }
}
