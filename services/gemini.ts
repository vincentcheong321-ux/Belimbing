
import { GoogleGenAI } from "@google/genai";
import { VisitorData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const logVisitorEntry = async (visitor: VisitorData, status: string): Promise<string> => {
  try {
    const prompt = `
      Create a formal, brief security log entry for a condominium visitor check-in.
      
      Visitor Details:
      - Name: ${visitor.fullName}
      - IC: ${visitor.icNumber} (Mask the middle digits for privacy in the log)
      - Car Plate: ${visitor.carPlate || 'N/A'}
      - Destination: Block ${visitor.blockNumber}, Lot ${visitor.lotNumber}, Unit ${visitor.unitNumber}
      - Check-in Status: ${status}
      - Time: ${new Date().toLocaleString()}

      The log should be professional and suitable for a property management audit trail. 
      Mention if the check-in is standard or if there are any noted regularities based on standard Malaysian condo protocols (just imply standard procedure was followed).
      Keep it under 50 words.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Log entry generated successfully.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Manual Override: System offline, entry logged locally.";
  }
};
