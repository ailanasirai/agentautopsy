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
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(demo.id)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border text-sm"
            style={{
              borderColor: "var(--border)",
              background: "var(--bg-card)",
            }}
          >
            <demo.icon size={15} style={{ color: demo.color }} />
            {demo.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
