/**
 * Helper to parse unstructured LLM text responses into structured layouts
 */
export interface ParsedAgentResponse {
  mainText: string;
  sections: Record<string, string>;
  lists: Record<string, string[]>;
}

export function parseAgentResponse(text: string): ParsedAgentResponse {
  const sections: Record<string, string> = {};
  const lists: Record<string, string[]> = {};
  
  let currentKey = "general";
  let currentContent: string[] = [];
  
  const lines = text.split("\n");

  for (let line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Check if line represents a markdown heading (e.g. ## Warnings, ### Diet Plan)
    const headingMatch = trimmed.match(/^(?:#+|-+)\s*(.*?)(?::)?$/);
    if (headingMatch && trimmed.startsWith("#")) {
      // Save previous section
      if (currentContent.length > 0) {
        sections[currentKey] = currentContent.join("\n").trim();
        
        // Try extracting lists from content
        const bulletPoints = currentContent
          .filter(l => l.trim().startsWith("-") || l.trim().startsWith("*") || /^\d+\./.test(l.trim()))
          .map(l => l.replace(/^(?:-|\*|\d+\.)\s*/, "").trim());
        if (bulletPoints.length > 0) {
          lists[currentKey] = bulletPoints;
        }
      }
      
      currentKey = headingMatch[1].toLowerCase().replace(/\s+/g, "_");
      currentContent = [];
    } else {
      currentContent.push(line);
    }
  }

  // Save final section
  if (currentContent.length > 0) {
    sections[currentKey] = currentContent.join("\n").trim();
    const bulletPoints = currentContent
      .filter(l => l.trim().startsWith("-") || l.trim().startsWith("*") || /^\d+\./.test(l.trim()))
      .map(l => l.replace(/^(?:-|\*|\d+\.)\s*/, "").trim());
    if (bulletPoints.length > 0) {
      lists[currentKey] = bulletPoints;
    }
  }

  return {
    mainText: text,
    sections,
    lists,
  };
}
