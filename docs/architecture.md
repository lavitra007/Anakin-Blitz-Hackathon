# 🏥 MedCare AI — Architecture Document

## System Overview
MedCare AI is an advanced, multi-agent AI system designed to ensure medical care continuity for pregnant patients and individuals managing chronic illnesses. It integrates clinical intake, document processing (OCR), redaction, safety checks, and clinical decision support into a cohesive platform.

```mermaid
graph TB
    subgraph Client["Next.js Web UI"]
        Dashboard["Patient/Doctor Dashboard"]
        Upload["File Upload (OCR)"]
        Consult["Consultation Panel"]
    end

    subgraph Orchestrator["AI Orchestrator"]
        Router["Orchestrator Interface"]
        Intake["1. Intake Agent"]
        DocAgent["2. Document Agent"]
        Evidence["3. Evidence Agent"]
        Summary["4. Summary Agent"]
        Physician["5. Physician Agent"]
    end

    subgraph External["External APIs"]
        Anakin["Anakin AI API"]
        Gemini["Google Gemini AI"]
    end

    Client --> Router
    Router --> Intake
    Router --> DocAgent
    Router --> Evidence
    Router --> Summary
    Router --> Physician

    Intake --> Anakin
    DocAgent --> Gemini
    Evidence --> Anakin
    Physician --> Anakin
```

## Core Layers
1. **Presentation Layer (Next.js / Tailwind CSS)**:
   - Dynamic, dark-themed dashboard.
   - Separate portals for patient intake, medical report uploads, clinical briefings, and physician consultation.
2. **Orchestration Layer (`lib/ai/orchestrator.ts`)**:
   - Manages and routes calls between the dedicated AI agents.
   - Aggregates state and clinical data context to feed into prompt systems.
3. **Agent Layer (`lib/agents/`)**:
   - Specialized agents: **Intake**, **Document**, **Evidence**, **Summary**, and **Physician**.
4. **Integration Layer (`lib/anakin/` & `lib/ocr/`)**:
   - `client.ts`: Connects to Anakin AI Quick Apps and Chatbot Endpoints.
   - `extractor.ts`: Performs document text extraction (OCR).
   - `parser.ts`: Parses clinical text fields.
