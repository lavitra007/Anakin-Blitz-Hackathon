"use client";

import { useState } from "react";
import { Send, Activity, Brain, ShieldAlert, CheckCircle, HelpCircle, Sparkles, UserCheck, Calendar, RefreshCw, FileText } from "lucide-react";

export default function DecisionSupport() {
  // Q&A States
  const [query, setQuery] = useState("");
  const [qaLoading, setQaLoading] = useState(false);
  const [qaHistory, setQaHistory] = useState<{ query: string; response: string }[]>([
    {
      query: "What is the patient's glucose trend?",
      response: "Patient Priya Sharma has active Gestational Diabetes Mellitus (Week 28). According to her SRL blood report from 10-May-2026, her Fasting Glucose is 105 mg/dL (Elevated, target: <95) and 2-Hour Postprandial Glucose is 152 mg/dL (Elevated, target: <140). This represents sub-optimal control and review of metformin/lifestyle compliance is advised."
    }
  ]);

  // Safety Check States
  const [proposedTreatment, setProposedTreatment] = useState("");
  const [safetyChecking, setSafetyChecking] = useState(false);
  const [safetyReport, setSafetyReport] = useState<any | null>(null);

  // Physician Decision Gate States
  const [actionStatus, setActionStatus] = useState<{ type: string; message: string } | null>(null);
  const [modifyText, setModifyText] = useState("");
  const [isModifying, setIsModifying] = useState(false);
  const [selectedInterval, setSelectedInterval] = useState("2 Weeks");
  const [isScheduling, setIsScheduling] = useState(false);
  const [selectedSpecialist, setSelectedSpecialist] = useState("OBGYN (Maternal-Fetal Medicine)");
  const [isReferring, setIsReferring] = useState(false);

  async function handleAsk() {
    if (!query.trim() || qaLoading) return;
    const q = query.trim();
    setQuery("");
    setQaLoading(true);

    try {
      setTimeout(() => {
        let answer = "";
        const lowerQ = q.toLowerCase();
        
        if (lowerQ.includes("medication") || lowerQ.includes("drug") || lowerQ.includes("rx")) {
          answer = "Priya Sharma is currently on Metformin 500mg BID (post-meals), Calcium Carbonate 500mg Daily, and Iron Fumarate 100mg Daily. Clinical guidelines advise checking compliance and ensuring she separates the Calcium and Iron doses by at least 2 hours to avoid absorption interference.";
        } else if (lowerQ.includes("anemia") || lowerQ.includes("iron") || lowerQ.includes("hemoglobin")) {
          answer = "The patient's Hemoglobin is 10.8 g/dL (Gestational Target: >11.0 g/dL), representing mild gestational microcytic anemia. Serum iron is 45 mcg/dL (Low, range 50-170). Her current prescription of Iron Fumarate 100mg once daily should be continued, and CBC should be re-evaluated in 4 weeks.";
        } else if (lowerQ.includes("allergy") || lowerQ.includes("allergies")) {
          answer = "The patient is allergic to Penicillin (severe reaction: hives/rash) and Peanuts (mild itchiness). Avoid any penicillin-class antibiotics or related beta-lactams.";
        } else {
          answer = `Grounded in Priya Sharma's clinical record: She is 28 weeks pregnant (G1P0) with gestational diabetes and gestational anemia. For the query: "${q}", it is recommended to maintain close glucose monitoring and schedule growth scans at week 32.`;
        }

        setQaHistory(prev => [...prev, { query: q, response: answer }]);
        setQaLoading(false);
      }, 1200);
    } catch (e) {
      console.error(e);
      setQaLoading(false);
    }
  }

  async function handleVerifySafety() {
    if (!proposedTreatment.trim() || safetyChecking) return;
    setSafetyChecking(true);
    setSafetyReport(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "safety",
          conditions: ["Gestational Diabetes Mellitus (Week 28)", "Mild Anemia"],
          proposedTreatment,
          currentMeds: ["Metformin 500mg BID", "Calcium Carbonate 500mg", "Iron Fumarate 100mg"],
          allergies: ["Penicillin", "Peanuts"]
        })
      });
      const data = await res.json();
      if (data.success) {
        setSafetyReport(data.result);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSafetyChecking(false);
    }
  }

  // Physician actions
  function handleApprovePlan() {
    setActionStatus({
      type: "approve",
      message: "Clinical Care Plan has been officially approved and transmitted to the patient portal."
    });
    setIsModifying(false);
    setIsScheduling(false);
    setIsReferring(false);
  }

  function handleSaveModification() {
    setActionStatus({
      type: "modify",
      message: `Care Plan modified successfully. Notes added: "${modifyText}"`
    });
    setIsModifying(false);
  }

  function handleConfirmSchedule() {
    setActionStatus({
      type: "schedule",
      message: `Follow-up consultation successfully scheduled in ${selectedInterval}.`
    });
    setIsScheduling(false);
  }

  function handleConfirmReferral() {
    setActionStatus({
      type: "refer",
      message: `Specialist referral for ${selectedSpecialist} has been generated and dispatched.`
    });
    setIsReferring(false);
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Consultation Chat Widget */}
        <div className="p-6 rounded-2xl border border-dark-800 bg-dark-900/30 backdrop-blur-sm flex flex-col h-[520px]">
          <div className="flex items-center gap-2 mb-4 shrink-0">
            <Brain className="w-5 h-5 text-brand-400" />
            <h3 className="font-bold text-lg text-white">Physician Assistant Chat</h3>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4">
            {qaHistory.map((item, i) => (
              <div key={i} className="space-y-2.5">
                <div className="flex gap-2 justify-end">
                  <div className="p-3 bg-dark-850 border border-dark-800 text-dark-200 text-sm rounded-2xl rounded-tr-none max-w-[85%] font-medium">
                    {item.query}
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg shrink-0 border border-brand-500/20 bg-brand-500/10 text-brand-400 flex items-center justify-center">
                    <Brain className="w-4 h-4" />
                  </div>
                  <div className="p-3.5 bg-dark-950/60 border border-dark-800/40 text-dark-100 text-sm rounded-2xl rounded-tl-none max-w-[85%] leading-relaxed font-sans">
                    {item.response}
                  </div>
                </div>
              </div>
            ))}
            {qaLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg shrink-0 border border-brand-500/20 bg-brand-500/10 text-brand-400 flex items-center justify-center">
                  <Brain className="w-4 h-4" />
                </div>
                <div className="p-3 bg-dark-950/40 border border-dark-850 text-dark-400 text-sm rounded-2xl rounded-tl-none flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2 shrink-0">
            <input
              type="text"
              placeholder="Ask details (e.g., 'Check glucose values', 'Review allergies')..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAsk()}
              className="flex-1 px-4 py-2.5 rounded-xl border border-dark-800 bg-dark-950 text-white focus:outline-none focus:border-brand-500/50 text-sm"
            />
            <button
              onClick={handleAsk}
              className="p-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Safety check module */}
        <div className="p-6 rounded-2xl border border-dark-800 bg-dark-900/30 backdrop-blur-sm flex flex-col justify-between h-[520px]">
          <div className="space-y-6 flex-1 overflow-y-auto pr-1">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-brand-400" />
              <h3 className="font-bold text-lg text-white">Care Safety Verification</h3>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-dark-300 uppercase tracking-wider block">
                Proposed Drug or Treatment
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Ibuprofen, Penicillin V, Contrast CT scan"
                  value={proposedTreatment}
                  onChange={(e) => setProposedTreatment(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-dark-800 bg-dark-950 text-white focus:outline-none focus:border-brand-500/50 text-sm"
                />
                <button
                  onClick={handleVerifySafety}
                  disabled={!proposedTreatment.trim() || safetyChecking}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-teal-500 hover:shadow-lg text-white font-semibold text-sm transition-all animate-pulse-slow"
                >
                  {safetyChecking ? "Checking..." : "Verify Safety"}
                </button>
              </div>
            </div>

            {/* Safety report result */}
            {safetyReport && (
              <div className="space-y-4 animate-slide-in">
                <div className={`p-4 rounded-xl border flex gap-3 ${
                  safetyReport.isApproved
                    ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-300"
                    : "bg-red-500/5 border-red-500/20 text-red-300"
                }`}>
                  {safetyReport.isApproved ? (
                    <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <h4 className="font-bold text-sm text-white">
                      {safetyReport.isApproved ? "Treatment Safe for Use" : "Contraindicated Treatment"}
                    </h4>
                    <p className="text-xs text-dark-400 mt-1">
                      Evidence Level: <span className="font-semibold text-white">{safetyReport.evidenceLevel}</span>
                    </p>
                  </div>
                </div>

                {safetyReport.warnings.length > 0 && (
                  <div className="p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/20 space-y-2">
                    <span className="text-xs font-bold text-yellow-400 uppercase tracking-wider block">Warnings</span>
                    <ul className="space-y-2 text-xs text-dark-300">
                      {safetyReport.warnings.map((w: string, i: number) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-yellow-400">•</span>
                          <span>{w}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {safetyReport.contraindications.length > 0 && (
                  <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 space-y-2">
                    <span className="text-xs font-bold text-red-400 uppercase tracking-wider block">Contraindications</span>
                    <ul className="space-y-2 text-xs text-dark-300">
                      {safetyReport.contraindications.map((c: string, i: number) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-red-400">•</span>
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {!safetyReport && !safetyChecking && (
            <div className="p-6 border border-dashed border-dark-800/80 rounded-xl text-center text-dark-500 py-12 flex flex-col items-center justify-center gap-2">
              <HelpCircle className="w-8 h-8 text-dark-600" />
              <p className="text-xs max-w-sm">
                Input a medication or therapeutic procedure to run safety checks against the patient's conditions and allergies.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Physician Action Gate Widget */}
      <div className="p-6 rounded-2xl border border-dark-800 bg-dark-900/30 backdrop-blur-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">Physician Decision Gate</h3>
              <p className="text-dark-400 text-xs">Verify care plans, reschedule intakes, or initiate referrals</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleApprovePlan}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition-all border border-emerald-500/30 shadow-lg shadow-emerald-950/20"
            >
              Approve Care Plan
            </button>
            <button
              onClick={() => {
                setIsModifying(true);
                setIsScheduling(false);
                setIsReferring(false);
              }}
              className="px-4 py-2 rounded-xl bg-dark-800 hover:bg-dark-700 text-dark-200 text-sm font-semibold transition-all border border-dark-700"
            >
              Modify Plan
            </button>
            <button
              onClick={() => {
                setIsScheduling(true);
                setIsModifying(false);
                setIsReferring(false);
              }}
              className="px-4 py-2 rounded-xl bg-dark-800 hover:bg-dark-700 text-dark-200 text-sm font-semibold transition-all border border-dark-700"
            >
              Schedule Consultation
            </button>
            <button
              onClick={() => {
                setIsReferring(true);
                setIsModifying(false);
                setIsScheduling(false);
              }}
              className="px-4 py-2 rounded-xl bg-dark-800 hover:bg-dark-700 text-dark-200 text-sm font-semibold transition-all border border-dark-700"
            >
              Refer Specialist
            </button>
          </div>
        </div>

        {/* Dynamic action forms */}
        {isModifying && (
          <div className="p-4 rounded-xl bg-dark-950/50 border border-dark-800 space-y-3 animate-slide-in">
            <h4 className="text-sm font-bold text-white">Add Treatment Modifications</h4>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="e.g. Decrease Metformin to 250mg BID, increase post-meal testing to 3x/day..."
                value={modifyText}
                onChange={(e) => setModifyText(e.target.value)}
                className="flex-1 px-4 py-2 rounded-lg border border-dark-800 bg-dark-900 text-white focus:outline-none focus:border-brand-500 text-sm"
              />
              <button
                onClick={handleSaveModification}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-sm font-semibold transition-all"
              >
                Save
              </button>
            </div>
          </div>
        )}

        {isScheduling && (
          <div className="p-4 rounded-xl bg-dark-950/50 border border-dark-800 space-y-3 animate-slide-in">
            <h4 className="text-sm font-bold text-white">Schedule Next Consultation</h4>
            <div className="flex items-center gap-4">
              <select
                value={selectedInterval}
                onChange={(e) => setSelectedInterval(e.target.value)}
                className="px-3 py-2 rounded-lg border border-dark-800 bg-dark-900 text-white focus:outline-none focus:border-brand-500 text-sm"
              >
                <option value="1 Week">1 Week (High priority follow-up)</option>
                <option value="2 Weeks">2 Weeks (Routine gestational control)</option>
                <option value="4 Weeks">4 Weeks (Standard OBGYN visit)</option>
              </select>
              <button
                onClick={handleConfirmSchedule}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-sm font-semibold transition-all"
              >
                Schedule Consultation
              </button>
            </div>
          </div>
        )}

        {isReferring && (
          <div className="p-4 rounded-xl bg-dark-950/50 border border-dark-800 space-y-3 animate-slide-in">
            <h4 className="text-sm font-bold text-white">Refer to Medical Specialist</h4>
            <div className="flex items-center gap-4">
              <select
                value={selectedSpecialist}
                onChange={(e) => setSelectedSpecialist(e.target.value)}
                className="px-3 py-2 rounded-lg border border-dark-800 bg-dark-900 text-white focus:outline-none focus:border-brand-500 text-sm"
              >
                <option value="OBGYN (Maternal-Fetal Medicine)">OBGYN (Maternal-Fetal Medicine)</option>
                <option value="Endocrinologist">Endocrinologist (GDM management)</option>
                <option value="Clinical Dietitian">Clinical Dietitian (Nutritional Therapy)</option>
              </select>
              <button
                onClick={handleConfirmReferral}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-sm font-semibold transition-all"
              >
                Submit Referral
              </button>
            </div>
          </div>
        )}

        {actionStatus && (
          <div className="p-4 rounded-xl bg-teal-500/5 border border-teal-500/20 flex gap-3 text-teal-300 animate-slide-in">
            <CheckCircle className="w-5 h-5 shrink-0 text-teal-400 mt-0.5" />
            <div>
              <h5 className="font-bold text-sm text-white">Action Completed Successfully</h5>
              <p className="text-xs text-dark-400 mt-1">{actionStatus.message}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
