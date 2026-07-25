import { AgentTrace } from "@/types/trace";

export interface ParseResult {
  valid: boolean;
  trace?: AgentTrace;
  error?: string;
}

export function parseAndValidateTrace(raw: unknown): ParseResult {
  if (typeof raw !== "object" || raw === null) {
    return { valid: false, error: "Trace must be a JSON object." };
  }

  const t = raw as Record<string, unknown>;

  if (!t.agent_name || typeof t.agent_name !== "string") {
    return { valid: false, error: "Missing or invalid 'agent_name' field." };
  }
  if (!t.framework || typeof t.framework !== "string") {
    return { valid: false, error: "Missing or invalid 'framework' field." };
  }
  if (!Array.isArray(t.steps) || t.steps.length === 0) {
    return { valid: false, error: "Trace must include a non-empty 'steps' array." };
  }
  if (typeof t.final_output !== "string") {
    return { valid: false, error: "Missing or invalid 'final_output' field." };
  }

  for (const [i, step] of (t.steps as unknown[]).entries()) {
    const s = step as Record<string, unknown>;
    if (
      typeof s.step_number !== "number" ||
      typeof s.type !== "string" ||
      typeof s.input !== "string" ||
      typeof s.output !== "string" ||
      typeof s.duration_ms !== "number" ||
      typeof s.status !== "string"
    ) {
      return {
        valid: false,
        error: `Step ${i + 1} is missing required fields (step_number, type, input, output, duration_ms, status).`,
      };
    }
  }

  return { valid: true, trace: t as unknown as AgentTrace };
}
