import { GoogleGenAI, ChatSession, GenerateContentStreamResult } from "@google/genai";
import { SYSTEM_INSTRUCTION, RESUME_DATA } from "../constants";

// Initialize the Gemini API client
// Accessing API_KEY directly from process.env as per instructions
const apiKey = process.env.API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey });

let chatSession: ChatSession | null = null;

export const getChatSession = (): ChatSession => {
  if (!chatSession) {
    chatSession = ai.chats.create({
      model: 'gemini-3-pro-preview',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
      },
    });
  }
  return chatSession;
};

export const sendMessageToGemini = async (message: string): Promise<GenerateContentStreamResult> => {
  const session = getChatSession();
  try {
    const result = await session.sendMessageStream({ message });
    return result;
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    throw error;
  }
};

export const analyzeJobMatch = async (jobDescription: string): Promise<GenerateContentStreamResult> => {
  // We use a fresh model instance for this specific task to avoid polluting the chat history
  // and to ensure a specific formatted output.
  
  const prompt = `
    Task: You are an expert AI Technical Recruiter and Career Coach. 
    Analyze the following Candidate Resume against the provided Job Description (JD).

    Candidate Resume Data:
    ${JSON.stringify(RESUME_DATA)}

    Target Job Description:
    ${jobDescription}

    Output Requirements (Please respond in CHINESE - 简体中文):
    1.  **Match Score**: Give a score from 0 to 100.
    2.  **核心优势**: One sentence explaining the single biggest reason to hire this candidate.
    3.  **深度分析**: 
        -   ✅ **核心匹配 (Matching Skills)**: List 3 key skills from the resume that perfectly match the JD.
        -   🚀 **独特价值 (Unique Value)**: How this candidate's specific project experience (e.g., AI Agents, Vibe Coding) adds extra value beyond the JD.
        -   ⚠️ **差距应对 (Gap Strategy)**: If there's a gap, briefly explain how the candidate's learning ability (proven by their projects) covers it.
    
    Format the output as Markdown. Start the response STRICTLY with the line: "SCORE: [Number]" followed by the rest of the analysis.
    Example:
    SCORE: 88
    
    ### 🎯 核心优势
    ...
  `;

  try {
    const result = await ai.models.generateContentStream({
      model: 'gemini-3-pro-preview',
      contents: prompt,
    });
    return result;
  } catch (error) {
    console.error("Error analyzing job match:", error);
    throw error;
  }
};