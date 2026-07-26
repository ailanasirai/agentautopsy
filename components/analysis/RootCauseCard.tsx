"use client";

import { motion } from "framer-motion";
import { Lightbulb, ShieldCheck } from "lucide-react";
import { AnalysisResult } from "@/types/trace";

const FAILURE_LABELS: Record<string, string> = {
  loop: "Infinite / repetitive loop",
  wrong_tool_call: "Wrong tool call",
  hallucination: "Hallucinated reasoning",
  timeout: "Timeout / incomplete execution",
  none: "No failure detected",
};

export default function RootCauseCard({ analysis }: { analysis: AnalysisResult }) {
  const isCritical = analysis.failure_detected;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4 }}
      className={`rounded-2xl border p-8 flex-1 ${
        isCritical ? "animate-pulse-danger" : "glow-success"
      }`}
      style={{
        borderColor: isCritical ? "var(--danger)" : "var(--success)",
        background: "var(--bg-card)",
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {isCritical ? (
            <Lightbulb size={16} style={{ color: "var(--danger)" }} />
          ) : (
            <ShieldCheck size={16} style={{ color: "var(--success)" }} />
          )}
          <span
            className="font-medium text-[15px]"
            style={{ color: isCritical ? "var(--danger)" : "var(--success)" }}
          >
            {isCritical
              ? `Root cause: ${FAILURE_LABELS[analysis.failure_type]}`
              : "No critical failure detected"}
          </span>
        </div>
        <span
          className="text-xs px-2 py-1 rounded-md"
          style={{ background: "var(--bg-elevated)", color: "var(--text-secondary)" }}
        >
          {analysis.confidence}% confidence
        </span>
      </div>
      <p className="text-sm mb-2" style={{ color: "var(--text-secondary)" }}>
        {analysis.root_cause}
      </p>
      {isCritical && (
        <div
          className="mt-3 pt-3 border-t text-sm flex items-start gap-2"
          style={{ borderColor: "var(--border)" }}
        >
          <span style={{ color: "var(--accent)" }}>Fix:</span>
          <span>{analysis.suggested_fix}</span>
        </div>
      )}
    </motion.div>
  );
}
