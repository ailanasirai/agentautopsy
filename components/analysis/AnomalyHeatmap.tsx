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
      <p className="text-sm mb-8" style={{ color: "var(--text-secondary)" }}>
        How unusual each step is compared to the rest of the run — based on
        timing deviation and step status.
      </p>

      <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", marginBottom: "32px" }}>
        {scores.map((s, i) => (
          <motion.div
            key={s.step}
            initial={{ opacity: 0, scale: 0.6 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            whileHover={{ scale: 1.12, y: -3 }}
            style={{ position: "relative" }}
            className="group"
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "15px",
                fontWeight: 600,
                background: deviationColor(s.deviation),
                color: "var(--bg-card)",
                opacity: 0.45 + (s.deviation / 100) * 0.55,
              }}
            >
              {s.step}
            </div>
            <div
              className="opacity-0 group-hover:opacity-100"
              style={{
                position: "absolute",
                bottom: "100%",
                marginBottom: "8px",
                left: "50%",
                transform: "translateX(-50%)",
                padding: "6px 12px",
                borderRadius: "8px",
                fontSize: "12px",
                whiteSpace: "nowrap",
                pointerEvents: "none",
                zIndex: 10,
                background: "var(--bg-elevated)",
                color: "var(--text-primary)",
                boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
                transition: "opacity 0.15s ease",
              }}
            >
              Step {s.step} — {s.deviation}% unusual ({deviationLabel(s.deviation)})
            </div>
          </motion.div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "24px",
          paddingTop: "24px",
          borderTop: "1px solid var(--border)",
          fontSize: "12px",
          color: "var(--text-secondary)",
          flexWrap: "wrap",
        }}
      >
        <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>Legend</span>
        <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ width: "12px", height: "12px", borderRadius: "4px", background: "var(--success)", display: "inline-block" }} />
          Low
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ width: "12px", height: "12px", borderRadius: "4px", background: "var(--warning)", display: "inline-block" }} />
          Medium
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ width: "12px", height: "12px", borderRadius: "4px", background: "var(--danger)", display: "inline-block" }} />
          High
        </span>
      </div>
    </div>
  );
}
