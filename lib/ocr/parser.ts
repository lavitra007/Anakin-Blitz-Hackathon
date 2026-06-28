export interface StructuredSection {
  title: string;
  content: string;
}

export interface GeneralParsedDocument {
  date: string | null;
  hospital: string | null;
  physicianName: string | null;
  patientName: string | null;
  sections: StructuredSection[];
  rawText: string;
}

/**
 * Parses raw document text into generic structured parts
 */
export function parseRawDocumentText(text: string): GeneralParsedDocument {
  const lines = text.split("\n");
  
  let date: string | null = null;
  let hospital: string | null = null;
  let physicianName: string | null = null;
  let patientName: string | null = null;
  
  const sections: StructuredSection[] = [];
  let currentSection: StructuredSection | null = null;

  // Simple patterns
  const dateRegex = /(?:date|dated)\s*:\s*([\w\d\s,-]+)/i;
  const patientRegex = /patient\s*(?:name)?\s*:\s*([\w\s]+)/i;
  const doctorRegex = /(?:doctor|dr\.|physician|ref\s+by)\s*:\s*([\w\s.]+)/i;
  const hospitalNames = ["apollo", "fortis", "max", "srl", "manipal"];

  for (let line of lines) {
    line = line.trim();
    if (!line) continue;

    // Detect Metadata
    if (!date) {
      const dateMatch = line.match(dateRegex);
      if (dateMatch) date = dateMatch[1].trim();
    }
    
    if (!patientName) {
      const patientMatch = line.match(patientRegex);
      if (patientMatch) patientName = patientMatch[1].trim();
    }

    if (!physicianName) {
      const docMatch = line.match(doctorRegex);
      if (docMatch) physicianName = docMatch[1].trim();
    }

    if (!hospital) {
      for (const name of hospitalNames) {
        if (line.toLowerCase().includes(name)) {
          hospital = line;
          break;
        }
      }
    }

    // Detect Section Headings (ALL CAPS or ending with colon)
    const isHeading = 
      (line.toUpperCase() === line && line.length > 3 && line.length < 30) ||
      (line.endsWith(":") && line.length < 40 && !line.includes("http"));

    if (isHeading) {
      if (currentSection) {
        sections.push(currentSection);
      }
      currentSection = {
        title: line.replace(/:$/, "").trim(),
        content: "",
      };
    } else {
      if (currentSection) {
        currentSection.content += line + "\n";
      } else {
        // Create an initial preamble section if text appears before headings
        currentSection = {
          title: "Introduction",
          content: line + "\n",
        };
      }
    }
  }

  if (currentSection) {
    sections.push(currentSection);
  }

  return {
    date: date || new Date().toLocaleDateString("en-IN"),
    hospital: hospital || "Unknown Facility",
    physicianName: physicianName || "Unknown Clinician",
    patientName: patientName || "Priya Sharma",
    sections: sections.map(s => ({ ...s, content: s.content.trim() })),
    rawText: text,
  };
}
