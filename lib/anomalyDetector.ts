import { AgentTrace, AnomalyScore } from "@/types/trace";

/**
 * Computes a 0-100 "unusualness" score per step using simple statistical
 * deviation on duration + status, so the heatmap has real signal behind it.
 */
export function computeAnomalyScores(trace: AgentTrace): AnomalyScore[] {
  const steps = trace.steps;
  if (steps.length === 0) return [];

  const durations = steps.map((s) => s.duration_ms);
  const mean = durations.reduce((a, b) => a + b, 0) / durations.length;
  const variance =
    durations.reduce((sum, d) => sum + (d - mean) ** 2, 0) / durations.length;
  const stdDev = Math.sqrt(variance) || 1;

  return steps.map((step) => {
    // z-score based duration deviation, normalized to 0-100
    const zScore = Math.abs(step.duration_ms - mean) / stdDev;
    let deviation = Math.min(100, zScore * 25);

    // Status contributes directly to anomaly weight
    if (step.status === "error") deviation = Math.max(deviation, 85);
    else if (step.status === "retry") deviation = Math.max(deviation, 55);

    return {
      step: step.step_number,
      deviation: Math.round(deviation),
    };
  });
}
