export interface PatientProfile {
  name: string;
  age: number;
  gender: string;
  pregnancyWeeks?: number;
}

export interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface LabValue {
  testName: string;
  result: number;
  unit: string;
  referenceRange: string;
  isHigh: boolean;
  isLow: boolean;
  clinicalSignificance: string;
}

export interface MedicationRegimen {
  drugName: string;
  dosage: string;
  frequency: string;
  duration?: string;
  instructions?: string;
}
