export const MEDICAL_CATEGORIES = [
  "Prescription",
  "Lab Report",
  "Discharge Summary",
  "Other"
];

export const PREGNANCY_RANGES = {
  GLUCOSE_FASTING: { min: 70, max: 95, unit: "mg/dL" },
  GLUCOSE_POSTPRANDIAL: { max: 140, unit: "mg/dL" },
  HEMOGLOBIN: { min: 11.0, max: 15.0, unit: "g/dL" }
};

export const CLINICAL_GUIDELINES = [
  { name: "ACOG Guidelines (Gestational Diabetes)", version: "2025" },
  { name: "ADA Standards of Care", version: "2026" }
];
