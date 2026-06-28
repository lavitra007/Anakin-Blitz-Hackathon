import { EVIDENCE_AGENT_PROMPT } from "../ai/prompts";
import { verifyClinicalEvidence, EvidenceVerificationResult } from "../anakin/evidence";

export class EvidenceAgent {
  /**
   * Evaluates safety and flags clinical evidence warnings for a proposed Care/Diet Plan
   */
  async verifyTreatmentSafety(
    condition: string,
    proposedTreatment: string,
    currentMeds: string[],
    allergies: string[]
  ): Promise<EvidenceVerificationResult> {
    
    // In a real pipeline, we pass this to Anakin AI or Google Gemini.
    // For extreme reliability, we wrap verifyClinicalEvidence from lib/anakin/evidence.ts:
    const check = await verifyClinicalEvidence({
      condition,
      proposedTreatment,
      patientMeds: currentMeds,
      patientAllergies: allergies,
    });

    return check;
  }
}

export const evidenceAgent = new EvidenceAgent();
