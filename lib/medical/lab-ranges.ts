export interface LabThresholds {
  min?: number;
  max?: number;
  unit: string;
  significance: string;
}

export const LAB_RANGES: Record<string, LabThresholds> = {
  "Glucose, Fasting": {
    max: 95,
    unit: "mg/dL",
    significance: "Fasting blood sugar. Level >= 95 mg/dL suggests Gestational Diabetes."
  },
  "Glucose, 2 Hours Post-Meal": {
    max: 140,
    unit: "mg/dL",
    significance: "Post-prandial sugar. Level >= 140 mg/dL suggests impaired tolerance."
  },
  "HbA1c": {
    max: 5.6,
    unit: "%",
    significance: "Glycated Hemoglobin. 5.7 - 6.4% indicates pre-diabetes / impaired gestational tolerance."
  },
  "Hemoglobin": {
    min: 11.0,
    unit: "g/dL",
    significance: "Hemoglobin level. In pregnancy, <11.0 g/dL signifies gestational anemia."
  },
  "Serum Iron": {
    min: 50,
    max: 170,
    unit: "mcg/dL",
    significance: "Serum iron storage levels."
  }
};
