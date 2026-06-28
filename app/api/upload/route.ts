import { NextResponse } from "next/server";
import { extractRawText } from "@/lib/ocr/extractor";
import { normalizeText } from "@/lib/ocr/parser";
import { extractMedicalEntities } from "@/lib/ocr/medical-parser";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    // 1. Validate empty uploads
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // 2. Validate file type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Unsupported file type: ${file.type}. Only PDF, PNG, JPG, and JPEG are supported.` }, 
        { status: 415 }
      );
    }

    // 3. Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File exceeds 10MB size limit." }, { status: 413 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 4. Extract raw text
    let rawText = "";
    try {
      rawText = await extractRawText(buffer, file.type);
    } catch (ocrError: any) {
      return NextResponse.json({ error: "OCR extraction failed.", details: ocrError.message }, { status: 422 });
    }

    // 5. Clean OCR output
    let cleanedText = "";
    try {
      cleanedText = normalizeText(rawText);
    } catch (parseError: any) {
      return NextResponse.json({ error: "Text normalization failed.", details: parseError.message }, { status: 422 });
    }

    // 6. Extract structured medical entities
    let extractionResult;
    try {
      extractionResult = extractMedicalEntities(cleanedText);
    } catch (extractionError: any) {
      return NextResponse.json({ error: "Medical entity extraction failed.", details: extractionError.message }, { status: 422 });
    }

    // Return the required structured JSON
    return NextResponse.json(extractionResult, { status: 200 });

  } catch (error: any) {
    console.error("Upload API error:", error);
    return NextResponse.json({ error: "Internal server error during upload processing", details: error.message }, { status: 500 });
  }
}
