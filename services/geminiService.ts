
import { GoogleGenAI, Type } from "@google/genai";
import { Transaction, UserConfig, AIInsight, FinancialGoal } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getFinancialInsights = async (
  transactions: Transaction[],
  userConfig: UserConfig,
  goals: FinancialGoal[]
): Promise<AIInsight[]> => {
  const prompt = `
    Analyze this user's financial situation and provide 3 smart, actionable insights.
    
    User Profile: ${userConfig.profile}
    Monthly Income Goal: ${userConfig.monthlyIncomeGoal}
    Currency: ${userConfig.currency}
    
    Current Goals: ${JSON.stringify(goals)}
    
    Recent Transactions (Last 20): ${JSON.stringify(transactions.slice(-20))}
    
    Provide insights that include a title, a short message, and a type ('tip', 'warning', or 'prediction').
    Be concise and professional.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              message: { type: Type.STRING },
              type: { type: Type.STRING, description: "One of: tip, warning, prediction" }
            },
            required: ["title", "message", "type"]
          }
        }
      }
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Error fetching AI insights:", error);
    return [{
      title: "Unable to load insights",
      message: "Check your connection and try again later.",
      type: "warning"
    }];
  }
};
