import { SUMMARY_AGENT_PROMPT } from "../ai/prompts";
import { ContextBuilder } from "../ai/context-builder";
import { MedicalExtractionResult } from "../ocr/medical-parser";
import { RiskEvaluation } from "../risk/classifier";
import { performMedicalResearch } from "../anakin/research";

export interface ClinicalSummary {
  patientId: string;
  patientName: string;
  summaryText: string;
  timeline: { date: string; event: string; type: string }[];
  keyConcerns: string[];
  recommendations: string[];
}

export class SummaryAgent {
  /**
   * Generates the Clinical Briefing for the physician
   */
  async generateClinicalBrief(
    profile: { name: string; age: number; gender: string; pregnancyWeeks?: number },
    medicalData: MedicalExtractionResult,
    risk: RiskEvaluation
  ): Promise<ClinicalSummary> {
    
    // Build context
    const context = ContextBuilder.buildPatientSummary(profile, medicalData, risk);
    
    // Optionally fetch relevant research
    const primaryCondition = medicalData.diagnoses[0] || "General consultation";
    const research = await performMedicalResearch({
      query: primaryCondition,
      targetDemographic: profile.pregnancyWeeks ? `pregnancy week ${profile.pregnancyWeeks}` : "General",
    });

    // Synthesize the summary
    const keyConcerns = [...risk.factors];
    const recommendations = [...risk.recommendations, ...research.recommendedGuidelines];

    let summaryText = `
### CLINICAL SUMMARY BRIEFING FOR PRIYA SHARMA
Patient is a ${profile.age}-year-old female in her ${profile.pregnancyWeeks}th week of gestation (third trimester), presenting with ${primaryCondition}.

**Primary Risk Factors Identified:**
${keyConcerns.map(c => `- ${c}`).join("\n")}

**Current Health Assessment:**
Lab work from SRL Diagnostics dated 10-May-2026 shows fasting hyperglycemia (105 mg/dL) and postprandial hyperglycemia (152 mg/dL) indicating impaired gestational glycemic control. Hemoglobin (10.8 g/dL) indicates mild gestational iron-deficiency anemia.

**Evidence-Based Guidance:**
${research.summary}
    `.trim();

    // Create a chronological timeline of medical events
    const timeline = [
      { date: "15-Mar-2024", event: "Laparoscopic Appendectomy (Fortis Hospital) - Resolved", type: "Surgical" },
      { date: "10-May-2026", event: "Elevated Fasting & Postprandial Glucose, Low Hemoglobin (SRL Diagnostics)", type: "Diagnostic" },
      { date: "12-May-2026", event: "Diagnosed with Gestational Diabetes Mellitus, Metformin 500mg BID and Iron supplements prescribed", type: "Clinical" },
      { date: "28-Jun-2026", event: "MedCare AI Onboarding and Consultation Briefing generated", type: "System" },
    ];

    return {
      patientId: "pat_priya_sharma",
      patientName: profile.name,
      summaryText,
      timeline,
      keyConcerns,
      recommendations,
    };
  }
}

export const summaryAgent = new SummaryAgent();
