import { AgentTrace } from "@/types/trace";

export function buildDiagnosisPrompt(trace: AgentTrace): string {
  return `You are an expert AI agent debugging assistant. Analyze this agent execution trace and diagnose what went wrong (if anything).

AGENT: ${trace.agent_name} (framework: ${trace.framework})
EXPECTED OUTCOME: ${trace.expected_outcome || "Not specified"}
FINAL OUTPUT: ${trace.final_output}

EXECUTION STEPS:
${trace.steps
  .map(
    (s) =>
      `Step ${s.step_number} [${s.type}${s.tool_name ? `: ${s.tool_name}` : ""}] status=${s.status}
  input: ${s.input}
  output: ${s.output}`
  )
  .join("\n\n")}

Classify the failure (if any) into exactly one of: "loop", "wrong_tool_call", "hallucination", "timeout", "none".

Respond with ONLY valid JSON, no markdown fences, no preamble, in this exact shape:
{
  "failure_detected": boolean,
  "failure_type": "loop" | "wrong_tool_call" | "hallucination" | "timeout" | "none",
  "root_cause": "one clear sentence explaining what went wrong and at which step",
  "suggested_fix": "one clear, actionable sentence on how to fix it",
  "confidence": number (0-100, your genuine confidence in this diagnosis),
  "reasoning_chain": ["short reasoning step 1", "short reasoning step 2", "short reasoning step 3"]
}`;
}
