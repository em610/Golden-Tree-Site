
import { GoogleGenAI, Type } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async analyzeConstructionDoc(data: string | Uint8Array, fileName: string, mimeType: string = 'text/plain') {
    let parts: any[] = [
      { text: `Perform a full 6-Loop Industrial Analysis on: "${fileName}". Detect risks and evaluate luxury standard compliance.` }
    ];

    if (mimeType === 'application/pdf' && typeof data === 'string') {
        parts.push({ inlineData: { data, mimeType: 'application/pdf' } });
    } else if (typeof data === 'string') {
        parts.push({ text: `DATA_STREAM:\n${data}` });
    }

    const response = await this.ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: { parts },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            loops: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  loop: { type: Type.STRING },
                  status: { type: Type.STRING },
                  findings: { type: Type.ARRAY, items: { type: Type.STRING } },
                  recommendation: { type: Type.STRING }
                },
                required: ["loop", "status", "findings", "recommendation"]
              }
            },
            luxuryCompliance: {
              type: Type.OBJECT,
              properties: {
                mockupStatus: { type: Type.STRING },
                holdPointsDetected: { type: Type.ARRAY, items: { type: Type.STRING } },
                protectionWarning: { type: Type.STRING, nullable: true }
              },
              required: ["mockupStatus", "holdPointsDetected"]
            },
            risks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  description: { type: Type.STRING },
                  severity: { type: Type.STRING },
                  mitigation: { type: Type.STRING }
                },
                required: ["description", "severity", "mitigation"]
              }
            }
          },
          required: ["summary", "loops", "luxuryCompliance", "risks"]
        }
      }
    });

    return JSON.parse(response.text);
  }

  async getChatResponse(message: string, history: { role: 'user' | 'assistant', content: string }[]) {
    const chat = this.ai.chats.create({
      model: "gemini-3-pro-preview",
      config: { systemInstruction: SYSTEM_INSTRUCTION },
    });
    const response = await chat.sendMessage({ message });
    return response.text;
  }
}

export const geminiService = new GeminiService();
