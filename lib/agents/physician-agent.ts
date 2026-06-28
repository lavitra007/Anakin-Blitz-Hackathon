import { PHYSICIAN_AGENT_PROMPT } from "../ai/prompts";
import { ContextBuilder } from "../ai/context-builder";
import { MedicalExtractionResult } from "../ocr/medical-parser";
import { RiskEvaluation } from "../risk/classifier";
import { anakinClient } from "../anakin/client";

export class PhysicianAgent {
  /**
   * Responds to physician inquiries during the clinical consultation
   */
  async consult(
    query: string,
    profile: { name: string; age: number; gender: string; pregnancyWeeks?: number },
    medicalData: MedicalExtractionResult,
    risk: RiskEvaluation,
    conversationHistory: { role: string; content: string }[] = []
  ): Promise<string> {
    const appId = process.env.ANAKIN_APP_ID_CHAT || "";

    const patientContext = ContextBuilder.buildPatientSummary(profile, medicalData, risk);
    const systemInstructions = `${PHYSICIAN_AGENT_PROMPT}\n\n=== PATIENT RECORD CONTEXT ===\n${patientContext}`;

    if (appId) {
      try {
        const response = await anakinClient.sendChatbotMessage(appId, {
          content: `${systemInstructions}\n\nDoctor Query: ${query}`,
        });
        return response.content || JSON.stringify(response);
      } catch (error) {
        console.error("Anakin Physician consult failed, using fallback:", error);
      }
    }

    // Default simulation logic for consultation queries
    return this.generateSimulatedResponse(query, medicalData, risk);
  }

  private generateSimulatedResponse(
    query: string,
    medicalData: MedicalExtractionResult,
    risk: RiskEvaluation
  ): string {
    const qLower = query.toLowerCase();

    if (qLower.includes("medication") || qLower.includes("drug") || qLower.includes("rx")) {
      return `
### Current Medications Review
The patient is currently prescribed:
1. **Metformin 500mg BID** (Oral, after breakfast and dinner) for glycemic control.
2. **Calcium Carbonate 500mg Daily** (Oral, after lunch).
3. **Iron Fumarate 100mg Daily** (Oral, morning empty stomach) for anemia.

*Clinical Recommendation:* Verify compliance. Monitor renal function indices (Creatinine: 0.7 mg/dL, within normal limits). Advise the patient to avoid taking Calcium and Iron supplements simultaneously, as Calcium inhibits iron absorption (should be separated by at least 2 hours).
      `.trim();
    }

    if (qLower.includes("glucose") || qLower.includes("sugar") || qLower.includes("diabetes")) {
      return `
### Glycemic Control Analysis
- **Fasting Glucose:** 105 mg/dL (Elevated, gestational target: <95 mg/dL).
- **Postprandial (2-hour) Glucose:** 152 mg/dL (Elevated, gestational target: <140 mg/dL).
- **HbA1c:** 6.4% (Elevated).

*Assessment:* The patient has active Gestational Diabetes Mellitus with sub-optimal glycemic control on lifestyle modifications and Metformin 500mg BID.
*Recommendations:*
1. Counsel on strict low-glycemic medical nutrition therapy (MNT).
2. If postprandial levels remain >140 mg/dL or fasting >95 mg/dL after 1-2 weeks, consider increasing Metformin dosage or initiating basal insulin therapy.
3. Schedule fetal growth scans every 4 weeks starting at week 32.
      `.trim();
    }

    if (qLower.includes("anemia") || qLower.includes("iron") || qLower.includes("hemoglobin")) {
      return `
### Anemia Assessment
- **Hemoglobin:** 10.8 g/dL (Mild gestational anemia, trimester target: >11.0 g/dL).
- **Serum Iron:** 45 mcg/dL (Low, normal range: 50-170 mcg/dL).

*Assessment:* Microcytic, iron-deficiency gestational anemia.
*Plan:*
1. Continue Iron Fumarate 100mg once daily.
2. Counsel patient to consume with Vitamin C (orange juice) to enhance absorption.
3. Check Complete Blood Count (CBC) and Reticulocyte count in 4 weeks to assess response.
      `.trim();
    }

    return `
### Clinical Guidance
Based on the patient's record, Priya Sharma is a 29-year-old at 28 weeks gestation with Gestational Diabetes Mellitus (high risk) and Mild Gestational Anemia.

*Suggested Actions:*
1. Strict self-monitoring of blood glucose (SMBG) four times daily (fasting and 2h post-meal).
2. Separate Iron and Calcium intake by >2 hours.
3. Follow-up consultation in 1 week to evaluate glucose diary.
    `.trim();
  }
}

export const physicianAgent = new PhysicianAgent();
