
import { GoogleGenAI } from "@google/genai";

export const getGeminiResponse = async (prompt: string): Promise<string> => {
    const apiKey = localStorage.getItem('gemini_api_key');

    if (!apiKey) {
        throw new Error("Gemini API Key not found. Please set it using the key icon in the top-left corner.");
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: [{ parts: [{ text: prompt }] }],
    });

    return response.text?.trim() || "";
};
