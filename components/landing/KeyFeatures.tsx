"use client";

import { motion } from "framer-motion";
import {
  Target,
  Gauge,
  Grid3x3,
  Brain,
  FileDown,
  Share2,
} from "lucide-react";

const FEATURES = [
  {
    icon: Target,
    title: "Root cause diagnosis",
    description: "Pinpoints exactly which step failed and why, not just that something went wrong.",
  },
  {
    icon: Gauge,
    title: "Honest confidence scoring",
    description: "Every diagnosis comes with a real confidence percentage, so you know how much to trust it.",
  },
  {
    icon: Grid3x3,
    title: "Anomaly heatmap",
    description: "A visual map of which steps deviated most from a healthy run, at a glance.",
  },
  {
    icon: Brain,
    title: "Explainable reasoning",
    description: "See the reasoning chain behind every diagnosis — never a black box.",
  },
  {
    icon: FileDown,
    title: "Exportable reports",
    description: "Turn any diagnosis into a clean PDF report, ready to share with your team.",
  },
  {
    icon: Share2,
    title: "Shareable links",
    description: "Generate a public, read-only link to any report in one click.",
  },
];

export default function KeyFeatures() {
  return (
    <div className="max-w-4xl mx-auto w-full px-6">
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-2xl md:text-3xl font-bold text-center mb-3"
      >
        Everything you need to debug an agent
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-center mb-14 max-w-lg mx-auto"
        style={{ color: "var(--text-secondary)" }}
      >
        Built for developers who ship AI agents and need to know why they fail.
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {FEATURES.map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            whileHover={{ y: -3 }}
            className="rounded-2xl border p-6 transition-all hover:shadow-lg"
            style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}
          >
            <feature.icon size={20} style={{ color: "var(--accent)" }} className="mb-3" />
            <h3 className="font-semibold mb-1.5">{feature.title}</h3>
            <p className="text-sm" style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
