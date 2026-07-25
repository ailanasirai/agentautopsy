import { NextRequest, NextResponse } from "next/server";
import { parseAndValidateTrace } from "@/lib/traceParser";
import { calculateHealthScore } from "@/lib/healthScore";
import { computeAnomalyScores } from "@/lib/anomalyDetector";
import { getDiagnosis } from "@/lib/gemini";
import { AnalysisResult } from "@/types/trace";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = parseAndValidateTrace(body);

    if (!parsed.valid || !parsed.trace) {
      return NextResponse.json(
        { error: parsed.error || "Invalid trace format." },
        { status: 400 }
      );
    }

    const trace = parsed.trace;

    const health_score = calculateHealthScore(trace);
    const anomaly_scores = computeAnomalyScores(trace);

    let diagnosis;
    try {
      diagnosis = await getDiagnosis(trace);
    } catch (err) {
      console.error("Gemini diagnosis failed:", err);
      return NextResponse.json(
        { error: "AI diagnosis failed. Please try again in a moment." },
        { status: 502 }
      );
    }

    const step_verdicts = trace.steps.map((s) => ({
      step_number: s.step_number,
      status: s.status,
    }));

    const result: AnalysisResult = {
      health_score,
      failure_detected: diagnosis.failure_detected,
      failure_type: diagnosis.failure_type,
      root_cause: diagnosis.root_cause,
      suggested_fix: diagnosis.suggested_fix,
      confidence: diagnosis.confidence,
      reasoning_chain: diagnosis.reasoning_chain,
      anomaly_scores,
      step_verdicts,
    };

    return NextResponse.json({ trace, analysis: result });
  } catch (err) {
    console.error("Analyze route error:", err);
    return NextResponse.json(
      { error: "Something went wrong while analyzing the trace." },
      { status: 500 }
    );
  }
}
