import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const analyzeRescueImage = async (base64Image: string) => {
  const model = "gemini-3-flash-preview";
  
  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image.split(",")[1] || base64Image,
            },
          },
          {
            text: "Analyze this street animal image. Identify: 1. Animal type 2. Condition (Injured, Abandoned, Healthy) 3. Severity (Low, Medium, High, Critical) 4. Brief description of the distress. Return as JSON.",
          },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          animalType: { type: Type.STRING },
          condition: { type: Type.STRING },
          severity: { type: Type.STRING },
          description: { type: Type.STRING },
          priorityScore: { type: Type.NUMBER, description: "Score from 1-10" },
        },
        required: ["animalType", "condition", "severity", "description", "priorityScore"],
      },
    },
  });

  return JSON.parse(response.text || "{}");
};

export const getRescueGuidance = async (condition: string) => {
  const model = "gemini-3-flash-preview";
  const response = await ai.models.generateContent({
    model,
    contents: `Provide immediate first-aid guidance for a street animal with the following condition: ${condition}. Keep it concise and actionable for a non-professional responder.`,
  });
  return response.text;
};
