import IntakeChat from "@/components/consultation/IntakeChat";
import { MessageSquare } from "lucide-react";

export default function ConsultationPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto w-full space-y-8 flex-1">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-display font-bold text-3xl text-white">Intake & Consultation Portal</h2>
            <p className="text-dark-400 text-sm">
              Conversational patient onboarding led by the Intake Agent
            </p>
          </div>
        </div>
      </div>

      <IntakeChat />
    </div>
  );
}
