"use client";

import { motion } from "framer-motion";
import { RefreshCw, Wrench, Ghost, CheckCircle2 } from "lucide-react";

const DEMOS = [
  {
    id: "loop-failure",
    label: "Infinite loop",
    icon: RefreshCw,
    color: "var(--warning)",
  },
  {
    id: "wrong-tool-call",
    label: "Wrong tool call",
    icon: Wrench,
    color: "var(--danger)",
  },
  {
    id: "hallucination",
    label: "Hallucination",
    icon: Ghost,
    color: "var(--danger)",
  },
  {
    id: "success-case",
    label: "Healthy run",
    icon: CheckCircle2,
    color: "var(--success)",
  },
];

export default function DemoTraceSelector({
  onSelect,
}: {
  onSelect: (id: string) => void;
}) {
  return (
    <div className="mt-8">
      <p
        className="text-sm mb-3 text-center"
        style={{ color: "var(--text-secondary)" }}
      >
        Don&apos;t have a trace handy? Try a sample
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        {DEMOS.map((demo, i) => (
          <motion.button
            key={demo.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelect(demo.id)}
            className="glass-card flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-medium"
            style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}
          >
            <demo.icon size={15} style={{ color: demo.color }} />
            {demo.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
