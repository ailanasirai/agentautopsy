"use client";

import { motion } from "framer-motion";
import { AlertTriangle, ShieldCheck, Lightbulb } from "lucide-react";
import { AnalysisResult } from "@/types/trace";

const FAILURE_LABELS: Record<string, string> = {
  loop: "Infinite / repetitive loop",
  wrong_tool_call: "Wrong tool call",
  hallucination: "Hallucinated reasoning",
  timeout: "Timeout / incomplete execution",
  none: "No failure detected",
};

function severityLabel(confidence: number, isCritical: boolean): string {
  if (!isCritical) return "Healthy";
  if (confidence >= 75) return "High severity";
  if (confidence >= 50) return "Moderate severity";
  return "Low severity";
}

export default function RootCauseCard({ analysis }: { analysis: AnalysisResult }) {
  const isCritical = analysis.failure_detected;
  const accentColor = isCritical ? "var(--danger)" : "var(--success)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4 }}
      className={`relative overflow-hidden rounded-2xl border flex-1 ${
        isCritical ? "animate-pulse-danger" : "glow-success"
      }`}
      style={{ borderColor: accentColor, background: "var(--bg-card)" }}
    >
      {/* Colored top accent strip */}
      <div className="h-1.5 w-full" style={{ background: accentColor }} />

      <div className="p-8">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            {isCritical ? (
              <AlertTriangle size={18} style={{ color: accentColor }} />
            ) : (
              <ShieldCheck size={18} style={{ color: accentColor }} />
            )}
            <span className="font-semibold text-base" style={{ color: accentColor }}>
              {isCritical
                ? `Root cause: ${FAILURE_LABELS[analysis.failure_type]}`
                : "No critical failure detected"}
            </span>
          </div>
          <div className="flex gap-2">
            <span
              className="text-xs font-medium px-2.5 py-1 rounded-full"
              style={{ background: `${accentColor}22`, color: accentColor }}
            >
              {severityLabel(analysis.confidence, isCritical)}
            </span>
            <span
              className="text-xs font-medium px-2.5 py-1 rounded-full"
              style={{ background: "var(--bg-elevated)", color: "var(--text-secondary)" }}
            >
              {analysis.confidence}% confidence
            </span>
          </div>
        </div>

        <p className="text-sm mb-5" style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>
          {analysis.root_cause}
        </p>

        {isCritical && (
          <div
            className="rounded-xl p-4 flex items-start gap-3"
            style={{
              background: "var(--accent-glow)",
              borderLeft: "3px solid var(--accent)",
            }}
          >
            <Lightbulb size={16} style={{ color: "var(--accent)", marginTop: 2 }} />
            <div>
              <span className="text-sm font-semibold block mb-1" style={{ color: "var(--accent)" }}>
                Suggested fix
              </span>
              <span className="text-sm" style={{ lineHeight: 1.6 }}>
                {analysis.suggested_fix}
              </span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
