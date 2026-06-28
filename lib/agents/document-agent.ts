import { extractTextFromDocument } from "../ocr/extractor";
import { parseRawDocumentText } from "../ocr/parser";
import { parseMedicalDetails, MedicalExtractionResult } from "../ocr/medical-parser";

export interface RedactedPIIEntity {
  id: string;
  type: string;
  value: string;
  start: number;
  end: number;
  confidence: number;
  redacted_as: string;
  status: "approved" | "pending";
}

export interface ProcessedDocument {
  id: string;
  fileName: string;
  category: string;
  date: string;
  status: "APPROVED" | "NEEDS_REVIEW";
  rawText: string;
  redactedText: string;
  entities: RedactedPIIEntity[];
  mapping: Record<string, string>;
  medicalData: MedicalExtractionResult;
  averageConfidence: number;
}

const PII_PATTERNS = [
  { regex: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, type: "AADHAAR", confidence: 0.99, prefix: "REDACTED_AADHAAR" },
  { regex: /\b[\w.+-]+@[\w-]+\.[\w.-]+\b/g, type: "EMAIL", confidence: 0.97, prefix: "REDACTED_EMAIL" },
  { regex: /\b(?:\+91[\s-]?)?[6-9]\d{9}\b/g, type: "PHONE_NUMBER", confidence: 0.95, prefix: "REDACTED_PHONE" },
  { regex: /\b(?:MRN|UHID|Reg(?:\.|istration)?\s*No\.?)[:\s]*([A-Z0-9-]{4,})\b/gi, type: "MEDICAL_ID", confidence: 0.93, prefix: "REDACTED_MEDICAL_ID" },
  { regex: /\bDr\.?\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?/g, type: "DOCTOR_NAME", confidence: 0.81, prefix: "REDACTED_DOCTOR" },
  { regex: /\b[A-Z][a-z]+\s+[A-Z][a-z]+\b/g, type: "PERSON_NAME", confidence: 0.82, prefix: "REDACTED_NAME" },
  { regex: /\b\d{1,3}[,/]?\s?[A-Z][a-z]+\s(?:Road|Street|Nagar|Layout|Colony|Marg)\b/g, type: "ADDRESS", confidence: 0.74, prefix: "REDACTED_ADDRESS" }
];

export class DocumentAgent {
  /**
   * Run the full ingestion, OCR, structuring, and PII redaction pipeline
   */
  async ingestDocument(
    file: File | Blob,
    fileName: string,
    category: string,
    redactionLevel: "strict" | "moderate" = "strict"
  ): Promise<ProcessedDocument> {
    // 1. OCR Text Extraction
    const ocrResult = await extractTextFromDocument(file, fileName);
    
    // 2. Structuring and General Parsing
    const parsedDoc = parseRawDocumentText(ocrResult.text);

    // 3. Medical Entity Extraction
    const medicalData = parseMedicalDetails(ocrResult.text);

    // 4. PII Detection (Anonymization)
    const entities: RedactedPIIEntity[] = [];
    const counters: Record<string, number> = {};
    const taken: [number, number][] = [];
    const mapping: Record<string, string> = {};

    for (const pattern of PII_PATTERNS) {
      if (redactionLevel === "moderate" && pattern.type === "DOCTOR_NAME") {
        continue;
      }

      pattern.regex.lastIndex = 0;
      let match;

      while ((match = pattern.regex.exec(ocrResult.text)) !== null) {
        const start = match.index;
        const end = pattern.regex.lastIndex;
        const value = match[0];

        const isOverlapping = taken.some(span => start < span[1] && end > span[0]);
        if (isOverlapping) continue;

        taken.push([start, end]);
        counters[pattern.type] = (counters[pattern.type] || 0) + 1;
        const redactedAs = `[${pattern.prefix}_${counters[pattern.type]}]`;

        entities.push({
          id: `e_${Math.random().toString(36).substring(2, 8)}`,
          type: pattern.type,
          value: value,
          start,
          end,
          confidence: pattern.confidence,
          redacted_as: redactedAs,
          status: pattern.confidence >= 0.90 ? "approved" : "pending",
        });
      }
    }

    entities.sort((a, b) => a.start - b.start);

    // 5. Apply auto-redaction for high-confidence entities (> 0.90)
    let redactedText = ocrResult.text;
    const sortedForRedaction = [...entities].sort((a, b) => b.start - a.start);

    for (const ent of sortedForRedaction) {
      mapping[ent.redacted_as] = ent.value;
      if (ent.confidence >= 0.90) {
        redactedText = redactedText.substring(0, ent.start) + ent.redacted_as + redactedText.substring(ent.end);
      }
    }

    const hasPendingReview = entities.some(e => e.status === "pending");
    const status = hasPendingReview ? "NEEDS_REVIEW" : "APPROVED";
    
    const piiCount = entities.length;
    const avgConf = piiCount > 0
      ? parseFloat((entities.reduce((sum, e) => sum + e.confidence, 0) / piiCount * 100).toFixed(1))
      : 100.0;

    return {
      id: `doc_${Math.random().toString(36).substring(2, 11)}`,
      fileName,
      category,
      date: parsedDoc.date || new Date().toLocaleDateString("en-IN"),
      status,
      rawText: ocrResult.text,
      redactedText,
      entities,
      mapping,
      medicalData,
      averageConfidence: avgConf,
    };
  }
}

export const documentAgent = new DocumentAgent();
