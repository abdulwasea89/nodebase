import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.warn("GEMINI_API_KEY is not set");
}

const genAI = new GoogleGenerativeAI(apiKey || "");

export const generateContent = async (prompt: string) => {
    if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not set");
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Error generating content with Gemini:", error);
        throw error;
    }
};
