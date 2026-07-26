"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, RefreshCw, Clock } from "lucide-react";
import { TraceStep } from "@/types/trace";

const STATUS_STYLE: Record<
  string,
  { color: string; icon: React.ElementType; glow: string }
> = {
  success: { color: "var(--success)", icon: Check, glow: "glow-success" },
  error: { color: "var(--danger)", icon: X, glow: "glow-danger" },
  retry: { color: "var(--warning)", icon: RefreshCw, glow: "glow-warning" },
  pending: { color: "var(--text-muted)", icon: Clock, glow: "" },
};

export default function Timeline({ steps }: { steps: TraceStep[] }) {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div
      className="rounded-2xl border p-8 transition-all hover:shadow-lg hover:-translate-y-0.5"
      style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}
    >
      <span className="text-sm block mb-4" style={{ color: "var(--text-secondary)" }}>
        Execution timeline
      </span>
      <div className="flex items-start gap-1 overflow-x-auto pb-2">
        {steps.map((step, i) => {
          const style = STATUS_STYLE[step.status] || STATUS_STYLE.pending;
          const Icon = style.icon;
          return (
            <div key={step.step_number} className="flex items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.08, type: "spring", stiffness: 300 }}
                whileHover={{ scale: 1.1, y: -2 }}
                onClick={() =>
                  setExpanded(expanded === step.step_number ? null : step.step_number)
                }
                className="flex flex-col items-center gap-1.5 min-w-[68px] cursor-pointer"
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center ${
                    step.status === "error" ? style.glow : ""
                  }`}
                  style={{ background: style.color }}
                >
                  <Icon size={16} color="var(--bg-card)" />
                </div>
                <span className="text-[11px]" style={{ color: "var(--text-secondary)" }}>
                  Step {step.step_number}
                </span>
              </motion.div>
              {i < steps.length - 1 && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: i * 0.08 + 0.1, duration: 0.3 }}
                  style={{
                    originX: 0,
                    height: 1,
                    width: 24,
                    background: "var(--border)",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {expanded !== null && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t text-sm overflow-hidden"
            style={{ borderColor: "var(--border)" }}
          >
            {(() => {
              const s = steps.find((s) => s.step_number === expanded)!;
              return (
                <div className="space-y-1">
                  <p>
                    <span style={{ color: "var(--text-secondary)" }}>Type: </span>
                    {s.type} {s.tool_name && `(${s.tool_name})`}
                  </p>
                  <p>
                    <span style={{ color: "var(--text-secondary)" }}>Input: </span>
                    {s.input}
                  </p>
                  <p>
                    <span style={{ color: "var(--text-secondary)" }}>Output: </span>
                    {s.output}
                  </p>
                  <p>
                    <span style={{ color: "var(--text-secondary)" }}>Duration: </span>
                    {s.duration_ms}ms
                  </p>
                </div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
