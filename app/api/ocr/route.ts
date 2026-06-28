import { NextResponse } from "next/server";
import { orchestrator } from "@/lib/ai/orchestrator";
import { addRecord } from "@/lib/utils/db";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const category = formData.get("category") as string || "Other";
    const redactionLevel = formData.get("redactionLevel") as "strict" | "moderate" || "strict";

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Call Document Agent via AI Orchestrator
    const processedDoc = await orchestrator.ingestDocument(
      file,
      file.name,
      category,
      redactionLevel
    );

    // Save record to local JSON db
    await addRecord(processedDoc);

    return NextResponse.json({
      success: true,
      record: processedDoc
    });
  } catch (error: any) {
    console.error("OCR API error:", error);
    return NextResponse.json({ error: "Failed to process document", details: error.message }, { status: 500 });
  }
}
