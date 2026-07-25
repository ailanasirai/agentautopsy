import { AgentTrace } from "@/types/trace";

/**
 * Health score is deterministic (rule-based), not AI-generated.
 * This keeps scores reproducible and trustworthy — the AI only
 * explains WHY, this function decides the number.
 */
export function calculateHealthScore(trace: AgentTrace): number {
  const steps = trace.steps;
  if (steps.length === 0) return 0;

  let score = 100;

  const errorSteps = steps.filter((s) => s.status === "error").length;
  const retrySteps = steps.filter((s) => s.status === "retry").length;
  const totalSteps = steps.length;

  // Each error step is a heavy penalty
  score -= errorSteps * 20;

  // Each retry is a moderate penalty (retries indicate friction)
  score -= retrySteps * 8;

  // Retry ratio penalty — a high proportion of retries signals looping
  const retryRatio = retrySteps / totalSteps;
  if (retryRatio > 0.3) score -= 15;

  // Did the agent's final output look like a failure message?
  const failurePhrases = ["unable to", "error", "could not", "failed"];
  const outputLower = trace.final_output.toLowerCase();
  if (failurePhrases.some((p) => outputLower.includes(p))) {
    score -= 15;
  }

  // Duration anomaly — extremely long individual steps relative to average
  const avgDuration =
    steps.reduce((sum, s) => sum + s.duration_ms, 0) / totalSteps;
  const hasOutlierDuration = steps.some((s) => s.duration_ms > avgDuration * 4);
  if (hasOutlierDuration) score -= 5;

  return Math.max(0, Math.min(100, Math.round(score)));
}
