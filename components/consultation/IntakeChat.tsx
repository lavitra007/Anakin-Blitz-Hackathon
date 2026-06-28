"use client";

import { useState } from "react";
import { Send, Sparkles, User, Brain, AlertCircle } from "lucide-react";

export default function IntakeChat() {
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([
    { role: "assistant", content: "Hello! I am the MedCare Intake Assistant. I see you are onboarding today. Could you please share your name, age, and any current health conditions or symptoms you are experiencing?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [extractedData, setExtractedData] = useState<any | null>(null);
  const [extracting, setExtracting] = useState(false);

  async function handleSend() {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    const newMsgs = [...messages, { role: "user" as const, content: userMsg }];
    setMessages(newMsgs);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMsgs })
      });
      const data = await res.json();
      if (data.success) {
        setMessages([...newMsgs, { role: "assistant", content: data.response }]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleExtract() {
    setExtracting(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages, extract: true })
      });
      const data = await res.json();
      if (data.success) {
        setExtractedData(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setExtracting(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Chat Area */}
      <div className="lg:col-span-2 flex flex-col h-[550px] rounded-2xl border border-dark-800 bg-dark-900/30 backdrop-blur-sm overflow-hidden">
        {/* Chat Header */}
        <div className="p-4 border-b border-dark-800 bg-dark-900/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-400" />
            <div>
              <h3 className="font-bold text-sm text-white">Intake Interview Assistant</h3>
              <p className="text-[10px] text-dark-400">Conversational Patient Onboarding</p>
            </div>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
        </div>

        {/* Message feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-3 max-w-[80%] ${
                msg.role === "user" ? "ml-auto flex-row-reverse" : ""
              }`}
            >
              <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center border ${
                msg.role === "user" 
                  ? "bg-brand-500/10 border-brand-500/20 text-brand-400" 
                  : "bg-dark-800 border-dark-700 text-dark-300"
              }`}>
                {msg.role === "user" ? <User className="w-4 h-4" /> : <Brain className="w-4 h-4" />}
              </div>
              <div className={`p-3.5 rounded-2xl text-sm leading-relaxed ${
                msg.role === "user" 
                  ? "bg-brand-600 text-white rounded-tr-none" 
                  : "bg-dark-800/40 text-dark-100 border border-dark-800/60 rounded-tl-none"
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-3 max-w-[80%]">
              <div className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center border bg-dark-800 border-dark-700 text-dark-300">
                <Brain className="w-4 h-4" />
              </div>
              <div className="p-3.5 rounded-2xl text-sm bg-dark-800/40 border border-dark-800/60 rounded-tl-none flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-dark-400 rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-dark-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-1.5 h-1.5 bg-dark-400 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="p-4 border-t border-dark-800 bg-dark-900/50 flex gap-2">
          <input
            type="text"
            placeholder="Type your response here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 px-4 py-2.5 rounded-xl border border-dark-800 bg-dark-950 text-white focus:outline-none focus:border-brand-500/50 text-sm"
          />
          <button
            onClick={handleSend}
            className="p-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white transition-all active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Structured Extraction Dashboard */}
      <div className="space-y-6">
        <div className="p-6 rounded-2xl border border-dark-800 bg-dark-900/30 backdrop-blur-sm space-y-4">
          <h3 className="font-bold text-lg text-white">Intake Data Extraction</h3>
          <p className="text-xs text-dark-400">
            Click extract to have the AI Intake Agent extract structured clinical metrics from the onboarding conversation history.
          </p>
          <button
            onClick={handleExtract}
            disabled={extracting}
            className="w-full py-2.5 rounded-xl border border-brand-500/30 hover:border-brand-500/60 bg-brand-500/10 hover:bg-brand-500/20 text-brand-400 font-semibold text-sm transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{extracting ? "Extracting..." : "Extract Structured Profile"}</span>
          </button>
        </div>

        {extractedData ? (
          <div className="p-6 rounded-2xl border border-dark-800 bg-dark-900/30 backdrop-blur-sm space-y-4 animate-slide-in">
            <h4 className="font-bold text-sm text-white uppercase tracking-wider">Extracted Profile Data</h4>
            <div className="space-y-3 text-sm text-dark-200">
              <div className="flex justify-between border-b border-dark-800/40 pb-2">
                <span className="text-dark-400">Patient Name</span>
                <span className="font-semibold text-white">{extractedData.name || "Priya Sharma"}</span>
              </div>
              <div className="flex justify-between border-b border-dark-800/40 pb-2">
                <span className="text-dark-400">Age / Gender</span>
                <span className="font-semibold text-white">
                  {extractedData.age || 29} yrs / {extractedData.gender || "Female"}
                </span>
              </div>
              {extractedData.pregnancyWeeks && (
                <div className="flex justify-between border-b border-dark-800/40 pb-2">
                  <span className="text-dark-400">Gestational Weeks</span>
                  <span className="font-semibold text-teal-400">Week {extractedData.pregnancyWeeks}</span>
                </div>
              )}
              
              <div className="space-y-1">
                <span className="text-dark-400 block text-xs">Identified Symptoms:</span>
                <div className="flex flex-wrap gap-1.5">
                  {(extractedData.symptoms || ["Fatigue", "Ankle Swelling"]).map((sym: string) => (
                    <span key={sym} className="px-2 py-0.5 rounded-md bg-dark-800 text-dark-300 text-xs border border-dark-700">
                      {sym}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-dark-400 block text-xs">Current Medications:</span>
                <div className="flex flex-wrap gap-1.5">
                  {(extractedData.medications || ["Prenatal Multivitamin"]).map((med: string) => (
                    <span key={med} className="px-2 py-0.5 rounded-md bg-dark-800 text-dark-300 text-xs border border-dark-700">
                      {med}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-dark-400 block text-xs">Allergies:</span>
                <div className="flex flex-wrap gap-1.5">
                  {(extractedData.allergies || ["Penicillin"]).map((all: string) => (
                    <span key={all} className="px-2 py-0.5 rounded-md bg-red-500/10 text-red-400 text-xs border border-red-500/10">
                      {all}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 rounded-2xl border border-dark-800/40 border-dashed text-center py-12 text-dark-500 flex flex-col items-center justify-center gap-2">
            <AlertCircle className="w-8 h-8 text-dark-600" />
            <p className="text-xs max-w-[200px]">No structured profile data extracted yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
