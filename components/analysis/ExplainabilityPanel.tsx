"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Brain } from "lucide-react";

export default function ExplainabilityPanel({ chain }: { chain: string[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="rounded-2xl border p-6 transition-all hover:shadow-lg hover:-translate-y-0.5"
      style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full"
      >
        <div className="flex items-center gap-2">
          <Brain size={16} style={{ color: "var(--accent)" }} />
          <span className="text-sm font-medium">How the AI reached this conclusion</span>
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }}>
          <ChevronDown size={16} style={{ color: "var(--text-secondary)" }} />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <ol className="mt-4 space-y-2">
              {chain.map((step, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="text-sm flex gap-2"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <span style={{ color: "var(--accent)" }}>{i + 1}.</span>
                  {step}
                </motion.li>
              ))}
            </ol>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
