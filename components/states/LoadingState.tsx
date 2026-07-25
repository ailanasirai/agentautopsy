"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const MESSAGES = [
  "Parsing execution steps...",
  "Measuring step timing...",
  "Detecting anomalies...",
  "Consulting diagnosis engine...",
  "Compiling root cause report...",
];

export default function LoadingState() {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((i) => (i + 1) % MESSAGES.length);
    }, 1400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-24 gap-6">
      <div
        className="relative w-64 h-40 rounded-xl border overflow-hidden"
        style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}
      >
        <div className="absolute inset-0 flex flex-col justify-around px-6 opacity-30">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-2 rounded"
              style={{ background: "var(--text-muted)", width: `${60 + i * 8}%` }}
            />
          ))}
        </div>
        <motion.div
          className="absolute left-0 right-0 h-8"
          style={{
            background:
              "linear-gradient(180deg, transparent, var(--accent-glow), transparent)",
          }}
          animate={{ top: ["0%", "85%", "0%"] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      <motion.p
        key={msgIndex}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-sm font-medium"
        style={{ color: "var(--text-secondary)" }}
      >
        {MESSAGES[msgIndex]}
      </motion.p>
    </div>
  );
}
