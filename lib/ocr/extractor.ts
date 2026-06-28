import pdfParse from 'pdf-parse';
import Tesseract from 'tesseract.js';

/**
 * Extracts raw text from a medical report (PDF or Image).
 * Handles OCR failures and detection of file type.
 */
export async function extractRawText(buffer: Buffer, mimeType: string): Promise<string> {
  if (mimeType === 'application/pdf') {
    try {
      const data = await pdfParse(buffer);
      return data.text || '';
    } catch (error) {
      console.error("PDF extraction failed:", error);
      throw new Error("Failed to parse PDF document.");
    }
  } else if (
    mimeType === 'image/png' || 
    mimeType === 'image/jpeg' || 
    mimeType === 'image/jpg'
  ) {
    try {
      const { data: { text } } = await Tesseract.recognize(buffer, 'eng');
      return text || '';
    } catch (error) {
      console.error("Image OCR failed:", error);
      throw new Error("Failed to run OCR on image.");
    }
  } else {
    throw new Error(`Unsupported file type: ${mimeType}. Only PDF, PNG, JPG, and JPEG are supported.`);
  }
}

// ============================================================================
// LEGACY COMPATIBILITY WRAPPERS
// ============================================================================
export async function extractTextFromDocument(file: any, fileName: string): Promise<{ text: string }> {
  // Stub for backward compatibility with document-agent.ts 
  // It won't actually perform OCR as Phase 2 uses the POST /api/upload endpoint exclusively.
  return { text: "Legacy extraction stub" };
}
