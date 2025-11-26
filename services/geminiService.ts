import { GoogleGenAI, Type } from "@google/genai";
import { Email, TeamsMessage, Track, Priority } from "../types.ts";

// The API key is loaded from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: "A concise, action-oriented title for the request." },
        description: { type: Type.STRING, description: "A detailed description of the request, summarizing the key points from the source message." },
        stakeholder: { type: Type.STRING, description: "The name or email of the person making the request." },
        track: { type: Type.STRING, description: "The most relevant functional track for this request.", enum: Object.values(Track) },
        priority: { type: Type.STRING, description: "The inferred priority of the request.", enum: Object.values(Priority) },
    },
    required: ["title", "description", "stakeholder", "track", "priority"],
};

const systemInstruction = `You are an intelligent assistant for a project management hub. Your task is to analyze incoming communications (emails, Teams messages) and extract structured data to create a formal project request. Be precise and infer the required fields accurately based on the content provided. The user is a project manager who needs this information to be clear and actionable. The stakeholder is the person who sent the original message.`;

export const analyzeEmailForRequest = async (email: Email) => {
    const prompt = `
        Analyze the following email and extract the necessary information to create a project request.

        From: ${email.sender}
        Subject: ${email.subject}
        Date: ${email.date}
        Body Snippet: ${email.snippet}
        Full Body: ${email.body || ''}

        Based on this, generate a JSON object that conforms to the required schema.
    `;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            systemInstruction,
            responseMimeType: "application/json",
            responseSchema,
        },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
};

export const analyzeTeamsMessageForRequest = async (message: TeamsMessage) => {
    const prompt = `
        Analyze the following Microsoft Teams message and extract the necessary information to create a project request.

        From: ${message.sender}
        Channel: ${message.channel}
        Timestamp: ${message.timestamp}
        Message: ${message.message}

        Based on this, generate a JSON object that conforms to the required schema.
    `;
    
     const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            systemInstruction,
            responseMimeType: "application/json",
            responseSchema,
        },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
};
