export interface DrugInfo {
  category: string;
  pregnancySafety: "Safe" | "Caution" | "Contraindicated";
  alternatives: string[];
  warnings: string[];
}

export const DRUG_DICTIONARY: Record<string, DrugInfo> = {
  metformin: {
    category: "Antidiabetic",
    pregnancySafety: "Safe",
    alternatives: ["Insulin", "Glyburide"],
    warnings: ["Monitor renal function", "May cause GI discomfort"]
  },
  ibuprofen: {
    category: "NSAID",
    pregnancySafety: "Contraindicated",
    alternatives: ["Acetaminophen (Paracetamol)"],
    warnings: ["Contraindicated in third trimester due to risk of premature closure of ductus arteriosus", "Risk of oligohydramnios"]
  },
  aspirin: {
    category: "Antiplatelet",
    pregnancySafety: "Caution",
    alternatives: ["Low-dose aspirin is safe for preeclampsia prevention under OBGYN guidance"],
    warnings: ["Avoid high doses", "Risk of maternal/fetal bleeding if taken near term"]
  },
  penicillin: {
    category: "Antibiotic",
    pregnancySafety: "Safe",
    alternatives: ["Erythromycin", "Azithromycin"],
    warnings: ["Verify allergic history before administration"]
  },
  insulin: {
    category: "Antidiabetic",
    pregnancySafety: "Safe",
    alternatives: [],
    warnings: ["Gold standard for gestational diabetes", "Risk of hypoglycemia"]
  }
};
