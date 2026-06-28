"use client";

import { useEffect, useState } from "react";
import { FileText, Sparkles, AlertTriangle, ShieldCheck, Calendar, Activity } from "lucide-react";

export default function BriefingView() {
  const [brief, setBrief] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  async function generateBrief() {
    setLoading(true);
    try {
      // Simulate API compilation wait
      setTimeout(() => {
        setBrief({
          patientName: "Priya Sharma",
          age: 29,
          pregnancyWeeks: 28,
          summaryText: "Patient is a 29-year-old female in her 28th week of gestation (third trimester) with Gestational Diabetes Mellitus (GDM) and mild anemia. Lab records indicate elevated fasting blood glucose (105 mg/dL) and 2-hour postprandial glucose (152 mg/dL) indicative of sub-optimal control. Anemia is mild with Hb at 10.8 g/dL and serum iron at 45 mcg/dL.",
          timeline: [
            { date: "15-Mar-2024", event: "Laparoscopic Appendectomy (Fortis Hospital) - Uncomplicated", type: "Surgical" },
            { date: "10-May-2026", event: "Biochemistry Labs: Fasting Glucose 105 mg/dL, Hb 10.8 g/dL (SRL Diagnostics)", type: "Lab" },
            { date: "12-May-2026", event: "Prescribed Tab. Metformin 500mg BID and Iron/Calcium supplements (Apollo)", type: "Prescription" },
            { date: "28-Jun-2026", event: "Entered Third Trimester (Week 28) - MedCare AI Continuity Brief Generated", type: "System" }
          ],
          keyConcerns: [
            "Gestational hyperglycemia (Fasting 105 mg/dL, target < 95)",
            "Third-trimester metabolic load increase",
            "Gestational iron-deficiency anemia (Hb 10.8 g/dL, target > 11.0)"
          ],
          recommendations: [
            "Initiate strict SMBG tracking (Fasting & 2-hr postprandial)",
            "Counsel on low-glycemic load diet with protein substitutes",
            "Separate calcium and iron supplement intakes by >2 hours",
            "Check fetal growth profile via ultrasound in 4 weeks"
          ]
        });
        setLoading(false);
      }, 1000);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  }

  useEffect(() => {
    generateBrief();
  }, []);

  if (loading) {
    return (
      <div className="py-16 flex flex-col items-center justify-center space-y-3">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-500" />
        <p className="text-sm text-dark-400">Synthesizing records and evidence...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Summary Narrative */}
      <div className="lg:col-span-2 space-y-8">
        <div className="p-6 rounded-2xl border border-dark-800 bg-dark-900/30 backdrop-blur-sm space-y-4">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-brand-400" />
            <h3 className="font-bold text-lg text-white">Synthesized Clinical Briefing</h3>
          </div>
          <p className="text-sm text-dark-300 leading-relaxed font-mono whitespace-pre-line bg-dark-950/40 p-4 rounded-xl border border-dark-800/60">
            {brief?.summaryText}
          </p>
        </div>

        {/* Timeline */}
        <div className="p-6 rounded-2xl border border-dark-800 bg-dark-900/30 backdrop-blur-sm space-y-4">
          <div className="flex items-center gap-2.5">
            <Calendar className="w-5 h-5 text-brand-400" />
            <h3 className="font-bold text-lg text-white">Chronological Health Timeline</h3>
          </div>

          <div className="relative border-l border-dark-800 ml-3.5 space-y-6 py-2">
            {brief?.timeline.map((item: any, i: number) => (
              <div key={i} className="relative pl-6">
                <span className="absolute -left-2 top-1.5 w-4.5 h-4.5 rounded-full border border-dark-700 bg-dark-900 flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-brand-500" />
                </span>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-brand-400 font-semibold">{item.date}</span>
                    <span className="px-1.5 py-0.5 rounded bg-dark-850 text-[10px] text-dark-400 font-medium">
                      {item.type}
                    </span>
                  </div>
                  <p className="text-sm text-dark-200">{item.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Concerns & Suggestions */}
      <div className="space-y-6">
        {/* Risks */}
        <div className="p-6 rounded-2xl border border-dark-800 bg-dark-900/30 backdrop-blur-sm space-y-4">
          <div className="flex items-center gap-2 text-red-400">
            <AlertTriangle className="w-5 h-5" />
            <h4 className="font-bold text-sm uppercase tracking-wider text-white">Critical Gaps</h4>
          </div>
          <ul className="space-y-3">
            {brief?.keyConcerns.map((con: string, i: number) => (
              <li key={i} className="text-sm text-dark-300 flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
                <span>{con}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action Recommendations */}
        <div className="p-6 rounded-2xl border border-dark-800 bg-dark-900/30 backdrop-blur-sm space-y-4">
          <div className="flex items-center gap-2 text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
            <h4 className="font-bold text-sm uppercase tracking-wider text-white">Recommended Actions</h4>
          </div>
          <ul className="space-y-3">
            {brief?.recommendations.map((rec: string, i: number) => (
              <li key={i} className="text-sm text-dark-300 flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
