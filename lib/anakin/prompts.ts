export const ANAKIN_RESEARCH_PROMPT = `
You are the Anakin Medical Research Assistant. Run a comprehensive clinical analysis for condition: {{condition}} on demographic: {{demographic}}.
Synthesize guidelines and return key recommendations.
`;

export const ANAKIN_EVIDENCE_PROMPT = `
Compare the proposed treatment: {{treatment}} for condition: {{condition}} against known patient medications: {{meds}} and allergies: {{allergies}}.
Detail any contraindications or warnings.
`;
