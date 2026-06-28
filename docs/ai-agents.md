# 🤖 MedCare AI — Specialized AI Agents

MedCare AI leverages five dedicated AI agents designed to handle specific clinical operations within a secure sandbox environment.

## 1. Intake Agent
- **Role**: Conversational onboarding.
- **Responsibility**: Warm, empathetic patient interaction. Gathers vital information including symptoms, gestational progress, medications, and allergies.
- **Integration**: Chatbot endpoint on Anakin AI (`ANAKIN_APP_ID_CHAT`).

## 2. Document Agent
- **Role**: Record processing & OCR.
- **Responsibility**: Run OCR on PDF reports/prescriptions, extract text sections, parse lab values, and identify Personable Identifiable Information (PII) for redaction.
- **Integration**: Regex parser & Gemini PII extraction model.

## 3. Evidence Agent
- **Role**: Clinical verification & research.
- **Responsibility**: Cross-check proposed care plans against medical guidelines (ACOG, ADA), identify potential drug-drug/food-drug contraindications, and query research repositories.
- **Integration**: Quick App workflow on Anakin AI (`ANAKIN_APP_ID_RESEARCH`).

## 4. Summary Agent
- **Role**: Profile compiler.
- **Responsibility**: Merge intake conversation data, processed documents, and research into a structured clinical briefing with chronological event timelines.
- **Integration**: Orchestrated markdown builder.

## 5. Physician Agent
- **Role**: Clinical assistant.
- **Responsibility**: Answer doctors' questions during the consultation with citation-backed, grounded insights based on the patient record.
- **Integration**: Chatbot endpoint on Anakin AI (`ANAKIN_APP_ID_CHAT`).
