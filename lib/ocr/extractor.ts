export interface ExtractedDocument {
  text: string;
  metadata: {
    mimeType: string;
    pageCount: number;
    fileName: string;
    extractedAt: string;
  };
}

/**
 * Extract raw text from a medical document (PDF, JPG, PNG) using OCR
 */
export async function extractTextFromDocument(
  file: File | Blob,
  fileName: string
): Promise<ExtractedDocument> {
  // In a real production system, this would call Google Document AI API:
  // e.g., using the DocumentProcessorServiceClient from @google-cloud/documentai.
  
  return new Promise((resolve) => {
    // Simulate OCR delay
    setTimeout(() => {
      let mockText = "";
      
      const lowerName = fileName.toLowerCase();
      if (lowerName.includes("prescription") || lowerName.includes("rx")) {
        mockText = `
APOLLO CLINIC - NEELADRI ROAD, BANGALORE
Date: 12-May-2026
Patient Name: Priya Sharma
Age: 29  Gender: Female
Diagnosis: Gestational Diabetes Mellitus (28 weeks gestation)

Rx:
1. Tab. Metformin 500mg - Twice daily (after breakfast, after dinner) - Oral route. Qty: 60 tabs.
2. Tab. Calcium Carbonate 500mg - Once daily (after lunch) - Oral route. Qty: 30 tabs.
3. Cap. Iron Fumarate 100mg - Once daily (empty stomach in morning) - Oral route. Qty: 30 tabs.

Dietary advice:
- Strict low glycemic index diet. Avoid refined sugars, white rice, and maida.
- Incorporate high-protein, fiber-rich alternatives like Quinoa and Chia seeds.
- Regular 20 minutes walk after meals.
- Self-monitoring of blood glucose (SMBG) 4 times a day (Fasting, and 2-hr post-meals).

Doctor Signature: Dr. Ramesh Kumar (MD, OBGYN)
Registration No: KMC-88746
        `;
      } else if (lowerName.includes("lab") || lowerName.includes("report") || lowerName.includes("srl") || lowerName.includes("blood")) {
        mockText = `
SRL DIAGNOSTICS - BANGALORE CENTRAL LAB
PATIENT REPORT
Patient Name: Priya Sharma  Age: 29  Gender: F
Date: 10-May-2026  Ref By: Dr. Ramesh Kumar

TEST REPORT - BIOCHEMISTRY

Test Name                    Result       Unit        Biological Reference Range
GLUCOSE, FASTING             105 (H)      mg/dL       70 - 95 (Pregnancy Target)
GLUCOSE, 2 HOURS POST-MEAL   152 (H)      mg/dL       < 140 (Pregnancy Target)
HbA1c                        6.4  (H)     %           4.0 - 5.6 (Normal)
HEMOGLOBIN                   10.8 (L)     g/dL        11.5 - 15.0 (Normal)
SERUM IRON                   45 (L)       mcg/dL      50 - 170 (Normal)
TOTAL CHOLESTEROL            190          mg/dL       120 - 200 (Normal)
SERUM CREATININE             0.7          mg/dL       0.5 - 1.1 (Normal)

Note: High fasting and postprandial glucose are indicative of impaired gestational glycemic control. Hemoglobin levels indicate mild microcytic anemia.
        `;
      } else if (lowerName.includes("discharge") || lowerName.includes("summary") || lowerName.includes("hospital")) {
        mockText = `
FORTIS HOSPITAL - BANGALORE
DISCHARGE SUMMARY
Patient Name: Priya Sharma  Age: 27  Gender: Female
IP No: H-110292  Date of Admission: 15-Mar-2024  Date of Discharge: 17-Mar-2024
Primary Diagnosis: Acute Appendicitis, Uncomplicated

History of Present Illness:
Patient presented with sudden-onset right lower quadrant abdominal pain accompanied by nausea and low-grade fever. 
Physical examination showed tenderness at McBurney's point. Rebound tenderness present.

Procedures Performed:
Laparoscopic Appendectomy performed on 15-Mar-2024 by Dr. Vivek Shastri under general anesthesia. No intraoperative complications. Appendix was inflamed but non-perforated.

Course in Hospital:
Postoperatively patient was started on clear liquids and advanced to soft diet. Pain was well managed. 
Vitals stable. Wound clean and dry. Patient ambulating well.

Discharge Medications:
1. Tab. Paracetamol 650mg - PRN for pain (Max 4 tabs/day) - 5 days.
2. Tab. Pantoprazole 40mg - Once daily before breakfast - 5 days.

Follow-up:
Review in outpatient clinic with Dr. Vivek Shastri in 10 days for suture removal.
        `;
      } else {
        mockText = `
GENERAL MEDICAL RECORD - INTAKE FILE
Patient: Priya Sharma
DOB: 14-Aug-1996
Allergies: Penicillin (severe rash), Peanuts (mild itchiness)
Current Conditions: Gestational Diabetes, Mild Anemia.
Current Medications: Prenatal Multivitamin (Daily).
Recent Symptoms: Occasional fatigue, mild swelling in ankles.
        `;
      }

      resolve({
        text: mockText.trim(),
        metadata: {
          mimeType: file.type || "application/pdf",
          pageCount: 1,
          fileName,
          extractedAt: new Date().toISOString(),
        },
      });
    }, 1200);
  });
}
