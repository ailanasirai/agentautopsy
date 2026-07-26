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

async function callGemini(trace: AgentTrace): Promise<GeminiDiagnosis> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set in environment variables.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = buildDiagnosisPrompt(trace);
  const result = await model.generateContent(prompt);
  const rawText = result.response.text();
  const cleaned = rawText.replace(/```json|```/g, "").trim();

  return JSON.parse(cleaned) as GeminiDiagnosis;
}

/**
 * Rule-based fallback diagnosis. Used only if the Gemini call fails
 * (network issue, invalid key, quota, etc.) so the app always returns
 * a usable result instead of a hard error.
 */
function fallbackDiagnosis(trace: AgentTrace): GeminiDiagnosis {
  const steps = trace.steps;
  const retrySteps = steps.filter((s) => s.status === "retry");
  const errorToolStep = steps.find(
    (s) => s.type === "tool_call" && s.status === "error"
  );
  const errorDecisionStep = steps.find(
    (s) => s.type === "decision" && s.status === "error"
  );
  const errorStep = steps.find((s) => s.status === "error");

  if (retrySteps.length >= 2) {
    const last = retrySteps[retrySteps.length - 1];
    return {
      failure_detected: true,
      failure_type: "loop",
      root_cause: `The agent retried the same action ${retrySteps.length} times (last seen at step ${last.step_number}) without making progress, indicating a repetitive loop.`,
      suggested_fix:
        "Add a maximum retry limit and a distinct fallback path when the same action repeats without new information.",
      confidence: 68,
      reasoning_chain: [
        "The AI diagnosis engine was unavailable, so this is a rule-based analysis.",
        `Detected ${retrySteps.length} retry-status steps in the trace.`,
        "Repeated retries on the same action are a strong signal of a loop.",
      ],
    };
  }

  if (errorToolStep) {
    return {
      failure_detected: true,
      failure_type: "wrong_tool_call",
      root_cause: `Step ${errorToolStep.step_number} called the tool "${errorToolStep.tool_name || "unknown"}" and received an error, suggesting incorrect parameters or tool selection.`,
      suggested_fix:
        "Validate tool arguments against the tool's expected schema before dispatching the call.",
      confidence: 65,
      reasoning_chain: [
        "The AI diagnosis engine was unavailable, so this is a rule-based analysis.",
        `Step ${errorToolStep.step_number} is a tool_call step with status "error".`,
      ],
    };
  }

  if (errorDecisionStep) {
    return {
      failure_detected: true,
      failure_type: "hallucination",
      root_cause: `Step ${errorDecisionStep.step_number} produced a decision that appears inconsistent with the retrieved information available at that point.`,
      suggested_fix:
        "Constrain the model to only use retrieved context and add a verification step before finalizing the answer.",
      confidence: 60,
      reasoning_chain: [
        "The AI diagnosis engine was unavailable, so this is a rule-based analysis.",
        `Step ${errorDecisionStep.step_number} is a decision step marked as an error.`,
      ],
    };
  }

  if (errorStep) {
    return {
      failure_detected: true,
      failure_type: "timeout",
      root_cause: `Step ${errorStep.step_number} did not complete successfully, and no further recovery step followed.`,
      suggested_fix:
        "Add timeout handling and a graceful fallback response when a step fails to complete.",
      confidence: 55,
      reasoning_chain: [
        "The AI diagnosis engine was unavailable, so this is a rule-based analysis.",
        `Step ${errorStep.step_number} has status "error" with no clear pattern match.`,
      ],
    };
  }

  return {
    failure_detected: false,
    failure_type: "none",
    root_cause: "No error or retry steps were found in this trace.",
    suggested_fix: "No fix needed — this run completed without detected issues.",
    confidence: 70,
    reasoning_chain: [
      "The AI diagnosis engine was unavailable, so this is a rule-based analysis.",
      "No error or retry statuses were present in any step.",
    ],
  };
}

export async function getDiagnosis(trace: AgentTrace): Promise<GeminiDiagnosis> {
  try {
    return await callGemini(trace);
  } catch (err) {
    console.error("Gemini call failed, using fallback diagnosis:", err);
    return fallbackDiagnosis(trace);
  }
}
