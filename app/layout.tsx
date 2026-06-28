import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { 
  Heart, 
  User, 
  UploadCloud, 
  FileText, 
  MessageSquare, 
  Activity, 
  ShieldAlert, 
  Layers
} from "lucide-react";

export const metadata: Metadata = {
  title: "MedCare AI — Care Continuity Platform",
  description: "AI-powered care continuity platform for gestational health and chronic conditions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-dark-950 text-dark-50 antialiased min-h-screen flex">
        {/* Left Sidebar */}
        <aside className="w-64 border-r border-dark-800 bg-dark-900/50 backdrop-blur-md flex flex-col justify-between h-screen sticky top-0 shrink-0">
          <div>
            {/* Logo */}
            <div className="p-6 border-b border-dark-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-teal-400 flex items-center justify-center shadow-lg shadow-brand-500/20">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-display font-bold text-lg leading-none bg-gradient-to-r from-white to-dark-300 bg-clip-text text-transparent">
                  MedCare AI
                </h1>
                <span className="text-[10px] tracking-wider uppercase text-brand-400 font-semibold">
                  Continuity Engine
                </span>
              </div>
            </div>

            {/* Navigation links */}
            <nav className="p-4 space-y-1">
              <Link
                href="/"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-dark-300 hover:text-white hover:bg-dark-800/50 transition-all font-medium text-sm group"
              >
                <Layers className="w-4 h-4 text-dark-400 group-hover:text-brand-400 transition-colors" />
                <span>Dashboard</span>
              </Link>
              <Link
                href="/consultation"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-dark-300 hover:text-white hover:bg-dark-800/50 transition-all font-medium text-sm group"
              >
                <MessageSquare className="w-4 h-4 text-dark-400 group-hover:text-brand-400 transition-colors" />
                <span>Intake & Consultation</span>
              </Link>
              <Link
                href="/upload"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-dark-300 hover:text-white hover:bg-dark-800/50 transition-all font-medium text-sm group"
              >
                <UploadCloud className="w-4 h-4 text-dark-400 group-hover:text-brand-400 transition-colors" />
                <span>Document Ingest</span>
              </Link>
              <Link
                href="/summary"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-dark-300 hover:text-white hover:bg-dark-800/50 transition-all font-medium text-sm group"
              >
                <FileText className="w-4 h-4 text-dark-400 group-hover:text-brand-400 transition-colors" />
                <span>Clinical Summary</span>
              </Link>
              <Link
                href="/physician"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-dark-300 hover:text-white hover:bg-dark-800/50 transition-all font-medium text-sm group"
              >
                <Activity className="w-4 h-4 text-dark-400 group-hover:text-brand-400 transition-colors" />
                <span>Physician Portal</span>
              </Link>
            </nav>
          </div>

          {/* User profile section */}
          <div className="p-4 border-t border-dark-800 bg-dark-900/30">
            <div className="flex items-center gap-3 p-2 rounded-xl bg-dark-800/30 border border-dark-800/50">
              <div className="w-10 h-10 rounded-lg bg-dark-700 flex items-center justify-center border border-dark-600">
                <User className="w-5 h-5 text-brand-400" />
              </div>
              <div className="overflow-hidden">
                <h4 className="font-semibold text-sm text-dark-100 truncate">Priya Sharma</h4>
                <p className="text-[10px] text-dark-400 truncate">Week 28 Gestation (GDM)</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-h-screen overflow-y-auto bg-gradient-to-b from-dark-950 to-dark-900 flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}
