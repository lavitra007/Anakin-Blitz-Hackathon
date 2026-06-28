import { LabValue } from "../ocr/medical-parser";

export type RiskLevel = "Routine" | "Priority" | "Urgent" | "Emergency";

export interface RiskEvaluation {
  riskLevel: RiskLevel;
  score: number; // 0 to 100
  factors: string[];
  recommendations: string[];
  monitoringInterval: string;
}

/**
 * Evaluates clinical risk based on patient conditions and lab parameters
 */
export function evaluatePatientRisk(
  conditions: string[],
  labs: LabValue[],
  pregnancyWeeks?: number
): RiskEvaluation {
  let score = 10; // Base score
  const factors: string[] = [];
  const recommendations: string[] = [];

  // Analyze Pregnancy status
  if (pregnancyWeeks) {
    factors.push(`Gestational status: Week ${pregnancyWeeks}`);
    score += 15;
    
    if (pregnancyWeeks >= 28) {
      factors.push("Third trimester entry (increased physiological demands)");
      score += 10;
    }
  }

  // Analyze Conditions
  const hasGDM = conditions.some(c => c.toLowerCase().includes("gestational diabetes") || c.toLowerCase().includes("gdm"));
  const hasAnemia = conditions.some(c => c.toLowerCase().includes("anemia"));

  if (hasGDM) {
    factors.push("Active Gestational Diabetes Mellitus (GDM)");
    score += 25;
    recommendations.push("Maintain tight postprandial glucose tracking (<140 mg/dL).");
    recommendations.push("Ensure medical nutrition therapy (MNT) compliance.");
  }

  if (hasAnemia) {
    factors.push("Active Gestational Anemia");
    score += 15;
    recommendations.push("Optimize oral iron supplementation (with Vitamin C, avoid taking with calcium).");
    recommendations.push("Recheck hemoglobin levels in 4 weeks.");
  }

  // Analyze Labs
  for (const lab of labs) {
    if (lab.isHigh) {
      if (lab.testName.toLowerCase().includes("glucose, fasting") && lab.result > 100) {
        factors.push(`Fasting hyperglycemia: ${lab.result} mg/dL (Target < 95)`);
        score += 20;
      }
      if (lab.testName.toLowerCase().includes("post-meal") && lab.result > 140) {
        factors.push(`Postprandial hyperglycemia: ${lab.result} mg/dL (Target < 140)`);
        score += 15;
      }
      if (lab.testName.toLowerCase().includes("hba1c") && lab.result >= 6.0) {
        factors.push(`HbA1c elevated: ${lab.result}% (Impaired long-term control)`);
        score += 10;
      }
    }
    if (lab.isLow) {
      if (lab.testName.toLowerCase().includes("hemoglobin") && lab.result < 11.0) {
        factors.push(`Low Hemoglobin: ${lab.result} g/dL (Target > 11.0 in 2nd/3rd trimester)`);
        score += 15;
      }
    }
  }

  // Determine Risk Tier
  let riskLevel: RiskLevel = "Routine";
  let monitoringInterval = "Routine (every 4 weeks)";

  if (score >= 85) {
    riskLevel = "Emergency";
    monitoringInterval = "Immediate medical intervention required";
    recommendations.push("Go to the nearest emergency department or contact your OBGYN immediately.");
  } else if (score >= 60) {
    riskLevel = "Urgent";
    monitoringInterval = "Frequent (weekly tracking + immediate OBGYN consult)";
    recommendations.push("Urgent OBGYN review for pharmacological management adjustments (consider insulin initiation).");
  } else if (score >= 35) {
    riskLevel = "Priority";
    monitoringInterval = "Bi-weekly tracking";
    recommendations.push("Lifestyle and dietary adjustments with regular SMBG tracking.");
  } else {
    recommendations.push("Continue routine prenatal care and standard dietary guidelines.");
  }

  return {
    riskLevel,
    score: Math.min(score, 100),
    factors,
    recommendations,
    monitoringInterval
  };
}
