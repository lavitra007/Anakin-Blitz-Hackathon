"use client";

import { useState } from "react";
import { 
  UploadCloud, 
  FileText, 
  ShieldAlert, 
  Check, 
  X, 
  Lock,
  Sparkles,
  Info,
  Layers
} from "lucide-react";

export default function FileUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState("Prescription");
  const [redactionLevel, setRedactionLevel] = useState<"strict" | "moderate">("strict");
  const [uploading, setUploading] = useState(false);
  const [processedDoc, setProcessedDoc] = useState<any | null>(null);
  const [approvedCount, setApprovedCount] = useState(0);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  }

  async function handleUpload() {
    if (!file) return;
    setUploading(true);
    setProcessedDoc(null);
    setApprovedCount(0);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", category);
    formData.append("redactionLevel", redactionLevel);

    try {
      const res = await fetch("/api/ocr", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setProcessedDoc(data.record);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUploading(false);
    }
  }

  function handleDecision(entityId: string, action: "approved" | "rejected") {
    if (!processedDoc) return;
    
    // Update entity status in the local state
    const updatedEntities = processedDoc.entities.map((e: any) => {
      if (e.id === entityId) {
        return { ...e, status: action };
      }
      return e;
    });

    // Recalculate redacted text based on approved/rejected redactions
    let currentText = processedDoc.rawText;
    const sorted = [...updatedEntities].sort((a: any, b: any) => b.start - a.start);
    
    for (const ent of sorted) {
      if (ent.status === "approved") {
        currentText = currentText.substring(0, ent.start) + ent.redacted_as + currentText.substring(ent.end);
      }
    }

    setProcessedDoc({
      ...processedDoc,
      entities: updatedEntities,
      redactedText: currentText,
      // If no pending items remain, set status to APPROVED
      status: updatedEntities.some((e: any) => e.status === "pending") ? "NEEDS_REVIEW" : "APPROVED"
    });
  }

  return (
    <div className="space-y-8">
      {/* Upload Setup Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Upload Form */}
        <div className="md:col-span-1 p-6 rounded-2xl border border-dark-800 bg-dark-900/30 backdrop-blur-sm space-y-5">
          <h3 className="font-bold text-lg text-white">Record Details</h3>
          
          <div className="space-y-2">
            <label className="text-xs font-semibold text-dark-300 uppercase tracking-wider block">Document Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-dark-800 bg-dark-950 text-white focus:outline-none text-sm"
            >
              <option value="Prescription">Prescription / Rx</option>
              <option value="Lab Report">Lab Report / Blood Work</option>
              <option value="Discharge Summary">Discharge Summary</option>
              <option value="Other">Other Intake Records</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-dark-300 uppercase tracking-wider block">PII Redaction Level</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm text-dark-200 cursor-pointer">
                <input
                  type="radio"
                  name="redactionLevel"
                  checked={redactionLevel === "strict"}
                  onChange={() => setRedactionLevel("strict")}
                  className="text-brand-500 focus:ring-0 focus:ring-offset-0 bg-dark-950 border-dark-800 w-4 h-4"
                />
                <span>Strict (Full Mask)</span>
              </label>
              <label className="flex items-center gap-2 text-sm text-dark-200 cursor-pointer">
                <input
                  type="radio"
                  name="redactionLevel"
                  checked={redactionLevel === "moderate"}
                  onChange={() => setRedactionLevel("moderate")}
                  className="text-brand-500 focus:ring-0 focus:ring-offset-0 bg-dark-950 border-dark-800 w-4 h-4"
                />
                <span>Moderate</span>
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-dark-300 uppercase tracking-wider block">Select File</label>
            <div className="relative border border-dashed border-dark-800 hover:border-brand-500/50 rounded-xl p-6 bg-dark-950/40 text-center transition-all cursor-pointer">
              <input
                type="file"
                accept=".txt,.pdf,.png,.jpg,.jpeg"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <UploadCloud className="w-8 h-8 text-dark-500 mx-auto mb-2" />
              {file ? (
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-brand-400 truncate max-w-[200px] mx-auto">{file.name}</p>
                  <p className="text-[10px] text-dark-400">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-xs text-dark-300">Drag & drop or click to browse</p>
                  <p className="text-[10px] text-dark-500">PDF, TXT, PNG, JPG (Max 5MB)</p>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-600 to-teal-500 hover:shadow-lg hover:shadow-brand-500/20 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
          >
            <span>{uploading ? "Ingesting Document..." : "Run AI Ingestion Pipeline"}</span>
          </button>
        </div>

        {/* Informational Guidelines Panel */}
        <div className="md:col-span-2 p-6 rounded-2xl border border-dark-800 bg-dark-900/30 backdrop-blur-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 text-brand-400">
              <Layers className="w-5 h-5" />
              <h3 className="font-bold text-lg text-white">Document Processing Pipeline</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-dark-950/40 border border-dark-800 space-y-2">
                <div className="flex items-center gap-2 text-sm text-teal-400 font-semibold">
                  <Sparkles className="w-4 h-4" />
                  <span>OCR text extraction</span>
                </div>
                <p className="text-xs text-dark-400">
                  Google Document AI extracts structured layouts and digital text from medical images or PDF scans.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-dark-950/40 border border-dark-800 space-y-2">
                <div className="flex items-center gap-2 text-sm text-brand-400 font-semibold">
                  <Lock className="w-4 h-4" />
                  <span>PII Detection & Redaction</span>
                </div>
                <p className="text-xs text-dark-400">
                  Direct identifiers are auto-redacted immediately. Quasi-identifiers are flagged for human review.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-brand-500/5 border border-brand-500/10 flex gap-3 text-xs text-dark-300">
            <Info className="w-5 h-5 text-brand-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white block mb-1">Human-in-the-Loop Redaction Review Gate</span>
              Any PII entities (e.g. physician name, clinic address) matched with confidence levels between 70% and 90% require your manual validation before they are released to the medical graph database.
            </div>
          </div>
        </div>
      </div>

      {/* HITL Review Area (displayed when document has been processed) */}
      {processedDoc && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-slide-in">
          {/* Flagged Redaction review queue */}
          <div className="lg:col-span-1 p-6 rounded-2xl border border-dark-800 bg-dark-900/30 backdrop-blur-sm space-y-4 h-[500px] flex flex-col">
            <div className="flex justify-between items-center border-b border-dark-800 pb-4 shrink-0">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-400 animate-pulse" />
                <h4 className="font-bold text-sm text-white uppercase tracking-wider">Review Queue</h4>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                processedDoc.status === "APPROVED" 
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                  : "bg-amber-500/10 text-amber-400 border-amber-500/20"
              }`}>
                {processedDoc.status}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {processedDoc.entities.filter((e: any) => e.status === "pending").length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-4 space-y-2">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Check className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-sm text-white">Queue Cleared!</h5>
                    <p className="text-[10px] text-dark-400 mt-1">
                      All redaction choices approved. This record is unlocked.
                    </p>
                  </div>
                </div>
              ) : (
                processedDoc.entities.filter((e: any) => e.status === "pending").map((ent: any) => (
                  <div key={ent.id} className="p-3.5 rounded-xl border border-dark-800 bg-dark-950/60 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] uppercase font-semibold text-brand-400 tracking-wider">
                          {ent.type}
                        </span>
                        <h5 className="font-semibold text-sm text-white truncate max-w-[150px]">{ent.value}</h5>
                      </div>
                      <span className="text-[10px] text-dark-400">{(ent.confidence * 100).toFixed(0)}% Conf</span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDecision(ent.id, "approved")}
                        className="flex-1 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center justify-center gap-1 transition-all"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Redact</span>
                      </button>
                      <button
                        onClick={() => handleDecision(ent.id, "rejected")}
                        className="flex-1 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 text-xs font-semibold flex items-center justify-center gap-1 transition-all"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Keep</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Document Preview (Side-by-side original and redacted) */}
          <div className="lg:col-span-2 p-6 rounded-2xl border border-dark-800 bg-dark-900/30 backdrop-blur-sm flex flex-col h-[500px]">
            <h4 className="font-bold text-sm text-white uppercase tracking-wider mb-4 border-b border-dark-800 pb-4">
              Anonymized Record Preview
            </h4>
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-hidden">
              {/* Raw Extracted Text */}
              <div className="flex flex-col h-full border border-dark-800 bg-dark-950 rounded-xl overflow-hidden">
                <div className="p-2 border-b border-dark-800 bg-dark-900/50 text-[10px] uppercase font-semibold text-dark-400 tracking-wider">
                  Raw OCR Extraction
                </div>
                <div className="flex-1 overflow-y-auto p-4 font-mono text-xs whitespace-pre-wrap leading-relaxed text-dark-300">
                  {processedDoc.rawText}
                </div>
              </div>

              {/* Redacted Preview */}
              <div className="flex flex-col h-full border border-dark-800 bg-dark-950 rounded-xl overflow-hidden">
                <div className="p-2 border-b border-dark-800 bg-dark-900/50 text-[10px] uppercase font-semibold text-brand-400 tracking-wider flex items-center justify-between">
                  <span>Anonymized Preview</span>
                  <span className="text-[10px] text-dark-400">Reversible mappings secure</span>
                </div>
                <div className="flex-1 overflow-y-auto p-4 font-mono text-xs whitespace-pre-wrap leading-relaxed text-emerald-400/90">
                  {processedDoc.redactedText}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
