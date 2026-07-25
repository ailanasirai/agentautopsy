import { GoogleGenerativeAI } from "@google/generative-ai";
import { AgentTrace } from "@/types/trace";
import { buildDiagnosisPrompt } from "./promptTemplates";

export interface GeminiDiagnosis {
  failure_detected: boolean;
  failure_type: "loop" | "wrong_tool_call" | "hallucination" | "timeout" | "none";
  root_cause: string;
  suggested_fix: string;
  confidence: number;
  reasoning_chain: string[];
}

export async function getDiagnosis(trace: AgentTrace): Promise<GeminiDiagnosis> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set in environment variables.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = buildDiagnosisPrompt(trace);
  const result = await model.generateContent(prompt);
  const rawText = result.response.text();

  // Strip any accidental markdown fences before parsing
  const cleaned = rawText.replace(/```json|```/g, "").trim();

  try {
    return JSON.parse(cleaned) as GeminiDiagnosis;
  } catch {
    throw new Error("Failed to parse Gemini diagnosis response as JSON.");
  }
}
