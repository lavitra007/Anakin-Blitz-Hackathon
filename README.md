# MedCare

> **AI Clinical Workflow Copilot for Primary Care**
> *Intelligent Patient Intake, OCR, Care Summary Synthesis, and Decision Support*

---

## Logo Placeholder
```
 __  __          _  _____              
|  \/  | ___  __| |/ ____|__ _ _ __ ___ 
| |\/| |/ _ \/ _` | |   / _` | '__/ _ \
| |  | |  __/ (_| | |__| (_| | | |  __/
|_|  |_|\___|\__,_|\____\__,_|_|  \___|
```

---

## Project Description
MedCare is an AI-powered clinical workflow copilot designed specifically for primary care. It assists healthcare professionals by streamlining patient onboarding, extracting medical knowledge from documents using OCR, performing safety audits, and compiling structured clinical briefings. 

**IMPORTANT**: The AI serves purely as an assistant. The AI never replaces, overrides, or acts without physician judgment.

## Vision
To free physicians from repetitive administrative tasks, reduce cognitive load, and minimize diagnostic errors, thereby returning their focus to hands-on patient care and clinical relationship-building.

## Problem Statement
Primary care doctors spend up to 40% of their workday filling out charts, reviewing disparate unstructured lab reports, and manually verifying safety guidelines. This administrative burden results in physician burnout and increases the risk of overlooking critical health contraindications.

## Solution
MedCare automates the clinical data pipeline:
1. **Empathetic Intake**: Collects historical and symptom logs directly from the patient.
2. **Document Ingestion**: Extracts raw text from uploads and filters out PII.
3. **Clinical Cross-Referencing**: Performs safety checks against guideline bases (ACOG, ADA).
4. **Physician Copilot Gate**: Presents structured briefings and lets physicians edit, schedule, or refer.

---

## Features
- **Intelligent Intake Chatbot**: Conducts conversational intake and compiles structured profiles.
- **PII Redaction Gate**: Flags name, SSN, and details using a Human-in-the-Loop review queue.
- **Medical Details Parser**: Extracts diagnoses, drugs, and lab indicators.
- **Lightweight Clinical Rules Engine**: Pre-evaluates metrics (hyperglycemia, gestational anemia).
- **Anakin Research Integration**: Retrieves guideline data on-demand.
- **Physician Decision Gate**: One-click actions to Approve, Modify, Schedule, or Refer.

---

## Workflow Diagram
```
Landing Page
   ↓
Patient Consultation
   ↓
Medical Report Upload
   ↓
OCR Processing (Tesseract)
   ↓
Medical Parser (Lab/Drug Normalizer)
   ↓
Context Builder (LLM Prompt Compiler)
   ↓
Anakin Clinical Search
   ↓
Anakin Agentic Research
   ↓
Clinical Summary Synthesis
   ↓
Physician Decision Support Gate
   ↓ (Approve | Modify | Schedule | Refer)
Clinical Record Finalization
```

---

## Architecture

### AI Agents
1. **Patient Intake Agent**: Converses with the patient to build demographic and symptom contexts.
2. **Medical Document Intelligence Agent**: Processes text and conducts quasi-identifier PII reviews.
3. **Evidence Retrieval Agent**: Cross-references care plans against clinical literature.
4. **Clinical Summary Agent**: Synthesizes notes into chronological timelines.
5. **Physician Copilot Agent**: Answers clinical queries based on the patient record.

### OCR Pipeline
- Extracts raw text using the configured OCR Provider.
- Identifies entities and maps values against standardized test ranges.

### Anakin Integration
- Connects securely to Anakin QuickApps to perform deep clinical database and web searches.

---

## Tech Stack
- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Orchestration**: Custom AI Orchestrator

---

## Repository Structure
```
medcare/
├── app/                  # Next.js Pages & Routes
│   ├── api/              # API Endpoints (/chat, /ocr, /analyze, /research, /records)
│   ├── consultation/     # Patient intake page
│   ├── physician/        # Physician decision support page
│   ├── summary/          # Synthesized clinical brief page
│   ├── upload/           # Document upload & PII redaction page
│   ├── globals.css       # Styling configuration
│   ├── layout.tsx        # Application root shell
│   └── page.tsx          # Main physician dashboard
│
├── components/           # UI Components
│   ├── consultation/     # Intake chatbot widget
│   ├── physician/        # Decision support and action panels
│   ├── summary/          # Chronological timeline and briefing views
│   ├── upload/           # File uploader and HITL review queue
│   ├── ui/               # Modular styling parts
│   ├── common/           # Shared components
│   └── landing/          # Dashboard components
│
├── docs/                 # System Documentation (overview.md, current-status.md)
├── lib/                  # Shared Services & Utility Core
│   ├── agents/           # The 5 specialized clinical workflow agents
│   ├── ai/               # Context compiler and orchestrator
│   ├── anakin/           # Anakin API client and search wrappers
│   ├── constants/        # System configuration constants
│   ├── medical/          # Lab thresholds and drug dictionary
│   ├── ocr/              # Text extractor and normalizers
│   ├── risk/             # Patient risk classifier
│   └── utils/            # Database and style helper libraries
│
├── public/               # Public assets
├── types/                # Shared TypeScript definitions
└── package.json          # Dependency definition file
```

---

## Installation
```bash
# Clone the repository
git clone https://github.com/lavitra007/Anakin-Blitz-Hackathon.git MedCare

# Navigate to project folder
cd MedCare

# Install dependencies
npm install

# Build production package
npm run build

# Launch dev server
npm run dev
```

---

## Environment Variables
Create a `.env.local` file in the root folder with:
```env
ANAKIN_API_KEY=your_anakin_api_token
OCR_PROVIDER=tesseract
NEXT_PUBLIC_APP_NAME=MedCare
```

---

## Future Roadmap
1. Support for real-time speech-to-text intake.
2. Vector-based semantic index search.
3. Multi-clinic patient record synchronization.

---

## License
Distributed under the MIT License. See [LICENSE](LICENSE) for details.
