"use client";

import { motion } from "framer-motion";
import { UploadCloud, Sparkles, FileCheck2 } from "lucide-react";

const STEPS = [
  {
    icon: UploadCloud,
    title: "Upload your trace",
    description:
      "Export your agent's execution log as JSON, or try one of the built-in sample traces to see it in action.",
  },
  {
    icon: Sparkles,
    title: "AI diagnosis",
    description:
      "Gemini-powered analysis identifies the failure pattern — infinite loops, wrong tool calls, hallucinations, or timeouts.",
  },
  {
    icon: FileCheck2,
    title: "Get your fix",
    description:
      "A clear root cause, an honest confidence score, and a concrete fix recommendation — ready in seconds.",
  },
];

export default function HowItWorks() {
  return (
    <div className="max-w-4xl mx-auto w-full px-6">
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-2xl md:text-3xl font-bold text-center mb-3"
      >
        How it works
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-center mb-14 max-w-lg mx-auto"
        style={{ color: "var(--text-secondary)" }}
      >
        From a failing agent to a clear answer, in three steps.
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {STEPS.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12, duration: 0.5 }}
            whileHover={{ y: -4 }}
            className="glass-card rounded-2xl border p-8 transition-all hover:shadow-lg"
            style={{ borderColor: "var(--border)" }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
              style={{ background: "var(--accent-glow)" }}
            >
              <step.icon size={22} style={{ color: "var(--accent)" }} />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {i + 1}. {step.title}
            </h3>
            <p
              className="text-sm"
              style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}
            >
              {step.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
