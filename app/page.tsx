"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Heart, 
  Activity, 
  FileText, 
  AlertTriangle, 
  ArrowRight, 
  UploadCloud, 
  RotateCcw,
  Sparkles,
  Shield,
  Clock
} from "lucide-react";

export default function Dashboard() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);

  async function fetchRecords() {
    try {
      const res = await fetch("/api/records");
      const data = await res.json();
      if (data.success) {
        setRecords(data.records);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleClearDb() {
    if (!confirm("Are you sure you want to delete all records from the database?")) return;
    setClearing(true);
    try {
      const res = await fetch("/api/records", { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setRecords([]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setClearing(false);
    }
  }

  useEffect(() => {
    fetchRecords();
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto w-full space-y-8 flex-1">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl border border-brand-500/20 bg-brand-950/20 glow-teal backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-brand-400 text-sm font-semibold tracking-wide uppercase">
            <Sparkles className="w-4 h-4 animate-pulse-slow" />
            <span>AI Care Continuity Active</span>
          </div>
          <h2 className="font-display font-bold text-3xl text-white">
            Welcome Back, Priya Sharma
          </h2>
          <p className="text-dark-400 text-sm">
            Gestational Week 28 · Third Trimester Care Plan Active
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/consultation"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-teal-500 text-white font-medium text-sm flex items-center gap-2 hover:shadow-lg hover:shadow-brand-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <span>Start Consultation</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Grid of Key Health Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Gestational week */}
        <div className="p-6 rounded-2xl border border-dark-800 bg-dark-900/40 backdrop-blur-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs uppercase font-semibold text-dark-400 tracking-wider">Gestation</span>
            <span className="p-2 rounded-lg bg-teal-500/10 text-teal-400 text-xs font-semibold border border-teal-500/10">Trimester 3</span>
          </div>
          <div className="mt-4 space-y-1">
            <h3 className="font-display font-bold text-4xl text-white">Week 28</h3>
            <p className="text-xs text-dark-400">Target Delivery: Sep 20, 2026</p>
          </div>
        </div>

        {/* Glucose */}
        <div className="p-6 rounded-2xl border border-dark-800 bg-dark-900/40 backdrop-blur-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs uppercase font-semibold text-dark-400 tracking-wider">Glycemic Range</span>
            <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-400 text-[10px] font-semibold border border-red-500/20">Hyperglycemic</span>
          </div>
          <div className="mt-4 space-y-1">
            <h3 className="font-display font-bold text-3xl text-white">105 / 152</h3>
            <p className="text-xs text-dark-400">Fasting / Postprandial (mg/dL)</p>
          </div>
        </div>

        {/* Anemia */}
        <div className="p-6 rounded-2xl border border-dark-800 bg-dark-900/40 backdrop-blur-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs uppercase font-semibold text-dark-400 tracking-wider">Hemoglobin</span>
            <span className="px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-400 text-[10px] font-semibold border border-yellow-500/20">Mild Anemia</span>
          </div>
          <div className="mt-4 space-y-1">
            <h3 className="font-display font-bold text-4xl text-white">10.8 <span className="text-lg font-normal text-dark-400">g/dL</span></h3>
            <p className="text-xs text-dark-400">Target Range: &gt; 11.0 g/dL</p>
          </div>
        </div>

        {/* Risk Level */}
        <div className="p-6 rounded-2xl border border-dark-800 bg-dark-900/40 backdrop-blur-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs uppercase font-semibold text-dark-400 tracking-wider">Clinical Risk</span>
            <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-400 text-[10px] font-semibold border border-red-500/20">Urgent Risk</span>
          </div>
          <div className="mt-4 space-y-1">
            <h3 className="font-display font-bold text-4xl text-white">70<span className="text-lg font-normal text-dark-400">/100</span></h3>
            <p className="text-xs text-dark-400">OBGYN Review Suggested</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Records and Risk breakdown */}
        <div className="lg:col-span-2 space-y-8">
          {/* Clinical Risk Evaluation Panel */}
          <div className="p-6 rounded-2xl border border-dark-800 bg-dark-900/30 backdrop-blur-sm space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">AI Clinical Risk Analysis</h3>
                <p className="text-xs text-dark-400">Generated from patient intake and recent SRL report</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-dark-300 uppercase tracking-wider">Risk Factors:</h4>
                <ul className="space-y-2 text-sm text-dark-200">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
                    <span>Active Gestational Diabetes Mellitus (Week 28)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
                    <span>Fasting Blood Glucose: 105 mg/dL (Target: &lt;95)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-2 shrink-0" />
                    <span>Mild Gestational Anemia (Hb: 10.8 g/dL)</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-dark-300 uppercase tracking-wider">Recommendations:</h4>
                <ul className="space-y-2 text-sm text-dark-200">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 shrink-0" />
                    <span>SMBG glucose tracking 4x daily</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 shrink-0" />
                    <span>Separate Iron and Calcium ingestion by 2+ hours</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 shrink-0" />
                    <span>Substitute high-GI foods for local equivalents</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Ingested Records list */}
          <div className="p-6 rounded-2xl border border-dark-800 bg-dark-900/30 backdrop-blur-sm space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-brand-400" />
                <h3 className="font-bold text-lg text-white">Ingested Medical Records</h3>
              </div>
              {records.length > 0 && (
                <button
                  onClick={handleClearDb}
                  disabled={clearing}
                  className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{clearing ? "Clearing..." : "Clear Records"}</span>
                </button>
              )}
            </div>

            {loading ? (
              <div className="py-8 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500" />
              </div>
            ) : records.length === 0 ? (
              <div className="py-12 border border-dashed border-dark-800 rounded-xl flex flex-col items-center justify-center text-center p-6 space-y-3">
                <UploadCloud className="w-10 h-10 text-dark-500" />
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-dark-200">No medical records ingested yet</h4>
                  <p className="text-xs text-dark-400 max-w-sm">
                    Upload your prescriptions, lab reports, or discharge summaries to build your AI timeline.
                  </p>
                </div>
                <Link
                  href="/upload"
                  className="px-4 py-2 rounded-lg bg-dark-800 hover:bg-dark-700 text-white font-medium text-xs border border-dark-700 transition-all"
                >
                  Go to Ingest Portal
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-dark-800/60">
                {records.map((rec) => (
                  <div key={rec.id} className="py-4 flex justify-between items-center gap-4 first:pt-0 last:pb-0">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-sm text-dark-100">{rec.name}</h4>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-dark-800 text-dark-400 font-medium">
                          {rec.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-dark-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {rec.date}
                        </span>
                        <span className="flex items-center gap-1 text-brand-400">
                          <Shield className="w-3 h-3" />
                          {rec.averageConfidence}% PII Conf
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                        rec.status === "APPROVED" 
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                          : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      }`}>
                        {rec.status}
                      </span>
                      <Link
                        href="/summary"
                        className="p-1.5 rounded-lg bg-dark-800 hover:bg-dark-700 text-dark-200 border border-dark-700 transition-all"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Column: Shortcuts / Quick tools */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-dark-800 bg-dark-900/30 backdrop-blur-sm space-y-4">
            <h3 className="font-bold text-lg text-white">System Operations</h3>
            <div className="grid grid-cols-1 gap-3">
              <Link
                href="/consultation"
                className="flex items-center justify-between p-4 rounded-xl border border-dark-800 hover:border-brand-500/30 bg-dark-950/40 hover:bg-dark-800/20 transition-all group"
              >
                <div className="space-y-1">
                  <h4 className="font-semibold text-sm text-dark-100 group-hover:text-brand-400 transition-colors">
                    Intake Conversation
                  </h4>
                  <p className="text-xs text-dark-400">Onboarding conversational chat</p>
                </div>
                <ArrowRight className="w-4 h-4 text-dark-500 group-hover:text-brand-400 transition-all group-hover:translate-x-1" />
              </Link>

              <Link
                href="/upload"
                className="flex items-center justify-between p-4 rounded-xl border border-dark-800 hover:border-brand-500/30 bg-dark-950/40 hover:bg-dark-800/20 transition-all group"
              >
                <div className="space-y-1">
                  <h4 className="font-semibold text-sm text-dark-100 group-hover:text-brand-400 transition-colors">
                    Ingest Medical File
                  </h4>
                  <p className="text-xs text-dark-400">OCR processing & redactions</p>
                </div>
                <ArrowRight className="w-4 h-4 text-dark-500 group-hover:text-brand-400 transition-all group-hover:translate-x-1" />
              </Link>

              <Link
                href="/summary"
                className="flex items-center justify-between p-4 rounded-xl border border-dark-800 hover:border-brand-500/30 bg-dark-950/40 hover:bg-dark-800/20 transition-all group"
              >
                <div className="space-y-1">
                  <h4 className="font-semibold text-sm text-dark-100 group-hover:text-brand-400 transition-colors">
                    View Clinical Brief
                  </h4>
                  <p className="text-xs text-dark-400">Multi-source synthesized summaries</p>
                </div>
                <ArrowRight className="w-4 h-4 text-dark-500 group-hover:text-brand-400 transition-all group-hover:translate-x-1" />
              </Link>

              <Link
                href="/physician"
                className="flex items-center justify-between p-4 rounded-xl border border-dark-800 hover:border-brand-500/30 bg-dark-950/40 hover:bg-dark-800/20 transition-all group"
              >
                <div className="space-y-1">
                  <h4 className="font-semibold text-sm text-dark-100 group-hover:text-brand-400 transition-colors">
                    Physician Decision Support
                  </h4>
                  <p className="text-xs text-dark-400">Ask the Physician Agent queries</p>
                </div>
                <ArrowRight className="w-4 h-4 text-dark-500 group-hover:text-brand-400 transition-all group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
