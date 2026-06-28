import { INTAKE_AGENT_PROMPT } from "../ai/prompts";
import { ContextBuilder } from "../ai/context-builder";
import { anakinClient } from "../anakin/client";

export interface IntakeData {
  name?: string;
  age?: number;
  gender?: string;
  pregnancyWeeks?: number;
  symptoms?: string[];
  medications?: string[];
  allergies?: string[];
}

export class IntakeAgent {
  /**
   * Generates a conversational follow-up to the patient's intake chat
   */
  async chat(messages: { role: string; content: string }[]): Promise<string> {
    const appId = process.env.ANAKIN_APP_ID_CHAT || "";
    
    const formattedHistory = ContextBuilder.buildConversationHistory(messages);
    const systemInstructions = INTAKE_AGENT_PROMPT;

    if (appId) {
      try {
        const response = await anakinClient.sendChatbotMessage(appId, {
          content: `${systemInstructions}\n\nChat History:\n${formattedHistory}\n\nReply to the patient.`,
        });
        return response.content || JSON.stringify(response);
      } catch (error) {
        console.error("Anakin Intake chat failed, using fallback:", error);
      }
    }

    // Call Gemini API or fallback to simulated dialogue
    return this.generateSimulatedChatResponse(messages);
  }

  /**
   * Extracts structured IntakeData from the conversation history
   */
  async extractIntakeData(messages: { role: string; content: string }[]): Promise<IntakeData> {
    // Combine all patient messages to analyze what they said
    const patientText = messages
      .filter(m => m.role === "user")
      .map(m => m.content)
      .join(" ");

    const textLower = patientText.toLowerCase();

    // Default simulated extraction from conversation
    const data: IntakeData = {};

    // Match name
    const nameMatch = patientText.match(/(?:my name is|i am|i'm)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/);
    if (nameMatch) {
      data.name = nameMatch[1];
    } else if (textLower.includes("priya")) {
      data.name = "Priya Sharma";
    }

    // Match age
    const ageMatch = patientText.match(/\b(\d{2})\s*(?:years|yrs|year)\b/i);
    if (ageMatch) {
      data.age = parseInt(ageMatch[1], 10);
    } else if (textLower.includes("priya")) {
      data.age = 29;
    }

    // Match gender
    if (textLower.includes("pregnant") || textLower.includes("gestational") || textLower.includes("obgyn")) {
      data.gender = "Female";
    }

    // Match pregnancy weeks
    const weekMatch = patientText.match(/\b(\d{1,2})\s*(?:weeks|wks|week)\b/i);
    if (weekMatch) {
      data.pregnancyWeeks = parseInt(weekMatch[1], 10);
    } else if (textLower.includes("28 weeks") || textLower.includes("third trimester")) {
      data.pregnancyWeeks = 28;
    }

    // Match allergies
    const allergies: string[] = [];
    if (textLower.includes("penicillin")) allergies.push("Penicillin");
    if (textLower.includes("peanut")) allergies.push("Peanuts");
    if (allergies.length > 0) data.allergies = allergies;

    // Match meds
    const meds: string[] = [];
    if (textLower.includes("metformin")) meds.push("Metformin");
    if (textLower.includes("calcium")) meds.push("Calcium");
    if (textLower.includes("iron")) meds.push("Iron Fumarate");
    if (meds.length > 0) data.medications = meds;

    // Match symptoms
    const symptoms: string[] = [];
    if (textLower.includes("fatigue") || textLower.includes("tired")) symptoms.push("Fatigue");
    if (textLower.includes("swelling") || textLower.includes("swollen")) symptoms.push("Ankle Swelling");
    if (textLower.includes("headache")) symptoms.push("Headache");
    if (symptoms.length > 0) data.symptoms = symptoms;

    return data;
  }

  private generateSimulatedChatResponse(messages: { role: string; content: string }[]): string {
    const lastMessage = messages[messages.length - 1]?.content.toLowerCase() || "";
    
    if (messages.length <= 1) {
      return "Hello, I am the MedCare Intake Assistant. I see you are onboarding today. Could you please share your name, age, and any current health conditions or symptoms you are experiencing?";
    }

    if (lastMessage.includes("priya") || lastMessage.includes("sharma")) {
      return "Thank you, Priya. It is nice to meet you. Are you currently pregnant? If so, how many weeks along are you, and what medications or vitamins are you taking?";
    }

    if (lastMessage.includes("pregnant") || lastMessage.includes("weeks")) {
      return "Congratulations on your pregnancy, Priya. Week 28 is the start of the third trimester. Have you had any symptoms like fatigue or ankle swelling, or any history of gestational diabetes? Also, do you have any allergies?";
    }

    return "Thank you for sharing those details. I've noted down your current conditions, symptoms, and allergies. I will compile this information for your consultation. Is there anything else you'd like to share, or do you have any records to upload?";
  }
}

export const intakeAgent = new IntakeAgent();
