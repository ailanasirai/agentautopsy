"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

export default function HealthScoreGauge({ score }: { score: number }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(count, score, {
      duration: 1.2,
      ease: "easeOut",
    });
    const unsub = rounded.on("change", (v) => setDisplay(v));
    return () => {
      controls.stop();
      unsub();
    };
  }, [score]);

  const color =
    score < 40 ? "var(--danger)" : score < 70 ? "var(--warning)" : "var(--success)";
  const glowClass =
    score < 40 ? "glow-danger" : score < 70 ? "glow-warning" : "glow-success";
  const label =
    score < 40 ? "Critical issues found" : score < 70 ? "Some friction detected" : "Running healthy";

  const circumference = 2 * Math.PI * 42;

  return (
    <div
      className="rounded-2xl border p-8 flex flex-col items-center gap-3 transition-all hover:shadow-lg hover:-translate-y-0.5"
      style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}
    >
      <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
        Health score
      </span>
      <div className={`relative w-28 h-28 rounded-full ${glowClass}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="var(--bg-elevated)"
            strokeWidth="7"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke={color}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{
              strokeDashoffset: circumference - (score / 100) * circumference,
            }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-medium">{display}</span>
        </div>
      </div>
      <span className="text-xs text-center" style={{ color }}>
        {label}
      </span>
    </div>
  );
}
