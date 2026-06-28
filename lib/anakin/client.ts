export interface AnakinConfig {
  apiKey: string;
  versionHeader?: string;
}

export interface QuickAppRunParams {
  inputs: Record<string, any>;
  stream?: boolean;
}

export interface ChatbotMessageParams {
  content: string;
  stream?: boolean;
  conversationId?: string;
}

export class AnakinClient {
  private apiKey: string;
  private versionHeader: string;
  private baseUrl = "https://api.anakin.ai/v1";

  constructor(config?: AnakinConfig) {
    this.apiKey = config?.apiKey || process.env.ANAKIN_API_KEY || "";
    this.versionHeader = config?.versionHeader || "2024-05-06";
  }

  private getHeaders() {
    return {
      "Authorization": `Bearer ${this.apiKey}`,
      "X-Anakin-Api-Version": this.versionHeader,
      "Content-Type": "application/json",
    };
  }

  /**
   * Run a Quick App workflow on Anakin.ai
   */
  async runQuickApp(appId: string, params: QuickAppRunParams) {
    if (!this.apiKey) {
      throw new Error("Anakin API key is missing. Set ANAKIN_API_KEY in your environment.");
    }
    if (!appId) {
      throw new Error("Anakin App ID is missing.");
    }

    const response = await fetch(`${this.baseUrl}/quickapps/${appId}/runs`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({
        inputs: params.inputs,
        stream: params.stream ?? false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Anakin QuickApp Run Failed (${response.status}): ${errorText}`);
    }

    return await response.json();
  }

  /**
   * Send a message to a Chatbot app on Anakin.ai
   */
  async sendChatbotMessage(appId: string, params: ChatbotMessageParams) {
    if (!this.apiKey) {
      throw new Error("Anakin API key is missing. Set ANAKIN_API_KEY in your environment.");
    }
    if (!appId) {
      throw new Error("Anakin App ID is missing.");
    }

    const body: Record<string, any> = {
      content: params.content,
      stream: params.stream ?? false,
    };

    if (params.conversationId) {
      body.conversationId = params.conversationId;
    }

    const response = await fetch(`${this.baseUrl}/chatbots/${appId}/messages`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Anakin Chatbot Send Failed (${response.status}): ${errorText}`);
    }

    return await response.json();
  }
}

// Default export of a single client instance
export const anakinClient = new AnakinClient();
