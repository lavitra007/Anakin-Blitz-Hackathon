/**
 * Cleans and normalizes raw OCR output.
 * Removes duplicate spaces, broken line breaks, OCR artifacts, and unreadable characters.
 */
export function normalizeText(rawText: string): string {
  if (!rawText) return "";

  let cleaned = rawText;

  // 1. Remove non-printable / unreadable characters (keep standard ASCII and newlines)
  cleaned = cleaned.replace(/[^\x20-\x7E\n\r]/g, " ");

  // 2. Remove common OCR artifacts (isolated punctuation marks often misread by OCR)
  cleaned = cleaned.replace(/ (\||\[|\]|\{|\}|\*|_|~|\^|`|\\) /g, " ");

  // 3. Remove duplicate spaces and tabs
  cleaned = cleaned.replace(/[ \t]+/g, " ");

  // 4. Clean up broken line breaks (trim each line)
  const lines = cleaned.split(/\r?\n/);
  const trimmedLines = lines.map(line => line.trim());
  
  // 5. Remove empty lines that are just artifacts, collapse multiple newlines
  const validLines = trimmedLines.filter(line => line.length > 0);
  
  // Join back together with a single newline
  cleaned = validLines.join('\n');

  return cleaned.trim();
}

// ============================================================================
// LEGACY COMPATIBILITY WRAPPERS
// ============================================================================
export function parseRawDocumentText(rawText: string): any {
  // Stub for backward compatibility with document-agent.ts 
  return { date: "" };
}
