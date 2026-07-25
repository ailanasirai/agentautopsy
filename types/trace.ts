export type StepType = "llm_call" | "tool_call" | "decision" | "output";
export type StepStatus = "success" | "error" | "retry" | "pending";

export interface TraceStep {
  step_number: number;
  type: StepType;
  timestamp: string;
  tool_name?: string;
  input: string;
  output: string;
  duration_ms: number;
  status: StepStatus;
}

export interface AgentTrace {
  agent_name: string;
  framework: string;
  steps: TraceStep[];
  final_output: string;
  expected_outcome?: string;
}

export type FailureType =
  | "loop"
  | "wrong_tool_call"
  | "hallucination"
  | "timeout"
  | "none";

export interface AnomalyScore {
  step: number;
  deviation: number; // 0-100, higher = more unusual
}

export interface AnalysisResult {
  health_score: number;
  failure_detected: boolean;
  failure_type: FailureType;
  root_cause: string;
  suggested_fix: string;
  confidence: number;
  reasoning_chain: string[];
  anomaly_scores: AnomalyScore[];
  step_verdicts: { step_number: number; status: StepStatus }[];
}

export interface FullReport {
  id?: string;
  trace: AgentTrace;
  analysis: AnalysisResult;
  created_at?: string;
}
