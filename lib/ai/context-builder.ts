import { MedicalExtractionResult, MedicationRegimen, LabValue } from "../ocr/medical-parser";
import { RiskEvaluation } from "../risk/classifier";

/**
 * Helper to build text context for LLM agents from structured medical data
 */
export class ContextBuilder {
  static buildPatientSummary(
    profile: { name: string; age: number; gender: string; pregnancyWeeks?: number },
    medicalData: MedicalExtractionResult,
    risk: RiskEvaluation
  ): string {
    let context = `=== PATIENT DEMOGRAPHICS ===\n`;
    context += `Name: ${profile.name}\n`;
    context += `Age: ${profile.age}\n`;
    context += `Gender: ${profile.gender}\n`;
    if (profile.pregnancyWeeks) {
      context += `Gestational Status: Week ${profile.pregnancyWeeks} (Trimester ${Math.ceil(profile.pregnancyWeeks / 13)})\n`;
    }
    context += `\n`;

    context += `=== CLINICAL RISK EVALUATION ===\n`;
    context += `Risk Level: ${risk.riskLevel} (Score: ${risk.score}/100)\n`;
    context += `Risk Factors:\n${risk.factors.map(f => `- ${f}`).join("\n")}\n`;
    context += `Monitoring Recommendation: ${risk.monitoringInterval}\n\n`;

    context += `=== DIAGNOSES / ISSUES ===\n`;
    context += medicalData.diagnoses.map(d => `- ${d}`).join("\n") + "\n\n";

    context += `=== ALLERGIES ===\n`;
    if (medicalData.allergies.length > 0) {
      context += medicalData.allergies.map(a => `- ${a}`).join("\n") + "\n\n";
    } else {
      context += `- No known allergies (NKDA)\n\n`;
    }

    context += `=== CURRENT REGIMEN / MEDICATIONS ===\n`;
    if (medicalData.medications.length > 0) {
      context += medicalData.medications.map(m => 
        `- ${m.drugName} ${m.dosage} - ${m.frequency}${m.instructions ? ` (${m.instructions})` : ""}`
      ).join("\n") + "\n\n";
    } else {
      context += `- No current medications active\n\n`;
    }

    context += `=== LABORATORY VALUES ===\n`;
    if (labsToText(medicalData.labs)) {
      context += labsToText(medicalData.labs) + "\n";
    } else {
      context += `- No recent labs parsed\n\n`;
    }

    return context;
  }

  static buildConversationHistory(messages: { role: string; content: string }[]): string {
    return messages
      .map(msg => `${msg.role.toUpperCase()}: ${msg.content}`)
      .join("\n\n");
  }
}

function labsToText(labs: LabValue[]): string {
  if (labs.length === 0) return "";
  return labs.map(l => {
    let flag = "";
    if (l.isHigh) flag = " [HIGH]";
    if (l.isLow) flag = " [LOW]";
    return `- ${l.testName}: ${l.result} ${l.unit} (Ref Range: ${l.referenceRange})${flag}\n  Significance: ${l.clinicalSignificance}`;
  }).join("\n");
}
