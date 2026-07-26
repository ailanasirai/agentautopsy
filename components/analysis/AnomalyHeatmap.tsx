"use client";

import { motion } from "framer-motion";
import { AnomalyScore } from "@/types/trace";

function deviationColor(deviation: number): string {
  if (deviation > 70) return "var(--danger)";
  if (deviation > 40) return "var(--warning)";
  return "var(--success)";
}

function deviationLabel(deviation: number): string {
  if (deviation > 70) return "High";
  if (deviation > 40) return "Medium";
  return "Low";
}

export default function AnomalyHeatmap({ scores }: { scores: AnomalyScore[] }) {
  return (
    <div
      className="rounded-2xl border p-8 transition-all hover:shadow-lg hover:-translate-y-0.5"
      style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}
    >
      <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
        How unusual each step is compared to the rest of the run — based on
        timing deviation and step status.
      </p>

      <div className="flex gap-3 flex-wrap mb-8">
        {scores.map((s, i) => (
          <motion.div
            key={s.step}
            initial={{ opacity: 0, scale: 0.6 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            whileHover={{ scale: 1.12, y: -3 }}
            className="relative group"
          >
            <div
              className="w-14 h-14 rounded-xl flex flex-col items-center justify-center text-sm font-semibold"
              style={{
                background: deviationColor(s.deviation),
                color: "var(--bg-card)",
                opacity: 0.45 + (s.deviation / 100) * 0.55,
              }}
            >
              {s.step}
            </div>
            <div
              className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10"
              style={{
                background: "var(--bg-elevated)",
                color: "var(--text-primary)",
                boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
              }}
            >
              Step {s.step} — {s.deviation}% unusual ({deviationLabel(s.deviation)})
            </div>
          </motion.div>
        ))}
      </div>

      {/* Legend */}
      <div
        className="flex items-center gap-6 pt-6 border-t text-xs"
        style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
      >
        <span className="font-medium" style={{ color: "var(--text-primary)" }}>
          Legend
        </span>
        <span className="flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-sm"
            style={{ background: "var(--success)" }}
          />
          Low
        </span>
        <span className="flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-sm"
            style={{ background: "var(--warning)" }}
          />
          Medium
        </span>
        <span className="flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-sm"
            style={{ background: "var(--danger)" }}
          />
          High
        </span>
      </div>
    </div>
  );
}
