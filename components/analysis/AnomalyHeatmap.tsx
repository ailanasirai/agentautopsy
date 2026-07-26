"use client";

import { motion } from "framer-motion";
import { AnomalyScore } from "@/types/trace";

function deviationColor(deviation: number): string {
  if (deviation > 70) return "var(--danger)";
  if (deviation > 40) return "var(--warning)";
  return "var(--success)";
}

export default function AnomalyHeatmap({ scores }: { scores: AnomalyScore[] }) {
  return (
    <div
      className="rounded-2xl border p-6 transition-all hover:shadow-lg hover:-translate-y-0.5"
      style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}
    >
      <span className="text-sm block mb-4" style={{ color: "var(--text-secondary)" }}>
        Anomaly heatmap
      </span>
      <div className="flex gap-2 flex-wrap">
        {scores.map((s, i) => (
          <motion.div
            key={s.step}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ scale: 1.15 }}
            className="relative group"
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-medium"
              style={{
                background: deviationColor(s.deviation),
                color: "var(--bg-card)",
                opacity: 0.4 + (s.deviation / 100) * 0.6,
              }}
            >
              {s.step}
            </div>
            <div
              className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-[11px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
              style={{ background: "var(--bg-elevated)", color: "var(--text-primary)" }}
            >
              {s.deviation}% unusual
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
