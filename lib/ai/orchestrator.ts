import { intakeAgent, IntakeData } from "../agents/intake-agent";
import { documentAgent, ProcessedDocument } from "../agents/document-agent";
import { evidenceAgent } from "../agents/evidence-agent";
import { summaryAgent, ClinicalSummary } from "../agents/summary-agent";
import { physicianAgent } from "../agents/physician-agent";
import { evaluatePatientRisk, RiskEvaluation } from "../risk/classifier";
import { LabValue, MedicalExtractionResult } from "../ocr/medical-parser";
import { EvidenceVerificationResult } from "../anakin/evidence";

export class AIOrchestrator {
  /**
   * Run the Intake Agent conversation step
   */
  async intakeChat(messages: { role: string; content: string }[]): Promise<string> {
    return await intakeAgent.chat(messages);
  }

  /**
   * Extract patient intake data from conversation
   */
  async extractIntake(messages: { role: string; content: string }[]): Promise<IntakeData> {
    return await intakeAgent.extractIntakeData(messages);
  }

  /**
   * Run the Document Agent on an uploaded file
   */
  async ingestDocument(
    file: File | Blob,
    fileName: string,
    category: string,
    redactionLevel?: "strict" | "moderate"
  ): Promise<ProcessedDocument> {
    return await documentAgent.ingestDocument(file, fileName, category, redactionLevel);
  }

  /**
   * Evaluate patient risk level based on clinical parameters
   */
  evaluateRisk(
    conditions: string[],
    labs: LabValue[],
    pregnancyWeeks?: number
  ): RiskEvaluation {
    return evaluatePatientRisk(conditions, labs, pregnancyWeeks);
  }

  /**
   * Run the Evidence Agent to verify care plan safety
   */
  async checkTreatmentSafety(
    condition: string,
    treatment: string,
    currentMeds: string[],
    allergies: string[]
  ): Promise<EvidenceVerificationResult> {
    return await evidenceAgent.verifyTreatmentSafety(condition, treatment, currentMeds, allergies);
  }

  /**
   * Run the Summary Agent to synthesize a comprehensive Clinical Briefing
   */
  async generateClinicalBrief(
    profile: { name: string; age: number; gender: string; pregnancyWeeks?: number },
    medicalData: MedicalExtractionResult,
    risk: RiskEvaluation
  ): Promise<ClinicalSummary> {
    return await summaryAgent.generateClinicalBrief(profile, medicalData, risk);
  }

  /**
   * Run the Physician Agent to assist the doctor with queries
   */
  async physicianConsult(
    query: string,
    profile: { name: string; age: number; gender: string; pregnancyWeeks?: number },
    medicalData: MedicalExtractionResult,
    risk: RiskEvaluation,
    history: { role: string; content: string }[] = []
  ): Promise<string> {
    return await physicianAgent.consult(query, profile, medicalData, risk, history);
  }
}

export const orchestrator = new AIOrchestrator();
